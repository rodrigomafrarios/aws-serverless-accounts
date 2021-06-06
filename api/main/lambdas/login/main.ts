import 'module-alias/register'
import 'source-map-support/register'

import type { ValidatedEventAPIGatewayProxyEvent } from '@/libs/apiGateway'
import { middyfy } from '@/libs/lambda'

import schema from './schema'
import { makeLoginController } from '@/main/factories/controllers/login/login-controller-factory'
import { lambdaAdapt } from '@/main/adapters/lambda-adapter'

const login: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { body } = event
  const controller = makeLoginController()
  const httpResponse = lambdaAdapt(controller)({
    ...body
  })
  return httpResponse
}

export const handler = middyfy(login)
