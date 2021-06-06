import type { AWS } from '@serverless/typescript'

import { login, signUp } from '@/main/lambdas'

const serverlessConfiguration: AWS = {
  service: 'accounts',
  frameworkVersion: '2',
  custom: {
    dynamodb: {
      stages: ['test'],
      start: {
        port: 8000,
        inMemory: true,
        migrate: true
      }
    },
    stage: "${opt:stage, self:provider.stage}"
  },
  plugins: [
    'serverless-dynamodb-local',
    'serverless-offline',
    'serverless-plugin-typescript'
  ],
  provider: {
    name: 'aws',
    profile: 'dev',
    stage: 'dev',
    region: 'us-east-1',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { login, signUp },
};

module.exports = serverlessConfiguration
