# KNX Switch Configurator - Development Plan

## Project Overview

**Project Name**: KNX Switch Visual Configurator  
**Type**: Web-based Product Configurator  
**Reference**: https://www.futureknx.com/knx-switches/customize  
**Phase**: Phase 1 (MVP)

---

## Technology Stack Recommendations

### Frontend Framework
- **Recommended**: React.js or Vue.js
  - React: Better ecosystem, larger community
  - Vue: Simpler learning curve, lighter weight
- **Alternative**: Vanilla JavaScript (if minimal dependencies preferred)

### UI/State Management
- **State Management**: Redux (React) or Pinia (Vue) or Context API
- **UI Library**: 
  - Material-UI / MUI (React)
  - Vuetify (Vue)
  - Or custom CSS framework (Tailwind CSS)

### PDF Generation
- **Libraries**:
  - `jsPDF` + `html2canvas` (client-side)
  - `pdfkit` (Node.js server-side)
  - `react-pdf` / `@react-pdf/renderer` (React-specific)
- **Recommendation**: `jsPDF` + `html2canvas` for client-side generation

### Icon Management
- Extract icons from PDF or use provided SVG/PNG files
- Store in `/assets/icons/` directory
- Create icon catalog JSON for easy management

### Build Tools
- **Bundler**: Vite (recommended) or Webpack
- **Package Manager**: npm or yarn

### Hosting/Deployment
- **Options**:
  - Netlify / Vercel (static hosting)
  - GitHub Pages
  - Custom server (if embedding required)

---

## Project Structure

```
knx-configurator/
├── public/
│   ├── icons/              # Icon library (SVG/PNG)
│   ├── images/            # Product images, logos
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ProductSelector.jsx
│   │   ├── ButtonConfigurator.jsx
│   │   ├── IconPicker.jsx
│   │   ├── ColorPicker.jsx
│   │   ├── LivePreview.jsx
│   │   └── PDFExport.jsx
│   ├── data/
│   │   ├── products.json      # Product catalog
│   │   ├── colors.json          # Color list
│   │   ├── icons.json           # Icon catalog
│   │   └── config.js            # App configuration
│   ├── utils/
│   │   ├── pdfGenerator.js      # PDF export logic
│   │   ├── filenameGenerator.js # PDF filename logic
│   │   └── validators.js
│   ├── styles/
│   │   ├── main.css
│   │   └── components.css
│   ├── App.jsx
│   └── main.jsx
├── config/
│   └── deployment.md            # Deployment instructions
├── package.json
├── README.md
└── .gitignore
```

---

## Data Structure Design

### 1. Products Configuration (`data/products.json`)

```json
{
  "productGroups": [
    {
      "id": "dora-switch",
      "name": "Dora Switch",
      "models": [
        { "id": "dora-switch-2", "buttonCount": 2 },
        { "id": "dora-switch-3", "buttonCount": 3 },
        { "id": "dora-switch-4", "buttonCount": 4 },
        { "id": "dora-switch-5", "buttonCount": 5 },
        { "id": "dora-switch-6", "buttonCount": 6 },
        { "id": "dora-switch-7", "buttonCount": 7 },
        { "id": "dora-switch-8", "buttonCount": 8 }
      ]
    },
    {
      "id": "dora-thermostat",
      "name": "Dora Thermostat/Keypad",
      "models": [
        { "id": "dora-thermostat-2", "buttonCount": 2 },
        // ... 3-8 buttons
      ]
    },
    {
      "id": "dora-xl",
      "name": "Dora XL",
      "models": [
        { "id": "dora-xl-3", "buttonCount": 3 },
        // ... 4-12 buttons
      ]
    },
    {
      "id": "pblock",
      "name": "Pblock",
      "models": [
        // Pblock models
      ]
    }
  ]
}
```

### 2. Colors Configuration (`data/colors.json`)

```json
{
  "frameColors": [
    { "id": "white", "name": "White", "hex": "#FFFFFF" },
    { "id": "black", "name": "Black", "hex": "#000000" },
    // ... from FutureKNX reference
  ],
  "buttonColors": [
    { "id": "white", "name": "White", "hex": "#FFFFFF" },
    { "id": "black", "name": "Black", "hex": "#000000" },
    // ... from FutureKNX reference
  ]
}
```

### 3. Icons Configuration (`data/icons.json`)

```json
{
  "icons": [
    {
      "id": "light-on",
      "name": "Light On",
      "path": "/icons/light-on.svg",
      "category": "lighting"
    },
    {
      "id": "light-off",
      "name": "Light Off",
      "path": "/icons/light-off.svg",
      "category": "lighting"
    }
    // ... more icons from library
  ]
}
```

### 4. Application State Structure

```javascript
{
  selectedProductGroup: "dora-switch",
  selectedModel: "dora-switch-4",
  buttonConfigurations: [
    {
      buttonIndex: 0,
      iconId: "light-on",
      colorId: "white"
    },
    // ... for each button
  ],
  frameColor: "white"
}
```

---

## Development Phases

### Phase 1: Project Setup & Foundation (Week 1)

#### Tasks:
1. **Project Initialization**
   - Set up React/Vue project with Vite
   - Configure build tools and dependencies
   - Set up Git repository
   - Create project structure

2. **Data Structure Setup**
   - Create JSON configuration files
   - Extract and catalog icons from PDF
   - Set up color palette from reference
   - Create product catalog structure

3. **Basic UI Framework**
   - Set up routing (if needed)
   - Create base layout components
   - Set up styling system
   - Implement responsive base

#### Deliverables:
- Working project scaffold
- Data structure files
- Icon catalog

---

### Phase 2: Core Configurator (Week 2-3)

#### Tasks:
1. **Product Selection Component**
   - Product group selector
   - Model/button count selector
   - Visual product display

2. **Button Configuration Component**
   - Dynamic button grid rendering
   - Button click/tap handlers
   - Icon assignment interface
   - Color assignment interface

3. **Icon Picker Component**
   - Icon library display
   - Icon search/filter (optional)
   - Icon selection handler

4. **Color Picker Component**
   - Frame color selector
   - Button color selector
   - Color preview

5. **Live Preview Component**
   - Real-time rendering of configuration
   - SVG/Canvas-based preview
   - Update on state changes

#### Deliverables:
- Working product selector
- Functional button configurator
- Icon assignment working
- Color customization working
- Live preview functional

---

### Phase 3: PDF Export (Week 4)

#### Tasks:
1. **PDF Generation Logic**
   - Implement PDF library integration
   - Create PDF template with branding
   - Add product preview image
   - Add company logo and info

2. **Filename Generation**
   - Implement naming convention: `GR{YYYYMMDD}_{increment}`
   - Handle unique suffix generation
   - Store/retrieve last used number

3. **Export Functionality**
   - Export button/action
   - Download trigger
   - Error handling

#### Deliverables:
- PDF export working
- Correct filename format
- Branded PDF output

---

### Phase 4: Integration & Polish (Week 5)

#### Tasks:
1. **Pblock Integration**
   - Add Pblock to product catalog
   - Test Pblock configurations
   - Verify all button counts

2. **UI/UX Refinement**
   - Match reference site behavior
   - Improve visual consistency
   - Add loading states
   - Error handling

3. **Testing**
   - Test all product combinations
   - Test all button counts
   - Test PDF export
   - Cross-browser testing

4. **Documentation**
   - Code comments
   - Configuration guide
   - Deployment instructions
   - User guide (if needed)

#### Deliverables:
- Complete configurator
- All products working
- Documentation complete

---

## Icon Library Processing

### Steps:
1. **Extract Icons from PDF**
   - Use PDF extraction tools or manual extraction
   - Convert to SVG format (preferred) or PNG
   - Organize by category

2. **Create Icon Catalog**
   - Generate `icons.json` with metadata
   - Include icon ID, name, path, category
   - Ensure all icons are accessible

3. **Icon Storage**
   - Store in `/public/icons/` directory
   - Use consistent naming convention
   - Optimize file sizes

---

## PDF Filename Convention

### Proposed Pattern: `GR{YYYYMMDD}_{increment}`

**Example**: `GR20260110_48`

- **Prefix**: `GR` (configurable)
- **Date**: `YYYYMMDD` format (current date)
- **Increment**: Sequential number (stored in localStorage or generated)

### Implementation:
```javascript
function generateFilename() {
  const prefix = 'GR';
  const date = new Date().toISOString().slice(0,10).replace(/-/g, '');
  const increment = getNextIncrement(); // from localStorage or counter
  return `${prefix}${date}_${increment}`;
}
```

---

## Configuration Management

### Adding New Products
1. Edit `data/products.json`
2. Add new product group or model
3. Add corresponding product images (if needed)
4. Redeploy

### Adding New Icons
1. Add icon file to `/public/icons/`
2. Update `data/icons.json`
3. Redeploy

### Adding New Colors
1. Update `data/colors.json`
2. Add color to frameColors or buttonColors array
3. Redeploy

---

## Testing Strategy

### Unit Tests
- Component rendering
- State management
- Utility functions
- PDF generation

### Integration Tests
- Product selection flow
- Configuration flow
- Export flow

### Manual Testing Checklist
- [ ] All product groups selectable
- [ ] All button counts work
- [ ] Icon assignment works for all buttons
- [ ] Color selection works (frame + buttons)
- [ ] Live preview updates correctly
- [ ] PDF exports with correct format
- [ ] PDF filename follows convention
- [ ] Reset/new config works
- [ ] Works on desktop browsers
- [ ] Doesn't break on mobile

---

## Deployment Plan

### Staging Environment
1. Deploy to staging URL
2. Client review and testing
3. Iterate based on feedback

### Production Deployment
1. Final testing on staging
2. Deploy to production domain
3. Embed in main website (if required)
4. Monitor for issues

### Deployment Options
- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **Embedding**: Iframe or direct integration
- **Custom Server**: Node.js server if needed

---

## Risk Mitigation

### Potential Issues:
1. **Icon Library Extraction**
   - Risk: PDF may not extract cleanly
   - Mitigation: Manual extraction or request SVG files

2. **PDF Generation Quality**
   - Risk: Preview quality may not match expectations
   - Mitigation: Use high-quality rendering, test early

3. **Browser Compatibility**
   - Risk: Some features may not work in older browsers
   - Mitigation: Use modern JavaScript, polyfills if needed

4. **Performance with Many Icons**
   - Risk: Large icon library may slow loading
   - Mitigation: Lazy loading, icon optimization

---

## Timeline Estimate

### Total Duration: 5 weeks

- **Week 1**: Setup & Foundation
- **Week 2-3**: Core Configurator
- **Week 4**: PDF Export
- **Week 5**: Integration & Polish

### Milestone Deliverables:
- **Milestone 1** (End of Week 3): Core MVP
- **Milestone 2** (End of Week 4): PDF Export
- **Milestone 3** (End of Week 5): Complete Integration

---

## Next Steps

1. **Client Approval**
   - Review and approve development plan
   - Confirm technology stack
   - Approve timeline

2. **Asset Preparation**
   - Extract icons from PDF
   - Get color palette from reference site
   - Get company logo and branding assets

3. **Reference Site Analysis**
   - Study FutureKNX configurator behavior
   - Document interaction patterns
   - Note visual design elements

4. **Development Start**
   - Initialize project
   - Set up development environment
   - Begin Phase 1 tasks

---

## Questions for Client

1. **Branding Assets**
   - Company logo file (SVG/PNG)
   - Company information/contact details for PDF
   - Brand colors (if different from product colors)

2. **Icon Library**
   - Preferred format (SVG vs PNG)?
   - Icon naming convention?
   - Any specific icons to prioritize?

3. **Deployment**
   - Where will this be hosted?
   - How should it be embedded (iframe, direct)?
   - Domain/subdomain preference?

4. **PDF Details**
   - Exact company information to include
   - PDF template preferences
   - Any specific branding requirements

---

## Success Criteria

✅ All product groups and models configurable  
✅ Icon assignment works for all buttons  
✅ Color customization works (frame + buttons)  
✅ Live preview updates in real-time  
✅ PDF exports with correct branding  
✅ PDF filename follows convention  
✅ Data-driven structure allows easy additions  
✅ Matches reference site interaction patterns  
✅ Works on desktop browsers  
✅ Documentation complete  


