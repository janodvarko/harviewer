#!/usr/bin/env node

// @ts-ignore: Cannot find declaration file
require('source-map-support/register');
const cdk = require('@aws-cdk/core');
const { SpaCdkStack } = require('@talkspace/spa-cdk/lib/spa-cdk-stack');

const SUBDOMAIN = process.env.SUBDOMAIN;
const ACM_CERT_ARN = process.env.ACM_CERT_ARN;
const ENV = process.env.ENV;
const CIRCLE_BUILD_NUM = process.env.CIRCLE_BUILD_NUM;

const app = new cdk.App();
new SpaCdkStack(
    app,
    `${ENV}-${SUBDOMAIN}-SPA-Stack`,
    SUBDOMAIN,
    ACM_CERT_ARN,
    ENV,
    CIRCLE_BUILD_NUM
);
