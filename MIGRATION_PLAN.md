# Phase 1: MindTrackAI Code Extraction Plan

**Date:** January 24, 2026  
**Status:** Ready for execution  
**Objective:** Split MindTrackAI into 3 focused apps

---

## 🎯 Target Architecture

```
MindTrackAI (Mental Health Focus)
├── Dashboard (mental health metrics only)
├── Mental Health tab
├── Sleep tracking
└── Journal

MedsTrackAI (Medication Management) - NEW REPO
├── Dashboard (medication metrics)
├── Medications tab (full feature set)
└── Prescription management

GymPulse (Fitness Tracking) - EXISTING REPO
├── Dashboard (fitness metrics)
└── Exercise tracking
```

---

## 📊 Current Feature Inventory

### ✅ KEEP in MindTrackAI

#### Navigation (lines 1485-1490)
- **Dashboard tab** - Keep, but remove medication/exercise metrics
- **Mental Health tab** - Keep entire section
- **Sleep tab** - Keep entire section
- **Journal tab** - Keep entire section

#### Core Mental Health Features
- **Mental Health Section** (lines 1640-1675)
  - Mood tracking slider (1-10 scale)
  - Notes field
  - Save mood functionality
  - Mood history display

- **Sleep Section** (lines 2112-2146)
  - Sleep hours input
  - Sleep quality selector
  - Sleep notes
  - Sleep history and stats

- **Journal Section** (lines 2194-2328)
  - Journal entry form
  - Entry history
  - Writing stats

#### Shared Utilities (Keep - Used by all features)
- **Analytics** (lines 2387-2427)
- **ErrorHandler** (lines 2429-2477)
- **InputValidator** (lines 2479-2531)
- **DB helpers** (lines 3407-3410)
- **Service Worker** (docs/service-worker.js)

#### Dashboard Components to Keep
- Mental health chart
- Sleep chart
- Weekly mood trends
- Sleep quality trends

### ❌ REMOVE from MindTrackAI (→ MedsTrackAI)

#### Navigation
- **Medication tab** (line 1487) - Remove entire tab button

#### Medication Section (lines 1676-2111) - ENTIRE SECTION
- Medical disclaimer
- Emergency contacts
- Location selector
- Pill identification tool
- Add medication form
- Medication tabs (8 sub-tabs):
  - Today's Medications
  - Supplements
  - Prescription Details
  - History
  - Effectiveness
  - Side Effects
  - Adherence Insights
  - Interactions

#### Medication-Related Functions
- `addMedication()`
- `saveMedication()`
- `logMedicationTaken()`
- `logMedicationSkipped()`
- `deleteMedication()`
- `switchMedicationTab()`
- `updateMedicationStats()`
- `checkDrugInteractions()`
- `validateDosage()`
- `searchMedication()`
- `identifyPill()`
- `saveContacts()`
- `toggleContactsEdit()`
- `handleCountryChange()`
- `savePrescriptionDetails()`
- `showPregnancySection()`
- `togglePregnancyFields()`
- `trackSideEffect()`
- `deleteSideEffect()`
- `setMedicationReminder()`

#### Medication Data Structures (localStorage)
- `medications` array
- `medicationDefinitions` array
- `medicationLogs` array
- `sideEffects` array
- `medicationReminders` object

#### Dashboard Components to Remove
- Medication adherence chart
- Medication effectiveness chart
- Drug interaction warnings

### ❌ REMOVE from MindTrackAI (→ GymPulse)

#### Navigation
- **Exercise tab** (line 1489) - Remove entire tab button

#### Exercise Section (lines 2147-2193) - ENTIRE SECTION
- Log exercise form
- Exercise type selector
- Duration input
- Intensity selector
- Exercise stats cards
- Exercise history display

#### Exercise-Related Functions
- `saveExercise()`
- `updateExerciseStats()`
- `deleteExercise()`

#### Exercise Data Structure
- `exercises` array

#### Dashboard Components to Remove
- Exercise duration chart
- Weekly exercise stats

---

## 📦 Data Structure Analysis

### Current Export Format (line 2838)
```javascript
{
  profile: { name, exportDate },
  moods: [],              // ✅ KEEP
  medications: [],        // ❌ REMOVE
  medicationDefinitions: [], // ❌ REMOVE
  medicationLogs: [],     // ❌ REMOVE
  sideEffects: [],        // ❌ REMOVE
  sleeps: [],             // ✅ KEEP
  exercises: [],          // ❌ REMOVE
  journalEntries: []      // ✅ KEEP
}
```

### New MindTrackAI Export Format
```javascript
{
  profile: { name, exportDate, appVersion: 'MindTrackAI v2.0' },
  moods: [],
  sleeps: [],
  journalEntries: [],
  analytics: []  // Optional
}
```

### MedsTrackAI Export Format (NEW)
```javascript
{
  profile: { name, exportDate, appVersion: 'MedsTrackAI v1.0' },
  medications: [],
  medicationDefinitions: [],
  medicationLogs: [],
  sideEffects: [],
  prescriptionDetails: [],
  emergencyContacts: {},
  analytics: []
}
```

### GymPulse Import Format
```javascript
{
  profile: { name, exportDate, appVersion: 'GymPulse v1.0' },
  exercises: [],
  analytics: []
}
```

---

## 🧪 Test Files Analysis

### ✅ Tests to KEEP in MindTrackAI
- `mental-health-tracker.test.js`
- `mental-health-insights.test.js`
- `sleep-tracker.test.js`
- `sleep-tracker-cli.test.js`
- `analytics-engine.test.js`
- `analytics-cli.test.js`
- `backup-manager.test.js`
- `export-manager.test.js`
- `data-operations.test.js`
- `chart-utils.test.js`
- `validation-utils.test.js`
- `error-handling.test.js`
- `pwa-onboarding.test.js`
- `daily-dashboard.test.js` (modified)
- `integration.test.js` (modified)

### ❌ Tests to MOVE to MedsTrackAI
- `medication-tracker.test.js`
- `medication-tracker-enhanced.test.js`
- `medication-tracker-enhanced.active.test.js`
- `medication-tracker-regulatory.test.js`
- `medication-enrichment.test.js`
- `medication-interactions.test.js`
- `medication-validator.test.js`
- `enhanced-medication-manager.test.js`
- Parts of `integration.test.js`
- Parts of `daily-dashboard.test.js`
- Parts of `docs/__tests__/critical-features.test.js`

### ❌ Tests to MOVE to GymPulse
- `exercise-tracker.test.js`
- `exercise-tracker-cli.test.js`
- Parts of `integration.test.js`
- Parts of `daily-dashboard.test.js`

---

## 🔧 Shared Utilities Strategy

### Option A: Duplicate Code (RECOMMENDED)
**Pros:**
- Each app is completely independent
- No dependency management
- Easier deployment
- Simple versioning

**Cons:**
- Code duplication (~500 lines)
- Bug fixes need to be applied 3x

### Option B: NPM Package `@mindtrack/common-utils`
**Pros:**
- Single source of truth
- Easier bug fixes

**Cons:**
- Need to maintain NPM package
- Version conflicts possible
- Deployment complexity

**DECISION:** Use Option A (duplicate) for simplicity. Apps are small enough.

---

## 🚀 Migration Steps (In Order)

### Step 1: Data Migration Tool ✅
Create export/import tools for users to migrate data:

1. Add "Export for MedsTrackAI" button in MindTrackAI
2. Add "Export for GymPulse" button in MindTrackAI
3. Create import functionality in MedsTrackAI
4. Create import functionality in GymPulse

### Step 2: Create MedsTrackAI Repo 🆕
```bash
# New repo structure
MedsTrackAI/
├── docs/
│   ├── index.html (medication features only)
│   └── service-worker.js
├── __tests__/
│   ├── medication-tracker.test.js
│   ├── medication-interactions.test.js
│   └── ... (8 test files)
├── package.json
└── README.md
```

### Step 3: Extract Medication Code to MedsTrackAI
**Line Ranges to Copy:**
- Lines 1676-2111: Full medication section HTML
- Medication functions (search for all medication-related functions)
- Medication CSS styles
- Medication test files

### Step 4: Move Exercise Code to GymPulse
**Line Ranges to Copy:**
- Lines 2147-2193: Full exercise section HTML
- Exercise functions
- Exercise CSS styles
- Exercise test files

### Step 5: Clean MindTrackAI
Remove:
- Medication navigation button (line 1487)
- Exercise navigation button (line 1489)
- Medication section HTML (lines 1676-2111)
- Exercise section HTML (lines 2147-2193)
- All medication functions
- All exercise functions
- Medication/exercise from dashboard charts
- Update mobile navigation
- Update data export function

### Step 6: Update Dashboard
Modify dashboard to show only:
- Mental health trends (moods)
- Sleep patterns
- Journal activity
- Overall wellness score (mood + sleep)

### Step 7: Testing Phase
- ✅ Run all MindTrackAI tests (should pass with mental health tests only)
- ✅ Run all MedsTrackAI tests
- ✅ Run all GymPulse tests
- ✅ Test data export/import between apps
- ✅ Test offline functionality (service worker)

### Step 8: Documentation Updates
- Update README files for each app
- Create migration guide for users
- Add cross-app linking documentation

---

## 📝 Function Extraction Map

### Medication Functions (grep search needed)
```
Lines TBD - need to search:
- addMedication()
- saveMedication()
- logMedicationTaken()
- logMedicationSkipped()
- deleteMedication()
- switchMedicationTab()
- updateMedicationStats()
- checkDrugInteractions()
- validateDosage()
- searchMedication()
- identifyPill()
- saveContacts()
- toggleContactsEdit()
- handleCountryChange()
- savePrescriptionDetails()
- showPregnancySection()
- togglePregnancyFields()
- trackSideEffect()
- deleteSideEffect()
- setMedicationReminder()
- updateMedTypePlaceholder()
- handleDosageAmountInput()
- updateDosagePreview()
```

### Exercise Functions (grep search needed)
```
Lines TBD - need to search:
- saveExercise()
- updateExerciseStats()
- deleteExercise()
```

---

## ⚠️ Migration Risks & Mitigation

### Risk 1: Data Loss
**Mitigation:**
- Create backup before any changes
- Add migration guide with screenshots
- Export all data before cleanup

### Risk 2: Broken Cross-References
**Mitigation:**
- Search for all `DB.get('medications')` references
- Search for all `DB.get('exercises')` references
- Update dashboard charts carefully

### Risk 3: Test Failures
**Mitigation:**
- Run tests after each major change
- Keep git history clean (commit per feature removal)
- Create rollback branch

### Risk 4: Service Worker Cache
**Mitigation:**
- Update service worker version number
- Clear old cache on version bump
- Test offline functionality

---

## ✅ Pre-Migration Checklist

- [x] All tests passing (2117/2117)
- [x] No code errors
- [ ] Create git branch: `feature/split-medication-exercise`
- [ ] Run full test suite
- [ ] Export sample data for testing migration
- [ ] Document current localStorage keys
- [ ] Backup production data (if applicable)

---

## 📌 Next Steps

**Ready to proceed to:**
1. Create detailed function extraction map (grep all medication/exercise functions)
2. Set up MedsTrackAI repo structure
3. Create data migration export tools
4. Begin extraction process

**Awaiting user confirmation to proceed with Step 1**

---

## 🎯 Success Criteria

- ✅ MindTrackAI: Only mental health, sleep, journal features
- ✅ MedsTrackAI: Complete medication management system
- ✅ GymPulse: Exercise tracking features
- ✅ All apps: 100% test pass rate
- ✅ Data export/import works between apps
- ✅ Service workers functional in all apps
- ✅ No code duplication except utilities
- ✅ Documentation complete for all apps

---

**Phase 1 Complete - Ready for Phase 2 (Extraction)**
