/**
 * SecurityService - Data validation, sanitization, and security checks
 * Provides utilities for input validation, SQL injection prevention, XSS protection
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

class SecurityService {
  /**
   * Validate email format
   */
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    
    if (!email) {
      errors.push('El correo es requerido');
    } else if (!this.isValidEmail(email)) {
      errors.push('El formato del correo es inválido');
    } else if (email.length > 255) {
      errors.push('El correo es demasiado largo');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate phone number
   */
  static validatePhone(phone: string): ValidationResult {
    const errors: string[] = [];
    
    if (!phone) {
      errors.push('El teléfono es requerido');
    } else if (!/^[\d\s\-\+\(\)]+$/.test(phone)) {
      errors.push('El formato del teléfono es inválido');
    } else if (phone.replace(/\D/g, '').length < 7) {
      errors.push('El teléfono debe tener al menos 7 dígitos');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate name (prevents injection)
   */
  static validateName(name: string, fieldName: string = 'Nombre'): ValidationResult {
    const errors: string[] = [];
    
    if (!name || name.trim().length === 0) {
      errors.push(`${fieldName} es requerido`);
    } else if (name.length > 100) {
      errors.push(`${fieldName} es demasiado largo`);
    } else if (!/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s'-]+$/.test(name)) {
      errors.push(`${fieldName} contiene caracteres inválidos`);
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate number range
   */
  static validateNumberRange(
    value: number,
    min: number,
    max: number,
    fieldName: string = 'Valor'
  ): ValidationResult {
    const errors: string[] = [];
    
    if (value < min || value > max) {
      errors.push(`${fieldName} debe estar entre ${min} y ${max}`);
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate date format and range
   */
  static validateDate(dateString: string, fieldName: string = 'Fecha'): ValidationResult {
    const errors: string[] = [];
    
    if (!dateString) {
      errors.push(`${fieldName} es requerida`);
    } else {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        errors.push(`${fieldName} tiene un formato inválido`);
      } else if (date > new Date()) {
        errors.push(`${fieldName} no puede ser en el futuro`);
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Sanitize HTML string to prevent XSS
   */
  static sanitizeHTML(dirty: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return dirty.replace(/[&<>"']/g, char => map[char]);
  }

  /**
   * Validate that string doesn't contain SQL injection patterns
   */
  static detectSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /('|(--)|;|\/\*|\*\/|xp_|sp_|exec|execute|select|insert|update|delete|drop|create|alter)/gi
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Hash a string (simple, client-side only - not for passwords)
   */
  static simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Generate a secure random string
   */
  static generateSecureToken(length: number = 32): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    const randomValues = new Uint8Array(length);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
      token += charset[randomValues[i] % charset.length];
    }

    return token;
  }

  /**
   * Validate credit card number (Luhn algorithm)
   */
  static validateCreditCard(cardNumber: string): ValidationResult {
    const errors: string[] = [];
    const cleaned = cardNumber.replace(/\s/g, '');

    if (!cleaned || !/^\d{13,19}$/.test(cleaned)) {
      errors.push('Número de tarjeta inválido');
    } else if (!this.luhnCheck(cleaned)) {
      errors.push('El número de tarjeta no es válido');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Luhn algorithm for credit card validation
   */
  private static luhnCheck(num: string): boolean {
    let sum = 0;
    let isEven = false;

    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  /**
   * Validate email format (basic RFC 5322)
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Check if password meets minimum requirements
   */
  static validatePassword(password: string): ValidationResult {
    const errors: string[] = [];

    if (!password) {
      errors.push('La contraseña es requerida');
    } else {
      if (password.length < 8) {
        errors.push('La contraseña debe tener al menos 8 caracteres');
      }
      if (!/[A-Z]/.test(password)) {
        errors.push('La contraseña debe contener letras mayúsculas');
      }
      if (!/[a-z]/.test(password)) {
        errors.push('La contraseña debe contener letras minúsculas');
      }
      if (!/[0-9]/.test(password)) {
        errors.push('La contraseña debe contener números');
      }
      if (!/[!@#$%^&*]/.test(password)) {
        errors.push('La contraseña debe contener caracteres especiales (!@#$%^&*)');
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate all object properties against rules
   */
  static validateObject(
    obj: Record<string, any>,
    rules: Record<string, (value: any) => ValidationResult>
  ): ValidationResult {
    const allErrors: string[] = [];

    for (const [field, rule] of Object.entries(rules)) {
      const result = rule(obj[field]);
      if (!result.isValid) {
        allErrors.push(`${field}: ${result.errors.join(', ')}`);
      }
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors
    };
  }

  /**
   * Check if IP address is valid
   */
  static validateIP(ip: string): ValidationResult {
    const errors: string[] = [];
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;

    if (!ipv4Regex.test(ip) && !ipv6Regex.test(ip)) {
      errors.push('Dirección IP inválida');
    }

    return { isValid: errors.length === 0, errors };
  }
}

export default SecurityService;
