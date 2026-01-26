# Function Extraction Map - MindTrackAI Code Split

**Generated:** January 24, 2026  
**Purpose:** Detailed map of all functions to extract for MedsTrackAI and GymPulse

---

## 🔴 MEDICATION FUNCTIONS (→ MedsTrackAI)

### Core Medication Management
| Function | Line | Purpose | Dependencies |
|----------|------|---------|--------------|
| `addMedication()` | 7104 | Add new medication/supplement | DB, InputValidator, Analytics |
| `switchMedicationTab()` | 6842, 7766 | Switch between med tabs | localStorage |
| `deleteMedication()` | TBD | Remove medication | DB |
| `saveMedication()` | TBD | Save medication details | DB |
| `logMedicationTaken()` | TBD | Mark medication as taken | DB, Analytics |
| `logMedicationSkipped()` | TBD | Mark medication as skipped | DB, Analytics |
| `updateMedicationStats()` | TBD | Update dashboard stats | DB |

### Prescription Management
| Function | Line | Purpose | Dependencies |
|----------|------|---------|--------------|
| `savePrescriptionDetails()` | TBD | Save prescription info | DB |
| `setMedicationReminder()` | TBD | Set notification reminder | Notification API |
| `toggleContactsEdit()` | TBD | Edit emergency contacts | DOM |
| `saveContacts()` | TBD | Save emergency contacts | DB |
| `handleCountryChange()` | TBD | Update emergency numbers | DOM |

### Safety & Validation
| Function | Line | Purpose | Dependencies |
|----------|------|---------|--------------|
| `checkDrugInteractions()` | TBD | Check for drug interactions | DB, medications array |
| `validateDosage()` | TBD | Validate dosage safety | InputValidator |
| `showPregnancySection()` | TBD | Show pregnancy warnings | DOM |
| `togglePregnancyFields()` | TBD | Toggle pregnancy fields | DOM |
| `searchMedication()` | TBD | Search medication database | Medication DB |
| `identifyPill()` | TBD | Identify pill by appearance | Pill database |

### Side Effects & Tracking
| Function | Line | Purpose | Dependencies |
|----------|------|---------|--------------|
| `trackSideEffect()` | TBD | Log medication side effect | DB, Analytics |
| `deleteSideEffect()` | TBD | Remove side effect entry | DB |
| `updateMedTypePlaceholder()` | TBD | Update form placeholder | DOM |
| `handleDosageAmountInput()` | TBD | Handle dosage input | InputValidator |
| `updateDosagePreview()` | TBD | Show dosage preview | DOM |

### Data & Analytics
| Function | Line | Purpose | Dependencies |
|----------|------|---------|--------------|
| `renderMedicationHistory()` | TBD | Show medication history | DB |
| `renderEffectivenessList()` | TBD | Show effectiveness tracking | DB |
| `renderAdherenceInsights()` | TBD | Show adherence stats | DB, Analytics |
| `renderInteractionWarnings()` | TBD | Display drug interactions | checkDrugInteractions() |

**Total Medication Functions:** ~25-30 functions

---

## 🟢 EXERCISE FUNCTIONS (→ GymPulse)

### Core Exercise Tracking
| Function | Line | Purpose | Dependencies |
|----------|------|---------|--------------|
| `saveExercise()` | 8508 | Save exercise session | DB, Analytics |
| `updateExerciseStats()` | TBD | Update exercise dashboard | DB |
| `deleteExercise()` | TBD | Remove exercise entry | DB |
| `renderExerciseHistory()` | TBD | Display exercise history | DB |

**Total Exercise Functions:** ~4-5 functions

---

## ✅ MENTAL HEALTH FUNCTIONS (KEEP in MindTrackAI)

### Mood Tracking
| Function | Line | Purpose | Dependencies |
|----------|------|---------|--------------|
| `saveMood()` | TBD | Save mood entry | DB, Analytics |
| `updateMoodChart()` | TBD | Update mood visualization | DB, Chart library |
| `deleteMood()` | TBD | Remove mood entry | DB |

### Sleep Tracking
| Function | Line | Purpose | Dependencies |
|----------|------|---------|--------------|
| `saveSleep()` | TBD | Save sleep entry | DB, Analytics |
| `updateSleepChart()` | TBD | Update sleep visualization | DB, Chart library |
| `deleteSleep()` | TBD | Remove sleep entry | DB |

### Journal
| Function | Line | Purpose | Dependencies |
|----------|------|---------|--------------|
| `saveJournalEntry()` | TBD | Save journal entry | DB, Analytics |
| `deleteJournalEntry()` | TBD | Remove journal entry | DB |
| `renderJournalEntries()` | TBD | Display journal entries | DB |

**Total Mental Health Functions:** ~10-12 functions

---

## 🔧 SHARED UTILITY FUNCTIONS (Duplicate in all 3 apps)

### Database Helpers (lines 3407-3410)
```javascript
const DB = {
  get: (key) => JSON.parse(localStorage.getItem('stepsync_' + key) || '[]'),
  set: (key, data) => localStorage.setItem('stepsync_' + key, JSON.stringify(data)),
  getOne: (key) => JSON.parse(localStorage.getItem('stepsync_' + key) || 'null'),
  setOne: (key, data) => localStorage.setItem('stepsync_' + key, JSON.stringify(data))
};
```

### Analytics Class (lines 2387-2427)
- `Analytics.track(category, action, label)`
- `Analytics.getStats()`

### ErrorHandler Class (lines 2429-2477)
- `ErrorHandler.handle(error, context)`
- `ErrorHandler.wrap(fn, context)`

### InputValidator Class (lines 2479-2531)
- `InputValidator.sanitizeHTML(input)`
- `InputValidator.sanitizeString(input, maxLength)`
- `InputValidator.validateNumber(value, min, max)`
- `InputValidator.validateEmail(email)`
- `InputValidator.validateDate(dateString)`

### Navigation & Theme (KEEP in all)
| Function | Line | Purpose | Dependencies |
|----------|------|---------|--------------|
| `showTab()` | TBD | Switch between main tabs | DOM, localStorage |
| `toggleTheme()` | TBD | Switch light/dark mode | localStorage, DOM |
| `exportData()` | 2833 | Export user data | DB (modify for each app) |
| `importData()` | TBD | Import user data | DB |
| `clearAllData()` | TBD | Clear localStorage | localStorage |

---

## 📊 DATA STRUCTURE EXTRACTION

### MedsTrackAI Data Keys
```javascript
// To extract from MindTrackAI
DB.get('medications')           // Medication list
DB.get('medicationDefinitions') // Medication details
DB.get('medicationLogs')        // Taken/skipped logs
DB.get('sideEffects')           // Side effect reports
localStorage.getItem('medicationReminders') // Notification settings
localStorage.getItem('emergencyContacts')   // Emergency info
localStorage.getItem('userCountry')         // Location for emergency numbers
```

### GymPulse Data Keys
```javascript
// To extract from MindTrackAI
DB.get('exercises')  // Exercise sessions
```

### MindTrackAI Data Keys (KEEP)
```javascript
DB.get('moods')          // Mood entries
DB.get('sleeps')         // Sleep logs
DB.get('journalEntries') // Journal entries
DB.get('analytics')      // Usage analytics
localStorage.getItem('mindtrack_activeTab') // Active tab
localStorage.getItem('theme')               // Light/dark mode
```

---

## 🎨 CSS EXTRACTION MAP

### Medication CSS Classes (REMOVE from MindTrackAI)
- `.med-tab` - Medication tab buttons
- `.med-tab.active` - Active medication tab
- `.med-tab-content` - Medication tab content
- `.med-grid` - Medication card grid
- `.pill-card` - Individual medication card
- `.interaction-badge` - Interaction warning badge
- `.side-effect-card` - Side effect card
- Pregnancy warning styles (lines in pregnancy section)
- Emergency contact styles
- Pill identification styles

### Exercise CSS Classes (REMOVE from MindTrackAI)
- `.exercise-card` - Exercise entry card
- Exercise stat cards
- Exercise history styles

### Mental Health CSS Classes (KEEP)
- `.mood-slider` - Mood rating slider
- `.sleep-card` - Sleep entry card
- `.journal-card` - Journal entry card
- `.stat-card` - Dashboard stat cards
- `.chart-container` - Chart containers

---

## 🧪 TEST FILE MAPPING

### Medication Tests (→ MedsTrackAI)
| File | Lines | Tests | Status |
|------|-------|-------|--------|
| `medication-tracker.test.js` | Full | 50+ | Move entire file |
| `medication-tracker-enhanced.test.js` | Full | 40+ | Move entire file |
| `medication-tracker-enhanced.active.test.js` | Full | 30+ | Move entire file |
| `medication-tracker-regulatory.test.js` | Full | 25+ | Move entire file |
| `medication-enrichment.test.js` | Full | 20+ | Move entire file |
| `medication-interactions.test.js` | Full | 15+ | Move entire file |
| `medication-validator.test.js` | Full | 20+ | Move entire file |
| `enhanced-medication-manager.test.js` | Full | 30+ | Move entire file |
| `docs/__tests__/critical-features.test.js` | Lines 142-294 | 13 tests | Move medication tests |

**Total Medication Tests:** ~240+ tests

### Exercise Tests (→ GymPulse)
| File | Lines | Tests | Status |
|------|-------|-------|--------|
| `exercise-tracker.test.js` | Full | 30+ | Move entire file |
| `exercise-tracker-cli.test.js` | Full | 20+ | Move entire file |

**Total Exercise Tests:** ~50+ tests

### Mental Health Tests (KEEP in MindTrackAI)
| File | Lines | Tests | Status |
|------|-------|-------|--------|
| `mental-health-tracker.test.js` | Full | 40+ | Keep |
| `mental-health-insights.test.js` | Full | 30+ | Keep |
| `sleep-tracker.test.js` | Full | 35+ | Keep |
| `sleep-tracker-cli.test.js` | Full | 25+ | Keep |
| `docs/__tests__/critical-features.test.js` | Lines 1-141, 295+ | 14 tests | Keep mental health tests |

**Total Mental Health Tests:** ~130+ tests

---

## 📋 EXTRACTION CHECKLIST

### Phase 1: Prepare MedsTrackAI Repo ✅
- [ ] Create new repo: `MedsTrackAI`
- [ ] Copy base structure (package.json, README, etc.)
- [ ] Copy service worker
- [ ] Copy shared utilities (Analytics, ErrorHandler, InputValidator, DB)

### Phase 2: Extract Medication Code
- [ ] Copy medication HTML section (lines 1676-2111)
- [ ] Copy ~25-30 medication functions
- [ ] Copy medication CSS classes
- [ ] Copy 8 medication test files (~240 tests)
- [ ] Update navigation (only medication tab)
- [ ] Update dashboard (medication metrics only)
- [ ] Test all medication functionality

### Phase 3: Extract Exercise Code to GymPulse
- [ ] Copy exercise HTML section (lines 2147-2193)
- [ ] Copy ~4-5 exercise functions
- [ ] Copy exercise CSS classes
- [ ] Copy 2 exercise test files (~50 tests)
- [ ] Update GymPulse navigation
- [ ] Update GymPulse dashboard
- [ ] Test all exercise functionality

### Phase 4: Clean MindTrackAI
- [ ] Remove medication tab button (line 1487)
- [ ] Remove exercise tab button (line 1489)
- [ ] Remove medication section (lines 1676-2111)
- [ ] Remove exercise section (lines 2147-2193)
- [ ] Remove medication functions (~25-30)
- [ ] Remove exercise functions (~4-5)
- [ ] Remove medication CSS classes
- [ ] Remove exercise CSS classes
- [ ] Update dashboard (mental health only)
- [ ] Update exportData() function
- [ ] Update mobile navigation
- [ ] Run all tests (should pass ~130 tests)

### Phase 5: Cross-App Features
- [ ] Create "Export for MedsTrackAI" function
- [ ] Create "Export for GymPulse" function
- [ ] Create "Import from MindTrackAI" in MedsTrackAI
- [ ] Create "Import from MindTrackAI" in GymPulse
- [ ] Test data migration workflow

---

## 🎯 SUCCESS METRICS

**MindTrackAI:**
- File size: ~6,000 lines (from 9,760)
- Tests: ~130 passing
- Features: 4 (Dashboard, Mental Health, Sleep, Journal)
- Bundle size: ~38% reduction

**MedsTrackAI:**
- File size: ~5,000 lines (new)
- Tests: ~240 passing
- Features: 2 (Dashboard, Medications with 8 sub-tabs)
- Focus: Medical compliance, safety

**GymPulse:**
- Additional tests: ~50
- Enhanced exercise tracking features
- Focus: Fitness metrics

---

**Next Step:** Begin Phase 1 - Create MedsTrackAI repo structure
