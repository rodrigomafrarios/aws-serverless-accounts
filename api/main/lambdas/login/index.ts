/* eslint no-template-curly-in-string: "off" */

import schema from '@/main/lambdas/login/schema'
import { handlerPath } from '@/libs/handlerResolver'

export default {
  role: '${ssm:${self:custom.stage}-list-accounts-iam-role}',
  environment: {
    DYNAMODB_ACCOUNTS: '${ssm:${self:custom.stage}-dynamodb-accounts-table}',
    JWT_SECRET: '${ssm:${self:custom.stage}-jwt-secret}'
  },
  handler: `${handlerPath(__dirname)}/main.handler`,
  events: [
    {
      http: {
        method: 'post',
        path: 'login',
        request: {
          schema: {
            'application/json': schema
          }
        }
      }
    }
  ]
}
