export default {
  type: 'object',
  properties: {
    email: { type: 'string' },
    password: { type: 'string' },
    name: { type: 'string' }
  },
  required: ['email', 'password', 'name']
} as const
