import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Management API',
      version: '1.0.0',
      description: 'A comprehensive RESTful API for task management with user authentication and role-based access control',
      contact: {
        name: 'API Support',
        email: 'support@taskmanagement.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.taskmanagement.com',
        description: 'Production server'
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints'
      },
      {
        name: 'Tasks',
        description: 'Task management endpoints'
      }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
          description: 'JWT token stored in HTTP-only cookie'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID',
              example: '507f1f77bcf86cd799439011'
            },
            name: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe',
              maxLength: 50
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john.doe@example.com'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role',
              example: 'user'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            }
          }
        },
        Task: {
          type: 'object',
          required: ['title', 'description', 'dueDate'],
          properties: {
            _id: {
              type: 'string',
              description: 'Task ID',
              example: '507f1f77bcf86cd799439011'
            },
            title: {
              type: 'string',
              description: 'Task title',
              example: 'Complete project documentation',
              maxLength: 100
            },
            description: {
              type: 'string',
              description: 'Detailed task description',
              example: 'Write comprehensive API documentation with examples',
              maxLength: 1000
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: 'Task due date',
              example: '2025-12-31T23:59:59.000Z'
            },
            status: {
              type: 'string',
              enum: ['pending', 'in progress', 'completed'],
              description: 'Current task status',
              example: 'pending'
            },
            user: {
              $ref: '#/components/schemas/User'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Task creation timestamp'
            }
          }
        },
        SignupRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe',
              minLength: 1,
              maxLength: 50
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Valid email address',
              example: 'john.doe@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Password (minimum 6 characters)',
              example: 'securePassword123',
              minLength: 6
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role (optional, defaults to user)',
              example: 'user'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'john.doe@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password',
              example: 'securePassword123'
            }
          }
        },
        TaskRequest: {
          type: 'object',
          required: ['title', 'description', 'dueDate'],
          properties: {
            title: {
              type: 'string',
              description: 'Task title',
              example: 'Complete project documentation',
              maxLength: 100
            },
            description: {
              type: 'string',
              description: 'Detailed task description',
              example: 'Write comprehensive API documentation',
              maxLength: 1000
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: 'Task due date (must be in the future)',
              example: '2025-12-31T23:59:59.000Z'
            },
            status: {
              type: 'string',
              enum: ['pending', 'in progress', 'completed'],
              description: 'Task status (optional, defaults to pending)',
              example: 'pending'
            }
          }
        },
        TaskUpdateRequest: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Updated task title',
              example: 'Updated documentation task',
              maxLength: 100
            },
            description: {
              type: 'string',
              description: 'Updated task description',
              example: 'Updated description with more details',
              maxLength: 1000
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: 'Updated due date',
              example: '2025-12-31T23:59:59.000Z'
            },
            status: {
              type: 'string',
              enum: ['pending', 'in progress', 'completed'],
              description: 'Updated task status',
              example: 'in progress'
            }
          }
        },
        PaginationResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            pagination: {
              type: 'object',
              properties: {
                currentPage: {
                  type: 'integer',
                  example: 1
                },
                totalPages: {
                  type: 'integer',
                  example: 5
                },
                totalItems: {
                  type: 'integer',
                  example: 50
                },
                itemsPerPage: {
                  type: 'integer',
                  example: 10
                },
                hasNextPage: {
                  type: 'boolean',
                  example: true
                },
                hasPrevPage: {
                  type: 'boolean',
                  example: false
                }
              }
            },
            count: {
              type: 'integer',
              example: 10
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Task'
              }
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operation successful'
            },
            data: {
              type: 'object'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Error message'
            },
            message: {
              type: 'string',
              example: 'Detailed error description'
            }
          }
        }
      },
      parameters: {
        PageParam: {
          name: 'page',
          in: 'query',
          description: 'Page number for pagination',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1,
            example: 1
          }
        },
        LimitParam: {
          name: 'limit',
          in: 'query',
          description: 'Number of items per page',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10,
            example: 10
          }
        },
        StatusParam: {
          name: 'status',
          in: 'query',
          description: 'Filter tasks by status',
          required: false,
          schema: {
            type: 'string',
            enum: ['pending', 'in progress', 'completed'],
            example: 'pending'
          }
        },
        SearchParam: {
          name: 'search',
          in: 'query',
          description: 'Search tasks by title or description',
          required: false,
          schema: {
            type: 'string',
            example: 'documentation'
          }
        },
        IdParam: {
          name: 'id',
          in: 'path',
          description: 'Resource ID (User ID or Task ID)',
          required: true,
          schema: {
            type: 'string',
            example: '507f1f77bcf86cd799439011'
          }
        }
      },
      responses: {
        Unauthorized: {
          description: 'Unauthorized - Authentication required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                message: 'Unauthorized - No Token Provided'
              }
            }
          }
        },
        Forbidden: {
          description: 'Forbidden - Insufficient permissions',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                message: 'Forbidden - Admin access required'
              }
            }
          }
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                message: 'Resource not found'
              }
            }
          }
        },
        BadRequest: {
          description: 'Bad request - Invalid input',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                error: 'Invalid email format'
              }
            }
          }
        },
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              },
              example: {
                message: 'Internal server error'
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/router/*.js', './src/controller/*.js', './src/models/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;