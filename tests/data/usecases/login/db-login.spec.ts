import { LoginParams } from '@/domain/usecases/login/login'
import { DbLogin } from '@/data/usecases/login/db-login'
import { LoadAccountByEmailRepository } from '@/data/interfaces/db/account/load-account-by-email-repository'
import { HashComparer } from '@/data/interfaces/criptography/hash-comparer'
import { Encrypter } from '@/data/interfaces/criptography/encrypter'
import { UpdateAccessTokenRepository } from '@/data/interfaces/db/account/update-access-token-repository'
import { mockAccount, mockLoadAccountByEmailRepository } from '@/tests/data/mocks/account-mocks'

type SutTypes = {
  sut: DbLogin
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

export const mockUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
	class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
		async updateAccessToken (id: string, token: string): Promise<void> {
			return Promise.resolve()
		}
	}
	return new UpdateAccessTokenRepositoryStub()
}

export const mockHashComparer = (): HashComparer => {
	class HashComparerStub implements HashComparer {
		async compare (value: string, hash: string): Promise<boolean> {
			return Promise.resolve(true)
		}
	}
	return new HashComparerStub()
}

export const mockEncrypter = (): Encrypter => {
	class EncrypterStub implements Encrypter {
		async encrypt (id: string): Promise<string> {
			return Promise.resolve('any_token')
		}
	}
	return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const hashComparerStub = mockHashComparer()
  const encrypterStub = mockEncrypter()
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository()
  const sut = new DbLogin(loadAccountByEmailRepositoryStub, hashComparerStub, encrypterStub, updateAccessTokenRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

const mockLoginParams = (): LoginParams => ({
  email: 'any_email@gmail.com',
  password: 'any_password'
})

describe('Login Usecase', () => {
  test('Should call LoadAccountByEmailRepository with correct values', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadAccountByEmailSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.getToken(mockLoginParams())
    const { email } = mockLoginParams()
    expect(loadAccountByEmailSpy).toHaveBeenCalledWith(email)
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut()
		jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockRejectedValueOnce(new Error())
		const promise = sut.getToken(mockLoginParams())
		await expect(promise).rejects.toThrow()
	})

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(null)
    const account = await sut.getToken(mockLoginParams())
    expect(account).toBeNull()
  })

  test('Should call HashComparer with correct value', async () => {
    const { sut, hashComparerStub } = makeSut()
    const hashComparerSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.getToken(mockLoginParams())
    const { password } = mockLoginParams()
    expect(hashComparerSpy).toHaveBeenCalledWith(password, 'hashed_password')
  })

  test('Should throw if HashComparer throws', async () => {
		const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(new Error())
		const promise = sut.getToken(mockLoginParams())
		await expect(promise).rejects.toThrow()
	})

  test('Should call encrypter with correct value', async () => {
    const { sut, encrypterStub } = makeSut()
    const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.getToken(mockLoginParams())
    const { id } = mockAccount()
    expect(encrypterSpy).toHaveBeenCalledWith(id)
  })

  test('Should throw if Encrypter throws', async () => {
		const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error())
		const promise = sut.getToken(mockLoginParams())
		await expect(promise).rejects.toThrow()
	})

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateAccessTokenSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    await sut.getToken(mockLoginParams())
    const { email } = mockAccount()
    expect(updateAccessTokenSpy).toHaveBeenCalledWith(email, 'any_token')
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
		const { sut, updateAccessTokenRepositoryStub } = makeSut()
		jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockRejectedValueOnce(new Error())
		const promise = sut.getToken(mockLoginParams())
		await expect(promise).rejects.toThrow()
	})

  test('Should return accessToken', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.getToken(mockLoginParams())
    expect(accessToken).toEqual('any_token')
  })
})
