# CloudCrafter_IaC
CloudCrafter is a full-stack cloud application deployed entirely using **Infrastructure as Code (IaC)**.

The system consists of a React (Vite) frontend, a Node.js/Express backend, and a PostgreSQL database managed by AWS RDS. The backend is fully containerized using Docker, and the Docker image is automatically built and pushed to Amazon ECR during deployment. The containerized backend runs on AWS ECS Fargate, ensuring a fully managed, serverless compute environment. All infrastructure components, networking rules, container builds, and deployment settings are defined and automated using the **AWS CDK**.

**Frontend URL:** https://d2mgfnfx51i2yc.cloudfront.net   (available for limited time)

# Web Application
This web application is designed to display daily stock market insights. In a real-world scenario, the intention is to fetch live stock prices, performance trends, and financial news from external market data APIs. However, to keep this project simple, self-contained, and cost-efficient, external API calls are not used. Instead the daily stock prices, top performing company, and market news are seeded into the PostgreSQL database during deployment. This simulates current-day market data. The backend exposes REST API endpoints that serve this data to the frontend UI. The backend service is fully **Dockerized** and for local development, PostgreSQL is also run in a separate Docker container to match production behavior. Both the frontend and backend are written in **TypeScript**.
#### What the Application Displays:
 -  Daily stock price movements
 -  Top performing company
 -  Latest stock market news

#### Tech Stack:

| Component | Technology                           | Deployment                               |
| --------- | ------------------------------------ | ---------------------------------------- |
| Frontend  | React + Vite (TS)                    | CloudFront + S3                          |
| Backend   | Node.js + Express + Prisma ORM (TS)  | ECS Fargate behind ALB                   |
| Database  | PostgreSQL                           | AWS RDS with Secrets Manager credentials |


# Infrastructure as Code (IaC)
The entire cloud environment for this application is provisioned using **AWS CDK (TypeScript)**. No manual configuration is performed in the AWS Console — every resource, permission, and network rule is defined in code and deployed with 'cdk deploy'. The architecture is organized into **four CDK stacks**, each responsible for a specific layer of the system. Resources are shared cleanly between stacks using CloudFormation exports (for example, backend url), this ensures a clean architecture.


### Networking Stack:
This stack creates the secure network environment in which all other services run.
It defines a Virtual Private Cloud (VPC) that is divided into two logical subnet groups: a Public Subnet, which is used to host the Application Load Balancer (application entry point), and a Private Subnet, where the ECS backend service and RDS database run securely without being directly exposed to the internet. To allow the backend service to perform necessary outbound operations (such as running Prisma migrations or downloading packages) while still remaining private, the VPC includes a NAT Gateway, enabling controlled outbound internet access from the private subnet.

AWS Services: **VPC, Subnets, NAT Gateway**

### RDS Stack:
This stack provides a fully managed PostgreSQL instance that stores all application data.
It runs entirely inside the private subnets of the VPC, preventing any direct external access. Database credentials are securely auto-generated and stored in AWS Secrets Manager, eliminating the need for hard coded passwords. A dedicated Security Group restricts inbound connections so that only the ECS backend service is allowed to communicate with the database.

AWS Services: **RDS (PostgreSQL), Secrets Manager, Security Group**

### Backend Stack:
This stack builds, stores, and deploys the backend service. The backend service is fully **Dockerized**, ensuring consistent behavior between local development and production. During deployment, the AWS CDK automatically builds the Docker image and pushes it to Amazon ECR. The image is then run in a serverless ECS Fargate service, meaning no servers need to be managed. The service is publicly accessible through an Application Load Balancer (ALB), while still operating inside the private network. At runtime, the backend securely retrieves its database credentials from AWS Secrets Manager and connects to the PostgreSQL RDS instance over the private subnet of the VPC.

AWS Services: **ECR, ECS Fargate, Application Load Balancer (ALB), , IAM Roles**

### Fronend Stack:
This stack deploys the built frontend and routes API traffic securely.
The frontend is built locally and the compiled output is uploaded directly to S3 for static hosting. It is then served globally through CloudFront, which provides HTTPS by default. Any requests made by the frontend to `/api/*` are automatically routed by CloudFront to the backend Application Load Balancer, allowing the backend to remain on internal HTTP while the user experiences secure HTTPS communication end-to-end. The frontend does not need to hardcode backend URLs, enabling cleaner code and easier environment portability.

AWS Services: **S3, CloudFront**

# Limitations and Possible Improvement
### No Custom Domain or SSL Certificate
 - The frontend is served via the default CloudFront URL.
 - A custom domain could be configured using Route 53, and HTTPS certificates could be issued and managed via AWS Certificate Manager (ACM).
### No CI/CD Pipeline
 - Infrastructure and application updates are deployed manually using cdk deploy.
 - A continuous deployment workflow could be implemented using GitHub Actions, GitLab CI, or AWS CodePipeline to automate build, testing, and rollout steps.
### HTTPS Termination Only at CloudFront
 - CloudFront provides HTTPS at the edge, but the backend service inside the VPC runs HTTP only.
 - For stricter security or compliance, the backend service could be configured to use TLS termination at the Application Load Balancer.

# Build and Deploy

## Prerequisites

#### AWS account with IAM user(prefered)
Go to [AWS](https://aws.amazon.com/) and signup. Create an IAM user with access to above mentioned AWS services.

#### Node.js and npm
Follow the [instruction](https://nodejs.org/en/download/) for other OS
```bash
brew install node           #Install Node.js & npm (macOS)
```
#### AWS CLI, CDK and Bootstrap
Follow the instruction:
[CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
[CDK](https://docs.aws.amazon.com/cdk/v2/guide/hello-world.html)

```bash
brew install awscli         # Install AWS CLI (macOS)
```

```bash
npm install -g aws-cdk      # Install AWS CDK globally (macOS)
```

```bash
aws configure               # configure AWS CLI and provide requested information.
```

```bash
cdk bootstrap               # only required once per AWS account/region
```

```bash
aws sts get-caller-identity           # Verify credentials
```


### Docker
[Follow the instruction:](https://docs.docker.com/get-started/get-docker/)
```bash
brew install --cask docker       # Docker desktop (macOS)
```

## Deploy
Git clone the repository:
```bash
git clone https://github.com/shahnajsc/CloudCrafter_IaC.git
```
```bash
cd CloudCrafter_IaC/cdk

npm install
```

Make sure Docker is running..

```bash
cdk deploy --all                              # Requires approval for each stack

cdk deploy --require-approval never --all     # No approval required
```

## Destroy
```bash
cdk destroy --all
```
