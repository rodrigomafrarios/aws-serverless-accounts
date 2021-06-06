import { AddAccount } from '@/domain/usecases/account/add-account/add-account'
import { Login } from '@/domain/usecases/login/login'
import { EmailInUseError } from '@/presentation/errors/email-in-use-error'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller } from '@/presentation/interfaces/controller'
import { HttpRequest, HttpResponse } from '@/presentation/interfaces/http'
import { Validation } from '@/presentation/interfaces/validation'

export class SignupController implements Controller {
  constructor (
    private readonly validator: Validation,
    private readonly addAccount: AddAccount,
    private readonly login: Login
    ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest
      const error = await this.validator.validate(body)
      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = body

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      if (!account) {
        return forbidden(new EmailInUseError())
      }

      const accessToken = await this.login.getToken({
        email,
        password
      })

      return ok({ name, accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
