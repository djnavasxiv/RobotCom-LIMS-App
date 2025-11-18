# CI/CD Pipeline Documentation

## Overview

The RobotCom LIMS application uses GitHub Actions for continuous integration and continuous deployment (CI/CD). The pipeline automates testing, building, packaging, security scanning, and deployment.

## Pipeline Architecture

### Workflow Stages

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Test & Quality (Runs on every push and PR)              │
│   - Lint code (ESLint)                                      │
│   - Type check (TypeScript)                                 │
│   - Run unit tests (Jest)                                   │
│   - Generate coverage reports                               │
│   - Security audit (npm audit)                              │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│ 2. Build Application (Runs on Linux, Windows, macOS)        │
│   - Install dependencies                                     │
│   - Build distribution (electron-vite)                       │
│   - Verify build artifacts                                  │
│   - Upload build artifacts                                  │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│ 3. Package Application (Only on main branch pushes)         │
│   - Build and package for each platform                     │
│   - Generate installers (.exe, .AppImage, .dmg)             │
│   - Upload release artifacts                                │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│ 4. Security Scanning (Runs in parallel)                     │
│   - Trivy vulnerability scanner                             │
│   - OWASP Dependency-Check                                  │
│   - SonarQube code analysis                                 │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────┐
│ 5. Notifications (If success or failure)                    │
│   - Slack notification                                      │
│   - GitHub issue creation (on failure)                      │
└──────────────────────────────────────────────────────────────┘
```

## Workflow Details

### 1. Test & Quality Stage

**Trigger**: Every push and pull request

**Node Versions Tested**: 18.x, 20.x

**Steps**:

```yaml
- Lint code with ESLint
- Type check with TypeScript
- Run Jest unit tests
- Generate coverage reports
- Upload to Codecov
- Run npm audit for security
```

**Success Criteria**:
- All tests pass
- Code coverage ≥ 60%
- No high-severity vulnerabilities
- TypeScript strict mode passes

### 2. Build Application

**Trigger**: After Test & Quality stage passes

**Platforms**: Ubuntu Linux, Windows, macOS

**Steps**:

```bash
pnpm install
npm run build
```

**Build Output**:
- `out/main/index.js` - Electron main process
- `out/preload/index.js` - Preload script
- `out/renderer/assets/` - React application
- `out/renderer/index.html` - Entry HTML

**Artifacts**:
- Stored for 7 days
- Available as download in Actions tab

### 3. Package Application

**Trigger**: Only on pushes to main branch

**Output Formats**:
- **Windows**: `robotcom-lims-1.0.0.exe` (NSIS installer)
- **Linux**: `robotcom-lims-1.0.0.AppImage` (Universal Linux)
- **macOS**: `robotcom-lims-1.0.0.dmg` (Disk Image)

**Artifacts**:
- Stored for 30 days in release/ directory
- Can be downloaded for manual distribution

### 4. Security Scanning

**Trigger**: Parallel with build

**Scans**:

#### Trivy
- Scans filesystem for vulnerabilities
- Checks dependencies
- Generates SARIF reports
- Integrates with GitHub Security tab

#### OWASP Dependency-Check
- Identifies known vulnerabilities
- Checks against CVE database
- Generates detailed reports

#### SonarQube
- Code quality analysis
- Technical debt assessment
- Security hotspots
- Requires SONAR credentials

### 5. Notifications

**Success Path**:
- Slack notification with status
- Build artifacts available

**Failure Path**:
- Slack notification with error
- Automatic GitHub issue created
- Contains build run URL and details

## Configuration

### GitHub Secrets Required

Set these in repository Settings → Secrets and variables:

```
SLACK_WEBHOOK      # Slack webhook URL for notifications
SONAR_HOST_URL     # SonarQube instance URL
SONAR_TOKEN        # SonarQube authentication token
```

### Environment Variables

```
NODE_ENV=production  # Set during build
```

## Monitoring Pipeline

### View Results

1. **GitHub Actions Dashboard**
   - https://github.com/yourusername/RobotCom-LIMS-App/actions
   - Real-time logs for each step
   - Download artifacts

2. **Codecov Coverage**
   - Coverage badge in README
   - Detailed coverage reports
   - Historical trends

3. **SonarQube Dashboard**
   - Code quality metrics
   - Security analysis
   - Technical debt assessment

## Troubleshooting

### Build Failures

**Issue**: Build fails with "Module not found"

**Solution**:
```bash
pnpm install --force
npm run build
```

**Issue**: Tests fail in CI but pass locally

**Solution**:
- Check Node version mismatch
- Check environment variables
- Review CI logs for specific errors
- Run `npm run test:ci` locally

### Package Creation Failures

**Issue**: Electron builder fails on Windows

**Solution**:
```bash
npm run package:win
```

Check for:
- Missing dependencies
- Icon file availability
- Code signing certificates

### Security Scan Failures

**Issue**: High-severity vulnerabilities detected

**Solution**:
1. Review vulnerability details in GitHub Security tab
2. Update affected dependency: `npm update package-name`
3. If no fix available, add vulnerability exception
4. Re-run security scan

## Optimization Tips

### Speed Up CI

1. **Cache Dependencies**
   ```yaml
   - uses: actions/setup-node@v4
     with:
       cache: 'npm'
   ```

2. **Parallel Jobs**
   ```yaml
   strategy:
     matrix:
       node-version: [18.x, 20.x]
   ```

3. **Skip Unnecessary Steps**
   ```yaml
   if: github.event_name == 'push'
   ```

### Reduce Build Size

1. **Tree-shake unused code**
   ```typescript
   import { specificFunction } from 'module';
   ```

2. **Lazy load components**
   ```typescript
   const Component = React.lazy(() => import('./Component'));
   ```

3. **Optimize dependencies**
   ```bash
   npm audit fix
   npm prune --production
   ```

## Best Practices

### ✅ Do

- Commit frequently with clear messages
- Use meaningful branch names: `feature/`, `fix/`, `docs/`
- Write tests for new features
- Keep build times under 10 minutes
- Monitor security scan results
- Review coverage reports
- Update dependencies regularly

### ❌ Don't

- Commit directly to main branch
- Ignore CI failures
- Increase coverage minimums without reason
- Ignore security vulnerabilities
- Skip testing for "small" changes
- Leave long-running workflows unmonitored

## Common Workflows

### Feature Development

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes, test locally
npm run dev
npm run test

# 3. Commit and push
git commit -am "feat: add new feature"
git push origin feature/my-feature

# 4. Create Pull Request
# GitHub Actions automatically tests the PR

# 5. After review and approval, merge
# CI/CD runs full pipeline on main
```

### Hotfix Deployment

```bash
# 1. Create hotfix branch from main
git checkout -b hotfix/critical-bug

# 2. Fix issue and test
npm run dev
npm run test

# 3. Commit to main
git commit -am "fix: critical bug"
git push origin main

# 4. CI/CD automatically:
#    - Tests
#    - Builds
#    - Packages
#    - Deploys
```

### Release Process

```bash
# 1. Update version
npm version patch|minor|major

# 2. Commit version bump
git commit -am "chore: release v1.0.0"

# 3. Create tag
git tag -a v1.0.0 -m "Release v1.0.0"

# 4. Push with tags
git push origin main --follow-tags

# 5. GitHub Actions:
#    - Creates release
#    - Uploads binaries
#    - Updates documentation
```

## Performance Metrics

### Current Benchmarks (Ubuntu)

| Stage | Duration | Status |
|-------|----------|--------|
| Test & Quality | ~3 min | ✅ |
| Build (Linux) | ~2 min | ✅ |
| Build (Windows) | ~2 min | ✅ |
| Build (macOS) | ~3 min | ✅ |
| Security Scan | ~2 min | ✅ |
| Package | ~5 min | ✅ |
| **Total** | **~15 min** | ✅ |

### Cache Hit Ratio

- Dependencies: ~95% (weekly updates)
- Build artifacts: ~100% (per PR)

## Integration with Other Tools

### GitHub Integrations

- **Protected branches**: Require CI to pass
- **Auto-merge**: Merge when CI passes
- **Deployment protection**: Manual approval required

### External Integrations

- **Slack**: Real-time notifications
- **Codecov**: Coverage tracking
- **SonarQube**: Code quality analysis
- **Discord**: Optional notifications via webhooks

## Maintenance

### Weekly Tasks

- Review security scan results
- Update dependencies
- Monitor build times
- Check coverage trends

### Monthly Tasks

- Audit CI/CD configuration
- Review and update GitHub Actions versions
- Performance optimization
- Documentation updates

### Yearly Tasks

- Major version updates
- Security policy review
- Infrastructure upgrades
- Disaster recovery testing

## Support & Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Codecov Documentation](https://docs.codecov.io)
- [SonarQube Documentation](https://docs.sonarqube.org)
- [Trivy Documentation](https://aquasecurity.github.io/trivy)
- [OWASP Dependency-Check](https://owasp.org/www-project-dependency-check)

## Contact

For CI/CD issues or questions:
1. Check GitHub Actions logs
2. Review this documentation
3. Create an issue with workflow details
4. Contact DevOps team
