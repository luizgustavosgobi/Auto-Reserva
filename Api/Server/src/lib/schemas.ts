export const tokenSchema = {
  headers: {
    type: 'object',
    properties: {
      authorization: { type: 'string', minLength: 209, maxLength: 209 }
    },
    required: ['authorization'],
    additionalProperties: false
  }
}

const prontuario = {
  params: {
    type: 'object',
    properties: {
      prontuario: { type: 'string', minLength: 7, maxLength: 7 },
    },
    required: ['prontuario'],
    additionalProperties: false
  }
}

////
////
////

export const loginSchema = {
  body: {
    type: 'object',
    properties: {
      prontuario: { type: 'string', minLength: 7, maxLength: 7 },
      password: {
        type: 'string',
        minLength: 8,
        pattern: '^(?=.*[a-z])(?=.*\\d).{8,}$',
        errorMessage: { pattern: 'Senha Não cumpre as especificações' }
      },
    },
    required: ['prontuario', 'password'],
    additionalProperties: false
  }
}

export const firstAccessSchema = {
  body: {
    type: 'object',
    properties: {
      prontuario: { type: 'string', minLength: 7, maxLength: 7 },
      accessCode: { type: 'string', minLength: 25, maxLength: 25 },
      password: {
        type: 'string',
        minLength: 8,
        pattern: '^(?=.*[a-z])(?=.*\\d).{8,}$',
        errorMessage: { pattern: 'Senha Não cumpre as especificações' }
      },
    },
    required: ['prontuario', 'accessCode', 'password'],
    additionalProperties: false
  }
}

export const deleteUserSchema = {
  body: {
    type: 'object',
    properties: {
      accessCode: { type: 'string', minLength: 25, maxLength: 25 },
    },
    required: ['accessCode'],
    additionalProperties: false
  },

  ...prontuario,
  ...tokenSchema
}

export const createUserSchema = {
  body: {
    type: 'object',
    properties: {
      prontuario: { type: 'string', minLength: 7, maxLength: 7 },
      name: { type: 'string' },
      photo: { type: 'string', format: 'url' },
      isAdm: { type: 'boolean' }
    },
    required: ['prontuario', 'name', 'photo', 'isAdm'],
    additionalProperties: false
  },

  ...tokenSchema
}

export const userPreferencesSchema = {
  body: {
    type: 'object',
    properties: {
      daysOfWeek: { type: 'array', items: { type: 'string' } },
      deletedDays: { type: 'array', items: { type: 'string' } },
      extraDays: { type: 'array', items: { type: 'string' } },
      reserve: { type: 'boolean' }
    },
    required: ['daysOfWeek', 'deletedDays', 'extraDays', 'reserve'],
    additionalProperties: false
  },

  ...tokenSchema
}

export const updateUserEmailSchema = {
  body: {
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      reciveEmails: { type: 'boolean' },
    },
    required: ['email', 'reciveEmails'],
    additionalProperties: false
  },

  ...tokenSchema
}

export const editUserDataSchema = {
  body: {
    type: 'object',
    properties: {
      prontuario: { type: 'string', minLength: 7, maxLength: 7 },
      name: { type: 'string' },
      photo: { type: 'string', format: 'url' },
      isAdm: { type: 'boolean' },
      accessCode: { type: 'string', minLength: 25, maxLength: 25 },
    },
    required: ['prontuario', 'name', 'photo', 'isAdm', 'accessCode'],
    additionalProperties: false
  },
}

export const foundsSchema = {
  body: {
    type: 'object',
    properties: {
      amount: {type: 'number'}
    },
    required: ['amount'],
    additionalProperties: false
  },

  ...prontuario,
  ...tokenSchema
}
