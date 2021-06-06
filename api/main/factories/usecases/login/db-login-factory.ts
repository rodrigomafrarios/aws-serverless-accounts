import { DbLogin } from '@/data/usecases/login/db-login'
import { AccountDynamoDbRepository } from '@/infra/db/dynamodb/account/account-dynamodb-repository'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '@/infra/criptography/jwt/jwt-adapter'
import { Login } from '@/domain/usecases/login/login'
import { DynamoDBClientFactory } from '@/infra/aws/factories/aws-config-factory'

export const makeDbLogin = (): Login => {
	const salt = 12
	const bcryptAdapter = new BcryptAdapter(salt)
	const jwtAdapter = new JwtAdapter(process.env.JWT_SECRET)
	const dynamoClient = DynamoDBClientFactory({ apiVersion: '2012-08-10' })
	const accountDynamoDbRepository = new AccountDynamoDbRepository(dynamoClient)
	return new DbLogin(accountDynamoDbRepository, bcryptAdapter, jwtAdapter, accountDynamoDbRepository)
}
