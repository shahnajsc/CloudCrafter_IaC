# CloudCrafter_IaC
CloudCrafter is a full-stack cloud application deployed entirely using **Infrastructure as Code (IaC)**.

The system consists of a React (Vite) frontend, a Node.js/Express backend, and a PostgreSQL database managed by AWS RDS. The backend is fully containerized using Docker, and the Docker image is automatically built and pushed to Amazon ECR during deployment. The containerized backend runs on AWS ECS Fargate, ensuring a fully managed, serverless compute environment. All infrastructure components, networking rules, container builds, and deployment settings are defined and automated using the **AWS CDK**.

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
