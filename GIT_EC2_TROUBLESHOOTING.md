# Git Troubleshooting on EC2

## Error: "Your local changes would be overwritten by merge"

This happens when you have uncommitted local changes that conflict with incoming changes from the remote repository.

## Quick Solutions

### Option 1: Discard Local Changes (Recommended for package-lock.json)

If the local changes are just generated files (like `package-lock.json`), you can safely discard them:

```bash
# See what files have changes
git status

# Discard changes to specific files
git checkout -- server/package-lock.json
git checkout -- server/prisma/migrations/migration_lock.toml

# Now pull again
git pull
```

### Option 2: Stash Changes (Keep for Later)

If you want to keep the changes but apply them later:

```bash
# Stash your local changes
git stash

# Pull the latest changes
git pull

# If you want to reapply your stashed changes later:
git stash pop
```

### Option 3: Commit Your Changes

If the local changes are important:

```bash
# Add the changed files
git add server/package-lock.json server/prisma/migrations/migration_lock.toml

# Commit them
git commit -m "Update package-lock and migration lock"

# Pull (may require merge)
git pull
```

## For Your Specific Case

Since `package-lock.json` and `migration_lock.toml` are typically auto-generated files, **Option 1 is recommended**:

```bash
cd /root/partial
git checkout -- server/package-lock.json
git checkout -- server/prisma/migrations/migration_lock.toml
git pull
```

After pulling, you may need to regenerate these files:

```bash
cd server
npm install  # This will regenerate package-lock.json
npx prisma migrate deploy  # This will update migration_lock.toml if needed
```

## Prevent This in the Future

### Option A: Add to .gitignore (if not already)

These files might already be in `.gitignore`, but if they're not, you can add them:

```bash
# Check if they're ignored
git check-ignore server/package-lock.json

# If not ignored and you want to ignore them (usually you DON'T want to ignore package-lock.json)
# But migration_lock.toml might be okay to ignore in some cases
```

### Option B: Always Pull Before Making Changes

```bash
# Always pull first
git pull

# Then make your changes
# Then commit and push
```

### Option C: Use a Deployment Script

Create a script that handles this automatically:

```bash
#!/bin/bash
# deploy.sh
cd /root/partial
git fetch
git reset --hard origin/main  # WARNING: This discards ALL local changes
git pull
cd server
npm install
npm run build
pm2 restart partial-server
```

## Common Git Commands on EC2

```bash
# Check status
git status

# See what changed
git diff

# Discard all local changes (CAREFUL!)
git reset --hard HEAD

# Discard changes to specific file
git checkout -- <filename>

# Pull latest changes
git pull

# If pull fails due to conflicts, see conflicts
git status
# Then resolve conflicts and:
git add <resolved-files>
git commit
```

