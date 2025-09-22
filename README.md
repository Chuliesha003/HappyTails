# 🐾 HappyTails - Pet Health Management Platform

A comprehensive pet health management platform with AI-powered symptom checking, email-based role system, and modern responsive design.

## ✨ Features

### 🔐 Simple User System
- **Guest Users**: Limited access with 2 free symptom checks
- **Registered Users**: Full access to all pet health management features
- **Admin Users**: Complete platform administration and management

### 🏥 Core Functionality
- **AI Symptom Checker**: Analyze pet symptoms with detailed recommendations
- **Vet Finder**: Locate and connect with trusted veterinarians
- **Pet Records**: Manage your pet's health information
- **User Dashboard**: Personal pet health management center
- **Admin Dashboard**: Platform administration and user management
- **Resources**: Educational content for pet care
- **Responsive Design**: Works seamlessly on all devices

### 🎨 Modern UI/UX
- Beautiful gradient designs with purple-pink theme
- Glass-morphism effects and smooth animations
- Interactive loading states and user feedback
- Custom paw print favicon and real pet photography

## 🚀 Demo Accounts

Try different access levels with these credentials:

| Email | Password | Role | Features |
|-------|----------|------|----------|
| `demo.admin@happytails.com` | `demo123` | Admin | 🟢 Full platform management |
| `demo.user@happytails.com` | `demo123` | User | 🔵 Complete pet health features |
| No login required | - | Guest | ⚪ Limited access (2 symptom checks) |

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Authentication**: Custom email-based role system
- **Routing**: React Router v6 with protected routes
- **State Management**: Context API
- **Icons**: Lucide React, Custom SVG assets

## Project Structure

This project has been organized into a monorepo structure:

```
happytails/
├── frontend/          # React frontend application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── package.json       # Root package.json for monorepo management
└── README.md
```

## Quick Start

### Development

From the root directory:
```bash
npm run dev
```

Or run frontend directly:
```bash
cd frontend
npm run dev
```

### Available Scripts

- `npm run dev` - Start the frontend development server
- `npm run build` - Build the frontend for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint on the frontend code

## Project info

**URL**: https://lovable.dev/projects/a403ab49-41cd-4789-a04d-12eded82ca20

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a403ab49-41cd-4789-a04d-12eded82ca20) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a403ab49-41cd-4789-a04d-12eded82ca20) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
