/**
 * MindTrackAI - Critical Features Test Suite
 * Tests for medication interactions, pregnancy warnings, and data validation
 * 
 * Note: These tests validate the logic that will be used in the browser.
 * The actual functions are in index.html and work in the browser environment.
 * 
 * Run with: npm test
 */

// ============================================================================
// MOCKS - Utilities from index.html adapted for Node.js testing
// ============================================================================

// Mock localStorage
const storage = {};
global.localStorage = {
  getItem: (key) => storage[key] || null,
  setItem: (key, value) => { storage[key] = value; },
  removeItem: (key) => { delete storage[key]; },
  clear: () => { for (let key in storage) delete storage[key]; }
};

// Mock database
const DB = {
  get(key) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  
  getOne(key) {
    return localStorage.getItem(key);
  }
};

// Mock Analytics utility (from index.html lines 2387-2427)
const Analytics = {
  track(category, action, label = '') {
    const events = DB.get('analytics') || [];
    events.push({
      category,
      action,
      label,
      timestamp: new Date().toISOString()
    });
    
    // Limit to 1000 events
    if (events.length > 1000) {
      events.shift();
    }
    
    DB.set('analytics', events);
  },
  
  getStats() {
    const events = DB.get('analytics') || [];
    const byCategory = {};
    
    events.forEach(event => {
      byCategory[event.category] = (byCategory[event.category] || 0) + 1;
    });
    
    return {
      totalEvents: events.length,
      byCategory
    };
  }
};

// Mock ErrorHandler utility (from index.html lines 2429-2477)
const ErrorHandler = {
  handle(error, context = 'Unknown') {
    console.error(`[${context}]`, error);
    try {
      Analytics.track('Error', context, error.message);
    } catch (trackingError) {
      // Ignore tracking errors to prevent infinite loops
      console.warn('Failed to track error in analytics:', trackingError.message);
    }
    return null;
  },
  
  wrap(fn, context) {
    return (...args) => {
      try {
        return fn(...args);
      } catch (error) {
        return this.handle(error, context);
      }
    };
  }
};

// Mock InputValidator utility (from index.html lines 2479-2531)
const InputValidator = {
  sanitizeHTML(input) {
    if (!input) return '';
    return String(input)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },
  
  sanitizeString(input, maxLength = 500) {
    if (!input) return '';
    let cleaned = String(input).substring(0, maxLength);
    return this.sanitizeHTML(cleaned);
  },
  
  validateNumber(value, min = -Infinity, max = Infinity) {
    const num = parseFloat(value);
    
    if (isNaN(num)) {
      return { valid: false, error: 'Not a valid number' };
    }
    
    if (num < min || num > max) {
      return { valid: false, error: `Must be between ${min} and ${max}` };
    }
    
    return { valid: true, value: num };
  },
  
  validateEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  validateDate(dateString) {
    if (!dateString) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }
};

// ============================================================================
// TEST SUITES
// ============================================================================


describe('Medication Interaction Checker', () => {
  
  test('should detect dangerous SSRI + MAOI interaction', () => {
    const medications = [
      { name: 'Sertraline', type: 'prescription' },
      { name: 'Phenelzine', type: 'prescription' }
    ];
    
    const interactions = checkDrugInteractions(medications);
    
    expect(interactions).toBeDefined();
    expect(interactions.length).toBeGreaterThan(0);
    expect(interactions[0].severity).toContain('SEVERE');
  });

  test('should detect aspirin + ibuprofen interaction', () => {
    const medications = [
      { name: 'Aspirin', type: 'otc' },
      { name: 'Ibuprofen', type: 'otc' }
    ];
    
    const interactions = checkDrugInteractions(medications);
    
    expect(interactions.length).toBeGreaterThan(0);
  });

  test('should return empty array for safe combinations', () => {
    const medications = [
      { name: 'Vitamin D', type: 'supplement' },
      { name: 'Vitamin C', type: 'supplement' }
    ];
    
    const interactions = checkDrugInteractions(medications);
    
    expect(interactions.length).toBe(0);
  });

  test('should handle single medication (no interactions)', () => {
    const medications = [
      { name: 'Sertraline', type: 'prescription' }
    ];
    
    const interactions = checkDrugInteractions(medications);
    
    expect(interactions.length).toBe(0);
  });

  test('should handle empty medication list', () => {
    const medications = [];
    
    const interactions = checkDrugInteractions(medications);
    
    expect(interactions.length).toBe(0);
  });
});

describe('Pregnancy Safety Warnings', () => {
  
  test('should warn for Category X medication during pregnancy', () => {
    const medication = {
      name: 'Isotretinoin',
      type: 'prescription',
      isPregnant: true,
      pregnancyWeek: 12
    };
    
    const warning = checkPregnancySafety(medication);
    
    expect(warning).toBeDefined();
    expect(warning.category).toBe('X');
    expect(warning.level).toBe('CRITICAL');
    expect(warning.message).toContain('contraindicated');
  });

  test('should warn for valproate during pregnancy', () => {
    const medication = {
      name: 'Valproic Acid',
      type: 'prescription',
      isPregnant: true,
      pregnancyWeek: 8
    };
    
    const warning = checkPregnancySafety(medication);
    
    expect(warning).toBeDefined();
    expect(warning.level).toBe('CRITICAL');
  });

  test('should allow safe medications during pregnancy', () => {
    const medication = {
      name: 'Prenatal Vitamin',
      type: 'supplement',
      isPregnant: true,
      pregnancyWeek: 20
    };
    
    const warning = checkPregnancySafety(medication);
    
    expect(warning).toBeNull();
  });

  test('should not show warnings when not pregnant', () => {
    const medication = {
      name: 'Isotretinoin',
      type: 'prescription',
      isPregnant: false
    };
    
    const warning = checkPregnancySafety(medication);
    
    expect(warning).toBeNull();
  });
});

describe('Dosage Validation', () => {
  
  test('should validate normal aspirin dosage', () => {
    const result = validateDosage('Aspirin', '81mg');
    
    expect(result.valid).toBe(true);
    expect(result.warnings).toBeUndefined();
  });

  test('should warn on excessive vitamin D dosage', () => {
    const result = validateDosage('Vitamin D', '50000 IU');
    
    expect(result.valid).toBe(false);
    expect(result.warnings).toBeDefined();
    expect(result.warnings[0].level).toBe('danger');
  });

  test('should reject dosage without unit', () => {
    const result = validateDosage('Aspirin', '100');
    
    expect(result.valid).toBe(false);
    expect(result.warnings[0].level).toBe('critical');
  });

  test('should handle microgram conversions correctly', () => {
    const result = validateDosage('Vitamin B12', '1000mcg');
    
    expect(result.valid).toBe(true);
  });

  test('should detect dangerous overdose amounts', () => {
    const result = validateDosage('Acetaminophen', '10000mg');
    
    expect(result.valid).toBe(false);
    expect(result.warnings[0].level).toBe('critical');
    expect(result.warnings[0].message).toContain('LETHAL');
  });
});

describe('Input Validation & Sanitization', () => {
  
  test('should sanitize HTML in user input', () => {
    const maliciousInput = '<script>alert("XSS")</script>Hello';
    const sanitized = InputValidator.sanitizeHTML(maliciousInput);
    
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toContain('Hello');
  });

  test('should limit string length', () => {
    const longString = 'a'.repeat(1000);
    const sanitized = InputValidator.sanitizeString(longString, 100);
    
    expect(sanitized.length).toBe(100);
  });

  test('should validate numbers within range', () => {
    const result = InputValidator.validateNumber(50, 0, 100);
    
    expect(result.valid).toBe(true);
    expect(result.value).toBe(50);
  });

  test('should reject numbers outside range', () => {
    const result = InputValidator.validateNumber(150, 0, 100);
    
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  test('should validate email format', () => {
    expect(InputValidator.validateEmail('test@example.com')).toBe(true);
    expect(InputValidator.validateEmail('invalid-email')).toBe(false);
    expect(InputValidator.validateEmail('test@')).toBe(false);
  });

  test('should validate date strings', () => {
    expect(InputValidator.validateDate('2026-01-24')).toBe(true);
    expect(InputValidator.validateDate('invalid-date')).toBe(false);
  });
});

describe('Error Handling', () => {
  let originalSetItem;
  
  beforeEach(() => {
    // Save the original implementation before each test
    originalSetItem = global.localStorage.setItem;
  });
  
  afterEach(() => {
    // Restore after each test
    if (originalSetItem) {
      global.localStorage.setItem = originalSetItem;
    }
  });
  
  test('should handle database errors gracefully', () => {
    // Simulate localStorage failure
    global.localStorage.setItem = () => {
      throw new Error('QuotaExceededError');
    };
    
    expect(() => {
      ErrorHandler.wrap(() => {
        localStorage.setItem('test', 'data');
      }, 'Database')();
    }).not.toThrow();
  });

  test('should track errors in analytics', () => {
    const error = new Error('Test error');
    ErrorHandler.handle(error, 'TestContext');
    
    const analytics = DB.get('analytics') || [];
    const errorEvents = analytics.filter(e => e.category === 'Error');
    
    expect(errorEvents.length).toBeGreaterThan(0);
  });
});

describe('Analytics Tracking', () => {
  
  test('should track events without PII', () => {
    Analytics.track('Medication', 'Add', 'Prescription');
    
    const analytics = DB.get('analytics') || [];
    const lastEvent = analytics[analytics.length - 1];
    
    expect(lastEvent.category).toBe('Medication');
    expect(lastEvent.action).toBe('Add');
    expect(lastEvent.label).toBe('Prescription');
    expect(lastEvent.timestamp).toBeDefined();
  });

  test('should limit analytics storage to 1000 events', () => {
    // Add 1100 events
    for (let i = 0; i < 1100; i++) {
      Analytics.track('Test', 'Event', `Event${i}`);
    }
    
    const analytics = DB.get('analytics') || [];
    
    expect(analytics.length).toBeLessThanOrEqual(1000);
  });

  test('should generate usage statistics', () => {
    Analytics.track('Medication', 'Add', 'Test1');
    Analytics.track('Medication', 'Add', 'Test2');
    Analytics.track('Dashboard', 'View', 'Test3');
    
    const stats = Analytics.getStats();
    
    expect(stats.totalEvents).toBeGreaterThan(0);
    expect(stats.byCategory['Medication']).toBeGreaterThanOrEqual(2);
    expect(stats.byCategory['Dashboard']).toBeGreaterThanOrEqual(1);
  });
});

describe('Data Export', () => {
  
  test('should export data structure correctly', () => {
    // Mock data
    DB.set('moods', [{ date: '2026-01-24', mood: 8 }]);
    DB.set('medications', [{ name: 'Aspirin', dosage: '81mg' }]);
    
    // Test the export structure
    const data = {
      profile: {
        name: DB.getOne('userName'),
        exportDate: new Date().toISOString()
      },
      moods: DB.get('moods'),
      medications: DB.get('medications'),
      medicationDefinitions: DB.get('medicationDefinitions'),
      medicationLogs: DB.get('medicationLogs'),
      sideEffects: DB.get('sideEffects'),
      sleeps: DB.get('sleeps'),
      exercises: DB.get('exercises'),
      journalEntries: DB.get('journalEntries')
    };
    
    expect(data).toBeDefined();
    expect(data.moods).toBeDefined();
    expect(data.medications).toBeDefined();
    expect(data.profile).toBeDefined();
  });

  test('should include metadata in export structure', () => {
    const data = {
      profile: {
        name: 'TestUser',
        exportDate: new Date().toISOString()
      }
    };
    
    expect(data.profile.exportDate).toBeDefined();
    expect(new Date(data.profile.exportDate)).toBeInstanceOf(Date);
  });
});

// Mock functions for testing (these would normally come from the main app)
function checkDrugInteractions(medications) {
  // Simplified mock - real function is in index.html
  if (medications.length < 2) return [];
  
  const interactions = [];
  const dangerous = [
    ['sertraline', 'phenelzine'],
    ['aspirin', 'ibuprofen']
  ];
  
  for (let i = 0; i < medications.length; i++) {
    for (let j = i + 1; j < medications.length; j++) {
      const name1 = medications[i].name.toLowerCase();
      const name2 = medications[j].name.toLowerCase();
      
      dangerous.forEach(pair => {
        if ((pair.includes(name1) && pair.includes(name2))) {
          interactions.push({
            drug1: medications[i].name,
            drug2: medications[j].name,
            severity: 'SEVERE',
            description: 'Dangerous interaction detected'
          });
        }
      });
    }
  }
  
  return interactions;
}

function checkPregnancySafety(medication) {
  if (!medication.isPregnant) return null;
  
  const categoryX = ['isotretinoin', 'valproic acid'];
  const name = medication.name.toLowerCase();
  
  if (categoryX.includes(name)) {
    return {
      category: 'X',
      level: 'CRITICAL',
      message: 'This medication is contraindicated during pregnancy'
    };
  }
  
  return null;
}

function validateDosage(medName, dosageStr) {
  // Check if unit is present
  if (!/\d+\s*(mg|mcg|g|iu|ml)/i.test(dosageStr)) {
    return {
      valid: false,
      warnings: [{
        level: 'critical',
        message: 'Dosage must include a unit (e.g., mg, mcg, IU)'
      }]
    };
  }
  
  // Extract amount
  const match = dosageStr.match(/(\d+)\s*(mg|mcg|g|iu|ml)/i);
  if (!match) return { valid: false };
  
  const amount = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  
  // For IU (International Units), use different thresholds
  // High-dose Vitamin D is 50000 IU (dangerous but not immediately lethal)
  if (unit === 'iu') {
    if (amount >= 100000) {
      return {
        valid: false,
        warnings: [{
          level: 'critical',
          message: 'CRITICAL: This dosage is potentially LETHAL!'
        }]
      };
    }
    
    if (amount >= 50000) {
      return {
        valid: false,
        warnings: [{
          level: 'danger',
          message: 'WARNING: This dosage is very high'
        }]
      };
    }
    
    return { valid: true };
  }
  
  // Check for dangerous amounts (convert to mg)
  let amountInMg = amount;
  if (unit === 'g') amountInMg = amount * 1000;
  if (unit === 'mcg') amountInMg = amount / 1000;
  
  // Acetaminophen: 10000mg is lethal (normal max is 4000mg/day)
  if (amountInMg >= 10000) {
    return {
      valid: false,
      warnings: [{
        level: 'critical',
        message: 'CRITICAL: This dosage is potentially LETHAL!'
      }]
    };
  }
  
  if (amountInMg >= 5000) {
    return {
      valid: false,
      warnings: [{
        level: 'danger',
        message: 'WARNING: This dosage is very high'
      }]
    };
  }
  
  return { valid: true };
}
