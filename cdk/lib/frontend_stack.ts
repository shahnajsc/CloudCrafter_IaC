/******************************************************************************/
/*      Frontend Stack — Deploys the React frontend to S3 and CloudFront       /
/														         			   /
/ - Builds the frontend locally using Vite.                                    /
/ - Uploads the compiled assets in a private S3 bucket.                        /
/ - Serves the application globally using CloudFront (HTTPS enabled).          /
/ - Routes requests to `/api/*` to the backend Load Balancer via CloudFront    /
/    --This allows the backend to remain HTTP internally while the user only   /
/      interacts with CloudFront over HTTPS                                    /
/                                                                              /
/   By: Shahnaj                                                                /
/   Created: 2025/10/28                                                        /
/   Updated: 2025/11/04           by Shahnaj                                   /
/******************************************************************************/

import { Stack, StackProps, CfnOutput, RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import { execSync } from "child_process";
import * as cdk from "aws-cdk-lib";

export class FrontendStack extends Stack {
	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		// Build the frontend locally before uploading.
		execSync("npm ci && npm run build", { cwd: "../frontend", stdio: "inherit" });

		// Create an S3 bucket(private) to store compiled frontend assets.
		const siteBucket = new s3.Bucket(this, "CloudCrafterFrontendBucket", {
			publicReadAccess: false,
			removalPolicy: RemovalPolicy.DESTROY,
			autoDeleteObjects: true,
		});

		// Import backend URL from CCBackend Stack.
		const backendUrl = cdk.Fn.importValue("backendURL");

		// Create a CloudFront distribution for frontend and route backend http request as htpps
		const distribution = new cloudfront.Distribution(this, "CloudCrafterFrontendCDN", {
			defaultRootObject: "index.html",
			defaultBehavior: {
				origin: new origins.S3Origin(siteBucket),
				viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
			},
			additionalBehaviors: {
				"api/*": {
					origin: new origins.HttpOrigin(backendUrl.replace("http://", ""), {
						protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
					}),
					viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
					cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
				},
			},
		});

		// Deploys built frontend files to S3
		new s3deploy.BucketDeployment(this, "DeployFrontend", {
			sources: [s3deploy.Source.asset("../frontend/dist")],
			destinationBucket: siteBucket,
			distribution,
			distributionPaths: ["/*"],
		});

		// Output the public Frontend URL
		new CfnOutput(this, "FrontendUrl", {
			value: `https://${distribution.distributionDomainName}`,
		});
	}
}
