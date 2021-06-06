import { SignupController } from '@/presentation/controllers/signup/signup-controller'
import { Validation } from '@/presentation/interfaces/validation'
import { makeValidation } from '@/tests/presentation/mocks/validation-mocks'
import { badRequest, forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { AddAccount } from '@/domain/usecases/account/add-account/add-account'
import { mockAddAccount } from '@/tests/presentation/mocks/signup-mocks'
import { EmailInUseError } from '@/presentation/errors/email-in-use-error'
import { makeLogin } from '@/tests/presentation/mocks/login-mocks'
import { Login } from '@/domain/usecases/login/login'

type SutTypes = {
  sut: SignupController
  addAccountStub: AddAccount
  loginStub: Login
  validationStub: Validation
}

const makeRequest = () => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password',
    name: 'any_name'
  }
})

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const addAccountStub = mockAddAccount()
  const loginStub = makeLogin()
  const sut = new SignupController(validationStub, addAccountStub, loginStub)
  return {
    sut,
    validationStub,
    addAccountStub,
    loginStub
  }
}

describe('SignupController', () => {
  test('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const { body } = makeRequest()
    const validationSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeRequest())
    expect(validationSpy).toHaveBeenCalledWith(body)
  })

  test('Should return 400 if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle({
      body: {
        email: 'wrong_mail',
        password: 'any_password',
        name: 'any_name'
      }
    })
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addAccountSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeRequest())
    expect(addAccountSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password',
      name: 'any_name'
    })
  })

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(null)
    const httpResponse = await sut.handle(makeRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  test('Should call Login with correct values', async () => {
    const { sut, loginStub } = makeSut()
    const loginSpy = jest.spyOn(loginStub, 'getToken')
    await sut.handle(makeRequest())
    expect(loginSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should throw if Login throws', async () => {
    const { sut, loginStub } = makeSut()
    jest.spyOn(loginStub, 'getToken').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeRequest())
    expect(httpResponse).toEqual(ok({
      accessToken: 'any_token',
      name: 'any_name'
    }))
  })
})
