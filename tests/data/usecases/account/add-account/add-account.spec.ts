import { AddAccount } from '@/domain/usecases/account/add-account/add-account'
import { DbAddAccount } from '@/data/usecases/account/add-account/db-add-account'
import { AddAccountRepository } from '@/data/interfaces/db/account/add-account-repository'
import { mockAccount, mockAddAccountParams, mockAddAccountRepository, mockLoadAccountByEmailRepository } from '@/tests/data/mocks/account-mocks'
import { LoadAccountByEmailRepository } from '@/data/interfaces/db/account/load-account-by-email-repository'
import { Hasher } from '@/data/interfaces/criptography/hasher'

type SutTypes = {
  sut: AddAccount
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hasherStub: Hasher
}

export const mockHasher = (): Hasher => {
	class HasherStub {
		async hash (value: string): Promise<string> {
			return Promise.resolve('any_password')
		}
	}
	return new HasherStub()
}

const makeSut = (): SutTypes => {
  const addAccountRepositoryStub = mockAddAccountRepository()
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const hasherStub = mockHasher()
  const sut = new DbAddAccount(addAccountRepositoryStub, loadAccountByEmailRepositoryStub, hasherStub)
  return {
    sut,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
    hasherStub
  }
}

describe('AddAccount Usecase', () => {
  test('Should call LoadAccountByEmailRepository with correct values', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadByEmailRepositorySpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(mockAddAccountParams())
    expect(loadByEmailRepositorySpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return null if LoadAccountByEmailRepository not return null', async () => {
		const { sut } = makeSut()
		const account = await sut.add(mockAccount())
		expect(account).toBeNull()
	})

  test('Should call Hasher with correct password', async () => {
		const { sut, hasherStub, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    .mockReturnValueOnce(Promise.resolve(null))
		const hashSpy = jest.spyOn(hasherStub, 'hash')
		await sut.add(mockAddAccountParams())
		expect(hashSpy).toHaveBeenCalledWith('any_password')
	})

  test('Should throw if Hasher throws', async () => {
		const { sut, loadAccountByEmailRepositoryStub, hasherStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    .mockReturnValueOnce(Promise.resolve(null))
		jest.spyOn(hasherStub, 'hash').mockImplementationOnce(() => {
      throw new Error()
    })
		const promise = sut.add(mockAddAccountParams())
		await expect(promise).rejects.toThrow()
	})

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    .mockReturnValueOnce(Promise.resolve(null))
    const addAccountRepositorySpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(mockAddAccountParams())
    expect(addAccountRepositorySpy).toHaveBeenCalledWith(mockAddAccountParams())
  })

  test('Should throw if AddAccountRepository throws', async () => {
		const { sut, addAccountRepositoryStub, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    .mockReturnValueOnce(Promise.resolve(null))
		jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
		const promise = sut.add(mockAddAccountParams())
		await expect(promise).rejects.toThrow()
	})
})
