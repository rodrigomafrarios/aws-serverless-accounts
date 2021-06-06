import { Login, LoginParams } from '@/domain/usecases/login/login'
import { LoadAccountByEmailRepository } from '@/data/interfaces/db/account/load-account-by-email-repository'
import { HashComparer } from '@/data/interfaces/criptography/hash-comparer'
import { Encrypter } from '@/data/interfaces/criptography/encrypter'
import { UpdateAccessTokenRepository } from '@/data/interfaces/db/account/update-access-token-repository'

export class DbLogin implements Login {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
    ) {}

  async getToken (params: LoginParams): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(params.email)
    if (account) {
      const isValid = await this.hashComparer.compare(params.password, account.password)
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id)
        await this.updateAccessTokenRepository.updateAccessToken(account.email, accessToken)
        return accessToken
      }
    }
    return null
  }
}
