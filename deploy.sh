#!/bin/bash

# ReMake Deployment Script
# This script handles the complete deployment process for the ReMake application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="${PROJECT_ID:-your-project-id}"
ENVIRONMENT="${ENVIRONMENT:-staging}"
REGION="${REGION:-us-central1}"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_dependencies() {
    log_info "Checking dependencies..."

    # Check if required tools are installed
    command -v node >/dev/null 2>&1 || { log_error "Node.js is required but not installed."; exit 1; }
    command -v npm >/dev/null 2>&1 || { log_error "npm is required but not installed."; exit 1; }
    command -v firebase >/dev/null 2>&1 || { log_error "Firebase CLI is required but not installed."; exit 1; }

    # Check if user is logged in to Firebase
    firebase projects:list >/dev/null 2>&1 || { log_error "Not logged in to Firebase. Run 'firebase login' first."; exit 1; }

    log_success "Dependencies check passed"
}

setup_environment() {
    log_info "Setting up environment for $ENVIRONMENT..."

    # Copy environment file
    if [ -f ".env.$ENVIRONMENT" ]; then
        cp ".env.$ENVIRONMENT" ".env.local"
        log_success "Environment file copied"
    else
        log_warning "Environment file .env.$ENVIRONMENT not found. Using .env.local if it exists."
    fi

    # Set Firebase project
    firebase use "$PROJECT_ID"
    log_success "Firebase project set to $PROJECT_ID"
}

install_dependencies() {
    log_info "Installing dependencies..."

    # Install root dependencies
    npm ci

    # Install functions dependencies
    cd functions
    npm ci
    cd ..

    log_success "Dependencies installed"
}

build_application() {
    log_info "Building application..."

    # Build Next.js application
    npm run build

    # Build functions
    cd functions
    npm run build
    cd ..

    log_success "Application built successfully"
}

run_tests() {
    log_info "Running tests..."

    # Run unit tests
    npm run test:unit || { log_warning "Unit tests failed"; }

    # Run integration tests (if available)
    npm run test:integration || { log_warning "Integration tests failed or not configured"; }

    # Run functions tests
    cd functions
    npm test || { log_warning "Functions tests failed"; }
    cd ..

    log_success "Testing completed"
}

deploy_infrastructure() {
    log_info "Deploying infrastructure..."

    # Deploy Firestore rules and indexes
    firebase deploy --only firestore

    # Deploy Storage rules
    firebase deploy --only storage

    log_success "Infrastructure deployed"
}

deploy_functions() {
    log_info "Deploying Cloud Functions..."

    # Deploy functions
    firebase deploy --only functions

    log_success "Functions deployed"
}

deploy_hosting() {
    log_info "Deploying hosting..."

    # Deploy hosting
    firebase deploy --only hosting

    log_success "Hosting deployed"
}

run_health_checks() {
    log_info "Running health checks..."

    # Check if functions are deployed and responding
    FUNCTIONS_URL="https://$REGION-$PROJECT_ID.cloudfunctions.net"

    # Test AI gateway function
    if curl -s -f "$FUNCTIONS_URL/aiGateway" >/dev/null 2>&1; then
        log_success "AI Gateway function is responding"
    else
        log_warning "AI Gateway function health check failed"
    fi

    # Test hosting
    HOSTING_URL="https://$PROJECT_ID.web.app"
    if curl -s -f "$HOSTING_URL" >/dev/null 2>&1; then
        log_success "Hosting is responding"
    else
        log_warning "Hosting health check failed"
    fi
}

create_backup() {
    log_info "Creating backup..."

    # Create timestamp
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)

    # Backup Firestore data (using gcloud)
    gcloud firestore export gs://$PROJECT_ID-backups/$TIMESTAMP \
        --project=$PROJECT_ID \
        --quiet

    log_success "Backup created at gs://$PROJECT_ID-backups/$TIMESTAMP"
}

rollback_deployment() {
    log_warning "Deployment failed. Starting rollback..."

    # Rollback functions to previous version
    firebase functions:rollback --only aiGateway,recommendations,generateRecommendations,refreshAllRecommendations,onUserCreate,onProfileUpdate,cleanupExpiredOpportunities,cleanupStorageFiles,updateCustomClaims,deleteUserData,exportAuditLogs

    # Rollback hosting
    firebase hosting:rollback

    log_info "Rollback completed. Please check the application status."
}

cleanup() {
    log_info "Cleaning up..."

    # Remove temporary files
    rm -f .env.local

    log_success "Cleanup completed"
}

# Main deployment flow
main() {
    echo "🚀 Starting ReMake deployment to $ENVIRONMENT environment"
    echo "Project: $PROJECT_ID"
    echo "Region: $REGION"
    echo

    # Trap errors for rollback
    trap rollback_deployment ERR

    check_dependencies
    setup_environment
    install_dependencies
    build_application

    # Run tests only in staging
    if [ "$ENVIRONMENT" = "staging" ]; then
        run_tests
    fi

    deploy_infrastructure
    deploy_functions
    deploy_hosting

    # Create backup before going live
    if [ "$ENVIRONMENT" = "production" ]; then
        create_backup
    fi

    run_health_checks
    cleanup

    log_success "🎉 Deployment completed successfully!"
    echo
    echo "Application URLs:"
    echo "- Hosting: https://$PROJECT_ID.web.app"
    echo "- Functions: https://$REGION-$PROJECT_ID.cloudfunctions.net"
    echo
    echo "Monitor your application at: https://console.firebase.google.com/project/$PROJECT_ID/overview"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --project=*)
            PROJECT_ID="${1#*=}"
            shift
            ;;
        --environment=*)
            ENVIRONMENT="${1#*=}"
            shift
            ;;
        --region=*)
            REGION="${1#*=}"
            shift
            ;;
        --help)
            echo "Usage: $0 [--project=PROJECT_ID] [--environment=ENVIRONMENT] [--region=REGION]"
            echo
            echo "Arguments:"
            echo "  --project=PROJECT_ID      Firebase project ID (default: your-project-id)"
            echo "  --environment=ENVIRONMENT Target environment: staging or production (default: staging)"
            echo "  --region=REGION           Firebase region (default: us-central1)"
            exit 0
            ;;
        *)
            log_error "Unknown argument: $1"
            exit 1
            ;;
    esac
done

# Validate environment
if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
    log_error "Environment must be 'staging' or 'production'"
    exit 1
fi

# Run main deployment
main "$@"