#!/bin/bash

# ReMake Startup Script - FREE Firebase Tier
# This script helps you start ReMake with proper error handling

set -e

echo "🚀 Starting ReMake (FREE Firebase Tier)"
echo "========================================"
echo

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if Firebase CLI is logged in
check_firebase_login() {
    echo -e "${BLUE}Checking Firebase login...${NC}"
    if ! firebase projects:list >/dev/null 2>&1; then
        echo -e "${RED}❌ Not logged in to Firebase${NC}"
        echo -e "${YELLOW}Please run: firebase login${NC}"
        echo
        echo "After logging in, run this script again."
        exit 1
    else
        echo -e "${GREEN}✅ Firebase login OK${NC}"
    fi
}

# Check if project is set
check_firebase_project() {
    echo -e "${BLUE}Checking Firebase project...${NC}"
    local current_project=$(firebase use 2>/dev/null | grep "Now using project" | awk '{print $4}' || echo "")
    if [ -z "$current_project" ] || [ "$current_project" != "remakevle" ]; then
        echo -e "${YELLOW}Setting Firebase project to remakevle...${NC}"
        firebase use remakevle
    else
        echo -e "${GREEN}✅ Firebase project OK: $current_project${NC}"
    fi
}

# Check if emulators can start
check_emulator_ports() {
    echo -e "${BLUE}Checking emulator ports...${NC}"

    # Check if ports are available
    local ports=(8080 9099 9199 5001)
    local port_names=("Firestore" "Auth" "Storage" "Hosting")

    for i in "${!ports[@]}"; do
        if lsof -i ":${ports[$i]}" >/dev/null 2>&1; then
            echo -e "${RED}❌ Port ${ports[$i]} (${port_names[$i]}) is already in use${NC}"
            echo -e "${YELLOW}Please close the application using this port or choose a different port${NC}"
            echo
            echo "To find what's using the port:"
            echo "lsof -i :${ports[$i]}"
            echo
            echo "To kill a process (replace PID):"
            echo "kill -9 <PID>"
            echo
            exit 1
        fi
    done

    echo -e "${GREEN}✅ All emulator ports available${NC}"
}

# Start emulators
start_emulators() {
    echo -e "${BLUE}Starting Firebase emulators...${NC}"
    echo -e "${YELLOW}This will start: Firestore (8080), Auth (9099), Storage (9199), Hosting (5001)${NC}"
    echo

    firebase emulators:start &
    EMULATOR_PID=$!

    # Wait a bit for emulators to start
    sleep 5

    # Check if emulators are running
    if ps -p $EMULATOR_PID > /dev/null; then
        echo -e "${GREEN}✅ Firebase emulators started successfully${NC}"
        echo -e "${YELLOW}Emulator UI: http://localhost:4000${NC}"
    else
        echo -e "${RED}❌ Failed to start Firebase emulators${NC}"
        exit 1
    fi

    echo
}

# Start Next.js app
start_app() {
    echo -e "${BLUE}Starting Next.js application...${NC}"
    echo -e "${YELLOW}App will be available at: http://localhost:3000${NC}"
    echo

    npm run dev &
    APP_PID=$!

    # Wait a bit for app to start
    sleep 3

    if ps -p $APP_PID > /dev/null; then
        echo -e "${GREEN}✅ ReMake app started successfully${NC}"
    else
        echo -e "${RED}❌ Failed to start ReMake app${NC}"
        exit 1
    fi

    echo
}

# Show success message
show_success() {
    echo -e "${GREEN}🎉 ReMake is now running!${NC}"
    echo
    echo "🌐 App:        http://localhost:3000"
    echo "🔥 Emulators:  http://localhost:4000"
    echo "📊 Firestore:  http://localhost:8080"
    echo "🔐 Auth:       http://localhost:9099"
    echo "💾 Storage:    http://localhost:9199"
    echo "🏠 Hosting:    http://localhost:5001"
    echo
    echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
    echo

    # Wait for user to stop
    trap "echo -e '\n${BLUE}Stopping services...${NC}'; kill $EMULATOR_PID $APP_PID 2>/dev/null; exit 0" INT
    wait
}

# Main execution
main() {
    echo "This script will start ReMake with FREE Firebase services only."
    echo "No Cloud Functions, no paid services - just pure Firebase goodness!"
    echo

    check_firebase_login
    echo

    check_firebase_project
    echo

    check_emulator_ports
    echo

    start_emulators
    start_app
    show_success
}

# Run main function
main "$@"