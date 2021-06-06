const fs = require('fs')

module.exports = async () => {
  const { resources } = JSON.parse(fs.readFileSync('./tests/infra/db/dynamodb/migrations/account.json', 'utf8'))
  const tables = Object.keys(resources)
  .map((name) => resources[name])
  .filter((r) => r.Type === 'AWS::DynamoDB::Table')
  .map((r) => r.Properties)
  return {
    port: 8000,
    tables
  };
}
