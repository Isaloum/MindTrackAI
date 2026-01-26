# MindTrackAI - Quick Reference Guide
**Enhanced Features Implementation Guide**

---

## 🎯 New Features at a Glance

### 1. Analytics Tracking (Privacy-Safe)
Track user behavior without collecting personal data.

```javascript
// Track any user action
Analytics.track('Category', 'Action', 'Label');

// Examples
Analytics.track('Medication', 'Add', 'Prescription');
Analytics.track('Dashboard', 'View');
Analytics.track('Export', 'CSV', 'Success');

// View statistics
const stats = Analytics.getStats();
console.log('Total events:', stats.totalEvents);
console.log('By category:', stats.byCategory);
console.log('Recent activity (7 days):', stats.last7Days);
```

**Privacy:** Zero PII collected, all data stays local, 1000-event limit.

---

### 2. Error Handling System
Catch errors gracefully and provide user-friendly messages.

```javascript
// Wrap risky functions
const safeFunction = ErrorHandler.wrap(myFunction, 'ContextName');

// Manual error handling
try {
  riskyOperation();
} catch (error) {
  ErrorHandler.handle(
    error, 
    'OperationContext', 
    'User-friendly error message'
  );
}

// Show custom error toast
ErrorHandler.showErrorToast('Something went wrong!');
```

**Features:** Anonymous error logging, user-friendly messages, graceful degradation.

---

### 3. Input Validation & Sanitization
Protect against XSS, injection, and data corruption.

```javascript
// Sanitize HTML (XSS protection)
const safe = InputValidator.sanitizeHTML(userInput);

// Sanitize with length limit
const safeName = InputValidator.sanitizeString(name, 100);

// Validate numbers
const result = InputValidator.validateNumber(value, min, max);
if (result.valid) {
  useValue(result.value);
} else {
  alert(result.error); // "Must be between X and Y"
}

// Validate email
if (InputValidator.validateEmail(email)) {
  sendEmail(email);
}

// Validate date
if (InputValidator.validateDate(dateStr)) {
  saveDate(dateStr);
}

// Sanitize entire form
const formData = {
  name: document.getElementById('name').value,
  notes: document.getElementById('notes').value,
  dose: document.getElementById('dose').value
};
const safe = InputValidator.sanitizeFormData(formData);
```

**Security:** Prevents XSS attacks, enforces data types, safe defaults.

---

## 🧪 Running Tests

### Quick Start
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode (auto-rerun)
npm run test:watch
```

### Test Coverage
The test suite covers:
- ✅ Medication interactions (dangerous combinations)
- ✅ Pregnancy safety warnings
- ✅ Dosage validation
- ✅ Input sanitization
- ✅ Error handling
- ✅ Analytics tracking
- ✅ Data export

### Example Test Output
```
PASS  docs/__tests__/critical-features.test.js
  Medication Interaction Checker
    ✓ should detect dangerous SSRI + MAOI interaction (12ms)
    ✓ should detect aspirin + ibuprofen interaction (3ms)
    ✓ should return empty array for safe combinations (2ms)
  
  Pregnancy Safety Warnings
    ✓ should warn for Category X medication (5ms)
    ✓ should allow safe medications (2ms)
  
  Dosage Validation
    ✓ should validate normal aspirin dosage (3ms)
    ✓ should warn on excessive vitamin D dosage (4ms)
    ✓ should reject dosage without unit (2ms)

Test Suites: 1 passed, 1 total
Tests:       24 passed, 24 total
```

---

## 📤 Enhanced Data Export

### What's Exported
The `exportData()` function now includes:
- ✅ User profile
- ✅ Mood entries
- ✅ **Medication definitions** (NEW)
- ✅ **Medication logs** (NEW)
- ✅ **Side effects** (NEW)
- ✅ Sleep logs
- ✅ Exercise logs
- ✅ **Journal entries** (NEW)

### Usage
```javascript
// Export all data
exportData();
// Downloads: mindtrack-export-2026-01-24.json

// Programmatic export
const data = {
  profile: { name: DB.getOne('userName'), exportDate: new Date().toISOString() },
  moods: DB.get('moods'),
  medications: DB.get('medications'),
  medicationDefinitions: DB.get('medicationDefinitions'),
  medicationLogs: DB.get('medicationLogs'),
  sideEffects: DB.get('sideEffects'),
  sleeps: DB.get('sleeps'),
  exercises: DB.get('exercises'),
  journalEntries: DB.get('journalEntries')
};
```

---

## 🔒 Security Best Practices

### Always Sanitize User Input
```javascript
// ❌ BAD - Direct use
const notes = document.getElementById('notes').value;
saveToDatabase(notes);

// ✅ GOOD - Sanitized
const notes = InputValidator.sanitizeString(
  document.getElementById('notes').value,
  500 // max length
);
saveToDatabase(notes);
```

### Always Validate Before Saving
```javascript
// ❌ BAD - No validation
const dose = document.getElementById('dose').value;
saveMedication({ dose });

// ✅ GOOD - Validated
const doseInput = document.getElementById('dose').value;
const validation = InputValidator.validateNumber(doseInput, 1, 10000);
if (validation.valid) {
  saveMedication({ dose: validation.value });
} else {
  alert(validation.error);
}
```

### Always Handle Errors
```javascript
// ❌ BAD - Unhandled
function saveMedication() {
  localStorage.setItem('meds', JSON.stringify(data));
}

// ✅ GOOD - Error handled
function saveMedication() {
  try {
    localStorage.setItem('meds', JSON.stringify(data));
    Analytics.track('Medication', 'Save', 'Success');
  } catch (error) {
    ErrorHandler.handle(
      error, 
      'saveMedication', 
      'Failed to save medication. Storage may be full.'
    );
  }
}
```

---

## 📊 Analytics Dashboard Example

```javascript
// Get comprehensive usage statistics
function showAnalyticsDashboard() {
  const stats = Analytics.getStats();
  
  console.log('=== Analytics Dashboard ===');
  console.log('Total Events:', stats.totalEvents);
  console.log('Recent Activity:', stats.last7Days, 'events in last 7 days');
  
  console.log('\nMost Used Features:');
  Object.entries(stats.byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([category, count]) => {
      console.log(`  ${category}: ${count} times`);
    });
    
  console.log('\nTop Actions:');
  Object.entries(stats.byAction)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([action, count]) => {
      console.log(`  ${action}: ${count} times`);
    });
}
```

---

## 🚨 Common Issues & Solutions

### Issue: "localStorage quota exceeded"
```javascript
// Solution: Clear old analytics data
const analytics = DB.get('analytics') || [];
DB.set('analytics', analytics.slice(-500)); // Keep only last 500

// Or use the built-in limit (automatic)
Analytics.track('Event', 'Action'); // Auto-limits to 1000
```

### Issue: "Export file is corrupt"
```javascript
// Solution: Use error-handled export
try {
  exportData();
} catch (error) {
  ErrorHandler.handle(error, 'export', 'Export failed. Try closing some tabs.');
}
```

### Issue: "Tests failing"
```bash
# Solution: Clear test cache
npm test -- --clearCache
npm test
```

---

## 🎓 Advanced Usage

### Custom Error Handler
```javascript
// Override default error toast
ErrorHandler.showErrorToast = function(message) {
  // Your custom implementation
  alert('ERROR: ' + message);
};
```

### Export Analytics to CSV
```javascript
function exportAnalyticsCSV() {
  const events = DB.get('analytics') || [];
  const csv = ['Category,Action,Label,Timestamp'];
  
  events.forEach(e => {
    csv.push(`${e.category},${e.action},${e.label || ''},${e.timestamp}`);
  });
  
  const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'analytics.csv';
  a.click();
}
```

### Clear All Analytics
```javascript
// Clear analytics data
DB.set('analytics', []);
console.log('Analytics cleared');
```

---

## 📱 PWA Features

### Check Service Worker Status
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistration()
    .then(reg => {
      if (reg) {
        console.log('Service Worker active');
        console.log('Scope:', reg.scope);
      }
    });
}
```

### Force Update
```javascript
navigator.serviceWorker.getRegistration()
  .then(reg => reg.update());
```

---

## 💡 Tips & Tricks

1. **Performance:** Analytics tracking is async and won't block UI
2. **Privacy:** All analytics data stays on device, never sent anywhere
3. **Storage:** Analytics auto-limits to 1000 events (FIFO)
4. **Errors:** All errors are logged but don't break the app
5. **Tests:** Run `npm test` before deploying changes

---

## 📚 Documentation

- **Full Audit Report:** [AUDIT_COMPLETE.md](./AUDIT_COMPLETE.md)
- **Test Suite:** [docs/__tests__/critical-features.test.js](./docs/__tests__/critical-features.test.js)
- **Service Worker:** [docs/service-worker.js](./docs/service-worker.js)
- **Main App:** [docs/index.html](./docs/index.html)

---

**Last Updated:** January 24, 2026  
**Version:** 2.1.0-enhanced
