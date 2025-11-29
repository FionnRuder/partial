# Finding Your EC2 IP and Setting Up Cloudflare DNS

## Part 1: Finding Your EC2 IP Address

### Method 1: AWS Console (Easiest)

1. **Go to AWS Console:**
   - Navigate to **EC2** → **Instances**
   - Find your EC2 instance in the list

2. **Check the IP addresses:**
   - **Public IPv4 address** - This is what you need for DNS (if you don't have an Elastic IP)
   - **Private IPv4 address** - Internal AWS network only (not for DNS)

3. **If you see "Elastic IP" column:**
   - If you have an Elastic IP assigned, use that instead (recommended)
   - Elastic IPs don't change when you restart the instance

### Method 2: From EC2 Instance (SSH)

If you're already SSH'd into your EC2 instance:

```bash
# Get public IP
curl http://169.254.169.254/latest/meta-data/public-ipv4

# Get private IP (for reference)
curl http://169.254.169.254/latest/meta-data/local-ipv4

# Get instance ID
curl http://169.254.169.254/latest/meta-data/instance-id
```

### Method 3: AWS CLI

```bash
# List all instances with their IPs
aws ec2 describe-instances --query 'Reservations[*].Instances[*].[InstanceId,PublicIpAddress,PrivateIpAddress,State.Name]' --output table

# Get IP for specific instance
aws ec2 describe-instances --instance-ids i-1234567890abcdef0 --query 'Reservations[0].Instances[0].PublicIpAddress' --output text
```

## Important: Elastic IP vs Public IP

### Public IP (Dynamic)
- **Changes** when you stop/start the instance
- **Not recommended** for production DNS
- Free, but unreliable

### Elastic IP (Static) - Recommended
- **Doesn't change** when you restart
- **Recommended** for production
- Free if attached to running instance
- Costs money if not attached to a running instance

### How to Create/Assign Elastic IP

1. **In AWS Console:**
   - Go to **EC2** → **Network & Security** → **Elastic IPs**
   - Click **Allocate Elastic IP address**
   - Click **Allocate**
   - Select the Elastic IP, click **Actions** → **Associate Elastic IP address**
   - Select your instance and click **Associate**

2. **Use this Elastic IP** for your DNS records (it won't change)

## Part 2: Setting Up DNS in Cloudflare

### Step 1: Log into Cloudflare

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Select your domain from the list

### Step 2: Navigate to DNS Settings

1. Click on **DNS** in the left sidebar
2. You'll see your current DNS records

### Step 3: Add A Record for Your API

1. Click **Add record**
2. Fill in the form:
   - **Type:** Select `A`
   - **Name:** Enter your subdomain (e.g., `api` for `api.yourdomain.com`)
   - **IPv4 address:** Paste your EC2's public IP or Elastic IP
   - **Proxy status:** 
     - **DNS only** (gray cloud) - Recommended for API servers
     - **Proxied** (orange cloud) - Routes through Cloudflare CDN (may cause issues with some APIs)
   - **TTL:** Leave as "Auto" or set to desired value
3. Click **Save**

### Step 4: Add A Record for Your Frontend (if needed)

If you're hosting your frontend on the same EC2 or a different one:

1. Click **Add record** again
2. Fill in:
   - **Type:** `A`
   - **Name:** Your subdomain (e.g., `app` for `app.yourdomain.com`, or `@` for root domain)
   - **IPv4 address:** Your EC2 IP (or different IP if frontend is elsewhere)
   - **Proxy status:** 
     - **Proxied** (orange cloud) - Good for frontend (CDN benefits)
     - **DNS only** (gray cloud) - If you need direct connection
   - **TTL:** Auto
3. Click **Save**

## Example Setup

Let's say:
- Your domain: `partialsystems.com`
- Your EC2 Elastic IP: `54.123.45.67`

### Records to Add:

1. **API Subdomain:**
   ```
   Type: A
   Name: api
   Content: 54.123.45.67
   Proxy: DNS only (gray cloud)
   TTL: Auto
   ```
   Result: `api.partialsystems.com` → `54.123.45.67`

2. **Frontend Subdomain:**
   ```
   Type: A
   Name: app
   Content: 54.123.45.67
   Proxy: Proxied (orange cloud)
   TTL: Auto
   ```
   Result: `app.partialsystems.com` → `54.123.45.67` (through Cloudflare CDN)

3. **Root Domain (optional):**
   ```
   Type: A
   Name: @
   Content: 54.123.45.67
   Proxy: Proxied (orange cloud)
   TTL: Auto
   ```
   Result: `partialsystems.com` → `54.123.45.67`

## DNS Propagation

After adding records:

1. **Wait for propagation:** Usually 1-5 minutes with Cloudflare
2. **Test your DNS:**
   ```bash
   # Test from your computer
   nslookup api.yourdomain.com
   dig api.yourdomain.com
   
   # Or use online tools
   # https://dnschecker.org
   ```

3. **Verify it points to your EC2 IP:**
   ```bash
   ping api.yourdomain.com
   # Should show your EC2 IP
   ```

## Cloudflare Proxy Settings Explained

### DNS Only (Gray Cloud) - Recommended for API
- ✅ Direct connection to your server
- ✅ No CDN interference
- ✅ Better for API endpoints
- ✅ Real client IPs visible
- ❌ No DDoS protection from Cloudflare
- ❌ No CDN caching

### Proxied (Orange Cloud) - Good for Frontend
- ✅ DDoS protection
- ✅ CDN caching (faster for static content)
- ✅ SSL/TLS handled by Cloudflare
- ❌ May hide real client IPs (use Cloudflare headers)
- ❌ Can cause issues with WebSockets
- ❌ May interfere with API authentication

**Recommendation:**
- **API:** Use **DNS only** (gray cloud)
- **Frontend:** Use **Proxied** (orange cloud) if you want CDN benefits

## Setting Up SSL/TLS

### Option 1: Cloudflare SSL (Easiest)

If using **Proxied** (orange cloud):
- Cloudflare automatically provides SSL
- Set SSL/TLS mode to **Full** or **Full (strict)** in Cloudflare dashboard
- Go to **SSL/TLS** → **Overview** → Set to **Full**

### Option 2: Let's Encrypt on EC2 (For DNS Only)

If using **DNS only** (gray cloud), set up SSL on your EC2:

```bash
# Install Certbot
sudo yum install certbot python3-certbot-nginx  # Amazon Linux
# OR
sudo apt-get install certbot python3-certbot-nginx  # Ubuntu

# Get certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal (already set up by certbot)
```

## Complete Example Workflow

1. **Get EC2 IP:**
   ```bash
   # In AWS Console: EC2 → Instances → Your Instance
   # Copy "Public IPv4 address" or "Elastic IP"
   # Example: 54.123.45.67
   ```

2. **Create Elastic IP (recommended):**
   - EC2 → Elastic IPs → Allocate → Associate with instance
   - Use this IP instead of public IP

3. **Add DNS in Cloudflare:**
   - DNS → Add record
   - Type: A, Name: `api`, Content: `54.123.45.67`, Proxy: DNS only
   - Save

4. **Wait 1-5 minutes** for DNS propagation

5. **Test:**
   ```bash
   ping api.yourdomain.com
   # Should resolve to 54.123.45.67
   ```

6. **Set up SSL:**
   - If proxied: Cloudflare handles it automatically
   - If DNS only: Use Let's Encrypt on EC2

7. **Update your environment variables:**
   ```env
   FRONTEND_URL=https://app.yourdomain.com
   COGNITO_REDIRECT_URI=https://api.yourdomain.com/auth/callback
   COGNITO_LOGOUT_URI=https://app.yourdomain.com/onboarding
   ```

## Troubleshooting

### DNS Not Resolving

1. **Check Cloudflare DNS settings:**
   - Make sure record is saved
   - Check proxy status (gray vs orange cloud)

2. **Check propagation:**
   - Use [dnschecker.org](https://dnschecker.org)
   - Enter your domain and check globally

3. **Clear DNS cache:**
   ```bash
   # Windows
   ipconfig /flushdns
   
   # Mac/Linux
   sudo dscacheutil -flushcache
   ```

### Can't Connect After DNS Setup

1. **Check EC2 Security Group:**
   - Allow inbound traffic on port 80 (HTTP)
   - Allow inbound traffic on port 443 (HTTPS)
   - Allow inbound traffic on port 8000 (if not using reverse proxy)

2. **Check if server is running:**
   ```bash
   # SSH into EC2
   sudo systemctl status nginx  # If using nginx
   pm2 status  # If using PM2
   ```

3. **Test direct IP connection:**
   ```bash
   curl http://54.123.45.67:8000/health
   # Should work before DNS is set up
   ```

## Next Steps

After DNS is set up:

1. ✅ Update environment variables with your new domains
2. ✅ Set up SSL certificates
3. ✅ Update Cognito App Client with production URLs
4. ✅ Test the authentication flow

See `PRODUCTION_DEPLOYMENT.md` for complete setup instructions.

