import { LoginController } from '@/presentation/controllers/login/login-controller'
import { Controller } from '@/presentation/interfaces/controller'
import { makeDbLogin } from '../../../factories/usecases/login/db-login-factory'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeDbLogin(), makeLoginValidation())
  return controller
}
