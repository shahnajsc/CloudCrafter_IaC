/******************************************************************************/
/*                 Networking Stack — VPC for All Services                     /
/                										                       /
/ - Creates a dedicated Virtual Private Cloud (VPC) for this application       /
/ - Uses 1 Availability Zone to reduce cost (demo / dev friendly)              /
/ - Public subnet → Application Load Balancer (internet entry point)           /
/ - Private subnet → ECS + RDS (not directly exposed to the internet)          /
/ - NAT Gateway allows private services to make outbound requests              /
/                                                                              /
/   By: Shahnaj                                                                /
/   Created: 2025/10/28                                                        /
/   Updated: 2025/11/04           by Shahnaj                                   /
/******************************************************************************/

import { Stack, StackProps, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export class NetworkingStack extends Stack {
	// Expose VPC for use by the RDS and Backend stacks.
	public readonly vpc: ec2.Vpc;

	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		// Create VPC with one AZ and one NAT Gateway (cost-efficient + works with Prisma).
		this.vpc = new ec2.Vpc(this, "CloudCrafterVPC", {
			maxAzs: 1,		// Single Availability Zone to reduce cost in demo.
			natGateways: 1,	// Allows private ECS tasks to reach the internet.
			subnetConfiguration: [
			{
				cidrMask: 24,
				name: "PublicSubnet",
				subnetType: ec2.SubnetType.PUBLIC,	// Used for Load Balancer entry point
			},
			{
				cidrMask: 24,
				name: "PrivateSubnet",
				subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS, // for ECS + RDS
			},
			],
		});

		// Output VPC ID
		new CfnOutput(this, "VpcId", { value: this.vpc.vpcId });
	}
}
