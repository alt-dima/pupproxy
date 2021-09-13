terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
    region = "eu-central-1"
}

variable vpc_cidr_block {
  type        = string
  description = "CIDR block for VPC"
}

variable subnet_cidr_block {
  type        = string
  description = "CIDR block for subnet"
}

variable subnet_az {
  type        = string
  description = "AZ for subnet"
}

variable envstate {
  type        = string
  description = "prefix for cloud"
}

resource "aws_vpc" "puppeteer-vpc" {
    cidr_block = var.vpc_cidr_block
    tags = {
        Name = "${var.envstate}-Puppeteer-vpc"
    }
}

resource "aws_subnet" "pup-subnet-1" {
    vpc_id = aws_vpc.puppeteer-vpc.id
    cidr_block = var.subnet_cidr_block
    availability_zone = var.subnet_az
    tags = {
        Name = "${var.envstate}-subnet-1-pup"
    }    
}

resource "aws_route_table" "pup-routetable"{
    vpc_id = aws_vpc.puppeteer-vpc.id

    route {
        cidr_block = "0.0.0.0/0"
        gateway_id = aws_internet_gateway.pup-igw.id
    }
    tags = {
        Name = "${var.envstate}-pup-routetable"
    }        
}

resource "aws_internet_gateway" "pup-igw"{
    vpc_id = aws_vpc.puppeteer-vpc.id

    tags = {
        Name = "${var.envstate}-pup-igw"
    }       
}

resource "aws_route_table_association" "pup-rt-subnet" {
    subnet_id = aws_subnet.pup-subnet-1.id
    route_table_id = aws_route_table.pup-routetable.id
}

resource "aws_security_group" "pup-sg" {
    name = "${var.envstate}-pup-sg"
    vpc_id = aws_vpc.puppeteer-vpc.id

    ingress {
        protocol         = "-1"
        from_port        = 0
        to_port          = 0
        cidr_blocks      = ["0.0.0.0/0"]
        ipv6_cidr_blocks = ["::/0"]
    }

    egress {
        protocol         = "-1"
        from_port        = 0
        to_port          = 0
        cidr_blocks      = ["0.0.0.0/0"]
        ipv6_cidr_blocks = ["::/0"]
    }

    tags = {
        Name = "${var.envstate}-pup-sg"
    }  
}

resource "aws_ecr_repository" "pup-ecr" {
  name                 = "pup-ecr"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecs_cluster" "pup-cluster" {
  name = "${var.envstate}-pup-cluster"
}

resource "aws_ecs_task_definition" "pup-task" {
  family = "${var.envstate}-pup-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  container_definitions = <<TASK_DEFINITION
  [{
   "name"        : "${var.envstate}-container-pupproxy",
   "image"       : "362725162213.dkr.ecr.eu-central-1.amazonaws.com/pup-ecr:latest",
   "essential"   : true,
   "portMappings" : [{
     "protocol"      : "tcp",
     "containerPort" : 8080,
     "hostPort"      : 8080
   }]
  }]
  TASK_DEFINITION
}

resource "aws_iam_role" "ecs_task_execution_role" {
  name = "${var.envstate}-pup-ecsTaskExecutionRole"
 
  assume_role_policy = <<EOF
{
 "Version": "2012-10-17",
 "Statement": [
   {
     "Action": "sts:AssumeRole",
     "Principal": {
       "Service": "ecs-tasks.amazonaws.com"
     },
     "Effect": "Allow",
     "Sid": ""
   }
 ]
}
EOF
}
 
resource "aws_iam_role_policy_attachment" "ecs-task-execution-role-policy-attachment" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_ecs_service" "pup-service" {
 name                               = "${var.envstate}-pup-service"
 cluster                            = aws_ecs_cluster.pup-cluster.id
 task_definition                    = aws_ecs_task_definition.pup-task.arn
 desired_count                      = 1
 launch_type                        = "FARGATE"
 scheduling_strategy                = "REPLICA"
 
 network_configuration {
   security_groups  = [aws_security_group.pup-sg.id]
   subnets          = [aws_subnet.pup-subnet-1.id]
   assign_public_ip = true
 }
}

output ecrurl {
  value       = aws_ecr_repository.pup-ecr.repository_url
  sensitive   = false
  description = "URL for ECR"
  depends_on  = []
}

