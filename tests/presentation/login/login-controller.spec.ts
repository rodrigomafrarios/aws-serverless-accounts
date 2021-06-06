import { Login } from '@/domain/usecases/login/login'
import { Validation } from '@/presentation/interfaces/validation'
import { LoginController } from '@/presentation/controllers/login/login-controller'
import { makeLogin } from '@/tests/presentation/mocks/login-mocks'
import { makeValidation } from '@/tests/presentation/mocks/validation-mocks'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'

type SutTypes = {
  sut: LoginController
  loginStub: Login
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const loginStub = makeLogin()
  const validationStub = makeValidation()
  const sut = new LoginController(loginStub, validationStub)
  return {
    sut,
    loginStub,
    validationStub
  }
}

const makeRequest = () => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

describe('LoginController', () => {
  test('Sould call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const { body } = makeRequest()
    const validationSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeRequest())
    expect(validationSpy).toHaveBeenCalledWith(body)
  })

  test('Should return 400 if validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(makeRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should return 401 if invalid credentials provided', async () => {
    const { sut, loginStub } = makeSut()
		jest.spyOn(loginStub, 'getToken').mockReturnValueOnce(Promise.resolve(''))
		const httpResponse = await sut.handle({
      body: {
        email: '',
        password: ''
      }
    })
		expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 if authentication throws', async () => {
		const { sut, loginStub } = makeSut()
		jest.spyOn(loginStub, 'getToken').mockImplementationOnce(() => {
      throw new Error()
    })
		const httpResponse = await sut.handle(makeRequest())
		expect(httpResponse).toEqual(serverError(new Error()))
	})

  test('Should return 200 if valid credentials are provided', async () => {
		const { sut } = makeSut()
		const httpResponse = await sut.handle(makeRequest())
		expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
	})
})
