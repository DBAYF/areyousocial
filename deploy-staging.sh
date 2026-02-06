#!/bin/bash

# Staging deployment script for ReMake

# Set staging environment variables
export ENVIRONMENT=staging
export PROJECT_ID=remake-staging

# Run the main deployment script
./deploy.sh --environment=staging --project=$PROJECT_ID