import { Login } from '@/domain/usecases/login/login'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'
import { Controller } from '@/presentation/interfaces/controller'
import { HttpRequest, HttpResponse } from '@/presentation/interfaces/http'
import { Validation } from '@/presentation/interfaces/validation'

export class LoginController implements Controller {
  constructor (
    private readonly login: Login,
    private readonly validator: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest
      const error = await this.validator.validate(body)
      if (error) {
        return badRequest(error)
      }

      const accessToken = await this.login.getToken(body)
      if (!accessToken) {
        return unauthorized()
      }
      return ok({ accessToken: accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
