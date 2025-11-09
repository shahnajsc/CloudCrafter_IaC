/******************************************************************************/
/*                 RDS Stack — PostgreSQL Database for Backend                 /
/                										                       /
/ - Creates a managed PostgreSQL instance in private subnets.                  /
/ - Auto-generates database credentials and stores them in Secrets Manager.    /
/ - Creates a security group controlling inbound access.                       /
/ - Ensures only ECS Fargate tasks (backend) will be allowed to connect.       /
/ - No public exposure, and automatic cleanup on `cdk destroy`.                /
/                                                                              /
/   By: Shahnaj                                                                /
/   Created: 2025/10/28                                                        /
/   Updated: 2025/11/04           by Shahnaj                                   /
/******************************************************************************/

import { Stack, StackProps, CfnOutput, RemovalPolicy, Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";

interface RdsStackProps extends StackProps {
  vpc: ec2.IVpc;
}

export class RdsStack extends Stack {
	public readonly dbInstance: rds.DatabaseInstance;
	public readonly dbSecurityGroup: ec2.SecurityGroup;
	public readonly dbSecret: secretsmanager.ISecret;

	constructor(scope: Construct, id: string, props: RdsStackProps) {
		super(scope, id, props);

		// Security group that control inbound access to the database.
		this.dbSecurityGroup = new ec2.SecurityGroup(this, "RdsSecurityGroup", {
			vpc: props.vpc,
			description: "Allow connections to Postgres from ECS tasks",
			allowAllOutbound: true,
		});

		// Create PostgreSQL database instance inside private subnets.
		this.dbInstance = new rds.DatabaseInstance(this, "CloudCrafterDB", {
			engine: rds.DatabaseInstanceEngine.postgres({
				version: rds.PostgresEngineVersion.VER_16,
			}),
			vpc: props.vpc,
			vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
			instanceType: ec2.InstanceType.of(
				ec2.InstanceClass.T3,
				ec2.InstanceSize.MICRO
			),
			allocatedStorage: 20,
			multiAz: false,
			storageEncrypted: true,
			deletionProtection: false,
			backupRetention: Duration.days(1),
			removalPolicy: RemovalPolicy.DESTROY,
			// Auto-generate credentials and store in AWS Secrets Manager.
			credentials: rds.Credentials.fromGeneratedSecret("postgres"),
			publiclyAccessible: false,
			securityGroups: [this.dbSecurityGroup],
			databaseName: "cloudcrafterdb",
		});

		// Store reference to DB credentials secret.
		this.dbSecret = this.dbInstance.secret!;

		// Output the secret name and endpoint for reference (debug).
		new CfnOutput(this, "DbEndpoint", {
			value: this.dbInstance.dbInstanceEndpointAddress,
			description: "Database endpoint",
		});

		new CfnOutput(this, "DbSecretName", {
			value: this.dbInstance.secret!.secretName,
			description: "DB Secret name in Secrets Manager",
		});
	}

	// Allows the backend (CCBackend) ECS service to connect to this database.
	public allowConnectionFrom(sg: ec2.ISecurityGroup) {
		this.dbSecurityGroup.addIngressRule(sg, ec2.Port.tcp(5432), "Allow ECS access");
	}
}
