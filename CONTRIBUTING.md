# Contributing to AnonDocs SDK

## Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/anondocs-sdk.git
cd anondocs-sdk
```

2. **Install dependencies**
```bash
npm install
```

3. **Build the project**
```bash
npm run build
```

## Project Structure

```
anondocs-sdk/
├── src/               # TypeScript source files
│   ├── client.ts      # Main client class
│   ├── types.ts       # Type definitions
│   ├── errors.ts      # Error classes
│   └── index.ts       # Public exports
├── dist/              # Compiled JavaScript (generated)
├── examples/          # Usage examples
└── .github/           # GitHub Actions workflows
```

## Building

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory with:
- `.js` files (CommonJS)
- `.d.ts` files (TypeScript declarations)
- Source maps

## Manual Publishing

### 1. Update version

```bash
npm version patch  # or minor, or major
```

### 2. Build

```bash
npm run build
```

### 3. Publish to NPM

```bash
npm publish
```

## Automated Publishing (GitHub Actions)

### Setup

1. Create an NPM access token:
   - Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
   - Click "Generate New Token" → "Classic Token"
   - Select "Automation" type
   - Copy the token

2. Add token to GitHub:
   - Go to your repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: paste your NPM token

### Publish Workflow

1. **Create a release on GitHub**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
   
   Or use GitHub UI: Releases → Create new release

2. **The workflow automatically**:
   - Builds the project
   - Runs checks
   - Publishes to NPM

## CI/CD

### Continuous Integration

On every push/PR to main/master/develop:
- Tests build on Node.js 16, 18, and 20
- Verifies dist/ is generated correctly

### Continuous Deployment

On GitHub release creation:
- Builds the project
- Publishes to NPM automatically

## Code Style

- Use TypeScript strict mode
- Follow existing code patterns
- Add JSDoc comments for public APIs
- Export all public types

## Making Changes

1. Create a feature branch
2. Make your changes
3. Build and test locally
4. Push and create a PR
5. CI will run automatically
6. After merge, create a release to publish

## Questions?

Open an issue on GitHub!

