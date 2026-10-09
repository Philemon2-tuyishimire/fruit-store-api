
export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Fruit E-Commerce API',
    version: '1.0.0',
    description:
      'API documentation for the Fruit Store Backend built with Node.js, Express, and TypeScript',
  },

  servers: [
    {
      url: 'https://fruit-store-api-1.onrender.com',
      description: 'Live API',
    },
  ],

  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },

  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Register a new customer',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: {
                    type: 'string',
                    example: 'John Doe',
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'john@example.com',
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    example: 'StrongPassword123!',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'User registered successfully',
          },
          '400': {
            description: 'Invalid registration details',
          },
          '409': {
            description: 'User already exists',
          },
        },
      },
    },

    '/api/auth/login': {
      post: {
        summary: 'Login user',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'john@example.com',
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    example: 'StrongPassword123!',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful; returns authentication token',
          },
          '400': {
            description: 'Invalid credentials',
          },
          '401': {
            description: 'Authentication failed',
          },
        },
      },
    },

    '/api/fruits': {
      get: {
        summary: 'Get all fruits',
        tags: ['Fruits'],
        responses: {
          '200': {
            description: 'List of all fruits',
          },
        },
      },

      post: {
        summary: 'Create a new fruit (Admin only)',
        tags: ['Fruits'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['name', 'description', 'price', 'stock', 'category'],
                properties: {
                  name: {
                    type: 'string',
                    example: 'Organic Apple',
                  },
                  description: {
                    type: 'string',
                    example: 'Fresh red organic apples',
                  },
                  price: {
                    type: 'number',
                    example: 3.5,
                  },
                  stock: {
                    type: 'number',
                    example: 100,
                  },
                  category: {
                    type: 'string',
                    example: 'Tree Fruits',
                  },
                  image: {
                    type: 'string',
                    format: 'binary',
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Fruit created successfully',
          },
          '401': {
            description: 'Unauthorized',
          },
          '403': {
            description: 'Forbidden; admin access required',
          },
        },
      },
    },

    '/api/fruits/{id}': {
      get: {
        summary: 'Get fruit by ID',
        tags: ['Fruits'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Fruit details',
          },
          '404': {
            description: 'Fruit not found',
          },
        },
      },

      delete: {
        summary: 'Delete a fruit (Admin only)',
        tags: ['Fruits'],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'Fruit deleted successfully',
          },
          '401': {
            description: 'Unauthorized',
          },
          '403': {
            description: 'Forbidden; admin access required',
          },
          '404': {
            description: 'Fruit not found',
          },
        },
      },
    },
  },
};
