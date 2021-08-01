import { AddAccountRepository } from '@/data/interfaces/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '@/data/interfaces/db/account/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '@/data/interfaces/db/account/update-access-token-repository'
import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usecases/account/add-account/add-account'
import * as Dynamodb from 'aws-sdk/clients/dynamodb'
import { v4 as uuidv4 } from 'uuid'

export class AccountDynamoDbRepository implements
LoadAccountByEmailRepository,
AddAccountRepository,
UpdateAccessTokenRepository {
  constructor (private readonly client: Dynamodb.DocumentClient) {}

  async loadByEmail (email: string): Promise<AccountModel> {
    const output = await this.client.get({
      TableName: process.env.DYNAMODB_TABLE_ACCOUNTS,
      Key: {
        email
      }
    }).promise()

    return output?.Item && ({
      id: output.Item.id,
      email: output.Item.email,
      password: output.Item.password,
      name: output.Item.name
    })
  }

  async updateAccessToken (email: string, token: string): Promise<void> {
    await this.client.transactWrite({
      TransactItems: [{
        Update: {
          TableName: process.env.DYNAMODB_TABLE_ACCOUNTS,
          Key: {
            email
          },
          UpdateExpression: 'SET accessToken = :token',
          ExpressionAttributeValues: {
            ':token': token
          }
        }
      }]
    }).promise()
  }

  async add (addAccountParams: AddAccountParams): Promise<any> {
    await this.client.transactWrite({
      TransactItems: [{
        Put: {
          TableName: process.env.DYNAMODB_TABLE_ACCOUNTS,
          Item: {
            id: uuidv4(),
            ...addAccountParams
          }
        }
      }]
    }).promise()
    return await this.loadByEmail(addAccountParams.email)
  }
}
