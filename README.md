# ReMake - Social Platform for Entrepreneurs

A complete, production-ready social platform for entrepreneurs featuring AI-powered networking, mentorship matching, job marketplace, and comprehensive admin tools.

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and **npm** 8+
- **Firebase CLI** (`npm install -g firebase-tools`)
- **Git**

```bash
# Check versions
node --version  # Should be 18+
npm --version   # Should be 8+
firebase --version  # Should be installed
```

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd remake

# Install dependencies
npm install

# Note: This app uses FREE Firebase features only (no Cloud Functions)
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.local.example .env.local

# Edit .env.local with your configuration
# Required: Firebase config, AI API keys, etc.
```

### 3. Firebase Setup

```bash
# Login to Firebase
firebase login

# Initialize/select Firebase project
firebase use your-project-id

# Start emulators (for local development)
# Note: Only Firestore, Auth, Storage, and Hosting emulators run (no Functions)
firebase emulators:start
```

### 4. Run Development Server

```bash
# Start the Next.js development server
npm run dev

# In another terminal, start Firebase emulators
firebase emulators:start
```

The app will be available at `http://localhost:3000`

## 📋 Detailed Setup Guide

### Firebase Configuration

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing

2. **Enable Services**
   ```bash
   # Enable Authentication
   firebase auth:export auth.json --project your-project-id

   # Enable Firestore
   # (Configure in Firebase Console)

   # Enable Storage
   # (Configure in Firebase Console)

   # Enable Functions
   firebase functions:config:set app.url="http://localhost:3000"
   ```

3. **Security Rules**
   ```bash
   # Deploy Firestore rules
   firebase deploy --only firestore

   # Deploy Storage rules
   firebase deploy --only storage
   ```

### Environment Variables

Edit `.env.local` with your actual values:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# AI Services (Get from respective providers)
OPENAI_API_KEY=sk-your_openai_key_here
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key_here
GOOGLE_AI_API_KEY=your_google_ai_key_here

# Other services (optional)
EMAIL_API_KEY=your_email_service_key_here
```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
# Terminal 1: Start Next.js
npm run dev

# Terminal 2: Start Firebase emulators
firebase emulators:start
```

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Staging Deployment

```bash
# Run staging deployment
./deploy-staging.sh
```

### Production Deployment

```bash
# Run production deployment
./deploy-production.sh
```

### Manual Deployment

```bash
# Build and deploy database/storage rules
firebase deploy --only firestore,storage

# Build and deploy hosting
npm run build
firebase deploy --only hosting
```

## 📁 Project Structure

```
remake/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (main)/            # Main application pages
│   │   └── (onboarding)/      # Onboarding flow
│   ├── components/            # Reusable components
│   │   ├── ui/               # Base UI components
│   │   ├── messaging/        # Messaging components
│   │   ├── opportunities/    # Job marketplace
│   │   ├── mentors/          # Mentorship system
│   │   ├── settings/         # User settings
│   │   └── shared/           # Shared components
│   ├── lib/                  # Utilities and configurations
│   │   ├── stores/           # Zustand state stores
│   │   ├── hooks/            # Custom React hooks
│   │   ├── validations/      # Zod validation schemas
│   │   └── utils/            # Helper functions
│   └── styles/               # Global styles
├── public/                    # Static assets
├── firebase.json             # Firebase configuration
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS config
├── tsconfig.json             # TypeScript configuration
└── README.md
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript type checking

# Testing
npm test                 # Run all tests
npm run test:unit        # Run unit tests
npm run test:integration # Run integration tests
npm run test:e2e         # Run E2E tests

# Firebase
firebase emulators:start  # Start Firebase emulators
firebase deploy          # Deploy to Firebase
firebase functions:log   # View function logs

# Deployment
./deploy.sh              # Full deployment
./deploy-staging.sh      # Staging deployment
./deploy-production.sh   # Production deployment
```

## 🌐 Features Overview

### Core Features
- **Authentication**: Firebase Auth with social logins
- **User Profiles**: Comprehensive profile management
- **Social Feed**: Posts, comments, likes, shares
- **Connections**: Professional networking
- **Messaging**: Real-time chat with AI assistance
- **Opportunities**: Job and investment marketplace
- **Mentorship**: AI-powered mentor matching

### Advanced Features
- **AI Integration**: OpenAI, Anthropic, Google AI
- **Real-time Updates**: WebSocket connections
- **Offline Support**: PWA capabilities
- **Admin Console**: Complete moderation tools
- **Analytics**: User behavior tracking
- **Security**: Enterprise-grade security

## 🆘 Troubleshooting

### Common Issues

**Emulators not starting:**
```bash
# Kill existing processes
pkill -f firebase
pkill -f java

# Clear emulator data
firebase emulators:clear
```

**Build failing:**
```bash
# Clear cache
npm run clean
rm -rf .next node_modules
npm install
```

**Functions not deploying:**
```bash
# Check function logs
firebase functions:log --only your-function-name

# Redeploy specific function
firebase deploy --only functions:your-function-name
```

### Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub Discussions for questions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🚨 Troubleshooting

Having issues? Check the **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** guide for:

- Port conflicts and how to resolve them
- Firebase login issues
- Build failures and fixes
- Common error messages
- Quick reset commands

### Quick Fixes

**Port already in use:**
```bash
# Find what's using port 5001
lsof -i :5001

# Kill the process
kill -9 <PID>

# Or change port in firebase.json
```

**Firebase not logged in:**
```bash
firebase login  # Run this first
```

**Emulators won't start:**
```bash
pkill -f firebase
firebase emulators:clear
firebase emulators:start
```

---

**Built with ❤️ for entrepreneurs worldwide**