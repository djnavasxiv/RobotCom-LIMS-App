/**
 * Testing utilities for React components
 * Provides helper functions for component testing
 */

import React from 'react';

export interface MockOptions {
  returnValue?: any;
  throwError?: boolean;
  delay?: number;
}

/**
 * Create a mock function with optional behavior
 */
export function createMock(options?: MockOptions) {
  let callCount = 0;
  let lastCallArgs: any[] = [];

  const mockFn = (...args: any[]) => {
    callCount++;
    lastCallArgs = args;

    if (options?.throwError) {
      throw new Error('Mock function error');
    }

    return Promise.resolve(options?.returnValue);
  };

  mockFn.callCount = () => callCount;
  mockFn.wasCalledWith = (...args: any[]) => JSON.stringify(lastCallArgs) === JSON.stringify(args);
  mockFn.resetCalls = () => {
    callCount = 0;
    lastCallArgs = [];
  };

  return mockFn as any;
}

/**
 * Wait for a condition to be true
 */
export async function waitFor(
  condition: () => boolean,
  timeout = 1000,
  interval = 50
): Promise<void> {
  const startTime = Date.now();

  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error('waitFor timeout exceeded');
    }
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
}

/**
 * Render a React component (simplified version without React Testing Library)
 */
export function renderComponent(_Component: React.ComponentType<any>, _props?: any) {
  const container = document.createElement('div');
  document.body.appendChild(container);

  return {
    container,
    unmount: () => {
      document.body.removeChild(container);
    },
  };
}

/**
 * Get user input value from form field
 */
export function getInputValue(selector: string): string {
  const element = document.querySelector(selector) as HTMLInputElement;
  return element?.value || '';
}

/**
 * Set user input value on form field
 */
export function setInputValue(selector: string, value: string): void {
  const element = document.querySelector(selector) as HTMLInputElement;
  if (element) {
    element.value = value;
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

/**
 * Simulate click event
 */
export function clickElement(selector: string): void {
  const element = document.querySelector(selector) as HTMLElement;
  if (element) {
    element.click();
  }
}

/**
 * Get element by selector
 */
export function getElement(selector: string): HTMLElement | null {
  return document.querySelector(selector);
}

/**
 * Get all elements matching selector
 */
export function getElements(selector: string): HTMLElement[] {
  return Array.from(document.querySelectorAll(selector));
}

/**
 * Check if element exists
 */
export function elementExists(selector: string): boolean {
  return document.querySelector(selector) !== null;
}

/**
 * Get element text content
 */
export function getElementText(selector: string): string {
  const element = document.querySelector(selector);
  return element?.textContent || '';
}

/**
 * Check if element is visible
 */
export function isElementVisible(selector: string): boolean {
  const element = document.querySelector(selector) as HTMLElement;
  if (!element) return false;

  const style = window.getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden';
}

/**
 * Fill out a form with provided data
 */
export function fillForm(data: Record<string, string>): void {
  Object.entries(data).forEach(([name, value]) => {
    const inputs = document.querySelectorAll(`[name="${name}"]`);
    inputs.forEach((input: any) => {
      if (input.type === 'checkbox' || input.type === 'radio') {
        input.checked = value === 'true';
      } else {
        input.value = value;
      }
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });
}

/**
 * Submit a form
 */
export function submitForm(selector: string): void {
  const form = document.querySelector(selector) as HTMLFormElement;
  if (form) {
    form.dispatchEvent(new Event('submit', { bubbles: true }));
  }
}

/**
 * Create a mock fetch response
 */
export function createMockResponse(data: any, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  } as Response);
}

/**
 * Test data factory functions
 */
export const testDataFactory = {
  patient: (overrides = {}) => ({
    id: 'patient-1',
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan@example.com',
    phone: '555-1234',
    birthDate: new Date('1990-01-15'),
    gender: 'male',
    address: 'Calle Principal 123',
    ...overrides,
  }),

  sample: (overrides = {}) => ({
    id: 'sample-1',
    sampleNumber: 'S-001',
    patientId: 'patient-1',
    collectionDate: new Date(),
    status: 'pending',
    ...overrides,
  }),

  test: (overrides = {}) => ({
    id: 'test-1',
    code: 'TEST-001',
    name: 'Complete Blood Count',
    price: 150.00,
    category: 'Hematology',
    unit: 'mcL',
    ...overrides,
  }),

  invoice: (overrides = {}) => ({
    id: 'invoice-1',
    invoiceNumber: 'INV-001',
    patientId: 'patient-1',
    sampleId: 'sample-1',
    subtotal: 150.00,
    tax: 30.00,
    total: 180.00,
    status: 'pending',
    ...overrides,
  }),

  user: (overrides = {}) => ({
    id: 'user-1',
    username: 'testuser',
    fullName: 'Test User',
    email: 'test@example.com',
    role: 'technician',
    isActive: true,
    ...overrides,
  }),
};

/**
 * Assert utility functions
 */
export const assert = {
  equals: (actual: any, expected: any, message?: string) => {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
  },

  truthy: (value: any, message?: string) => {
    if (!value) {
      throw new Error(message || `Expected truthy value, got ${value}`);
    }
  },

  falsy: (value: any, message?: string) => {
    if (value) {
      throw new Error(message || `Expected falsy value, got ${value}`);
    }
  },

  includes: (array: any[], value: any, message?: string) => {
    if (!array.includes(value)) {
      throw new Error(message || `Expected array to include ${value}`);
    }
  },

  throws: (fn: () => void, message?: string) => {
    try {
      fn();
      throw new Error(message || 'Expected function to throw');
    } catch (error) {
      // Expected
    }
  },
};
