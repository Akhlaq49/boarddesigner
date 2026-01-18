#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Automated Project Setup Script for KNX Switch Configurator
This script automates the entire project initialization
"""

import os
import json
import shutil
import subprocess
import sys
from pathlib import Path
from datetime import datetime

# Project configuration
PROJECT_NAME = "knx-configurator"
FRAMEWORK = "react"  # Options: "react" or "vue"

def print_step(step_num, message):
    """Print formatted step message"""
    print(f"\n{'='*60}")
    print(f"STEP {step_num}: {message}")
    print(f"{'='*60}\n")

def run_command(command, cwd=None, check=True):
    """Run shell command and handle errors"""
    try:
        result = subprocess.run(
            command,
            shell=True,
            cwd=cwd,
            check=check,
            capture_output=True,
            text=True
        )
        if result.stdout:
            print(result.stdout)
        return result
    except subprocess.CalledProcessError as e:
        print(f"Error: {e.stderr}")
        if check:
            sys.exit(1)
        return e

def create_directory_structure(base_path):
    """Create project directory structure"""
    print_step(1, "Creating Directory Structure")
    
    directories = [
        "public/icons",
        "public/images",
        "src/components",
        "src/data",
        "src/utils",
        "src/styles",
        "src/hooks",
        "config",
        "docs"
    ]
    
    for directory in directories:
        full_path = os.path.join(base_path, directory)
        os.makedirs(full_path, exist_ok=True)
        print(f"[OK] Created: {directory}")

def create_product_config(base_path):
    """Create products.json configuration"""
    print_step(2, "Creating Product Configuration")
    
    products = {
        "productGroups": [
            {
                "id": "dora-switch",
                "name": "Dora Switch",
                "models": [
                    {"id": "dora-switch-2", "buttonCount": 2, "name": "Dora Switch 2 Buttons"},
                    {"id": "dora-switch-3", "buttonCount": 3, "name": "Dora Switch 3 Buttons"},
                    {"id": "dora-switch-4", "buttonCount": 4, "name": "Dora Switch 4 Buttons"},
                    {"id": "dora-switch-5", "buttonCount": 5, "name": "Dora Switch 5 Buttons"},
                    {"id": "dora-switch-6", "buttonCount": 6, "name": "Dora Switch 6 Buttons"},
                    {"id": "dora-switch-7", "buttonCount": 7, "name": "Dora Switch 7 Buttons"},
                    {"id": "dora-switch-8", "buttonCount": 8, "name": "Dora Switch 8 Buttons"}
                ]
            },
            {
                "id": "dora-thermostat",
                "name": "Dora Thermostat/Keypad",
                "models": [
                    {"id": "dora-thermostat-2", "buttonCount": 2, "name": "Dora Thermostat 2 Buttons"},
                    {"id": "dora-thermostat-3", "buttonCount": 3, "name": "Dora Thermostat 3 Buttons"},
                    {"id": "dora-thermostat-4", "buttonCount": 4, "name": "Dora Thermostat 4 Buttons"},
                    {"id": "dora-thermostat-5", "buttonCount": 5, "name": "Dora Thermostat 5 Buttons"},
                    {"id": "dora-thermostat-6", "buttonCount": 6, "name": "Dora Thermostat 6 Buttons"},
                    {"id": "dora-thermostat-7", "buttonCount": 7, "name": "Dora Thermostat 7 Buttons"},
                    {"id": "dora-thermostat-8", "buttonCount": 8, "name": "Dora Thermostat 8 Buttons"}
                ]
            },
            {
                "id": "dora-xl",
                "name": "Dora XL",
                "models": [
                    {"id": "dora-xl-3", "buttonCount": 3, "name": "Dora XL 3 Buttons"},
                    {"id": "dora-xl-4", "buttonCount": 4, "name": "Dora XL 4 Buttons"},
                    {"id": "dora-xl-5", "buttonCount": 5, "name": "Dora XL 5 Buttons"},
                    {"id": "dora-xl-6", "buttonCount": 6, "name": "Dora XL 6 Buttons"},
                    {"id": "dora-xl-7", "buttonCount": 7, "name": "Dora XL 7 Buttons"},
                    {"id": "dora-xl-8", "buttonCount": 8, "name": "Dora XL 8 Buttons"},
                    {"id": "dora-xl-9", "buttonCount": 9, "name": "Dora XL 9 Buttons"},
                    {"id": "dora-xl-10", "buttonCount": 10, "name": "Dora XL 10 Buttons"},
                    {"id": "dora-xl-11", "buttonCount": 11, "name": "Dora XL 11 Buttons"},
                    {"id": "dora-xl-12", "buttonCount": 12, "name": "Dora XL 12 Buttons"}
                ]
            },
            {
                "id": "pblock",
                "name": "Pblock",
                "models": [
                    {"id": "pblock-2", "buttonCount": 2, "name": "Pblock 2 Buttons"},
                    {"id": "pblock-3", "buttonCount": 3, "name": "Pblock 3 Buttons"},
                    {"id": "pblock-4", "buttonCount": 4, "name": "Pblock 4 Buttons"}
                ]
            }
        ]
    }
    
    file_path = os.path.join(base_path, "src/data/products.json")
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2, ensure_ascii=False)
    
    print(f"[OK] Created: src/data/products.json")

def create_colors_config(base_path):
    """Create colors.json configuration"""
    print_step(3, "Creating Colors Configuration")
    
    # Basic color palette (to be updated from FutureKNX reference)
    colors = {
        "frameColors": [
            {"id": "white", "name": "White", "hex": "#FFFFFF", "rgb": [255, 255, 255]},
            {"id": "black", "name": "Black", "hex": "#000000", "rgb": [0, 0, 0]},
            {"id": "gray", "name": "Gray", "hex": "#808080", "rgb": [128, 128, 128]},
            {"id": "silver", "name": "Silver", "hex": "#C0C0C0", "rgb": [192, 192, 192]},
            {"id": "anthracite", "name": "Anthracite", "hex": "#383838", "rgb": [56, 56, 56]},
            {"id": "aluminum", "name": "Aluminum", "hex": "#A8A8A8", "rgb": [168, 168, 168]}
        ],
        "buttonColors": [
            {"id": "white", "name": "White", "hex": "#FFFFFF", "rgb": [255, 255, 255]},
            {"id": "black", "name": "Black", "hex": "#000000", "rgb": [0, 0, 0]},
            {"id": "gray", "name": "Gray", "hex": "#808080", "rgb": [128, 128, 128]},
            {"id": "red", "name": "Red", "hex": "#FF0000", "rgb": [255, 0, 0]},
            {"id": "blue", "name": "Blue", "hex": "#0000FF", "rgb": [0, 0, 255]},
            {"id": "green", "name": "Green", "hex": "#00FF00", "rgb": [0, 255, 0]},
            {"id": "yellow", "name": "Yellow", "hex": "#FFFF00", "rgb": [255, 255, 0]},
            {"id": "orange", "name": "Orange", "hex": "#FFA500", "rgb": [255, 165, 0]}
        ]
    }
    
    file_path = os.path.join(base_path, "src/data/colors.json")
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(colors, f, indent=2, ensure_ascii=False)
    
    print(f"[OK] Created: src/data/colors.json")

def create_icons_config(base_path):
    """Create icons.json configuration"""
    print_step(4, "Creating Icons Configuration")
    
    # Placeholder icons (to be updated after PDF extraction)
    icons = {
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
            },
            {
                "id": "fan",
                "name": "Fan",
                "path": "/icons/fan.svg",
                "category": "climate"
            },
            {
                "id": "heating",
                "name": "Heating",
                "path": "/icons/heating.svg",
                "category": "climate"
            },
            {
                "id": "cooling",
                "name": "Cooling",
                "path": "/icons/cooling.svg",
                "category": "climate"
            },
            {
                "id": "blinds-up",
                "name": "Blinds Up",
                "path": "/icons/blinds-up.svg",
                "category": "window"
            },
            {
                "id": "blinds-down",
                "name": "Blinds Down",
                "path": "/icons/blinds-down.svg",
                "category": "window"
            },
            {
                "id": "scene",
                "name": "Scene",
                "path": "/icons/scene.svg",
                "category": "general"
            }
        ],
        "categories": [
            {"id": "lighting", "name": "Lighting"},
            {"id": "climate", "name": "Climate"},
            {"id": "window", "name": "Window"},
            {"id": "general", "name": "General"}
        ]
    }
    
    file_path = os.path.join(base_path, "src/data/icons.json")
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(icons, f, indent=2, ensure_ascii=False)
    
    print(f"[OK] Created: src/data/icons.json")
    print("[NOTE] Icons need to be extracted from PDF and added to public/icons/")

def extract_icons_from_pdf(pdf_path, output_dir):
    """Attempt to extract icons from PDF"""
    print_step(5, "Extracting Icons from PDF")
    
    try:
        from pdf2image import convert_from_path
        from PIL import Image
        
        print("Converting PDF pages to images...")
        images = convert_from_path(pdf_path, dpi=300)
        
        os.makedirs(output_dir, exist_ok=True)
        
        for i, image in enumerate(images):
            page_path = os.path.join(output_dir, f"page_{i+1}.png")
            image.save(page_path, 'PNG')
            print(f"[OK] Extracted page {i+1} to {page_path}")
        
        print(f"\n[NOTE] Manual icon extraction needed from: {output_dir}")
        print("   Please extract individual icons and save as SVG/PNG in public/icons/")
        return True
        
    except ImportError:
        print("[NOTE] pdf2image not installed. Skipping automatic extraction.")
        print("   Install with: pip install pdf2image")
        print("   Also requires: poppler (https://poppler.freedesktop.org/)")
        return False
    except Exception as e:
        print(f"[NOTE] PDF extraction failed: {e}")
        print("   Manual extraction required")
        return False

def initialize_react_project(base_path):
    """Initialize React project with Vite"""
    print_step(6, "Initializing React Project with Vite")
    
    # Check if node/npm is available
    result = run_command("npm --version", check=False)
    if result.returncode != 0:
        print("[NOTE] npm not found. Please install Node.js first.")
        print("   Download from: https://nodejs.org/")
        return False
    
    # Create Vite React project
    print("Creating Vite React project...")
    run_command(f"npm create vite@latest {PROJECT_NAME} -- --template react", cwd=os.path.dirname(base_path))
    
    project_path = os.path.join(os.path.dirname(base_path), PROJECT_NAME)
    
    # Install dependencies
    print("\nInstalling dependencies...")
    run_command("npm install", cwd=project_path)
    
    # Install additional packages
    print("\nInstalling additional packages...")
    packages = [
        "jspdf",
        "html2canvas",
        "react-redux",
        "@reduxjs/toolkit"
    ]
    
    for package in packages:
        run_command(f"npm install {package}", cwd=project_path)
    
    return project_path

def create_react_components(base_path):
    """Create React component files"""
    print_step(7, "Creating React Components")
    
    components = {
        "ProductSelector.jsx": '''import React from 'react';
import productsData from '../data/products.json';

const ProductSelector = ({ selectedProductGroup, selectedModel, onProductGroupChange, onModelChange }) => {
  const productGroup = productsData.productGroups.find(pg => pg.id === selectedProductGroup);
  
  return (
    <div className="product-selector">
      <h2>Select Product</h2>
      
      <div className="product-groups">
        <label>Product Series:</label>
        <select value={selectedProductGroup} onChange={(e) => onProductGroupChange(e.target.value)}>
          {productsData.productGroups.map(pg => (
            <option key={pg.id} value={pg.id}>{pg.name}</option>
          ))}
        </select>
      </div>
      
      {productGroup && (
        <div className="models">
          <label>Model (Button Count):</label>
          <select value={selectedModel} onChange={(e) => onModelChange(e.target.value)}>
            {productGroup.models.map(model => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.buttonCount} buttons)
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default ProductSelector;
''',
        "ButtonConfigurator.jsx": '''import React from 'react';

const ButtonConfigurator = ({ buttonCount, buttonConfigs, onButtonClick }) => {
  return (
    <div className="button-configurator">
      <h3>Configure Buttons</h3>
      <div className="button-grid">
        {Array.from({ length: buttonCount }, (_, index) => (
          <div
            key={index}
            className="button-item"
            onClick={() => onButtonClick(index)}
          >
            <div className="button-preview">
              {buttonConfigs[index]?.icon && (
                <img src={buttonConfigs[index].icon} alt="Button Icon" />
              )}
            </div>
            <div className="button-info">
              Button {index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ButtonConfigurator;
''',
        "IconPicker.jsx": '''import React, { useState } from 'react';
import iconsData from '../data/icons.json';

const IconPicker = ({ onIconSelect, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const filteredIcons = selectedCategory === 'all'
    ? iconsData.icons
    : iconsData.icons.filter(icon => icon.category === selectedCategory);
  
  return (
    <div className="icon-picker-modal">
      <div className="icon-picker-content">
        <div className="icon-picker-header">
          <h3>Select Icon</h3>
          <button onClick={onClose}>Close</button>
        </div>
        
        <div className="category-filter">
          <label>Category:</label>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="all">All</option>
            {iconsData.categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        
        <div className="icon-grid">
          {filteredIcons.map(icon => (
            <div
              key={icon.id}
              className="icon-item"
              onClick={() => onIconSelect(icon)}
            >
              <img src={icon.path} alt={icon.name} />
              <span>{icon.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IconPicker;
''',
        "ColorPicker.jsx": '''import React from 'react';
import colorsData from '../data/colors.json';

const ColorPicker = ({ type, selectedColor, onColorSelect }) => {
  const colors = type === 'frame' ? colorsData.frameColors : colorsData.buttonColors;
  
  return (
    <div className="color-picker">
      <h3>{type === 'frame' ? 'Frame Color' : 'Button Color'}</h3>
      <div className="color-grid">
        {colors.map(color => (
          <div
            key={color.id}
            className={`color-item ${selectedColor === color.id ? 'selected' : ''}`}
            style={{ backgroundColor: color.hex }}
            onClick={() => onColorSelect(color.id)}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
''',
        "LivePreview.jsx": '''import React from 'react';

const LivePreview = ({ productGroup, model, buttonConfigs, frameColor, buttonColor }) => {
  const buttonCount = model?.buttonCount || 0;
  
  return (
    <div className="live-preview">
      <h3>Live Preview</h3>
      <div className="preview-container">
        <div className="product-frame" style={{ backgroundColor: frameColor }}>
          <div className="button-grid-preview">
            {Array.from({ length: buttonCount }, (_, index) => (
              <div
                key={index}
                className="button-preview-item"
                style={{ backgroundColor: buttonColor }}
              >
                {buttonConfigs[index]?.icon && (
                  <img src={buttonConfigs[index].icon} alt="Button" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="preview-info">
        <p><strong>Product:</strong> {productGroup?.name}</p>
        <p><strong>Model:</strong> {model?.name}</p>
        <p><strong>Buttons:</strong> {buttonCount}</p>
      </div>
    </div>
  );
};

export default LivePreview;
''',
        "PDFExport.jsx": '''import React from 'react';
import { generatePDF } from '../utils/pdfGenerator';

const PDFExport = ({ configuration, onExport }) => {
  const handleExport = async () => {
    try {
      await generatePDF(configuration);
      if (onExport) onExport();
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };
  
  return (
    <div className="pdf-export">
      <button onClick={handleExport} className="export-button">
        Export PDF
      </button>
    </div>
  );
};

export default PDFExport;
'''
    }
    
    components_dir = os.path.join(base_path, "src/components")
    for filename, content in components.items():
        file_path = os.path.join(components_dir, filename)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"[OK] Created: src/components/{filename}")

def create_utils(base_path):
    """Create utility files"""
    print_step(8, "Creating Utility Files")
    
    utils = {
        "pdfGenerator.js": '''import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { generateFilename } from './filenameGenerator';

/**
 * Generate PDF from configuration
 * @param {Object} configuration - Current configuration state
 * @param {HTMLElement} previewElement - DOM element to capture
 */
export async function generatePDF(configuration, previewElement) {
  try {
    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Add company logo (if available)
    // pdf.addImage(logoData, 'PNG', 10, 10, 50, 20);
    
    // Add title
    pdf.setFontSize(18);
    pdf.text('KNX Switch Configuration', 10, 40);
    
    // Add product information
    pdf.setFontSize(12);
    pdf.text(`Product: ${configuration.productGroup?.name || 'N/A'}`, 10, 50);
    pdf.text(`Model: ${configuration.model?.name || 'N/A'}`, 10, 55);
    pdf.text(`Button Count: ${configuration.buttonCount || 0}`, 10, 60);
    
    // Capture preview if element provided
    if (previewElement) {
      const canvas = await html2canvas(previewElement, {
        scale: 2,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 70, 190, 100);
    }
    
    // Add company information
    pdf.setFontSize(10);
    pdf.text('Company Information', 10, 180);
    pdf.text('Contact: [Your Company Contact]', 10, 185);
    pdf.text('Website: [Your Website]', 10, 190);
    
    // Generate filename and save
    const filename = generateFilename();
    pdf.save(filename);
    
    return filename;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
}
''',
        "filenameGenerator.js": '''/**
 * Generate PDF filename following convention: GR{YYYYMMDD}_{increment}
 * @returns {string} Generated filename
 */
export function generateFilename() {
  const prefix = 'GR';
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  
  // Get or create increment counter in localStorage
  const storageKey = 'knx_config_increment';
  let increment = parseInt(localStorage.getItem(storageKey) || '0', 10);
  increment += 1;
  localStorage.setItem(storageKey, increment.toString());
  
  // Format increment with leading zeros (2 digits)
  const formattedIncrement = increment.toString().padStart(2, '0');
  
  return `${prefix}${date}_${formattedIncrement}.pdf`;
}
''',
        "validators.js": '''/**
 * Validation utilities
 */

export function validateProductGroup(productGroupId, productsData) {
  return productsData.productGroups.some(pg => pg.id === productGroupId);
}

export function validateModel(modelId, productGroup) {
  return productGroup?.models.some(m => m.id === modelId);
}

export function validateButtonCount(buttonCount) {
  return Number.isInteger(buttonCount) && buttonCount >= 2 && buttonCount <= 12;
}
'''
    }
    
    utils_dir = os.path.join(base_path, "src/utils")
    for filename, content in utils.items():
        file_path = os.path.join(utils_dir, filename)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"[OK] Created: src/utils/{filename}")

def create_app_file(base_path):
    """Create main App.jsx file"""
    print_step(9, "Creating Main App Component")
    
    app_content = '''import React, { useState } from 'react';
import ProductSelector from './components/ProductSelector';
import ButtonConfigurator from './components/ButtonConfigurator';
import IconPicker from './components/IconPicker';
import ColorPicker from './components/ColorPicker';
import LivePreview from './components/LivePreview';
import PDFExport from './components/PDFExport';
import productsData from './data/products.json';
import colorsData from './data/colors.json';
import './styles/App.css';

function App() {
  const [selectedProductGroup, setSelectedProductGroup] = useState('dora-switch');
  const [selectedModel, setSelectedModel] = useState('dora-switch-4');
  const [buttonConfigs, setButtonConfigs] = useState({});
  const [frameColor, setFrameColor] = useState('#FFFFFF');
  const [buttonColor, setButtonColor] = useState('#FFFFFF');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);
  
  const productGroup = productsData.productGroups.find(pg => pg.id === selectedProductGroup);
  const model = productGroup?.models.find(m => m.id === selectedModel);
  
  const handleProductGroupChange = (groupId) => {
    setSelectedProductGroup(groupId);
    const newGroup = productsData.productGroups.find(pg => pg.id === groupId);
    if (newGroup && newGroup.models.length > 0) {
      setSelectedModel(newGroup.models[0].id);
    }
  };
  
  const handleModelChange = (modelId) => {
    setSelectedModel(modelId);
    // Reset button configs when model changes
    setButtonConfigs({});
  };
  
  const handleButtonClick = (buttonIndex) => {
    setSelectedButtonIndex(buttonIndex);
    setShowIconPicker(true);
  };
  
  const handleIconSelect = (icon) => {
    setButtonConfigs({
      ...buttonConfigs,
      [selectedButtonIndex]: {
        icon: icon.path,
        iconId: icon.id,
        iconName: icon.name
      }
    });
    setShowIconPicker(false);
    setSelectedButtonIndex(null);
  };
  
  const handleFrameColorSelect = (colorId) => {
    const color = colorsData.frameColors.find(c => c.id === colorId);
    if (color) {
      setFrameColor(color.hex);
    }
  };
  
  const handleButtonColorSelect = (colorId) => {
    const color = colorsData.buttonColors.find(c => c.id === colorId);
    if (color) {
      setButtonColor(color.hex);
    }
  };
  
  const handleReset = () => {
    setButtonConfigs({});
    setFrameColor('#FFFFFF');
    setButtonColor('#FFFFFF');
  };
  
  const configuration = {
    productGroup,
    model,
    buttonCount: model?.buttonCount || 0,
    buttonConfigs,
    frameColor,
    buttonColor
  };
  
  return (
    <div className="app">
      <header className="app-header">
        <h1>KNX Switch Configurator</h1>
      </header>
      
      <main className="app-main">
        <div className="configurator-panel">
          <ProductSelector
            selectedProductGroup={selectedProductGroup}
            selectedModel={selectedModel}
            onProductGroupChange={handleProductGroupChange}
            onModelChange={handleModelChange}
          />
          
          <ButtonConfigurator
            buttonCount={model?.buttonCount || 0}
            buttonConfigs={buttonConfigs}
            onButtonClick={handleButtonClick}
          />
          
          <ColorPicker
            type="frame"
            selectedColor={frameColor}
            onColorSelect={handleFrameColorSelect}
          />
          
          <ColorPicker
            type="button"
            selectedColor={buttonColor}
            onColorSelect={handleButtonColorSelect}
          />
          
          <PDFExport
            configuration={configuration}
            onExport={handleReset}
          />
          
          <button onClick={handleReset} className="reset-button">
            Reset Configuration
          </button>
        </div>
        
        <div className="preview-panel">
          <LivePreview
            productGroup={productGroup}
            model={model}
            buttonConfigs={buttonConfigs}
            frameColor={frameColor}
            buttonColor={buttonColor}
          />
        </div>
      </main>
      
      {showIconPicker && (
        <IconPicker
          onIconSelect={handleIconSelect}
          onClose={() => setShowIconPicker(false)}
        />
      )}
    </div>
  );
}

export default App;
'''
    
    file_path = os.path.join(base_path, "src/App.jsx")
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(app_content)
    print(f"[OK] Created: src/App.jsx")

def create_styles(base_path):
    """Create CSS files"""
    print_step(10, "Creating Style Files")
    
    app_css = '''/* App.css */
.app {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.app-header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  text-align: center;
}

.app-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.app-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.configurator-panel {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.preview-panel {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.product-selector {
  margin-bottom: 2rem;
}

.product-selector label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.product-selector select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.button-configurator {
  margin-bottom: 2rem;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
}

.button-item {
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.button-item:hover {
  border-color: #2c3e50;
  transform: translateY(-2px);
}

.button-preview {
  width: 60px;
  height: 60px;
  margin: 0 auto 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.button-preview img {
  max-width: 100%;
  max-height: 100%;
}

.color-picker {
  margin-bottom: 2rem;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
  gap: 0.5rem;
}

.color-item {
  width: 50px;
  height: 50px;
  border: 2px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.color-item:hover {
  transform: scale(1.1);
}

.color-item.selected {
  border-color: #2c3e50;
  border-width: 3px;
}

.live-preview {
  position: sticky;
  top: 2rem;
}

.preview-container {
  background: #f9f9f9;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.product-frame {
  border: 2px solid #333;
  border-radius: 8px;
  padding: 2rem;
  min-height: 300px;
}

.button-grid-preview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 1rem;
}

.button-preview-item {
  aspect-ratio: 1;
  border: 1px solid #333;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
}

.button-preview-item img {
  max-width: 100%;
  max-height: 100%;
}

.export-button,
.reset-button {
  width: 100%;
  padding: 1rem;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.2s;
}

.export-button:hover,
.reset-button:hover {
  background-color: #34495e;
}

.icon-picker-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.icon-picker-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.icon-picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 1rem;
}

.icon-item {
  text-align: center;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-item:hover {
  border-color: #2c3e50;
  background-color: #f0f0f0;
}

.icon-item img {
  width: 40px;
  height: 40px;
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .app-main {
    grid-template-columns: 1fr;
  }
}
'''
    
    file_path = os.path.join(base_path, "src/styles/App.css")
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(app_css)
    print(f"[OK] Created: src/styles/App.css")

def create_package_json_updates(base_path):
    """Update package.json with project info"""
    package_json_path = os.path.join(base_path, "package.json")
    if os.path.exists(package_json_path):
        with open(package_json_path, 'r', encoding='utf-8') as f:
            package_data = json.load(f)
        
        package_data['name'] = PROJECT_NAME
        package_data['description'] = 'KNX Switch Visual Configurator'
        package_data['version'] = '1.0.0'
        
        with open(package_json_path, 'w', encoding='utf-8') as f:
            json.dump(package_data, f, indent=2)
        print(f"[OK] Updated: package.json")

def create_readme(base_path):
    """Create project README"""
    readme_content = r'''# KNX Switch Configurator

A web-based visual configurator for KNX switch products (Dora series + Pblock).

## Features

- Product selection (Dora Switch, Dora Thermostat/Keypad, Dora XL, Pblock)
- Button layout customization
- Icon assignment from icon library
- Color customization (frame and buttons)
- Live preview
- PDF export with branding

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

\`\`\`bash
npm install
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

### Build

\`\`\`bash
npm run build
\`\`\`

## Project Structure

\`\`\`
src/
├── components/     # React components
├── data/          # Configuration files (products, colors, icons)
├── utils/         # Utility functions (PDF generation, etc.)
└── styles/        # CSS files
\`\`\`

## Configuration

Edit configuration files in \`src/data/\`:
- \`products.json\` - Product catalog
- \`colors.json\` - Color palettes
- \`icons.json\` - Icon library

## PDF Export

PDFs are generated with filename format: \`GR{YYYYMMDD}_{increment}.pdf\`

## License

[Your License]
'''
    
    file_path = os.path.join(base_path, "README.md")
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(readme_content)
    print(f"[OK] Created: README.md")

def main():
    """Main setup function"""
    print("\n" + "="*60)
    print("KNX Switch Configurator - Automated Setup")
    print("="*60 + "\n")
    
    # Determine project path
    current_dir = os.getcwd()
    project_path = os.path.join(current_dir, PROJECT_NAME)
    
    # Check if project already exists
    if os.path.exists(project_path):
        response = input(f"Project '{PROJECT_NAME}' already exists. Overwrite? (y/n): ")
        if response.lower() != 'y':
            print("Setup cancelled.")
            return
        shutil.rmtree(project_path)
    
    try:
        # Step 1: Create directory structure
        create_directory_structure(project_path)
        
        # Step 2-4: Create configuration files
        create_product_config(project_path)
        create_colors_config(project_path)
        create_icons_config(project_path)
        
        # Step 5: Try to extract icons from PDF
        pdf_path = os.path.join(current_dir, "mm icon library SON.pdf")
        if os.path.exists(pdf_path):
            extract_icons_from_pdf(pdf_path, os.path.join(project_path, "public/icons/extracted"))
        
        # Step 6: Initialize React project
        react_project_path = initialize_react_project(current_dir)
        
        if react_project_path and os.path.exists(react_project_path):
            # Move our created files to React project
            print("\nMoving configuration files to React project...")
            
            # Copy data files
            src_data_src = os.path.join(project_path, "src/data")
            src_data_dst = os.path.join(react_project_path, "src/data")
            if os.path.exists(src_data_src):
                shutil.copytree(src_data_src, src_data_dst, dirs_exist_ok=True)
            
            # Copy icons if extracted
            icons_src = os.path.join(project_path, "public/icons")
            icons_dst = os.path.join(react_project_path, "public/icons")
            if os.path.exists(icons_src):
                shutil.copytree(icons_src, icons_dst, dirs_exist_ok=True)
            
            # Create components in React project
            create_react_components(react_project_path)
            create_utils(react_project_path)
            create_app_file(react_project_path)
            create_styles(react_project_path)
            create_package_json_updates(react_project_path)
            create_readme(react_project_path)
            
            # Clean up temporary project_path
            if os.path.exists(project_path) and project_path != react_project_path:
                shutil.rmtree(project_path)
            
            project_path = react_project_path
        
        print("\n" + "="*60)
        print("SETUP COMPLETE!")
        print("="*60)
        print(f"\nProject created at: {project_path}")
        print("\nNext steps:")
        print("1. cd " + PROJECT_NAME)
        print("2. npm install (if not already done)")
        print("3. Extract icons from PDF and add to public/icons/")
        print("4. Update src/data/icons.json with actual icon paths")
        print("5. Add company logo to public/images/")
        print("6. Update PDF template with company information")
        print("7. npm run dev")
        print("\n" + "="*60)
        
    except Exception as e:
        print(f"\n[ERROR] Error during setup: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()

