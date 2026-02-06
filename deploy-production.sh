#!/bin/bash

# Production deployment script for ReMake
# This script includes additional safety checks for production deployments

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
PROJECT_ID="${PROJECT_ID:-remake-production}"
ENVIRONMENT="production"

echo -e "${YELLOW}[WARNING]${NC} You are about to deploy to PRODUCTION!"
echo "Project: $PROJECT_ID"
echo
read -p "Are you sure you want to continue? (yes/no): " -r
echo

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

# Additional production checks
echo "Running production safety checks..."

# Check if tests pass
echo "Running tests..."
npm test || { echo -e "${RED}[ERROR]${NC} Tests failed. Aborting production deployment."; exit 1; }

# Check if build succeeds
echo "Running production build..."
npm run build || { echo -e "${RED}[ERROR]${NC} Build failed. Aborting production deployment."; exit 1; }

# Set production environment variables
export ENVIRONMENT=production
export PROJECT_ID=$PROJECT_ID

echo -e "${GREEN}[INFO]${NC} All checks passed. Starting production deployment..."

# Run the main deployment script
./deploy.sh --environment=production --project=$PROJECT_ID

echo -e "${GREEN}[SUCCESS]${NC} Production deployment completed!"
echo
echo "Post-deployment checklist:"
echo "☐ Verify application loads correctly"
echo "☐ Test critical user flows"
echo "☐ Check analytics are working"
echo "☐ Monitor error rates for 24 hours"
echo "☐ Notify team of successful deployment"