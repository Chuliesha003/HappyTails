## Project Contribution

This project was developed as a group academic project.

My contributions include:
-Frontend – Technical Documentation & QA 


<div align="center">

# 🐾 HappyTails

### AI-Powered Pet Health Management Platform

A comprehensive web application helping pet owners manage their pets' health with intelligent symptom checking, veterinary clinic discovery, and complete health record management.

[![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Architecture](#-architecture) • [Project Structure](#-project-structure) • [License](#-license)

</div>

---

## 📋 Overview

HappyTails is a modern, full-stack web application designed to streamline pet healthcare management. Built with React and Node.js, it provides pet owners with AI-powered health insights, veterinary clinic discovery, and comprehensive pet record management—all in one elegant, responsive platform.

## ✨ Features

### 🤖 AI-Powered Symptom Checker
- Intelligent analysis of pet symptoms using advanced AI
- Detailed health recommendations and care guidelines
- Quick preliminary health assessments
- Guest access with limited free checks

### 🏥 Veterinary Clinic Finder
- Interactive map-based clinic discovery
- Search and filter by location, services, and ratings
- Detailed clinic profiles with contact information
- Real-time availability and appointment booking

### 📝 Pet Health Records Management
- Complete digital health profiles for multiple pets
- Medical history tracking and documentation
- Vaccination schedules and reminders
- Upload and store medical documents

### 👥 Multi-Level User System
- **Guest Users**: Limited access for exploring the platform
- **Registered Users**: Full access to all pet management features
- **Veterinarians**: Clinic profile management and appointment handling
- **Administrators**: Platform oversight and content moderation

### 📱 Modern User Experience
- Fully responsive design for mobile, tablet, and desktop
- Beautiful gradient UI with purple-pink theme
- Glass-morphism effects and smooth animations
- Intuitive navigation and user feedback
- Real-time notifications and updates

### 📚 Educational Resources
- Curated pet care articles and guides
- Expert veterinary advice
- Preventive care tips
- Breed-specific health information

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **Routing**: React Router v6 with protected routes
- **State Management**: React Context API
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Firebase Authentication
- **API Architecture**: RESTful API design
- **Security**: JWT tokens, CORS, rate limiting
- **File Storage**: Firebase Storage
- **Logging**: Winston logger
- **Testing**: Jest

### DevOps & Tools
- **Version Control**: Git & GitHub
- **Code Quality**: ESLint, Prettier
- **API Documentation**: Swagger/OpenAPI
- **Process Management**: PM2

## 🏗️ Architecture

HappyTails follows a **monorepo architecture** with clear separation between frontend and backend:

```
┌─────────────────────────────────────────────────┐
│                   Client Layer                   │
│         (React SPA + TypeScript)                 │
│   ┌─────────────────────────────────────┐       │
│   │  Pages  │ Components │ Services      │       │
│   └─────────────────────────────────────┘       │
└────────────────┬────────────────────────────────┘
                 │ HTTP/REST API
                 ▼
┌─────────────────────────────────────────────────┐
│                  API Layer                       │
│            (Express.js Server)                   │
│   ┌─────────────────────────────────────┐       │
│   │  Routes  │ Controllers │ Middleware  │       │
│   └─────────────────────────────────────┘       │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│               Data Layer                         │
│   ┌──────────────┐    ┌──────────────┐         │
│   │   MongoDB    │    │   Firebase   │         │
│   │  (Database)  │    │    (Auth)    │         │
│   └──────────────┘    └──────────────┘         │
└─────────────────────────────────────────────────┘
```

### Key Design Patterns
- **MVC Pattern**: Controllers handle business logic, models define data schemas
- **Repository Pattern**: Data access abstraction through Mongoose models
- **Middleware Chain**: Request validation, authentication, and error handling
- **Context API**: Centralized state management for auth and user data
- **Protected Routes**: Role-based access control on both frontend and backend

## 📁 Project Structure

```
HappyTails/
├── frontend/                  # React application
│   ├── src/
│   │   ├── pages/            # Page components (Dashboard, VetFinder, etc.)
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   └── ...          # Custom components
│   │   ├── contexts/        # React Context providers
│   │   ├── services/        # API service layer
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Helper functions
│   │   └── App.tsx          # Root component
│   ├── public/              # Static assets
│   ├── package.json
│   └── vite.config.ts       # Vite configuration
│
├── backend/                  # Express API server
│   ├── config/              # Configuration files
│   │   ├── config.js       # Environment config
│   │   ├── database.js     # MongoDB connection
│   │   └── firebase.js     # Firebase admin setup
│   ├── controllers/         # Request handlers
│   │   ├── authController.js
│   │   ├── petController.js
│   │   ├── vetController.js
│   │   └── ...
│   ├── models/              # Mongoose schemas
│   │   ├── User.js
│   │   ├── Pet.js
│   │   ├── Appointment.js
│   │   └── ...
│   ├── routes/              # API route definitions
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js         # JWT verification
│   │   ├── validator.js    # Request validation
│   │   └── errorHandler.js # Error handling
│   ├── utils/               # Utility functions
│   ├── tests/               # Test suites
│   ├── server.js            # Entry point
│   └── package.json
│
├── LICENSE
├── README.md
└── package.json             # Root package.json
```

## 🔑 Key Features Implementation

### AI Symptom Checker
The symptom checker uses a sophisticated normalization and analysis system:
- Collects detailed pet and symptom information
- Normalizes input data for consistent AI processing
- Generates comprehensive health assessments
- Provides actionable recommendations and next steps

### Role-Based Access Control
- Firebase authentication integration
- Custom JWT token verification middleware
- Protected API endpoints based on user roles
- Frontend route guards for authorized access

### Pet Health Records
- CRUD operations for pet profiles
- Photo upload and management via Firebase Storage
- Medical history timeline
- Vaccination tracking system

## 🎨 UI/UX Highlights

- **Responsive Design**: Mobile-first approach with breakpoints for all devices
- **Custom Theme**: Purple-pink gradient color scheme with glass-morphism
- **Smooth Animations**: Framer Motion for page transitions and interactions
- **Loading States**: Skeleton loaders and spinners for better UX
- **Form Validation**: Real-time validation with helpful error messages
- **Accessibility**: ARIA labels and keyboard navigation support

## 🚀 Performance Optimizations

- Code splitting and lazy loading for reduced bundle size
- Image optimization and lazy loading
- API response caching
- Database query optimization with indexes
- Minimized re-renders with React.memo and useMemo

## 🔒 Security Features

- Secure authentication with Firebase
- JWT token-based API authorization
- Input validation and sanitization
- CORS configuration
- Rate limiting on API endpoints
- SQL injection prevention with Mongoose
- XSS protection with proper escaping

## 📈 Future Enhancements

- [ ] Real-time chat with veterinarians
- [ ] Push notifications for appointments and reminders
- [ ] Integration with wearable pet health devices
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Telemedicine video consultations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Vinuki Omalshara**

- GitHub: [@VinukiOmalshara](https://github.com/VinukiOmalshara)
- Project Link: [HappyTails](https://github.com/VinukiOmalshara/HappyTails)

## 🙏 Acknowledgments

- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide Icons](https://lucide.dev/)
- Design inspiration from modern pet care platforms

---

<div align="center">

**If you found this project helpful, please consider giving it a ⭐!**

Made with ❤️ for pet owners everywhere

</div>
