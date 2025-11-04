# Quick Start Guide

## 🚀 Publishing to NPM

### Option 1: Manual Publishing

```bash
# 1. Build the project
npm run build

# 2. Bump version
npm version patch   # 1.0.0 → 1.0.1
# or
npm version minor   # 1.0.0 → 1.1.0
# or
npm version major   # 1.0.0 → 2.0.0

# 3. Publish to NPM
npm publish
```

### Option 2: Automated (Recommended)

```bash
# 1. Commit your changes
git add .
git commit -m "feat: add new feature"
git push

# 2. Create a tag
git tag v1.0.1
git push origin v1.0.1

# 3. GitHub Actions will automatically:
#    - Build the project
#    - Publish to NPM
```

**One-time setup**: Add `NPM_TOKEN` to GitHub secrets (see CONTRIBUTING.md)

---

## 🛠️ Development Commands

```bash
npm install          # Install dependencies
npm run build        # Compile TypeScript → dist/
npm run clean        # Delete dist/ folder
npm run rebuild      # Clean + build
```

---

## 📦 What Gets Published

**Included in NPM package:**
- ✅ `dist/` - Compiled JavaScript + type definitions
- ✅ `README.md`
- ✅ `LICENSE`
- ✅ `package.json`

**Excluded from NPM:**
- ❌ `src/` - TypeScript source (not needed by users)
- ❌ `examples/` - Only for development
- ❌ `node_modules/`
- ❌ `.github/` - CI/CD workflows

---

## 🔒 What Gets Committed to Git

**Included in Git:**
- ✅ `src/` - Source code
- ✅ `examples/` - Usage examples
- ✅ `.github/` - GitHub Actions workflows
- ✅ Config files (tsconfig.json, package.json, etc.)

**Excluded from Git:**
- ❌ `dist/` - Build artifacts (generated)
- ❌ `node_modules/` - Dependencies (installed)
- ❌ `.env` files - Secrets

---

## 📋 Checklist Before Publishing

- [ ] Code compiles: `npm run build`
- [ ] Version bumped: `npm version patch/minor/major`
- [ ] README updated with new features
- [ ] Examples work correctly
- [ ] CHANGELOG updated (if you have one)

---

## 🎯 First-Time NPM Setup

```bash
# 1. Create NPM account (if needed)
https://www.npmjs.com/signup

# 2. Login to NPM
npm login

# 3. Check you're logged in
npm whoami

# 4. Publish!
npm publish
```

---

## 🤖 GitHub Actions Workflows

### CI Workflow (`.github/workflows/ci.yml`)
- **Triggers**: Push or PR to main/master/develop
- **Actions**: 
  - Builds on Node 16, 18, 20
  - Verifies dist/ is created
  - Checks for build errors

### Publish Workflow (`.github/workflows/publish.yml`)
- **Triggers**: GitHub release created
- **Actions**:
  - Builds the project
  - Publishes to NPM automatically

---

## 📚 More Info

- Full details: [CONTRIBUTING.md](./CONTRIBUTING.md)
- API docs: [README.md](./README.md)

