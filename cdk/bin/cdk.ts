#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { NetworkingStack } from '../lib/networking_stack';
import { RdsStack } from '../lib/rds_stack';
import { CCBackendStack } from '../lib/backend_stack';
import { FrontendStack } from '../lib/frontend_stack';

const app = new cdk.App();

// env used to target AWS CDK default settings account/region explicitly
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION
};

// Network stack: must be deployed first. Service: VPC
const CCNetwork = new NetworkingStack(app, "CCNetwork", { env });

// RDS Stack: depends on CCNetwork. Services: RDS (Postgress), secretsmanager, SecurityGroup(EC2)
const CCRDS = new RdsStack(app, "CCRDS", { env, vpc: CCNetwork.vpc, });
CCRDS.addDependency(CCNetwork);

// Backend Stack: depends on CCRDS. Services: ECS, FargateService, ECR
const CCBackend = new CCBackendStack(app, "CCBackend", {
  env,
  vpc: CCNetwork.vpc,
  dbInstance: CCRDS.dbInstance,
  dbSecret: CCRDS.dbSecret,
});
CCBackend.addDependency(CCRDS);

// Frontend Stack: depends on CCBackend. Services: S3. CloudFront
const CCFrontend = new FrontendStack(app, "CCFrontend");
CCFrontend.addDependency(CCBackend);
