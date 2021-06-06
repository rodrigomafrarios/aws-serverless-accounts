import { AccountModel } from '@/domain/models/account'
import { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account/add-account'

export const mockAccount = (): AccountModel => {
  return {
    id: 'any_id',
    email: 'any_email@mail.com',
    password: 'any_password',
    name: 'any_name'
  }
}

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountParams): Promise<AccountModel> {
      return Promise.resolve(mockAccount())
    }
  }
  return new AddAccountStub()
}
