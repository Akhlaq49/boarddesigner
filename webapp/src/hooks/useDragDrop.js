import { useState, useEffect, useCallback } from 'react';

const COLORS = {
  'polar-white': '#ffffff',
  'royal-silver': '#cbd5e1',
  'anthracite-gray': '#475569',
  'meteor-black': '#1e293b',
  'texture-black': '#0f172a',
  'pure-gold': '#fbbf24',
  'antique-copper': '#b45309',
  'antique-bronze': '#78350f',
  'red-cherry': '#dc2626',
  'green-leaf': '#16a34a'
};

const ICON_FILES = [
  'AC-01.svg', 'AC-05.svg', 'AC-10.svg', 'AC-23.svg', 'AC-30.svg',
  'BC-01.svg', 'BC-02.svg', 'BC-04.svg', 'BC-06.svg', 'BC-11.svg', 'BC-14.svg',
  'C-06.svg', 'C-07.svg',
  'CB-8.svg', 'CB-16.svg', 'CB-32.svg', 'CB-44.svg', 'CB-48.svg', 'CB-49.svg',
  'CB-52.svg', 'CB-68.svg', 'CB-70.svg', 'CB-71.svg', 'CB-75.svg', 'CB-87.svg',
  'CB-88.svg', 'CB-90.svg',
  'C&H-03.svg', 'C&H-11.svg',
  'D-02.svg', 'D-03.svg', 'D-10.svg', 'D-15.svg', 'D-19.svg', 'D-27.svg',
  'E&R-01.svg',
  'G&S-10.svg', 'G&S-18.svg',
  'H&HS-08.svg', 'H&HS-15.svg', 'H&HS-19.svg',
  'H&S-03.svg',
  'IU-03.svg', 'IU-04.svg', 'IU-10.svg',
  'KC-01.svg', 'KC-04.svg', 'KC-11.svg', 'KC-12.svg',
  'LL-01.svg', 'LL-03.svg', 'LL-22.svg', 'LL-27.svg', 'LL-32.svg', 'LL-35.svg',
  'LL-42.svg', 'LL-43.svg', 'LL-48.svg', 'LL-59.svg', 'LL-61.svg', 'LL-62.svg',
  'LL-68.svg', 'LL-73.svg', 'LL-78.svg', 'LL-84.svg', 'LL-94.svg', 'LL-99.svg',
  'M&H-02.svg',
  'M&T-02.svg', 'M&T-05.svg', 'M&T-06.svg', 'M&T-20.svg',
  'OB-14.svg', 'OB-21.svg',
  'S&G-02.svg', 'S&G-03.svg', 'S&G-06.svg', 'S&G-08.svg',
  'SCS-01.svg', 'SCS-02.svg', 'SCS-05.svg', 'SCS-06.svg', 'SCS-07.svg',
  'SCS-09.svg', 'SCS-17.svg', 'SCS-19.svg', 'SCS-23.svg'
];

export function useDragDrop() {
  const [gridType, setGridType] = useState('2x4');
  const [selectedButton, setSelectedButton] = useState(null);
  const [dropZones, setDropZones] = useState({});
  const [selectedColor, setSelectedColor] = useState(null);
  const [showIconPopup, setShowIconPopup] = useState(false);
  const [currentIconPosition, setCurrentIconPosition] = useState(null);
  const [showButtonColorPopup, setShowButtonColorPopup] = useState(false);
  const [buttonColorTarget, setButtonColorTarget] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', type: '', show: false });

  const showFeedback = useCallback((message, type = 'info') => {
    setFeedback({ message, type, show: true });
    setTimeout(() => setFeedback({ message: '', type: '', show: false }), 3000);
  }, []);

  const getColorValue = (colorName) => COLORS[colorName] || '#ffffff';

  const getButtonDimensions = (buttonType) => {
    const dimensions = {
      1: { colSpan: 1, rowSpan: 1 },
      2: { colSpan: 2, rowSpan: 1 },
      3: { colSpan: 1, rowSpan: 2 },
      4: { colSpan: 2, rowSpan: 2 }
    };
    return dimensions[buttonType] || { colSpan: 1, rowSpan: 1 };
  };

  const updateDropZone = useCallback((zoneId, data) => {
    setDropZones(prev => ({ ...prev, [zoneId]: data }));
  }, []);

  const clearDropZone = useCallback((zoneId) => {
    setDropZones(prev => {
      const newZones = { ...prev };
      delete newZones[zoneId];
      return newZones;
    });
  }, []);

  const placeButtonInZones = useCallback((zones, buttonData) => {
    zones.forEach(zoneId => {
      updateDropZone(zoneId, buttonData);
    });
  }, [updateDropZone]);

  const applyFrameColor = useCallback((colorName) => {
    const colorValue = getColorValue(colorName);
    showFeedback(`${colorName} applied to frame`, 'success');
    // Color application logic would go here
  }, [showFeedback]);

  const applyFullColor = useCallback((colorName) => {
    const colorValue = getColorValue(colorName);
    showFeedback(`${colorName} applied to all`, 'success');
    // Color application logic would go here
  }, [showFeedback]);

  const applyIconToButton = useCallback((buttonId, position, iconPath) => {
    if (!buttonId) {
      showFeedback('Please select a button first', 'info');
      return;
    }
    const zone = dropZones[buttonId];
    if (zone) {
      updateDropZone(buttonId, {
        ...zone,
        [position]: { type: 'icon', value: iconPath }
      });
      showFeedback('Icon applied', 'success');
    }
  }, [dropZones, updateDropZone, showFeedback]);

  const applyTextToButton = useCallback((buttonId, position, text) => {
    if (!buttonId) {
      showFeedback('Please select a button first', 'info');
      return;
    }
    const zone = dropZones[buttonId];
    if (zone) {
      updateDropZone(buttonId, {
        ...zone,
        [position]: { type: 'text', value: text }
      });
      showFeedback('Text applied', 'success');
    }
  }, [dropZones, updateDropZone, showFeedback]);

  const applyButtonColor = useCallback((buttonId, colorName) => {
    const zone = dropZones[buttonId];
    if (zone) {
      updateDropZone(buttonId, {
        ...zone,
        color: colorName
      });
      showFeedback('Color applied to button', 'success');
    }
  }, [dropZones, updateDropZone, showFeedback]);

  return {
    gridType,
    setGridType,
    selectedButton,
    setSelectedButton,
    dropZones,
    updateDropZone,
    clearDropZone,
    selectedColor,
    setSelectedColor,
    icons: ICON_FILES,
    showIconPopup,
    setShowIconPopup,
    currentIconPosition,
    setCurrentIconPosition,
    showButtonColorPopup,
    setShowButtonColorPopup,
    buttonColorTarget,
    setButtonColorTarget,
    feedback,
    showFeedback,
    applyFrameColor,
    applyFullColor,
    applyIconToButton,
    applyTextToButton,
    applyButtonColor,
    getButtonDimensions,
    placeButtonInZones,
    getColorValue
  };
}

