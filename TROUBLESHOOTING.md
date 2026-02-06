# 🚨 ReMake Troubleshooting Guide

## Common Issues & Solutions

### 1. "firebase command not found"
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Verify installation
firebase --version
```

### 2. "Not logged in to Firebase"
```bash
# Login to Firebase (opens browser)
firebase login

# Verify login
firebase projects:list
```

### 3. "Project not found"
```bash
# List available projects
firebase projects:list

# Use your project
firebase use your-project-id

# Or create new project
firebase projects:create remake-app
```

### 4. "Port XXXX already in use"
```bash
# Find what's using the port
lsof -i :5001  # Replace with your port

# Kill the process (replace PID)
kill -9 <PID>

# Or change ports in firebase.json
{
  "emulators": {
    "hosting": {
      "port": 5002  # Try different port
    }
  }
}
```

### 5. "Emulators failed to start"
```bash
# Kill all Firebase processes
pkill -f firebase
pkill -f java

# Clear emulator data
firebase emulators:clear

# Try starting again
firebase emulators:start
```

### 6. "Build failed" or "Module not found"
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

### 7. "Firebase config not found"
```bash
# Check if .env.local exists
ls -la .env.local

# Copy from template if missing
cp .env.local.example .env.local

# Edit with your Firebase config
nano .env.local
```

### 8. "Cannot connect to Firestore"
```bash
# Check if emulators are running
curl http://localhost:8080

# Start emulators if not running
firebase emulators:start
```

### 9. "Auth emulator not working"
```bash
# Check auth emulator
curl http://localhost:9099

# Clear auth data
firebase emulators:clear
```

### 10. "App not loading"
```bash
# Check if Next.js is running
curl http://localhost:3000

# Check for build errors
npm run build

# Clear cache
rm -rf .next
npm run dev
```

## 🔧 Quick Fix Commands

### Complete Reset
```bash
# Stop all processes
pkill -f firebase
pkill -f node
pkill -f next

# Clean everything
rm -rf .next node_modules
npm install

# Clear Firebase data
firebase emulators:clear

# Restart
firebase emulators:start &
npm run dev
```

### Port Issues
```bash
# Find all processes using Firebase ports
lsof -i :8080 -i :9099 -i :9199 -i :5001

# Kill all at once
lsof -ti :8080,9099,9199,5001 | xargs kill -9
```

### Firebase Issues
```bash
# Check Firebase status
firebase --version
firebase projects:list

# Re-login if needed
firebase logout
firebase login

# Reset project
firebase use --clear
firebase use your-project-id
```

## 📞 Getting Help

### Check These First
1. **Firebase Console**: https://console.firebase.google.com/
2. **Emulator UI**: http://localhost:4000
3. **App Logs**: Check terminal output
4. **Browser Console**: F12 → Console tab

### Debug Steps
1. **Check Firebase login**: `firebase projects:list`
2. **Check project**: `firebase use`
3. **Check ports**: `lsof -i :8080,9099,9199,5001`
4. **Check app**: `curl http://localhost:3000`
5. **Check emulators**: `curl http://localhost:8080`

### Common Error Messages

#### "Error: functions predeploy error"
- **Cause**: Functions directory exists but shouldn't
- **Fix**: `rm -rf functions/`

#### "Error: Could not start Hosting Emulator"
- **Cause**: Port 5000 taken
- **Fix**: Change port in firebase.json or kill process

#### "Error: Project does not exist"
- **Cause**: Wrong project ID
- **Fix**: `firebase use correct-project-id`

#### "Error: Cannot run login in non-interactive mode"
- **Cause**: Trying to login in script
- **Fix**: Run `firebase login` manually first

## 🚀 Quick Start (If Everything Works)

```bash
# 1. Make sure you're logged in
firebase login

# 2. Set project
firebase use remakevle

# 3. Start emulators
firebase emulators:start

# 4. Start app (new terminal)
npm run dev

# 5. Open browser
# http://localhost:3000
```

## 📊 System Requirements

- **Node.js**: 18+
- **npm**: 8+
- **Firebase CLI**: Latest
- **Git**: Latest
- **OS**: macOS/Linux/Windows

## 🔄 Still Having Issues?

1. **Restart your computer** (sometimes helps)
2. **Try different ports** in firebase.json
3. **Use incognito browser** for Firebase login
4. **Check Firebase status page** for outages
5. **Create a new Firebase project** if current one is corrupted

---

**Need more help?** Check the main README.md or create an issue! 🎯