# Testing Framework Setup Guide

## Overview

This document outlines the testing infrastructure for the RobotCom LIMS application, including unit tests, integration tests, and end-to-end tests.

## Testing Architecture

### Test Structure

```
src/renderer/src/
├── __tests__/
│   ├── testUtils.ts           # Testing utilities and helpers
│   ├── SecurityService.test.ts # Service unit tests
│   ├── components/            # Component tests
│   ├── integration/           # Integration tests
│   └── e2e/                  # End-to-end tests
```

### Test Types

#### 1. **Unit Tests**
- Test individual services and utilities
- Located in `__tests__/*.test.ts`
- Examples: SecurityService, LoggerService, ValidationRules

#### 2. **Component Tests**
- Test React components in isolation
- Located in `__tests__/components/`
- Test rendering, props, state, and user interactions

#### 3. **Integration Tests**
- Test multiple components/services working together
- Located in `__tests__/integration/`
- Example: PatientForm submission with validation and storage

#### 4. **End-to-End (E2E) Tests**
- Test complete user workflows
- Located in `__tests__/e2e/`
- Example: Full patient registration to report generation

## Testing Utilities

### Available Helpers

The `testUtils.ts` file provides:

```typescript
// Mock creation
createMock(options?: MockOptions)

// DOM utilities
getInputValue(selector)
setInputValue(selector, value)
clickElement(selector)
getElement(selector)
elementExists(selector)
isElementVisible(selector)

// Form utilities
fillForm(data)
submitForm(selector)

// Assertions
assert.equals(actual, expected)
assert.truthy(value)
assert.falsy(value)
assert.includes(array, value)
assert.throws(fn)

// Test data factories
testDataFactory.patient()
testDataFactory.sample()
testDataFactory.test()
testDataFactory.invoice()
testDataFactory.user()
```

## Writing Tests

### Unit Test Example

```typescript
import SecurityService from '../application/services/SecurityService';
import { assert } from './testUtils';

describe('SecurityService', () => {
  it('should validate email format', () => {
    const result = SecurityService.validateEmail('user@example.com');
    assert.truthy(result.isValid);
  });

  it('should reject invalid email', () => {
    const result = SecurityService.validateEmail('invalid');
    assert.falsy(result.isValid);
  });
});
```

### Component Test Example

```typescript
import { PatientForm } from '../presentation/components/Patients/PatientForm';
import { renderComponent, fillForm, clickElement, assert } from './testUtils';
import { testDataFactory } from './testUtils';

describe('PatientForm', () => {
  it('should render form fields', () => {
    const { container } = renderComponent(PatientForm);
    assert.truthy(
      container.querySelector('[name="firstName"]'),
      'Should render first name field'
    );
  });

  it('should validate required fields', async () => {
    const { container } = renderComponent(PatientForm);
    clickElement('button[type="submit"]');
    // Assert validation messages appear
  });

  it('should submit valid form data', async () => {
    const mockOnSave = createMock();
    const { container } = renderComponent(PatientForm, { onSave: mockOnSave });
    
    const patient = testDataFactory.patient();
    fillForm({
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phone: patient.phone,
    });
    
    clickElement('button[type="submit"]');
    await waitFor(() => mockOnSave.callCount() > 0);
    assert.truthy(mockOnSave.wasCalledWith(expect.objectContaining(patient)));
  });
});
```

## Security Testing

### Input Validation Tests

All form inputs are tested for:
- Required field validation
- Format validation (email, phone, date)
- Length constraints
- Special character handling
- SQL injection prevention
- XSS prevention

### Example Security Tests

```typescript
describe('SecurityService', () => {
  describe('SQL Injection Detection', () => {
    it('should detect SQL injection attempts', () => {
      const result = SecurityService.detectSqlInjection("'; DROP TABLE users; --");
      assert.truthy(result);
    });

    it('should allow safe input', () => {
      const result = SecurityService.detectSqlInjection('Juan Pérez');
      assert.falsy(result);
    });
  });

  describe('XSS Prevention', () => {
    it('should detect XSS attempts', () => {
      const result = SecurityService.detectXss('<script>alert("XSS")</script>');
      assert.truthy(result);
    });

    it('should sanitize user input', () => {
      const input = '<img onerror="alert(1)">';
      const sanitized = SecurityService.sanitizeInput(input);
      assert.falsy(sanitized.includes('onerror'));
    });
  });
});
```

## Test Coverage

### Coverage Targets

- **Overall**: 60% minimum
- **Statements**: 60% minimum
- **Branches**: 60% minimum
- **Functions**: 60% minimum
- **Lines**: 60% minimum

### Coverage Reports

Generate coverage reports with:

```bash
npm run test:coverage
```

Reports are generated in:
- Terminal output
- `coverage/` directory
- HTML report: `coverage/index.html`

## Running Tests

### Development

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test -- SecurityService.test.ts

# Run tests matching pattern
npm run test -- --testNamePattern="Email Validation"
```

### CI/CD Pipeline

Tests run automatically on:
- Every push to main branch
- Every pull request
- Scheduled daily at 2 AM UTC

## Test Data Management

### Using Test Data Factories

```typescript
import { testDataFactory } from './testUtils';

const patient = testDataFactory.patient({
  firstName: 'Carlos',
  email: 'carlos@example.com'
});

const sample = testDataFactory.sample({
  patientId: patient.id
});
```

### Seed Data for Tests

```typescript
import { SeedService } from '../application/services/SeedService';

const seedService = new SeedService();
await seedService.seedDatabase({
  labs: [{ name: 'Test Lab' }],
  tests: [
    { code: 'CBC', name: 'Complete Blood Count', price: 150 }
  ]
});
```

## Mock Services

### Creating Mocks

```typescript
import { createMock } from './testUtils';

const mockPatientService = {
  createPatient: createMock({ returnValue: { id: '1' } }),
  updatePatient: createMock(),
  deletePatient: createMock({ throwError: true })
};
```

### Verifying Mock Calls

```typescript
const mock = createMock();
mock('data');

assert.equals(mock.callCount(), 1);
assert.truthy(mock.wasCalledWith('data'));

mock.resetCalls();
assert.equals(mock.callCount(), 0);
```

## Common Testing Patterns

### Async Testing

```typescript
it('should load patient data', async () => {
  const service = new PatientService();
  const patient = await service.getPatient('patient-1');
  assert.equals(patient.id, 'patient-1');
});
```

### Form Testing

```typescript
it('should validate and submit patient form', async () => {
  const onSave = createMock();
  const { container } = renderComponent(PatientForm, { onSave });
  
  fillForm({
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan@example.com',
    phone: '555-1234',
    birthDate: '1990-01-15'
  });
  
  submitForm('form');
  await waitFor(() => onSave.callCount() > 0);
  assert.truthy(true);
});
```

### Error Handling

```typescript
it('should handle service errors', async () => {
  const mockService = {
    getPatient: createMock({ throwError: true })
  };
  
  assert.throws(() => {
    mockService.getPatient('1');
  }, 'Should throw error');
});
```

## Continuous Integration

### GitHub Actions Integration

Tests run in CI pipeline with:
- Node.js 18+
- Code coverage reporting
- Test result annotations
- Automatic failure comments on PRs

### Pre-commit Testing

Run tests before committing:

```bash
npm run test:precommit
```

This runs:
1. Unit tests for changed files
2. Linting
3. Type checking
4. Security validation

## Best Practices

### ✅ Do

- Write tests for critical business logic
- Use meaningful test names describing what is tested
- Keep tests focused and independent
- Use test data factories for consistency
- Mock external dependencies
- Test both happy paths and error cases
- Keep tests maintainable and readable

### ❌ Don't

- Write tests that depend on execution order
- Create overly complex test setups
- Mock everything indiscriminately
- Write tests that are more complex than the code
- Ignore test failures
- Mix unit and integration tests
- Test implementation details instead of behavior

## Debugging Tests

### Debug Mode

```bash
# Run tests with debugging
node --inspect-brk node_modules/.bin/jest --runInBand

# In Chrome: chrome://inspect
```

### Verbose Output

```bash
npm run test -- --verbose
```

### Logging in Tests

```typescript
it('should debug patientdata', () => {
  const patient = testDataFactory.patient();
  console.log('Patient data:', JSON.stringify(patient, null, 2));
  assert.truthy(patient.id);
});
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Cypress E2E Testing](https://www.cypress.io/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Support

For testing questions or issues:
1. Check existing test examples in `__tests__/`
2. Review testing utilities in `testUtils.ts`
3. Consult this guide for patterns and best practices
4. Create an issue with test failure details
