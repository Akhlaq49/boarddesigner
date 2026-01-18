# KNX Switch Configurator - Project Analysis

## Document Overview

### Files Analyzed
1. **Scope Web APP.docx** - Project scope and requirements document
2. **mm icon library SON.pdf** - Icon library asset (7 pages, by I-LUXUS)

---

## Project Summary

### Goal
Build a web-based visual configurator (mini web-app) where visitors can:
- Choose a KNX switch product (Dora series + Pblock)
- Customize button layout + icons + colors (buttons and frame)
- See live preview of configured product
- Export configuration as branded PDF
- Start new configuration after export

### Reference Implementation
- **Reference Site**: https://www.futureknx.com/knx-switches/customize
- **Behavior**: Match interaction pattern and product structure of FutureKNX configurator

---

## Product Catalog (Phase 1)

### Product Groups
1. **Dora Switch** (buttons)
2. **Dora Keypad / Thermostat** (same button-count family)
3. **Dora XL**
4. **Pblock** (new series)

### Button Count Models

#### Dora Switch
- 2, 3, 4, 5, 6, 7, 8 buttons

#### Dora Thermostat/Keypad
- 2, 3, 4, 5, 6, 7, 8 buttons

#### Dora XL
- 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 buttons

---

## Feature Requirements

### 1. Color Customization
- **Type**: Fixed color list only (no RGBA picker)
- **Scope**:
  - Frame color selection from fixed list
  - Button colors from fixed list (per button or per area)
  - Color list reference: https://www.futureknx.com/knx-switches/customize
- **Out of Scope**:
  - RGBA / free color picker
  - Advanced gradients/material shaders

### 2. Icon Assignment
- **Type**: Icon library provided (SVG/PNG)
- **Source**: Provided by client (referenced from FutureKNX website)
- **Rules**: 
  - Any icon on any button allowed
  - No restriction rules
  - No "incompatible combinations" blocking

### 3. Live Preview
- Real-time visualization of configured product
- Shows selected icons, colors, and layout
- Quality: Low/medium acceptable (not production-accurate)

### 4. PDF Export
- **Content Required**:
  - Final configured product preview image
  - Selected icons as configured
  - Model name / product identification
  - Company logo
  - Company information/contact
- **Format**: Single-page PDF (default)
- **Filename Pattern**: `GR20260110_48` (prefix + date + incremental/unique suffix)
- **Delivery**: Download-only (no email in Phase 1)

---

## User Experience Flow

### Minimum Expected Flow
1. **Product Selection**
   - Select product series (Dora Switch / Dora Thermostat-Keypad / Dora XL / Pblock)
   - Select model (button count)

2. **Configuration Screen**
   - Live preview visible at all times
   - Edit button layout
   - Click/tap button area → choose icon for that button
   - Apply colors to buttons + frame from fixed lists

3. **Export**
   - User clicks "Export PDF"
   - PDF downloads locally

4. **New Configuration**
   - After export, user can reset or start new config quickly

---

## Technical Requirements

### Access & Authentication
- **Primary User**: Any visitor (public access)
- **Login**: Not required in Phase 1
- **Admin Panel**: Not in Phase 1

### Data Management
- **Saving**: No saving of user designs
- **Archive**: No "open later and edit"
- **Analytics**: No analytics/logging in Phase 1

### Responsive Design
- **Primary**: Desktop-first (browser)
- **Mobile**: Should not completely break, but full mobile optimization not required in Phase 1

### Data-Driven Architecture
The configurator must be built in a data-driven way to easily add:
- New product series
- New models/layouts
- New icons
- New fixed colors
With minimal code rewriting.

---

## Out of Scope (Phase 1)

Explicitly excluded:
- ❌ Admin panel/backoffice
- ❌ Login system
- ❌ Saving designs / reopening/editing later
- ❌ Customer-specific archives
- ❌ Analytics dashboards
- ❌ Email PDF sending
- ❌ Complex rule validation
- ❌ Full mobile-first redesign
- ❌ Quotation/ordering/payment workflow

---

## Deliverables Required

Developer must deliver:
1. Working configurator embedded into domain (or hosted and embedded)
2. All source code + build instructions
3. Clear configuration structure for:
   - Product groups
   - Models/layouts
   - Icons
   - Colors
4. PDF export implementation with correct branding + filename method
5. Basic installation notes (how to deploy/update)

---

## Icon Library Asset

### File Information
- **File**: mm icon library SON.pdf
- **Pages**: 7
- **Author**: I-LUXUS
- **Title**: mm icon library
- **Status**: Icon assets provided, needs extraction/cataloging

---

## Suggested Milestone Plan

### Milestone 1: Core Configurator MVP
- Product selection + layouts + button selection + icon assignment
- Colors (fixed list) + frame color
- Live preview working end-to-end

### Milestone 2: PDF Export
- Branded PDF + download
- Correct filename convention

### Milestone 3: Pblock Integration
- Add Pblock series using same data-driven structure
- (If not already completed in M1)

---

## Integration & Access Rules

- No full production admin access before contract/milestones
- Preferred: Work via staging environment / repo / deployment link
- Use milestone-based delivery (to avoid "half-done" and disputes)


