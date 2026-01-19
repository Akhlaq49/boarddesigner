import React, { useMemo } from 'react';

const GRID_CONFIGS = {
  '2x4': { columns: 2, rows: 4, visibleZones: 8 },
  '1x8': { columns: 1, rows: 8, visibleZones: 8 },
  '2x6': { columns: 2, rows: 6, visibleZones: 12 }
};

function Frame({
  gridType,
  setGridType,
  dropZones,
  selectedButton,
  setSelectedButton,
  updateDropZone,
  clearDropZone,
  getButtonDimensions,
  placeButtonInZones,
  showFeedback
}) {
  const config = GRID_CONFIGS[gridType] || GRID_CONFIGS['2x4'];

  const allZones = useMemo(() => {
    const zones = [];
    for (let row = 1; row <= 8; row++) {
      for (let col = 1; col <= 2; col++) {
        const zoneId = `button${(row - 1) * 2 + col}`;
        zones.push({
          id: zoneId,
          row,
          col,
          visible: row <= config.rows && col <= config.columns
        });
      }
    }
    return zones;
  }, [config]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, zoneId) => {
    e.preventDefault();
    const buttonType = parseInt(e.dataTransfer.getData('buttonType'));
    if (!buttonType) return;

    const dimensions = getButtonDimensions(buttonType);
    const zone = allZones.find(z => z.id === zoneId);
    
    // Check if button fits
    if (zone.col + dimensions.colSpan - 1 > config.columns || 
        zone.row + dimensions.rowSpan - 1 > config.rows) {
      showFeedback('Button does not fit in this location', 'error');
      return;
    }

    // Collect zones to merge
    const zonesToMerge = [];
    for (let r = zone.row; r < zone.row + dimensions.rowSpan; r++) {
      for (let c = zone.col; c < zone.col + dimensions.colSpan; c++) {
        const z = allZones.find(z => z.row === r && z.col === c);
        if (z && z.visible) {
          zonesToMerge.push(z.id);
        }
      }
    }

    // Check if zones are available
    const occupied = zonesToMerge.some(zId => dropZones[zId]);
    if (occupied) {
      showFeedback('Location is already occupied', 'error');
      return;
    }

    // Place button
    const buttonData = {
      type: buttonType,
      dimensions,
      zones: zonesToMerge
    };
    placeButtonInZones(zonesToMerge, buttonData);
    showFeedback('Button placed successfully', 'success');
  };

  const handleZoneClick = (zoneId) => {
    if (dropZones[zoneId]) {
      setSelectedButton(zoneId);
    }
  };

  const handleRemove = (e, zoneId) => {
    e.stopPropagation();
    const zone = dropZones[zoneId];
    if (zone && zone.zones) {
      zone.zones.forEach(z => clearDropZone(z));
    } else {
      clearDropZone(zoneId);
    }
    showFeedback('Button removed', 'success');
  };

  const handleColorClick = (e, zoneId) => {
    e.stopPropagation();
    // This would open the button color popup
    // For now, just show feedback
    showFeedback('Button color selection', 'info');
  };

  const renderZoneContent = (zoneId) => {
    const zone = dropZones[zoneId];
    if (!zone) return null;

    return (
      <div className="dropped-button">
        <div className="button-content">
          <span className="s0">
            {zone.s0?.type === 'icon' && <img src={`/ican/images/${zone.s0.value}`} alt="icon" style={{ width: '24px', height: '24px' }} />}
            {zone.s0?.type === 'text' && <span>{zone.s0.value}</span>}
          </span>
          <span className="s1">
            {zone.s1?.type === 'icon' && <img src={`/ican/images/${zone.s1.value}`} alt="icon" style={{ width: '32px', height: '32px' }} />}
            {zone.s1?.type === 'text' && <span>{zone.s1.value}</span>}
          </span>
          <span className="s2">
            {zone.s2?.type === 'icon' && <img src={`/ican/images/${zone.s2.value}`} alt="icon" style={{ width: '24px', height: '24px' }} />}
            {zone.s2?.type === 'text' && <span>{zone.s2.value}</span>}
          </span>
        </div>
        <button
          className="remove-button"
          onClick={(e) => handleRemove(e, zoneId)}
          title="Remove"
        >
          ×
        </button>
        <button
          className="button-color-btn"
          onClick={(e) => handleColorClick(e, zoneId)}
          title="Change Color"
        >
          🎨
        </button>
      </div>
    );
  };

  return (
    <div className="w-100 d-flex flex-column align-items-center">
      {/* Grid Type Selector */}
      <div className="grid-type-selector d-flex flex-row align-items-center justify-content-center gap-4 mb-4">
        {['2x4', '1x8', '2x6'].map(type => (
          <button
            key={type}
            type="button"
            className={`grid-type-btn ${gridType === type ? 'active' : ''}`}
            onClick={() => setGridType(type)}
            title={`${type === '2x4' ? '2 Columns × 4 Rows' : type === '1x8' ? '1 Column × 8 Rows' : '2 Columns × 6 Rows'}`}
          >
            {/* SVG icons would go here - simplified for now */}
            <span>{type}</span>
          </button>
        ))}
      </div>

      {/* Device Layout - Drop Zone */}
      <div
        id="key"
        className={`layout polar-white custom basic layout-${gridType}`}
        data-place="frame"
        data-grid-type={gridType}
      >
        {allZones.map(zone => (
          <div
            key={zone.id}
            data-place={zone.id}
            data-grid-row={zone.row}
            data-grid-col={zone.col}
            className={`polar-white part-${zone.id.replace('button', '')} drop-zone ${!zone.visible ? 'hidden' : ''} ${dropZones[zone.id] ? 'has-content' : ''} ${selectedButton === zone.id ? 'selected' : ''}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, zone.id)}
            onClick={() => handleZoneClick(zone.id)}
          >
            {!dropZones[zone.id] && (
              <>
                <span className="s0"></span>
                <span className="s1"></span>
                <span className="s2"></span>
              </>
            )}
            {renderZoneContent(zone.id)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Frame;

