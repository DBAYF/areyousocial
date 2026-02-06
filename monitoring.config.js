// Monitoring and alerting configuration for ReMake

module.exports = {
  // Application Performance Monitoring
  performance: {
    // Core Web Vitals thresholds
    coreWebVitals: {
      lcp: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
      fid: { good: 100, needsImprovement: 300 },   // First Input Delay
      cls: { good: 0.1, needsImprovement: 0.25 },   // Cumulative Layout Shift
    },

    // Custom performance metrics
    customMetrics: {
      apiResponseTime: { warning: 1000, critical: 3000 }, // API response time in ms
      pageLoadTime: { warning: 2000, critical: 5000 },    // Page load time in ms
      timeToInteractive: { warning: 3000, critical: 8000 }, // Time to interactive in ms
    },
  },

  // Error Tracking
  errors: {
    // Error rates that trigger alerts
    rates: {
      frontend: { warning: 0.01, critical: 0.05 }, // 1% / 5% error rate
      backend: { warning: 0.005, critical: 0.02 }, // 0.5% / 2% error rate
      api: { warning: 0.01, critical: 0.03 },      // 1% / 3% error rate
    },

    // Error patterns to monitor
    patterns: [
      /TypeError/i,
      /ReferenceError/i,
      /FirebaseError/i,
      /AuthError/i,
      /ValidationError/i,
      /NetworkError/i,
    ],

    // Errors to ignore (false positives)
    ignorePatterns: [
      /ChunkLoadError/i,      // Code splitting issues
      /Non-Error promise rejection/i,
      /Loading chunk/i,
    ],
  },

  // Business Metrics
  business: {
    // User engagement metrics
    engagement: {
      dailyActiveUsers: { min: 100, target: 500 },
      sessionDuration: { min: 180, target: 600 }, // seconds
      bounceRate: { max: 0.4, target: 0.2 },
    },

    // Conversion metrics
    conversion: {
      signupRate: { min: 0.05, target: 0.15 },     // 5% / 15%
      profileCompletionRate: { min: 0.3, target: 0.7 }, // 30% / 70%
      connectionRate: { min: 0.1, target: 0.3 },   // 10% / 30%
    },

    // Revenue metrics (when applicable)
    revenue: {
      monthlyRecurringRevenue: { target: 10000 },
      customerAcquisitionCost: { max: 50, target: 25 },
      customerLifetimeValue: { min: 500, target: 2000 },
    },
  },

  // System Health
  system: {
    // Firebase services
    firestore: {
      readLatency: { warning: 100, critical: 500 },    // ms
      writeLatency: { warning: 200, critical: 1000 },  // ms
      errorRate: { warning: 0.001, critical: 0.01 },   // 0.1% / 1%
    },

    storage: {
      uploadLatency: { warning: 2000, critical: 10000 }, // ms
      downloadLatency: { warning: 1000, critical: 5000 }, // ms
      errorRate: { warning: 0.005, critical: 0.02 },     // 0.5% / 2%
    },

    functions: {
      executionTime: { warning: 30000, critical: 540000 }, // ms (30s / 9min)
      memoryUsage: { warning: 0.8, critical: 0.95 },       // 80% / 95%
      errorRate: { warning: 0.01, critical: 0.05 },        // 1% / 5%
    },

    hosting: {
      responseTime: { warning: 1000, critical: 3000 }, // ms
      availability: { min: 0.995, critical: 0.99 },    // 99.5% / 99%
    },
  },

  // Alerting Configuration
  alerting: {
    // Alert channels
    channels: {
      email: {
        enabled: true,
        recipients: ['alerts@remake.com', 'dev@remake.com'],
      },
      slack: {
        enabled: true,
        webhook: process.env.SLACK_WEBHOOK_URL,
        channels: ['#alerts', '#dev'],
      },
      pagerDuty: {
        enabled: process.env.NODE_ENV === 'production',
        integrationKey: process.env.PAGERDUTY_INTEGRATION_KEY,
      },
    },

    // Alert severity levels
    severity: {
      low: { channels: ['email'] },
      medium: { channels: ['email', 'slack'] },
      high: { channels: ['email', 'slack', 'pagerduty'] },
      critical: { channels: ['email', 'slack', 'pagerduty'] },
    },

    // Alert throttling (prevent alert spam)
    throttling: {
      windowMs: 5 * 60 * 1000, // 5 minutes
      maxAlerts: 5, // Max 5 alerts per window
      groupBy: ['type', 'severity'], // Group similar alerts
    },
  },

  // Monitoring Tools Integration
  integrations: {
    // Sentry for error tracking
    sentry: {
      enabled: true,
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 0.1, // 10% of transactions
    },

    // Google Analytics for user behavior
    googleAnalytics: {
      enabled: true,
      trackingId: process.env.GA_TRACKING_ID,
      customDimensions: {
        userType: 'dimension1',
        userStage: 'dimension2',
        subscriptionStatus: 'dimension3',
      },
    },

    // Mixpanel for product analytics
    mixpanel: {
      enabled: true,
      token: process.env.MIXPANEL_TOKEN,
      events: [
        'user_signup',
        'profile_completed',
        'connection_made',
        'opportunity_applied',
        'mentorship_requested',
        'message_sent',
      ],
    },

    // New Relic for application performance
    newRelic: {
      enabled: true,
      licenseKey: process.env.NEW_RELIC_LICENSE_KEY,
      appName: 'ReMake',
      labels: 'environment:' + process.env.NODE_ENV,
    },

    // DataDog for infrastructure monitoring
    datadog: {
      enabled: true,
      apiKey: process.env.DATADOG_API_KEY,
      appKey: process.env.DATADOG_APP_KEY,
      tags: ['service:remake', 'env:' + process.env.NODE_ENV],
    },
  },

  // Scheduled Reports
  reports: {
    // Daily reports
    daily: {
      enabled: true,
      time: '08:00', // 8 AM EST
      timezone: 'America/New_York',
      recipients: ['reports@remake.com'],
      metrics: [
        'daily_active_users',
        'signups',
        'engagement_rate',
        'error_rate',
        'system_health',
      ],
    },

    // Weekly reports
    weekly: {
      enabled: true,
      day: 'monday',
      time: '09:00',
      timezone: 'America/New_York',
      recipients: ['weekly-reports@remake.com'],
      metrics: [
        'weekly_active_users',
        'conversion_rates',
        'revenue_metrics',
        'user_acquisition',
        'retention_rates',
      ],
    },

    // Monthly reports
    monthly: {
      enabled: true,
      day: 1, // First day of month
      time: '10:00',
      timezone: 'America/New_York',
      recipients: ['monthly-reports@remake.com'],
      metrics: [
        'monthly_active_users',
        'churn_rate',
        'lifetime_value',
        'market_metrics',
        'financial_summary',
      ],
    },
  },

  // Incident Response
  incidentResponse: {
    // Escalation policy
    escalation: [
      {
        delay: 0, // Immediate
        channels: ['slack'],
        message: 'Alert triggered - please acknowledge',
      },
      {
        delay: 15 * 60 * 1000, // 15 minutes
        channels: ['email', 'slack'],
        message: 'Escalation: Alert not acknowledged',
      },
      {
        delay: 60 * 60 * 1000, // 1 hour
        channels: ['pagerduty', 'email', 'slack'],
        message: 'Critical: Immediate attention required',
      },
    ],

    // Runbooks for common incidents
    runbooks: {
      'high-error-rate': {
        title: 'High Error Rate Incident',
        steps: [
          'Check application logs in Firebase Console',
          'Review recent deployments',
          'Check database connectivity',
          'Verify external service status',
          'Scale resources if needed',
          'Contact development team if issue persists',
        ],
      },
      'database-latency': {
        title: 'Database Latency Incident',
        steps: [
          'Check Firestore metrics in GCP Console',
          'Review slow queries',
          'Check database indexes',
          'Consider scaling database',
          'Optimize problematic queries',
        ],
      },
      'function-timeout': {
        title: 'Function Timeout Incident',
        steps: [
          'Check function logs in Firebase Console',
          'Review function execution time',
          'Check for infinite loops or hanging requests',
          'Increase function timeout if needed',
          'Optimize function performance',
        ],
      },
    },
  },
}