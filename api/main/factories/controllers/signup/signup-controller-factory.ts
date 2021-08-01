import { Controller } from '@/presentation/interfaces/controller'
import { makeSignupValidation } from './signup-validation-factory'
import { SignupController } from '@/presentation/controllers/signup/signup-controller'
import { makeDbLogin } from '../../../factories/usecases/login/db-login-factory'
import { makeAddAccount } from '../../../factories/usecases/account/add-account/add-account-factory'

export const makeSignUpController = (): Controller => {
  const controller = new SignupController(makeSignupValidation(), makeAddAccount(), makeDbLogin())
  return controller
}
