# KNX Switch Configurator - Project Documentation

## 📋 Overview

This repository contains the analysis and development plan for a **KNX Switch Visual Configurator** web application. The project allows visitors to customize KNX switch products (Dora series + Pblock) by selecting button layouts, icons, and colors, with live preview and PDF export functionality.

## 📁 Documents

### 1. **PROJECT_ANALYSIS.md**
Complete analysis of the project scope, requirements, and extracted data from:
- `Scope Web APP.docx` - Project requirements document
- `mm icon library SON.pdf` - Icon library asset (7 pages)

### 2. **DEVELOPMENT_PLAN.md**
Comprehensive development plan including:
- Technology stack recommendations
- Project structure
- Data structure design
- Development phases (5-week timeline)
- Testing strategy
- Deployment plan

### 3. **extracted_scope.txt**
Raw extracted text from the scope document (for reference)

## 🎯 Project Goal

Build a web-based visual configurator where visitors can:
- Choose KNX switch products (Dora series + Pblock)
- Customize button layout, icons, and colors
- See live preview of configured product
- Export configuration as branded PDF
- Start new configuration after export

## 🔗 Reference

- **Reference Site**: https://www.futureknx.com/knx-switches/customize
- **Behavior**: Match interaction pattern and product structure of FutureKNX configurator

## 📦 Products Included (Phase 1)

### Product Groups
- Dora Switch (2-8 buttons)
- Dora Thermostat/Keypad (2-8 buttons)
- Dora XL (3-12 buttons)
- Pblock (new series)

## 🚀 Quick Start

1. Review `PROJECT_ANALYSIS.md` for complete requirements
2. Review `DEVELOPMENT_PLAN.md` for implementation details
3. Extract icons from `mm icon library SON.pdf`
4. Set up development environment
5. Begin Phase 1 development

## 📊 Development Timeline

- **Week 1**: Setup & Foundation
- **Week 2-3**: Core Configurator
- **Week 4**: PDF Export
- **Week 5**: Integration & Polish

## ✅ Milestones

1. **Milestone 1**: Core Configurator MVP
2. **Milestone 2**: PDF Export
3. **Milestone 3**: Pblock Integration

## 📝 Notes

- No admin panel in Phase 1
- No login system in Phase 1
- No saving of user designs
- Data-driven architecture for easy expansion
- Desktop-first design (mobile not fully optimized in Phase 1)

## 🔧 Technology Recommendations

- **Frontend**: React.js or Vue.js
- **PDF Generation**: jsPDF + html2canvas
- **Build Tool**: Vite
- **Hosting**: Netlify/Vercel (static hosting)

---

For detailed information, please refer to:
- `PROJECT_ANALYSIS.md` - Complete project analysis
- `DEVELOPMENT_PLAN.md` - Detailed development plan


