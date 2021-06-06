import { Hasher } from '@/data/interfaces/criptography/hasher'
import { AddAccountRepository } from '@/data/interfaces/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '@/data/interfaces/db/account/load-account-by-email-repository'
import { AccountModel } from '@/domain/models/account'
import { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account/add-account'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hasher: Hasher
  ) {}

  async add (accountParams: AddAccountParams): Promise<AccountModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(accountParams.email)
    if (!account) {
      const hashedPassword = await this.hasher.hash(accountParams.password)
      const addAccountParams = Object.assign({}, accountParams, { password: hashedPassword })
      const newAccount = await this.addAccountRepository.add(addAccountParams)
      return newAccount
    }
    return null
  }
}
