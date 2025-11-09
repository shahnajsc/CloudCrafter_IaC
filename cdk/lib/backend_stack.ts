/******************************************************************************/
/*    Backend Stack — Deploys the backend service using ECS Fargate, ALB       /
/																			   /
/ - Imports VPC and RDS resources from other stacks                            /
/ - Builds and stores backend Docker image in ECR                              /
/ - Spins up an ECS Fargate cluster running the backend container              /
/ - Configures IAM + networking for secure DB access                           /
/ - Exposes backend through a public Application Load Balancer (HTTP)          /
/                                                                              /
/   By: Shahnaj                                                                /
/   Created: 2025/10/28                                                        /
/   Updated: 2025/11/04           by Shahnaj                                   /
/******************************************************************************/

import { Stack, StackProps, CfnOutput, RemovalPolicy, Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as ecrassets from "aws-cdk-lib/aws-ecr-assets";
import * as rds from "aws-cdk-lib/aws-rds";

interface BackendStackProps extends StackProps {
	vpc: ec2.IVpc;
	dbInstance: rds.DatabaseInstance;
	dbSecret: secretsmanager.ISecret;
}

export class CCBackendStack extends Stack {

	constructor(scope: Construct, id: string, props: BackendStackProps) {
		super(scope, id, props);

		// Create ECR repo to store backend Docker image after local build.
		const repository = new ecr.Repository(this, "CloudCrafterRepo", {
			repositoryName: "cloudcrafter-backend",
			removalPolicy: RemovalPolicy.DESTROY,
		});

		// ECS cluster for the backend. Running inside the same VPC.
		const cluster = new ecs.Cluster(this, "CloudCrafterCluster", {
			vpc: props.vpc,
			clusterName: "cloudcrafter-cluster",
		});

		// Fargate service behind a public Application Load Balancer.
		const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(
			this,
			"CloudCrafterService",
			{
			cluster,
			desiredCount: 1,
			cpu: 512,
			memoryLimitMiB: 1024,
			assignPublicIp: false,
			publicLoadBalancer: true,
			redirectHTTP: false, // ALB stays HTTP, CloudFront handles HTTPS.
			taskImageOptions: {
				// CDK builds Docker image locally and uploads to ECR.
				image: ecs.ContainerImage.fromAsset("../backend", {
				platform: ecrassets.Platform.LINUX_AMD64,
				}),

				containerPort: 3000,
				environment: {
					NODE_ENV: "production",
					PORT: "3000",
				},
				// Inject database credentials from the Secrets Manager.
				secrets: {
					DB_HOST: ecs.Secret.fromSecretsManager(props.dbSecret, "host"),
					DB_PORT: ecs.Secret.fromSecretsManager(props.dbSecret, "port"),
					DB_NAME: ecs.Secret.fromSecretsManager(props.dbSecret, "dbname"),
					DB_USER: ecs.Secret.fromSecretsManager(props.dbSecret, "username"),
					DB_PASS: ecs.Secret.fromSecretsManager(props.dbSecret, "password"),
				},
			},
			// Give container extra startup time (needed for DB migrations + seed).
			healthCheckGracePeriod: Duration.seconds(120),
			}
		);
		// ALB healthcheck configuration to check if the HTTP endpoint is responding.
		fargateService.targetGroup.configureHealthCheck({
			path: "/",
			healthyHttpCodes: "200",
			interval: Duration.seconds(30),
		});

		// Allow ECS task to read DB credentials
		props.dbSecret.grantRead(fargateService.taskDefinition.taskRole);

		// Allow ECS tasks to connect to the RDS Instance.
		fargateService.service.connections.allowToDefaultPort(
			props.dbInstance,
			"Allow backend to connect to RDS"
		);

		// Export backend URL for CCFrontend Stack to import.
		new CfnOutput(this, "BackendUrl", {
			value: `${fargateService.loadBalancer.loadBalancerDnsName}`,
			exportName: "backendURL",
		});
	}
}


