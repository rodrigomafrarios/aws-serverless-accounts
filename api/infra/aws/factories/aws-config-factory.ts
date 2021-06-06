import AWS from 'aws-sdk'

export const DynamoDBClientFactory = (options: any): AWS.DynamoDB.DocumentClient => {
  AWS.config.update({
    region: options.region ? options.region : process.env.AWS_REGION
  })
  return new AWS.DynamoDB.DocumentClient(options)
}
