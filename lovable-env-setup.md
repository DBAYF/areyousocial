# Lovable Environment Variables Setup

## Required Environment Variables for ReMake Deployment

When deploying to Lovable, add these environment variables in your Lovable project settings:

### Firebase Configuration
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBBBH9uRdSejFNTssqyUJGft-hRsEXn9lY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=remakevle.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=remakevle
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=remakevle.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=981058396915
NEXT_PUBLIC_FIREBASE_APP_ID=1:981058396915:web:607bb3f231a98019788d86
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-9QFJH6Z3KS
FIRESTORE_PROJECT_ID=remakevle
```

### AI Services
```
OPENAI_API_KEY=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
```

### Application Settings
```
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-lovable-app.lovable.app
```

## How to Set Environment Variables in Lovable

1. Go to your Lovable project dashboard
2. Navigate to Project Settings → Environment Variables
3. Add each variable from the list above
4. Redeploy your application

## Verification

After deployment, you can verify the setup by:
- Checking that Firebase authentication works
- Testing AI features in the messaging system
- Confirming real-time features function properly

## Troubleshooting

If you encounter issues:
1. Check that all environment variables are set correctly
2. Verify your Firebase project is active
3. Ensure your OpenAI API key is valid
4. Check the Lovable deployment logs for any build errors