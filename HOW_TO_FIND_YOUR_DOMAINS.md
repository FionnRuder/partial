# How to Find Your Production Domains

## Understanding the Two Domains

You need to determine **two separate domains**:

1. **Frontend Domain** (`your-frontend-domain.com`) - Where your Next.js app is hosted
2. **API Domain** (`your-api-domain.com`) - Where your Express server is hosted

These can be:
- The same domain (e.g., `app.example.com` for frontend, `api.example.com` for backend)
- Different domains (e.g., `myapp.com` for frontend, `backend.myapp.com` for API)
- Subdomains of the same domain

## Scenario 1: You Haven't Deployed Yet

If you haven't deployed to production yet, you need to **decide where to host** first:

### Option A: Same Domain, Different Subdomains (Recommended)
- Frontend: `https://app.yourdomain.com` or `https://www.yourdomain.com`
- API: `https://api.yourdomain.com`

### Option B: Different Domains
- Frontend: `https://yourdomain.com`
- API: `https://api-different-domain.com`

### Option C: Same Domain, Different Paths (Less Common)
- Frontend: `https://yourdomain.com`
- API: `https://yourdomain.com/api` (requires reverse proxy configuration)

## Scenario 2: You're Deploying to EC2

### If Using EC2 with a Custom Domain:

1. **Point your domain to EC2:**
   - Get your EC2 instance's public IP or Elastic IP
   - In your domain registrar (GoDaddy, Namecheap, etc.), create DNS records:
     - `A` record: `api.yourdomain.com` → Your EC2 IP
     - `A` record: `app.yourdomain.com` → Your EC2 IP (or use CloudFront/CDN)

2. **Set up SSL certificates:**
   - Use Let's Encrypt (free) with Certbot
   - Or use AWS Certificate Manager if using CloudFront

3. **Your domains would be:**
   - Frontend: `https://app.yourdomain.com`
   - API: `https://api.yourdomain.com`

### If Using EC2 without a Custom Domain (Temporary):

You can use the EC2 public IP, but this is **not recommended** for production:
- Frontend: `https://<your-ec2-ip>` (requires SSL setup)
- API: `https://<your-ec2-ip>` (same IP, different ports/paths)

**Better:** Get a domain name (even a cheap one like `yourname.xyz` for ~$1/year)

## Scenario 3: You're Using a Hosting Platform

### Vercel (for Next.js Frontend):
- Your frontend domain will be: `https://your-app.vercel.app`
- Or custom domain: `https://yourdomain.com` (if configured)

### Railway:
- Your app gets a domain like: `https://your-app.up.railway.app`
- Or custom domain: `https://yourdomain.com` (if configured)

### Heroku:
- Your app gets a domain like: `https://your-app.herokuapp.com`
- Or custom domain: `https://yourdomain.com` (if configured)

### AWS Elastic Beanstalk:
- Your app gets a domain like: `https://your-env.elasticbeanstalk.com`
- Or custom domain: `https://yourdomain.com` (if configured)

### AWS ECS/Fargate with ALB:
- Your ALB gets a DNS name like: `your-alb-123456789.us-east-1.elb.amazonaws.com`
- Or custom domain: `https://yourdomain.com` (if configured)

## Scenario 4: You've Already Deployed

If you've already deployed, your domains are:

### Check Your Deployment Platform:

1. **Check your hosting provider's dashboard:**
   - Look for "Domains", "URLs", or "Deployment URL"
   - This shows where your app is accessible

2. **Check your DNS records:**
   - If you set up custom domains, check your domain registrar
   - Look for `A` records or `CNAME` records pointing to your hosting

3. **Check your server configuration:**
   - If using nginx/Apache, check the server blocks
   - Look for `server_name` directives

4. **Test your URLs:**
   - Try accessing your frontend in a browser
   - Try accessing your API: `https://your-api-domain.com/health` (should return health check)

## Common Examples

### Example 1: EC2 with Custom Domain
```
Frontend: https://app.partialsystems.com
API: https://api.partialsystems.com
```

### Example 2: Vercel Frontend + EC2 Backend
```
Frontend: https://partial-app.vercel.app (or custom domain)
API: https://api.partialsystems.com
```

### Example 3: Same Domain, Different Subdomains
```
Frontend: https://www.partialsystems.com
API: https://api.partialsystems.com
```

## How to Determine Your Specific Domains

### Step 1: Identify Your Frontend Domain

**Ask yourself:**
- Where is my Next.js app deployed? (Vercel, Netlify, EC2, etc.)
- What URL do I use to access it in a browser?
- Do I have a custom domain configured?

**That's your frontend domain!**

### Step 2: Identify Your API Domain

**Ask yourself:**
- Where is my Express server running? (EC2, Railway, Heroku, etc.)
- What URL would I use to make API calls to it?
- Do I have a custom domain configured?

**That's your API domain!**

### Step 3: Verify They Work

Test your domains:

```bash
# Test frontend
curl https://your-frontend-domain.com

# Test API
curl https://your-api-domain.com/health
```

Both should return responses (not 404 or connection errors).

## Quick Decision Guide

**If you don't have domains yet:**

1. **Buy a domain** (Namecheap, Google Domains, Route 53, etc.)
   - Cost: ~$10-15/year for `.com`
   - Or ~$1/year for `.xyz` or other TLDs

2. **Set up subdomains:**
   - `app.yourdomain.com` for frontend
   - `api.yourdomain.com` for backend

3. **Point DNS to your hosting:**
   - Create `A` or `CNAME` records pointing to your servers

4. **Set up SSL:**
   - Use Let's Encrypt (free) or your hosting provider's SSL

## Example: Setting Up from Scratch

Let's say you want to use `partialsystems.com`:

1. **Buy the domain** `partialsystems.com`

2. **Deploy your apps:**
   - Frontend to Vercel: `app.partialsystems.com`
   - Backend to EC2: `api.partialsystems.com`

3. **Configure DNS:**
   - `A` record: `api.partialsystems.com` → Your EC2 IP
   - `CNAME` record: `app.partialsystems.com` → Your Vercel deployment

4. **Set up SSL:**
   - Vercel handles SSL automatically
   - Use Let's Encrypt on EC2 for SSL

5. **Your URLs would be:**
   - Frontend: `https://app.partialsystems.com`
   - API: `https://api.partialsystems.com`
   - Callback: `https://api.partialsystems.com/auth/callback`
   - Logout: `https://app.partialsystems.com/onboarding`

## Still Not Sure?

**Answer these questions:**

1. **Where is your frontend deployed?**
   - [ ] Not deployed yet → You need to deploy first
   - [ ] Vercel → Check Vercel dashboard for your URL
   - [ ] EC2 → Check your domain DNS or EC2 public IP
   - [ ] Other → Check your hosting provider's dashboard

2. **Where is your backend deployed?**
   - [ ] Not deployed yet → You need to deploy first
   - [ ] EC2 → Check your domain DNS or EC2 public IP
   - [ ] Railway/Heroku → Check platform dashboard
   - [ ] Other → Check your hosting provider's dashboard

3. **Do you have a custom domain?**
   - [ ] Yes → Use that domain (with subdomains if needed)
   - [ ] No → Use the default domain from your hosting provider, or buy one

## Next Steps

Once you know your domains:

1. Update your environment variables (see `PRODUCTION_ENV_SETUP.md`)
2. Update Cognito App Client with your production URLs
3. Deploy your applications
4. Test the authentication flow

## Need Help?

If you're still unsure:
1. Check your hosting provider's documentation
2. Look at your deployment dashboard/console
3. Check your DNS records in your domain registrar
4. Test URLs in your browser or with `curl`

