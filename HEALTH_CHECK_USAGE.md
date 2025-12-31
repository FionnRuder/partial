# Health Check Endpoints Usage Guide

Your server now has three health check endpoints available for monitoring and orchestration.

## Available Endpoints

1. **`GET /health`** - Full health check (database + Cognito)
2. **`GET /health/live`** - Liveness probe (server running)
3. **`GET /health/ready`** - Readiness probe (can accept traffic)

## Quick Start

### 1. Manual Testing (Browser or curl)

#### Test Full Health Check
```bash
# Using curl
curl http://localhost:8000/health

# Or in browser
http://localhost:8000/health
```

**Example Response (Healthy):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "checks": {
    "database": {
      "status": "up",
      "responseTime": 5
    },
    "cognito": {
      "status": "up"
    }
  }
}
```

**Example Response (Unhealthy):**
```json
{
  "status": "unhealthy",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "checks": {
    "database": {
      "status": "down",
      "error": "Database connection failed"
    },
    "cognito": {
      "status": "down",
      "error": "Cognito client not initialized"
    }
  }
}
```

#### Test Liveness Probe
```bash
curl http://localhost:8000/health/live
```

**Response:**
```json
{
  "status": "alive",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

#### Test Readiness Probe
```bash
curl http://localhost:8000/health/ready
```

**Response (Ready):**
```json
{
  "status": "ready",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

**Response (Not Ready):**
```json
{
  "status": "not_ready",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "reason": "Database is not available"
}
```

### 2. HTTP Status Codes

- **200 OK**: Service is healthy/ready/alive
- **503 Service Unavailable**: Service is unhealthy/not ready

## Usage in Different Scenarios

### A. Kubernetes Probes

Add to your `deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: partial-server
spec:
  template:
    spec:
      containers:
      - name: server
        image: your-image:tag
        ports:
        - containerPort: 8000
        # Liveness probe - restart container if fails
        livenessProbe:
          httpGet:
            path: /health/live
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        # Readiness probe - remove from load balancer if fails
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        # Optional: Startup probe for slow-starting containers
        startupProbe:
          httpGet:
            path: /health/live
            port: 8000
          initialDelaySeconds: 0
          periodSeconds: 10
          timeoutSeconds: 3
          failureThreshold: 30
```

### B. Docker Compose Health Checks

Add to your `docker-compose.yml`:

```yaml
services:
  server:
    image: your-image:tag
    ports:
      - "8000:8000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health/live"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

Or using wget:
```yaml
healthcheck:
  test: ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:8000/health/live || exit 1"]
  interval: 30s
  timeout: 10s
  retries: 3
```

### C. Load Balancer Health Checks

#### AWS Application Load Balancer (ALB)

```json
{
  "HealthCheckPath": "/health/ready",
  "HealthCheckProtocol": "HTTP",
  "HealthCheckPort": "8000",
  "HealthCheckIntervalSeconds": 30,
  "HealthCheckTimeoutSeconds": 5,
  "HealthyThresholdCount": 2,
  "UnhealthyThresholdCount": 3
}
```

#### Nginx Upstream Health Check

```nginx
upstream backend {
    server server1:8000 max_fails=3 fail_timeout=30s;
    server server2:8000 max_fails=3 fail_timeout=30s;
}

server {
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}

# Health check endpoint (optional)
location /nginx-health {
    access_log off;
    proxy_pass http://backend/health/ready;
}
```

### D. Monitoring Services

#### Prometheus + Blackbox Exporter

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'health-checks'
    metrics_path: /probe
    params:
      module: [http_2xx]
    static_configs:
      - targets:
        - http://localhost:8000/health
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: blackbox-exporter:9115
```

#### Datadog

Add to your Datadog agent configuration:

```yaml
instances:
  - name: Partial Server Health
    url: http://localhost:8000/health
    collect_response_time: true
    tags:
      - env:production
      - service:api
```

#### New Relic

Use HTTP monitors targeting:
- `/health` for full health status
- `/health/ready` for availability checks

### E. Programmatic Checks

#### Node.js/TypeScript

```typescript
async function checkHealth() {
  try {
    const response = await fetch('http://localhost:8000/health');
    const data = await response.json();
    
    if (response.status === 200 && data.status === 'healthy') {
      console.log('Service is healthy');
      console.log('Database response time:', data.checks.database.responseTime, 'ms');
      return true;
    } else {
      console.warn('Service is degraded or unhealthy:', data.status);
      return false;
    }
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}

// Run every 30 seconds
setInterval(checkHealth, 30000);
```

#### Python

```python
import requests
import time

def check_health():
    try:
        response = requests.get('http://localhost:8000/health', timeout=5)
        data = response.json()
        
        if response.status_code == 200 and data['status'] == 'healthy':
            print(f"Service is healthy")
            print(f"Database response time: {data['checks']['database'].get('responseTime', 'N/A')} ms")
            return True
        else:
            print(f"Service is {data['status']}")
            return False
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

# Run every 30 seconds
while True:
    check_health()
    time.sleep(30)
```

#### Shell Script

```bash
#!/bin/bash

HEALTH_URL="http://localhost:8000/health"
MAX_RETRIES=3
RETRY_DELAY=5

check_health() {
    local response=$(curl -s -w "\n%{http_code}" "$HEALTH_URL")
    local body=$(echo "$response" | head -n -1)
    local status_code=$(echo "$response" | tail -n 1)
    
    if [ "$status_code" -eq 200 ]; then
        local health_status=$(echo "$body" | jq -r '.status')
        if [ "$health_status" = "healthy" ]; then
            echo "✓ Service is healthy"
            return 0
        else
            echo "⚠ Service is $health_status"
            return 1
        fi
    else
        echo "✗ Health check failed with status code: $status_code"
        return 1
    fi
}

# Retry logic
for i in $(seq 1 $MAX_RETRIES); do
    if check_health; then
        exit 0
    fi
    if [ $i -lt $MAX_RETRIES ]; then
        echo "Retrying in $RETRY_DELAY seconds..."
        sleep $RETRY_DELAY
    fi
done

echo "Health check failed after $MAX_RETRIES attempts"
exit 1
```

### F. CI/CD Pipeline Checks

#### GitHub Actions

```yaml
name: Health Check
on:
  workflow_dispatch:

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - name: Check server health
        run: |
          response=$(curl -s -o /dev/null -w "%{http_code}" http://your-server:8000/health)
          if [ "$response" -eq 200 ]; then
            echo "✓ Server is healthy"
            exit 0
          else
            echo "✗ Server health check failed (status: $response)"
            exit 1
          fi
```

#### GitLab CI

```yaml
health_check:
  script:
    - |
      if curl -f http://your-server:8000/health; then
        echo "Server is healthy"
      else
        echo "Health check failed"
        exit 1
      fi
```

## Best Practices

1. **Use `/health/live` for liveness probes** - Simple check that server is running
2. **Use `/health/ready` for readiness probes** - Checks if service can accept traffic
3. **Use `/health` for comprehensive monitoring** - Full status with all service dependencies
4. **Set appropriate timeouts** - Health checks should be fast (typically 1-5 seconds)
5. **Monitor response times** - Track database response time trends
6. **Set up alerts** - Alert when status is `degraded` or `unhealthy` for extended periods
7. **Log health check failures** - Track patterns in service degradation

## Environment-Specific URLs

- **Local Development**: `http://localhost:8000/health`
- **Staging**: `https://staging.yourdomain.com/health`
- **Production**: `https://api.yourdomain.com/health`

Make sure to replace the port (8000) with your actual server port if different!




