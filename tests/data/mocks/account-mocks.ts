import { LoadAccountByEmailRepository } from '@/data/interfaces/db/account/load-account-by-email-repository'
import { AccountModel } from '@/domain/models/account'
import { AddAccountRepository } from '@/data/interfaces/db/account/add-account-repository'
import { AddAccountParams } from '@/domain/usecases/account/add-account/add-account'
import { v4 as uuidv4 } from 'uuid'

const id = uuidv4()

export const mockAddAccountParams = (): AddAccountParams => ({
  email: 'any_email@mail.com',
  password: 'any_password',
  name: 'any_name'
})

export const mockAccount = (): AccountModel => ({
  id,
  name: 'any_name',
  email: 'any_email',
  password: 'hashed_password'
})

export const mockLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return Promise.resolve(mockAccount())
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

export const mockAddAccountRepository = (): AddAccountRepository => {
	class AddAccountRepositoryStub implements AddAccountRepository {
		async add (addAccountParams: AddAccountParams): Promise<AccountModel> {
			return Promise.resolve(mockAccount())
		}
	}
	return new AddAccountRepositoryStub()
}
