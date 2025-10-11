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

# HappyTails

Comprehensive pet health management platform for clinics, pet owners and administrators.

This README is written to be suitable for sharing on GitHub and for presentation to lecturers or evaluators. It covers project goals, architecture, setup, development tips, and how to extend or test the application.

---

## Quick overview

- Purpose: Help pet owners manage pet health records, find veterinarians, run AI-backed symptom checks, and let clinics/admins manage users and content.
- Audience: Students, instructors, reviewers, maintainers, and contributors.

---

## Key features

- User roles: Guest, Registered User, Vet, Admin
- Pet records: create, edit, delete, and view pet profiles and medical history
- Symptom checker: AI-assisted symptom analysis and recommendations
- Vet finder: search and view nearby verified veterinary clinics
- Admin dashboard: user, pet, appointment, vet, and content management
- Responsive UI built with Tailwind CSS and shadcn/ui components

---

## Tech stack

- Frontend: React 18 + TypeScript, Vite
- Styling: Tailwind CSS, shadcn/ui
- Backend: Node.js + Express (API controllers and routes in `backend/`)
- Database: MongoDB (Mongoose models in `backend/models/`)
- Authentication: Firebase (used for auth) + backend token verification
- Linting & formatting: ESLint, Prettier

---

## Repo layout (monorepo)

```
HappyTails/
├─ frontend/          # React app (src/, public/, package.json)
├─ backend/           # Express API (controllers/, models/, routes/)
├─ README.md          # This file
└─ ...
```

---

## Getting started (developer instructions)

Prerequisites
- Node.js 18+ and npm (or Yarn)
- MongoDB running locally or a MongoDB URI
- Firebase project (for auth) and credentials in `frontend/.env` and `backend/.env` as needed

Local development (recommended)

1. Clone the repo

	git clone <your-repo-url>
	cd HappyTails

2. Install dependencies

	cd frontend
	npm install

	cd ../backend
	npm install

3. Configure environment

	- Copy `frontend/.env.example` → `frontend/.env` and set VITE_GOOGLE_MAPS_API_KEY, Firebase keys, and backend URL
	- Copy `backend/.env.example` → `backend/.env` and set MONGODB_URI and Firebase admin credentials

4. Run development servers (two terminals)

	# Terminal 1 - backend
	cd backend; npm run dev

	# Terminal 2 - frontend
	cd frontend; npm run dev

The frontend will normally run at http://localhost:5173 and the backend at http://localhost:8080 (confirm in console output).

---

## How to use (demo instructions for evaluators)

1. Open the frontend URL in a browser.
2. Use the demo accounts or register a new user.
3. Navigate to "Pet Records" to add a pet — after successful creation, the pet will appear below the form in the Pet Records page (create/list/edit/delete supported).
4. Open the Admin Dashboard (admin account) to manage users, pets, appointments, vets, and articles.

Screenshots and a short walkthrough video are helpful for exams — include them in the repository under `docs/screenshots/` if available.

---

## Development notes & internals (for lecturers)

- Frontend pages are under `frontend/src/pages/`.
- Shared types for API models are in `frontend/src/types/api.ts`.
- Admin API and controllers are in `backend/controllers/` and routes in `backend/routes/`.
- Pet creation includes frontend normalization to the API types (e.g. gender capitalization). Backend controllers enforce validation and create or reuse existing related records as needed.

Important implementation detail: when creating pets, the app checks for existing records where appropriate and avoids duplicate creation. Pet CRUD is stored in the pets collection (Mongoose model). See `backend/controllers/petController.js` and `frontend/src/services/pets.ts` for the full flow.

---

## Testing and QA

- ESLint: `cd frontend && npm run lint`
- Type checking: `cd frontend && npx tsc --noEmit`
- Run unit/integration tests (if present) with the project test scripts — add tests under `frontend/__tests__/` or `backend/__tests__/`.

---

## Contributing

Contributions are welcome. For class submissions, please include a short changelog and clearly comment any significant design decisions. For OSS contributions follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-change`
3. Commit with conventional commit messages (`feat:`, `fix:`, `chore:`, `docs:`)
4. Open a pull request describing the change

---

## Deployment

This repo can be deployed to Vercel, Netlify (frontend) and an appropriate Node host (backend). If using the provided Lovable project, you can publish directly from the Lovable UI.

---

## License & attribution

Specify your preferred license here (e.g., MIT). Include attribution for any third-party assets.

---

## Contact

Project lead: Vinuki Omalshara
Repository: https://github.com/VinukiOmalshara/HappyTails

If you'd like, I can also:

- Add example screenshots under `docs/screenshots/` and reference them in this README
- Add CI configuration (GitHub Actions) for linting and type checking on PRs
- Create a short walkthrough video and link it from the README

---

Thank you — good luck with your presentation or lecture review.
