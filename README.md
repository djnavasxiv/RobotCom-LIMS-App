# RobotCom LIMS - Laboratory Information Management System

[![Build Status](https://github.com/yourusername/RobotCom-LIMS-App/workflows/CI%2FCD/badge.svg)](https://github.com/yourusername/RobotCom-LIMS-App/actions)
[![Code Coverage](https://codecov.io/gh/yourusername/RobotCom-LIMS-App/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/RobotCom-LIMS-App)
[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](#license)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](#version)

Modern, full-featured Laboratory Information Management System (LIMS) desktop application built with Electron, React, TypeScript, and Prisma ORM. Streamline laboratory operations with patient management, sample tracking, test ordering, result entry, billing, and comprehensive reporting.

## 🎯 Features

### Core Functionality
- **Patient Management**: Complete patient record management with history tracking
- **Sample Tracking**: Track samples from collection to analysis
- **Test Ordering**: Order tests from comprehensive catalog with pricing
- **Result Entry**: Secure result entry with validation and normalization
- **Billing System**: Invoice generation, payment tracking, and financial reports
- **Report Generation**: Comprehensive patient reports with charts and visualizations
- **User Management**: Role-based access control with audit logging

### Advanced Features
- **Data Visualization**: Charts and graphs for result trends and statistics
- **Advanced Filtering**: Filter and search across all modules with export to CSV/PDF
- **Security**: CSRF protection, input validation, SQL injection prevention
- **Performance Monitoring**: Real-time performance metrics and optimization
- **Error Handling**: Comprehensive error boundaries and user-friendly messages
- **Multi-language**: Full Spanish localization support
- **Dark Mode**: Optional dark theme for reduced eye strain

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- pnpm 8.0.0 or higher (recommended)

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/RobotCom-LIMS-App.git
cd RobotCom-LIMS-App

# Install dependencies
npm install -g pnpm
pnpm install

# Setup database
cd packages/robotcom-lims
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# Start development server
npm run dev
```

### Build for Production

```bash
# Build application
npm run build

# Package for distribution
npm run package        # All platforms
npm run package:win    # Windows
npm run package:mac    # macOS
npm run package:linux  # Linux
```

## 📁 Project Structure

```
RobotCom-LIMS-App/
├── packages/
│   ├── robotcom-lims/          # Main Electron application
│   │   ├── src/
│   │   │   ├── main/           # Electron main process
│   │   │   ├── preload/        # Preload scripts
│   │   │   └── renderer/       # React application
│   │   │       ├── src/
│   │   │       │   ├── application/    # Services, state, hooks
│   │   │       │   ├── data/          # Repositories, models
│   │   │       │   ├── domain/        # Business entities
│   │   │       │   ├── infrastructure/ # External integrations
│   │   │       │   └── presentation/  # Components and pages
│   │   │       └── __tests__/        # Test utilities and specs
│   │   ├── prisma/             # Database schema and migrations
│   │   └── electron.vite.config.ts
│   └── website/                # Marketing website
├── .github/
│   ├── workflows/              # CI/CD pipelines
│   └── dependabot.yml         # Dependency updates
├── API.md                      # API documentation
├── DEPLOYMENT.md              # Deployment guide
├── TESTING.md                 # Testing guide
├── CI-CD.md                   # CI/CD documentation
└── README.md                  # This file
```

## 🏗️ Architecture

### Technology Stack

**Frontend**:
- React 18.2.0 - UI framework
- TypeScript - Type-safe development
- Material-UI - Component library
- Zustand - State management
- Recharts - Data visualization
- React Hook Form - Form management

**Backend**:
- Electron 28.0+ - Desktop framework
- Node.js 18+ - Runtime
- Prisma ORM - Database management
- SQLite - Database engine

**Development**:
- Vite 5.4 - Build tool
- Jest - Unit testing
- TypeScript - Type checking
- ESLint - Code quality
- Prettier - Code formatting

### System Architecture

```
┌─────────────────────────────────────────┐
│           Electron Main Process          │
│  - Window management                    │
│  - IPC communication                    │
│  - File system access                   │
└──────────────────┬──────────────────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
    ┌─────────────┐    ┌──────────────┐
    │   Preload   │    │   Database   │
    │   Scripts   │    │   (SQLite)   │
    └─────────────┘    └──────────────┘
         │                   ▲
         │                   │
    ┌────┴────────────┬──────┴────────┐
    ▼                 ▼               ▼
┌──────────────┐ ┌─────────┐ ┌────────────┐
│   Services   │ │Repository│ │ Migrations │
│ (Business    │ │ (Data    │ │ (Schema    │
│  Logic)      │ │ Access)  │ │ Versioning)│
└──────────────┘ └─────────┘ └────────────┘
         ▲
         │
    ┌────┴──────────────┐
    │   React Frontend   │
    │  Components &      │
    │  Pages             │
    └───────────────────┘
```

## 🔐 Security Features

- **Input Validation**: Email, phone, date, and name validation
- **CSRF Protection**: Token-based CSRF protection
- **XSS Prevention**: Automatic HTML escaping and sanitization
- **SQL Injection Prevention**: Parameterized queries via Prisma
- **Rate Limiting**: Login attempt rate limiting
- **Secure Storage**: Encrypted credential storage
- **Audit Logging**: Complete audit trail of user actions
- **Role-Based Access Control**: Granular permission management

## 📊 Performance Metrics

- **Build Time**: ~3.0 seconds
- **Bundle Size**: ~1.4 MB JavaScript
- **Modules**: 797 optimized modules
- **Coverage**: 60%+ test coverage
- **Load Time**: <2 seconds startup

## 🧪 Testing

Comprehensive testing infrastructure with:
- **Unit Tests**: Service and utility tests with Jest
- **Component Tests**: React component testing
- **Integration Tests**: Multi-component workflows
- **E2E Tests**: Full user journey testing
- **Security Tests**: Input validation and XSS/SQL injection testing

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch

# E2E tests
npm run test:e2e
```

See [TESTING.md](./TESTING.md) for detailed testing guide.

## 📚 Documentation

- [API Documentation](./API.md) - REST API endpoints and usage
- [Deployment Guide](./DEPLOYMENT.md) - Installation and configuration
- [Testing Guide](./TESTING.md) - Testing infrastructure and best practices
- [CI/CD Documentation](./CI-CD.md) - GitHub Actions workflows

## 🚢 Deployment

### Supported Platforms

- **Windows**: 10+ (exe installer via NSIS)
- **macOS**: 10.15+ (dmg installer)
- **Linux**: Ubuntu 20.04+ (AppImage)

### Quick Deployment

```bash
# Development
npm run dev

# Production build
npm run build

# Package for all platforms
npm run package

# Deploy to production
npm run deploy
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🔄 CI/CD Pipeline

Automated testing, building, and deployment via GitHub Actions:

- ✅ Unit tests (multiple Node versions)
- ✅ Code quality analysis (ESLint, TypeScript)
- ✅ Security scanning (Trivy, OWASP)
- ✅ Cross-platform builds (Windows, macOS, Linux)
- ✅ Automated packaging
- ✅ Artifact management
- ✅ Notifications (Slack)

See [CI-CD.md](./CI-CD.md) for workflow details.

## 📈 Development Roadmap

### Completed (Phase 1-8)
- ✅ User authentication and authorization
- ✅ Patient and sample management
- ✅ Test ordering and result entry
- ✅ Billing and invoicing system
- ✅ Report generation and viewing
- ✅ Data visualization and charts
- ✅ Advanced filtering and export
- ✅ Error handling and logging

### In Progress (Phase 9)
- ⏳ Performance optimization
- ⏳ Security hardening
- ⏳ Testing framework setup
- ⏳ CI/CD pipeline
- ⏳ API documentation
- ⏳ Deployment automation
- ⏳ Monitoring and analytics

### Planned (Phase 10+)
- 🗺️ HIPAA compliance certification
- 🗺️ Multi-lab support
- 🗺️ Integration with lab equipment
- 🗺️ Mobile app (iOS/Android)
- 🗺️ Telemedicine features
- 🗺️ Advanced analytics and AI

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## 📝 License

This project is proprietary software. All rights reserved. Unauthorized copying or modification is prohibited.

## 💼 Support

For support, please contact:
- **Email**: support@robotcom.com
- **Documentation**: https://docs.robotcom.com
- **Issues**: https://github.com/yourusername/RobotCom-LIMS-App/issues
- **Status Page**: https://status.robotcom.com

## 🙏 Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- UI powered by [Material-UI](https://mui.com/)
- Database managed by [Prisma](https://www.prisma.io/)
- Visualizations with [Recharts](https://recharts.org/)
- Spanish localization community

## 📞 Contact

**RobotCom Inc.**
- Website: https://www.robotcom.com
- Email: info@robotcom.com
- Phone: +1 (555) 123-4567

---

<div align="center">

### 🌟 Star us on GitHub to show your support!

Made with ❤️ by the RobotCom team

</div>
