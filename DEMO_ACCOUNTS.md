# HappyTails Demo Accounts

This document contains the available demo accounts for testing the HappyTails platform.

## 🔐 Demo Credentials

### Administrator Accounts
| Email | Password | Access Level | Dashboard |
|-------|----------|--------------|-----------|
| `admin@happytails.com` | `admin123` | Full Admin Access | Admin Dashboard |
| `demo.admin@happytails.com` | `demo123` | Full Admin Access | Admin Dashboard |

### Registered User Accounts
| Email | Password | Access Level | Dashboard |
|-------|----------|--------------|-----------|
| `user@happytails.com` | `user123` | Registered User | User Dashboard |
| `demo.user@happytails.com` | `demo123` | Registered User | User Dashboard |

## 🎯 Features by Role

### Admin Dashboard Features
- User management and registration approval
- System status monitoring
- Database and server health metrics  
- System configuration settings
- Real-time activity logs
- Full platform analytics

### User Dashboard Features
- Pet profile management
- Appointment scheduling and history
- Health reminders and notifications
- Quick actions (symptom checker, vet finder)
- Recent activity tracking
- Pet records access

### Guest User Features
- AI Symptom Checker (2 uses per session)
- Educational Resources
- Basic navigation

## 🚀 Quick Test Scenarios

1. **Admin Login Test**: Use `demo.admin@happytails.com` / `demo123` to access admin features
2. **User Login Test**: Use `demo.user@happytails.com` / `demo123` to access user dashboard
3. **Guest Access Test**: Use the site without logging in (limited to 2 symptom checks)
4. **Invalid Login Test**: Try wrong credentials to see error handling

## 📱 Navigation After Login

- **Admin users** → Redirected to `/admin-dashboard`
- **Registered users** → Redirected to `/user-dashboard`  
- **Guest users** → Limited access with session-based usage tracking

## 🔒 Security Features

- Password validation required
- Role-based access control
- Protected routes with authentication
- Session management with localStorage
- Guest usage limits (2 uses for symptom checker)

---

*Last updated: September 14, 2025*
