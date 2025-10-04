const swaggerJsdoc = require('swagger-jsdoc');

/**
 * Swagger API Documentation Configuration
 * OpenAPI 3.0 specification for HappyTails API
 */

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HappyTails Pet Care API',
      version: '1.0.0',
      description: 'Comprehensive API documentation for the HappyTails pet care management platform. This API provides endpoints for pet health management, veterinary services, appointment booking, AI-powered symptom checking, and educational resources.',
      contact: {
        name: 'HappyTails Support',
        email: 'support@happytails.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://api.happytails.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your Firebase authentication token',
        },
      },
      schemas: {
        // Common response schemas
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Operation completed successfully',
            },
            data: {
              type: 'object',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            status: {
              type: 'string',
              example: 'error',
            },
            message: {
              type: 'string',
              example: 'An error occurred',
            },
            error: {
              type: 'object',
              properties: {
                statusCode: {
                  type: 'integer',
                  example: 400,
                },
                status: {
                  type: 'string',
                  example: 'error',
                },
              },
            },
            stack: {
              type: 'string',
              description: 'Stack trace (development only)',
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Validation failed',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        // User schemas
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            uid: {
              type: 'string',
              description: 'Firebase UID',
              example: 'abc123firebase',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com',
            },
            displayName: {
              type: 'string',
              example: 'John Doe',
            },
            role: {
              type: 'string',
              enum: ['user', 'vet', 'admin'],
              default: 'user',
              example: 'user',
            },
            photoURL: {
              type: 'string',
              example: 'https://example.com/photo.jpg',
            },
            phoneNumber: {
              type: 'string',
              example: '+1234567890',
            },
            address: {
              type: 'string',
              example: '123 Main St, City, State 12345',
            },
            isActive: {
              type: 'boolean',
              default: true,
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        // Pet schemas
        Pet: {
          type: 'object',
          required: ['name', 'species', 'breed', 'birthDate'],
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            owner: {
              type: 'string',
              description: 'User ID of the pet owner',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              example: 'Max',
            },
            species: {
              type: 'string',
              enum: ['dog', 'cat', 'bird', 'rabbit', 'other'],
              example: 'dog',
            },
            breed: {
              type: 'string',
              example: 'Golden Retriever',
            },
            birthDate: {
              type: 'string',
              format: 'date',
              example: '2020-01-15',
            },
            gender: {
              type: 'string',
              enum: ['male', 'female', 'unknown'],
              example: 'male',
            },
            color: {
              type: 'string',
              example: 'Golden',
            },
            weight: {
              type: 'number',
              description: 'Weight in kg',
              example: 30.5,
            },
            microchipId: {
              type: 'string',
              example: 'MC123456789',
            },
            photoURL: {
              type: 'string',
              example: 'https://example.com/pet-photo.jpg',
            },
            medicalHistory: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  date: {
                    type: 'string',
                    format: 'date',
                  },
                  condition: {
                    type: 'string',
                  },
                  treatment: {
                    type: 'string',
                  },
                  vet: {
                    type: 'string',
                  },
                  notes: {
                    type: 'string',
                  },
                },
              },
            },
            vaccinations: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                  },
                  date: {
                    type: 'string',
                    format: 'date',
                  },
                  nextDue: {
                    type: 'string',
                    format: 'date',
                  },
                  veterinarian: {
                    type: 'string',
                  },
                },
              },
            },
            allergies: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['peanuts', 'pollen'],
            },
            currentMedications: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                  },
                  dosage: {
                    type: 'string',
                  },
                  frequency: {
                    type: 'string',
                  },
                  startDate: {
                    type: 'string',
                    format: 'date',
                  },
                  endDate: {
                    type: 'string',
                    format: 'date',
                  },
                },
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        // Vet schemas
        Vet: {
          type: 'object',
          required: ['name', 'email', 'licenseNumber', 'specializations'],
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            userId: {
              type: 'string',
              description: 'Reference to User model',
              example: '507f1f77bcf86cd799439011',
            },
            name: {
              type: 'string',
              example: 'Dr. Sarah Johnson',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'vet@example.com',
            },
            phone: {
              type: 'string',
              example: '+1234567890',
            },
            licenseNumber: {
              type: 'string',
              example: 'VET-2024-001',
            },
            specializations: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['General Practice', 'Surgery'],
            },
            qualifications: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['DVM', 'Board Certified'],
            },
            experience: {
              type: 'number',
              description: 'Years of experience',
              example: 10,
            },
            bio: {
              type: 'string',
              example: 'Experienced veterinarian specializing in small animals',
            },
            photoURL: {
              type: 'string',
              example: 'https://example.com/vet-photo.jpg',
            },
            clinicName: {
              type: 'string',
              example: 'Happy Paws Clinic',
            },
            clinicAddress: {
              type: 'string',
              example: '456 Vet Lane, City, State 67890',
            },
            availability: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  day: {
                    type: 'string',
                    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                  },
                  startTime: {
                    type: 'string',
                    example: '09:00',
                  },
                  endTime: {
                    type: 'string',
                    example: '17:00',
                  },
                },
              },
            },
            consultationFee: {
              type: 'number',
              example: 75.00,
            },
            rating: {
              type: 'number',
              minimum: 0,
              maximum: 5,
              example: 4.8,
            },
            reviewCount: {
              type: 'number',
              default: 0,
              example: 45,
            },
            isVerified: {
              type: 'boolean',
              default: false,
              example: true,
            },
            isAvailableForEmergency: {
              type: 'boolean',
              default: false,
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        // Appointment schemas
        Appointment: {
          type: 'object',
          required: ['pet', 'vet', 'appointmentDate', 'reason'],
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            user: {
              type: 'string',
              description: 'User ID of pet owner',
              example: '507f1f77bcf86cd799439011',
            },
            pet: {
              type: 'string',
              description: 'Pet ID',
              example: '507f1f77bcf86cd799439011',
            },
            vet: {
              type: 'string',
              description: 'Vet ID',
              example: '507f1f77bcf86cd799439011',
            },
            appointmentDate: {
              type: 'string',
              format: 'date-time',
              example: '2024-12-15T10:00:00Z',
            },
            reason: {
              type: 'string',
              example: 'Regular checkup',
            },
            symptoms: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['coughing', 'lethargy'],
            },
            status: {
              type: 'string',
              enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled'],
              default: 'scheduled',
              example: 'scheduled',
            },
            type: {
              type: 'string',
              enum: ['checkup', 'vaccination', 'surgery', 'emergency', 'followup', 'other'],
              example: 'checkup',
            },
            notes: {
              type: 'string',
              example: 'Pet has been showing symptoms for 2 days',
            },
            diagnosis: {
              type: 'string',
              example: 'Minor respiratory infection',
            },
            prescription: {
              type: 'string',
              example: 'Antibiotics for 7 days',
            },
            followUpDate: {
              type: 'string',
              format: 'date-time',
            },
            fee: {
              type: 'number',
              example: 75.00,
            },
            isPaid: {
              type: 'boolean',
              default: false,
              example: false,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        // Article schemas
        Article: {
          type: 'object',
          required: ['title', 'content', 'category'],
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            title: {
              type: 'string',
              example: 'Understanding Pet Nutrition',
            },
            slug: {
              type: 'string',
              example: 'understanding-pet-nutrition',
            },
            content: {
              type: 'string',
              example: 'Detailed article content about pet nutrition...',
            },
            excerpt: {
              type: 'string',
              example: 'Learn the basics of proper pet nutrition',
            },
            category: {
              type: 'string',
              enum: ['health', 'nutrition', 'training', 'behavior', 'grooming', 'safety', 'general'],
              example: 'nutrition',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['diet', 'health', 'wellness'],
            },
            author: {
              type: 'string',
              description: 'User ID of the author',
              example: '507f1f77bcf86cd799439011',
            },
            coverImage: {
              type: 'string',
              example: 'https://example.com/article-cover.jpg',
            },
            views: {
              type: 'number',
              default: 0,
              example: 150,
            },
            isPublished: {
              type: 'boolean',
              default: false,
              example: true,
            },
            publishedAt: {
              type: 'string',
              format: 'date-time',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        // Symptom checker schemas
        SymptomAnalysis: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            analysis: {
              type: 'object',
              properties: {
                severity: {
                  type: 'string',
                  enum: ['low', 'moderate', 'high', 'emergency'],
                  example: 'moderate',
                },
                possibleConditions: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                  example: ['Upper respiratory infection', 'Allergies'],
                },
                recommendations: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                  example: ['Monitor symptoms', 'Schedule vet appointment'],
                },
                urgency: {
                  type: 'string',
                  example: 'Schedule appointment within 2-3 days',
                },
                homeCareTips: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                  example: ['Keep pet hydrated', 'Ensure adequate rest'],
                },
              },
            },
            disclaimer: {
              type: 'string',
              example: 'This is AI-generated advice. Always consult a veterinarian.',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints',
      },
      {
        name: 'Pets',
        description: 'Pet records management',
      },
      {
        name: 'Veterinarians',
        description: 'Veterinarian profiles and management',
      },
      {
        name: 'Appointments',
        description: 'Appointment booking and management',
      },
      {
        name: 'Symptom Checker',
        description: 'AI-powered pet symptom analysis',
      },
      {
        name: 'Resources',
        description: 'Educational articles and resources',
      },
      {
        name: 'Admin',
        description: 'Administrative functions (admin only)',
      },
      {
        name: 'Health',
        description: 'Health check and system status',
      },
    ],
  },
  apis: [
    './routes/*.js', // Path to the API routes
    './controllers/*.js', // Path to controllers (for additional documentation)
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
