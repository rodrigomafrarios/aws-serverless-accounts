import { AccountDynamoDbRepository } from '@/infra/db/dynamodb/account/account-dynamodb-repository'
import { DynamoDBClientFactory } from '@/infra/aws/factories/aws-config-factory'
import { v4 as uuidv4 } from 'uuid'
import { mockAddAccountParams } from '@/tests/data/mocks/account-mocks'

type SutTypes = {
  sut: AccountDynamoDbRepository
  client: AWS.DynamoDB.DocumentClient
}

const makeSut = (): SutTypes => {
  const client = DynamoDBClientFactory({
    region: 'local',
    endpoint: 'http://localhost:8000',
    apiVersion: '2012-08-10'
  })
  const sut = new AccountDynamoDbRepository(client)
  return {
    sut,
    client
  }
}

describe('AccountDynamoDbRepository', () => {
  beforeAll(() => {
    process.env.DYNAMODB_TABLE_ACCOUNTS = 'test-accounts'
  })
  describe('loadByEmail()', () => {
    test('Should load an account', async () => {
      const { sut, client } = makeSut()
      const id = uuidv4()
      await client.transactWrite({
        TransactItems: [{
          Put: {
            TableName: 'test-accounts',
            Item: {
              id,
              name: 'any_name',
              email: 'any_email@gmail.com',
              password: '123'
            }
          }
        }]
      }).promise()

      const results = await sut.loadByEmail('any_email@gmail.com')

      expect(results).toEqual({
        id,
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: '123'
      })
    })
  })

  describe('updateAccessToken()', () => {
    test('Should update accessToken', async () => {
      const { sut, client } = makeSut()
      const id = uuidv4()
      await client.transactWrite({
        TransactItems: [{
          Put: {
            TableName: 'test-accounts',
            Item: {
              id,
              name: 'any_name',
              email: 'any_email@gmail.com',
              password: '123'
            }
          }
        }]
      }).promise()

      await sut.updateAccessToken('any_email@gmail.com', 'any_token')

      const { Item } = await client.get({
        TableName: process.env.DYNAMODB_TABLE_ACCOUNTS,
        Key: {
          email: 'any_email@gmail.com'
        }
      }).promise()

      expect(Item.accessToken).toBeTruthy()
      expect(Item.accessToken).toBe('any_token')
    })
  })

  describe('add()', () => {
    test('Should add an account', async () => {
      const { sut } = makeSut()
      const results = await sut.add(mockAddAccountParams())

      expect(results).toBeTruthy()
      expect(results.email).toStrictEqual('any_email@mail.com')
    })
  })
})
