import { DbAddAccount } from '@/data/usecases/account/add-account/db-add-account'
import { AddAccount } from '@/domain/usecases/account/add-account/add-account'
import { DynamoDBClientFactory } from '@/infra/aws/factories/aws-config-factory'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountDynamoDbRepository } from '@/infra/db/dynamodb/account/account-dynamodb-repository'

export const makeAddAccount = (): AddAccount => {
  const salt = 12
	const bcryptAdapter = new BcryptAdapter(salt)
  const dynamoClient = DynamoDBClientFactory({ apiVersion: '2012-08-10' })
  const accountRepository = new AccountDynamoDbRepository(dynamoClient)
  return new DbAddAccount(accountRepository, accountRepository, bcryptAdapter)
}
