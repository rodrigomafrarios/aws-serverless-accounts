import 'module-alias/register'
import 'source-map-support/register'

import type { ValidatedEventAPIGatewayProxyEvent } from '@/libs/apiGateway'
import { middyfy } from '@/libs/lambda'

import schema from './schema'
import { lambdaAdapt } from '../../../main/adapters/lambda-adapter'
import { makeSignUpController } from '../../../main/factories/controllers/signup/signup-controller-factory'

// atualizando via s3 notification

const signUp: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { body } = event
  const controller = makeSignUpController()
  const httpResponse = lambdaAdapt(controller)({
    ...body
  })
  return httpResponse
}

export const handler = middyfy(signUp)
