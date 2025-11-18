/**
 * SecurityService Unit Tests
 * Tests validation, sanitization, and security functions
 */

import SecurityService from '../application/services/SecurityService';
import { assert } from './testUtils';

describe('SecurityService', () => {
  describe('Email Validation', () => {
    it('should validate correct email format', () => {
      const result = SecurityService.validateEmail('user@example.com');
      assert.truthy(result.isValid, 'Valid email should pass validation');
    });

    it('should reject invalid email format', () => {
      const result = SecurityService.validateEmail('invalid-email');
      assert.falsy(result.isValid, 'Invalid email should fail validation');
    });

    it('should reject empty email', () => {
      const result = SecurityService.validateEmail('');
      assert.falsy(result.isValid, 'Empty email should fail validation');
    });

    it('should reject email without domain', () => {
      const result = SecurityService.validateEmail('user@');
      assert.falsy(result.isValid, 'Email without domain should fail validation');
    });
  });

  describe('Phone Validation', () => {
    it('should validate phone with at least 10 digits', () => {
      const result = SecurityService.validatePhone('555-1234567');
      assert.truthy(result.isValid, 'Valid phone should pass validation');
    });

    it('should reject phone with less than 7 digits', () => {
      const result = SecurityService.validatePhone('555-123');
      assert.falsy(result.isValid, 'Phone with too few digits should fail');
    });

    it('should handle various phone formats', () => {
      const formats = [
        '5551234567',
        '555-123-4567',
        '+1 (555) 123-4567',
        '5551234567',
      ];

      formats.forEach((phone) => {
        const result = SecurityService.validatePhone(phone);
        assert.truthy(
          result.isValid,
          `Phone format "${phone}" should be valid`
        );
      });
    });
  });

  describe('Name Validation', () => {
    it('should validate standard names', () => {
      const result = SecurityService.validateName('Juan Pérez');
      assert.truthy(result.isValid, 'Standard name should pass validation');
    });

    it('should accept names with special characters', () => {
      const result = SecurityService.validateName("O'Connor");
      assert.truthy(result.isValid, 'Name with apostrophe should be valid');
    });

    it('should reject names with numbers', () => {
      const result = SecurityService.validateName('Juan123');
      assert.falsy(result.isValid, 'Name with numbers should fail');
    });

    it('should reject empty names', () => {
      const result = SecurityService.validateName('');
      assert.falsy(result.isValid, 'Empty name should fail');
    });

    it('should reject overly long names', () => {
      const longName = 'a'.repeat(101);
      const result = SecurityService.validateName(longName);
      assert.falsy(result.isValid, 'Name longer than 100 chars should fail');
    });
  });

  describe('Date Validation', () => {
    it('should validate correct date format', () => {
      const result = SecurityService.validateDate('1990-01-15');
      assert.truthy(result.isValid, 'Valid date should pass validation');
    });

    it('should reject future dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const dateString = futureDate.toISOString().split('T')[0];
      const result = SecurityService.validateDate(dateString);
      assert.falsy(result.isValid, 'Future date should fail validation');
    });

    it('should reject invalid date format', () => {
      const result = SecurityService.validateDate('01/15/1990');
      assert.falsy(result.isValid, 'Invalid date format should fail');
    });

    it('should reject empty date', () => {
      const result = SecurityService.validateDate('');
      assert.falsy(result.isValid, 'Empty date should fail');
    });
  });

  describe('SQL Injection Detection', () => {
    it('should detect simple SQL injection', () => {
      const result = SecurityService.detectSqlInjection("'; DROP TABLE users; --");
      assert.truthy(result, 'SQL injection should be detected');
    });

    it('should detect UNION-based injection', () => {
      const result = SecurityService.detectSqlInjection('1 UNION SELECT * FROM users');
      assert.truthy(result, 'UNION-based injection should be detected');
    });

    it('should detect comment-based injection', () => {
      const result = SecurityService.detectSqlInjection('1 OR 1=1 --');
      assert.truthy(result, 'Comment-based injection should be detected');
    });

    it('should allow safe input', () => {
      const result = SecurityService.detectSqlInjection('Juan Pérez');
      assert.falsy(result, 'Safe input should not be flagged');
    });
  });

  describe('XSS Detection', () => {
    it('should detect script tag injection', () => {
      const result = SecurityService.detectXss('<script>alert("XSS")</script>');
      assert.truthy(result, 'Script tag should be detected');
    });

    it('should detect event handler injection', () => {
      const result = SecurityService.detectXss('<img onerror="alert(1)">');
      assert.truthy(result, 'Event handler should be detected');
    });

    it('should detect javascript: protocol', () => {
      const result = SecurityService.detectXss('<a href="javascript:alert(1)">');
      assert.truthy(result, 'JavaScript protocol should be detected');
    });

    it('should allow safe HTML-like text', () => {
      const result = SecurityService.detectXss('Check < 10 and > 5');
      assert.falsy(result, 'Safe text with brackets should not be flagged');
    });
  });

  describe('Input Sanitization', () => {
    it('should sanitize HTML special characters', () => {
      const input = '<script>alert("test")</script>';
      const sanitized = SecurityService.sanitizeInput(input);
      assert.falsy(
        sanitized.includes('<script>'),
        'Script tags should be removed'
      );
      assert.falsy(
        sanitized.includes('</script>'),
        'Script closing tags should be removed'
      );
    });

    it('should escape HTML entities', () => {
      const input = '< > & " \'';
      const sanitized = SecurityService.sanitizeInput(input);
      assert.truthy(
        sanitized.includes('&lt;'),
        'Less than should be escaped'
      );
      assert.truthy(
        sanitized.includes('&gt;'),
        'Greater than should be escaped'
      );
    });

    it('should trim whitespace', () => {
      const input = '  test  ';
      const sanitized = SecurityService.sanitizeInput(input);
      assert.equals(sanitized, 'test', 'Whitespace should be trimmed');
    });
  });

  describe('IP Address Validation', () => {
    it('should validate correct IPv4 address', () => {
      const result = SecurityService.isValidIpAddress('192.168.1.1');
      assert.truthy(result, 'Valid IPv4 should pass');
    });

    it('should reject invalid IPv4 address', () => {
      const result = SecurityService.isValidIpAddress('256.256.256.256');
      assert.falsy(result, 'Invalid IPv4 should fail');
    });

    it('should reject incomplete IP address', () => {
      const result = SecurityService.isValidIpAddress('192.168.1');
      assert.falsy(result, 'Incomplete IP should fail');
    });
  });

  describe('Secure Token Generation', () => {
    it('should generate non-empty token', () => {
      const token = SecurityService.generateSecureToken();
      assert.truthy(token && token.length > 0, 'Token should not be empty');
    });

    it('should generate tokens of specified length', () => {
      const token = SecurityService.generateSecureToken(64);
      assert.equals(token.length, 128, 'Token should be double the byte length in hex');
    });

    it('should generate different tokens each time', () => {
      const token1 = SecurityService.generateSecureToken();
      const token2 = SecurityService.generateSecureToken();
      assert.falsy(token1 === token2, 'Tokens should be unique');
    });

    it('should generate valid hex strings', () => {
      const token = SecurityService.generateSecureToken();
      const hexRegex = /^[0-9a-f]+$/;
      assert.truthy(
        hexRegex.test(token),
        'Token should be valid hexadecimal'
      );
    });
  });

  describe('Rate Limiter', () => {
    it('should allow requests within limit', () => {
      const limiter = SecurityService.createRateLimiter(5, 1000);
      for (let i = 0; i < 5; i++) {
        const result = limiter.check('user-1');
        assert.truthy(result, `Request ${i + 1} should be allowed`);
      }
    });

    it('should block requests beyond limit', () => {
      const limiter = SecurityService.createRateLimiter(3, 1000);
      for (let i = 0; i < 3; i++) {
        limiter.check('user-1');
      }
      const result = limiter.check('user-1');
      assert.falsy(result, 'Request beyond limit should be blocked');
    });

    it('should track attempt count', () => {
      const limiter = SecurityService.createRateLimiter(5, 1000);
      limiter.check('user-1');
      limiter.check('user-1');
      const attempts = limiter.getAttempts('user-1');
      assert.equals(attempts, 2, 'Should track correct attempt count');
    });

    it('should allow reset', () => {
      const limiter = SecurityService.createRateLimiter(3, 1000);
      limiter.check('user-1');
      limiter.check('user-1');
      limiter.check('user-1');
      limiter.reset('user-1');
      const result = limiter.check('user-1');
      assert.truthy(result, 'Request should be allowed after reset');
    });
  });

  describe('Credit Card Validation (Luhn Algorithm)', () => {
    it('should validate correct credit card number', () => {
      const result = SecurityService.isValidCreditCard('4532015112830366');
      assert.truthy(result, 'Valid credit card should pass');
    });

    it('should reject invalid credit card number', () => {
      const result = SecurityService.isValidCreditCard('4532015112830367');
      assert.falsy(result, 'Invalid credit card should fail');
    });

    it('should reject short numbers', () => {
      const result = SecurityService.isValidCreditCard('123');
      assert.falsy(result, 'Short number should fail');
    });

    it('should accept formatted credit cards', () => {
      const result = SecurityService.isValidCreditCard('4532 0151 1283 0366');
      assert.truthy(result, 'Formatted credit card should work');
    });
  });

  describe('Password Strength Validation', () => {
    it('should accept strong passwords', () => {
      const result = SecurityService.isStrongPassword('SecurePass123!');
      assert.truthy(result, 'Strong password should pass');
    });

    it('should reject weak passwords', () => {
      const result = SecurityService.isStrongPassword('weak');
      assert.falsy(result, 'Weak password should fail');
    });

    it('should require minimum 8 characters', () => {
      const result = SecurityService.isStrongPassword('Pass1!');
      assert.falsy(result, 'Password < 8 chars should fail');
    });

    it('should require uppercase', () => {
      const result = SecurityService.isStrongPassword('lowercase123!');
      assert.falsy(result, 'Password without uppercase should fail');
    });

    it('should require lowercase', () => {
      const result = SecurityService.isStrongPassword('UPPERCASE123!');
      assert.falsy(result, 'Password without lowercase should fail');
    });

    it('should require number', () => {
      const result = SecurityService.isStrongPassword('NoNumbers!');
      assert.falsy(result, 'Password without number should fail');
    });

    it('should require special character', () => {
      const result = SecurityService.isStrongPassword('NoSpecial123');
      assert.falsy(result, 'Password without special char should fail');
    });
  });
});
