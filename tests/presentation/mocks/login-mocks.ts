import { Login, LoginParams } from '@/domain/usecases/login/login'

export const makeLogin = (): Login => {
	class LoginStub implements Login {
		async getToken (params: LoginParams): Promise<string> {
			return Promise.resolve('any_token')
		}
	}
	return new LoginStub()
}
