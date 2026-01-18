import './App.css'

import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { useMemo, useRef, useState, type CSSProperties } from 'react'

type ProductTab = '2-8 Button Switch' | '3-12 Button Switch' | '2-8 Room Controller' | 'Design Your Self'
type PanelTab = 'Texture' | 'Wall Color'
type LeftTab = 'Button Parts' | 'Icon & Text'
type ApplyMode = 'FRAME' | 'BUTTON' | 'ALL'

type LayoutId = 'basic' | 'long' | 'thermostat'

type LayoutDef = {
  id: LayoutId
  name: string
  buttonCount: number // number of buttons in this layout
}

type TextureDef = {
  id: string
  name: string
  css: string
}

type ColorDef = {
  code: string
  name: string
  hex: string
}

type PositionContent = 'empty' | 'icon' | 'text'

type Button = {
  id: string
  frameId: string
  positions: {
    rightTop: PositionContent
    center: PositionContent
    leftBottom: PositionContent
  }
  icon?: 'light' | 'fan' | 'scene' | 'power'
  text?: string
  color?: string
  texture?: string
}

type Frame = {
  id: string
  color?: string
  texture?: string
  buttons: string[] // button IDs
}

function clampByte(n: number) {
  if (Number.isNaN(n)) return 0
  return Math.max(0, Math.min(255, Math.round(n)))
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const v = hex.trim().replace(/^#/, '')
  if (!/^[0-9a-fA-F]{6}$/.test(v)) return null
  const r = parseInt(v.slice(0, 2), 16)
  const g = parseInt(v.slice(2, 4), 16)
  const b = parseInt(v.slice(4, 6), 16)
  return { r, g, b }
}

function rgbToHex(r: number, g: number, b: number) {
  const to2 = (n: number) => clampByte(n).toString(16).padStart(2, '0')
  return `#${to2(r)}${to2(g)}${to2(b)}`
}

function layoutIconSvg(layout: LayoutDef) {
  // Simple grid representation based on button count
  let cols = 2
  let rows = Math.ceil(layout.buttonCount / cols)
  
  if (layout.id === 'long') {
    cols = 3
    rows = 4
  } else if (layout.id === 'thermostat') {
    cols = 2
    rows = 3
  }

  const gap = 6
  const size = 100
  const pad = 12
  const cellW = (size - pad * 2 - gap * (cols - 1)) / cols
  const cellH = (size - pad * 2 - gap * (rows - 1)) / rows

  const rects: Array<{ x: number; y: number; w: number; h: number; key: string }> = []

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c
      if (idx >= layout.buttonCount) break
      const x = pad + c * (cellW + gap)
      const y = pad + r * (cellH + gap)
      rects.push({ x, y, w: cellW, h: cellH, key: `${r}-${c}` })
    }
  }

  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      {rects.map((r) => (
        <rect
          key={r.key}
          x={r.x}
          y={r.y}
          width={r.w}
          height={r.h}
          rx={10}
          fill="#111827"
          opacity="0.72"
        />
      ))}
    </svg>
  )
}

function buildFrames(layout: LayoutDef): Array<{ id: string; key: string }> {
  return Array.from({ length: layout.buttonCount }).map((_, i) => ({
    id: `frame-${i}`,
    key: `frame-${i}`,
  }))
}

function iconGlyph(icon?: 'light' | 'fan' | 'scene' | 'power') {
  switch (icon) {
    case 'light':
      return '💡'
    case 'fan':
      return '🌀'
    case 'scene':
      return '🎬'
    case 'power':
      return '⏻'
    default:
      return null
  }
}

function App() {
  const layouts: LayoutDef[] = useMemo(
    () => [
      { id: 'basic', name: 'Basic', buttonCount: 8 },
      { id: 'long', name: 'Long', buttonCount: 12 },
      { id: 'thermostat', name: 'Thermostat', buttonCount: 6 },
    ],
    [],
  )

  const materialPresets: TextureDef[] = useMemo(
    () => [
      { id: 'polarWhite', name: 'Polar White', css: 'linear-gradient(180deg, #ffffff, #f3f4f6)' },
      {
        id: 'royalSilver',
        name: 'Royal Silver',
        css: 'linear-gradient(90deg, #cbd5e1, #94a3b8, #cbd5e1)',
      },
      { id: 'anthracite', name: 'Anthracite Gray', css: 'linear-gradient(180deg, #6b7280, #374151)' },
      { id: 'meteorBlack', name: 'Meteor Black', css: 'linear-gradient(180deg, #111827, #000000)' },
      { id: 'textureBlack', name: 'Texture Black', css: 'repeating-linear-gradient(90deg, #111827 0 6px, #0b1220 6px 12px)' },
      { id: 'pureGold', name: 'Pure Gold', css: 'linear-gradient(90deg, #b45309, #fbbf24, #b45309)' },
      { id: 'antiqueCopper', name: 'Antique Copper', css: 'linear-gradient(90deg, #7c2d12, #b45309, #7c2d12)' },
      { id: 'antiqueBronze', name: 'Antique Bronze', css: 'linear-gradient(90deg, #6b4f3b, #a67c52, #6b4f3b)' },
      { id: 'redCherry', name: 'Red Cherry', css: 'linear-gradient(90deg, #7f1d1d, #dc2626, #7f1d1d)' },
      { id: 'greenLeaf', name: 'Green Leaf', css: 'linear-gradient(90deg, #14532d, #16a34a, #14532d)' },
    ],
    [],
  )

  const wallColorList: ColorDef[] = useMemo(
    () => [
      { code: 'AC-01', name: 'Pure White', hex: '#FFFFFF' },
      { code: 'AC-02', name: 'Light Gray', hex: '#F5F5F5' },
      { code: 'AC-03', name: 'Warm Gray', hex: '#E5E5E5' },
      { code: 'AC-04', name: 'Medium Gray', hex: '#CCCCCC' },
      { code: 'AC-05', name: 'Dark Gray', hex: '#999999' },
      { code: 'AC-06', name: 'Charcoal', hex: '#666666' },
      { code: 'AC-07', name: 'Deep Black', hex: '#333333' },
      { code: 'AC-08', name: 'Pure Black', hex: '#000000' },
      { code: 'AC-09', name: 'Beige', hex: '#F3F2ED' },
      { code: 'AC-10', name: 'Cream', hex: '#F0ECE1' },
      { code: 'AC-11', name: 'Light Blue', hex: '#C0DAEB' },
      { code: 'AC-12', name: 'Sky Blue', hex: '#AFD9D7' },
      { code: 'AC-13', name: 'Rose', hex: '#E392A1' },
      { code: 'AC-14', name: 'Peach', hex: '#E3C1B5' },
      { code: 'AC-15', name: 'Yellow', hex: '#FFE4A8' },
      { code: 'AC-16', name: 'Light Beige', hex: '#DDE1E3' },
    ],
    [],
  )

  const wallPresets = useMemo(
    () => wallColorList.map((c) => c.hex),
    [wallColorList],
  )

  const [product, setProduct] = useState<ProductTab>('2-8 Button Switch')
  const [focusMode, setFocusMode] = useState(false)
  const [layoutId, setLayoutId] = useState<LayoutId>('basic')
  const [panelTab, setPanelTab] = useState<PanelTab>('Wall Color')
  const [leftTab, setLeftTab] = useState<LeftTab>('Button Parts')
  const [applyMode, setApplyMode] = useState<ApplyMode>('FRAME')

  const [materialId, setMaterialId] = useState(materialPresets[0]!.id)
  const [backgroundMaterialId, setBackgroundMaterialId] = useState(materialPresets[0]!.id)

  const [wallHex, setWallHex] = useState('#f5f5f5')
  const rgb = useMemo(() => hexToRgb(wallHex) ?? { r: 245, g: 245, b: 245 }, [wallHex])

  const [alpha, setAlpha] = useState(0.85)
  const previewRef = useRef<HTMLDivElement | null>(null)
  const [exporting, setExporting] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [selectedColorCode, setSelectedColorCode] = useState<string | null>(null)

  // Frame & Button Management
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null)
  const [selectedButtonId, setSelectedButtonId] = useState<string | null>(null)
  const [frames, setFrames] = useState<Record<string, Frame>>({})
  const [buttons, setButtons] = useState<Record<string, Button>>({})

  const layout = layouts.find((l) => l.id === layoutId) ?? layouts[0]!
  const selectedBackgroundMaterial = materialPresets.find((m) => m.id === backgroundMaterialId) ?? materialPresets[0]!

  const frameList = useMemo(() => buildFrames(layout), [layout])

  // Initialize frames when layout changes
  useMemo(() => {
    setFrames((prev) => {
      const next: Record<string, Frame> = { ...prev }
      frameList.forEach((f) => {
        if (!next[f.id]) {
          next[f.id] = { id: f.id, buttons: [] }
        }
      })
      // Remove frames that no longer exist
      Object.keys(next).forEach((id) => {
        if (!frameList.some((f) => f.id === id)) {
          delete next[id]
        }
      })
      return next
    })
    // Clear selection if frame no longer exists
    setSelectedFrameId((prev) => (prev && frameList.some((f) => f.id === prev) ? prev : frameList[0]?.id ?? null))
  }, [frameList])

  const selectedButton = selectedButtonId ? buttons[selectedButtonId] : null

  // Calculate total buttons across all frames
  const totalButtons = useMemo(() => {
    return Object.values(frames).reduce((sum, frame) => {
      return sum + (frame.buttons?.length ?? 0)
    }, 0)
  }, [frames])

  // Calculate frames with buttons (active frames)
  const activeFrames = useMemo(() => {
    return Object.values(frames).filter((frame) => (frame.buttons?.length ?? 0) > 0).length
  }, [frames])

  // Calculate dynamic board size based on buttons and layout
  const boardSize = useMemo(() => {
    // Base size
    let baseWidth = 520
    let baseHeight = 520
    
    // Calculate grid dimensions
    let cols = 2
    let rows = Math.ceil(layout.buttonCount / cols)
    
    if (layout.id === 'long') {
      cols = 3
      rows = 4
    } else if (layout.id === 'thermostat') {
      cols = 2
      rows = 3
    }

    // Adjust size based on total buttons added
    // Scale factor increases with more buttons, but caps at reasonable size
    const buttonRatio = totalButtons > 0 ? totalButtons / layout.buttonCount : 1
    const scaleFactor = Math.min(1.6, 1 + (buttonRatio - 1) * 0.15) // Max 60% increase
    
    // Also consider active frames - if many frames have buttons, we might need more space
    const frameRatio = activeFrames > 0 ? activeFrames / layout.buttonCount : 1
    const frameScaleFactor = Math.min(1.3, 1 + (frameRatio - 1) * 0.1)
    
    // Combine both factors
    const finalScale = Math.min(1.7, scaleFactor * frameScaleFactor)
    
    // Adjust dimensions based on grid aspect ratio
    const gridAspectRatio = cols / rows
    if (gridAspectRatio > 1) {
      // Wider grid
      baseWidth = baseWidth * finalScale
      baseHeight = baseWidth / gridAspectRatio
    } else {
      // Taller grid
      baseHeight = baseHeight * finalScale
      baseWidth = baseHeight * gridAspectRatio
    }

    // Ensure minimum size and respect viewport limits
    const minSize = 400
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800
    const maxWidth = Math.min(viewportWidth * 0.85, 800)
    const maxHeight = Math.min(viewportHeight * 0.75, 800)

    return {
      width: Math.max(minSize, Math.min(baseWidth, maxWidth)),
      height: Math.max(minSize, Math.min(baseHeight, maxHeight)),
    }
  }, [layout, totalButtons, activeFrames])

  const switchGridStyle = useMemo(() => {
    // Calculate grid based on button count
    let cols = 2
    let rows = Math.ceil(layout.buttonCount / cols)
    
    if (layout.id === 'long') {
      cols = 3
      rows = 4
    } else if (layout.id === 'thermostat') {
      cols = 2
      rows = 3
    }

    return {
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
    } as CSSProperties
  }, [layout])

  const frameStyleForIndex = (_i: number) => {
    // No special grid areas needed for simple layouts
    return undefined
  }

  const addButtonToFrame = (frameId: string) => {
    const buttonId = `btn-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    const newButton: Button = {
      id: buttonId,
      frameId,
      positions: {
        rightTop: 'empty',
        center: 'empty',
        leftBottom: 'empty',
      },
      icon: 'light',
      text: 'TEXT',
    }
    setButtons((prev) => ({ ...prev, [buttonId]: newButton }))
    setFrames((prev) => ({
      ...prev,
      [frameId]: {
        ...prev[frameId],
        buttons: [...(prev[frameId]?.buttons ?? []), buttonId],
      },
    }))
    setSelectedButtonId(buttonId)
    return buttonId
  }

  const updateButton = (buttonId: string, patch: Partial<Button>) => {
    setButtons((prev) => ({ ...prev, [buttonId]: { ...prev[buttonId]!, ...patch } }))
  }

  const updateFrame = (frameId: string, patch: Partial<Frame>) => {
    setFrames((prev) => ({ ...prev, [frameId]: { ...prev[frameId]!, ...patch } }))
  }

  const applyColorOrTexture = (value: string, isTexture: boolean) => {
    if (applyMode === 'FRAME' && selectedFrameId) {
      if (isTexture) {
        updateFrame(selectedFrameId, { texture: value })
      } else {
        updateFrame(selectedFrameId, { color: value })
      }
    } else if (applyMode === 'BUTTON' && selectedButtonId) {
      if (isTexture) {
        updateButton(selectedButtonId, { texture: value })
      } else {
        updateButton(selectedButtonId, { color: value })
      }
    } else if (applyMode === 'ALL' && selectedFrameId) {
      const frame = frames[selectedFrameId]
      if (!frame) return
      if (isTexture) {
        updateFrame(selectedFrameId, { texture: value })
        frame.buttons.forEach((btnId) => {
          updateButton(btnId, { texture: value })
        })
      } else {
        updateFrame(selectedFrameId, { color: value })
        frame.buttons.forEach((btnId) => {
          updateButton(btnId, { color: value })
        })
      }
    }
  }

  const handleDrop = (frameId: string, payloadRaw: string) => {
    try {
      const payload = JSON.parse(payloadRaw) as { kind: 'part' | 'iconText'; value: string }
      if (payload.kind === 'iconText' || payload.kind === 'part') {
        addButtonToFrame(frameId)
      }
    } catch {
      // ignore
    }
  }

  const handleSavePdf = async () => {
    const el = previewRef.current
    if (!el) return
    try {
      setExporting(true)
      const canvas = await html2canvas(el, {
        backgroundColor: null,
        scale: Math.min(2, window.devicePixelRatio || 1),
      })
      const imgData = canvas.toDataURL('image/png')

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()

      const imgW = canvas.width
      const imgH = canvas.height
      const scale = Math.min((pageW - 48) / imgW, (pageH - 48) / imgH)
      const drawW = imgW * scale
      const drawH = imgH * scale
      const x = (pageW - drawW) / 2
      const y = (pageH - drawH) / 2

      pdf.addImage(imgData, 'PNG', x, y, drawW, drawH, undefined, 'FAST')
      pdf.save(`knx-design-${layout.id}.pdf`)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="brand">future</div>
          <button className="homeBtn" type="button" onClick={() => setProduct('2-8 Button Switch')}>
            ← Home Page
          </button>
        </div>

        <nav className="tabs" aria-label="Product tabs">
          {(['2-8 Button Switch', '3-12 Button Switch', '2-8 Room Controller', 'Design Your Self'] as const).map((t) => (
            <button
              key={t}
              type="button"
              className={`${'tab'} ${product === t ? 'tabActive' : ''}`}
              onClick={() => setProduct(t)}
            >
              {t}
            </button>
          ))}
        </nav>

        <div className="actions">
          <label className="toggle">
            <input type="checkbox" checked={focusMode} onChange={(e) => setFocusMode(e.target.checked)} />
            Focus Mode
          </label>
          <button className="primaryBtn" type="button" onClick={handleSavePdf} disabled={exporting}>
            {exporting ? 'Exporting…' : 'Save Design as PDF'}
          </button>
      </div>
      </header>

      <div className="layoutStrip" aria-label="Layout picker">
        {layouts.map((l) => (
          <button
            key={l.id}
            type="button"
            className={`${'layoutBtn'} ${layoutId === l.id ? 'layoutBtnActive' : ''}`}
            onClick={() => setLayoutId(l.id)}
            title={l.name}
            aria-label={l.name}
          >
            {layoutIconSvg(l)}
        </button>
        ))}
      </div>

      <main className={`content ${focusMode ? 'contentFocus' : ''}`}>
        <aside className={`leftPanel ${focusMode ? 'leftPanelHidden' : ''}`} aria-label="Button parts / Icon & Text">
            <div className="subTabs" aria-label="Left panel tabs">
              {(['Button Parts', 'Icon & Text'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`${'subTab'} `}
                  onClick={() => setLeftTab(t)}
                  aria-pressed={leftTab === t}
                  style={leftTab === t ? { borderBottomColor: '#111827' } : undefined}
                >
                  {t}
                </button>
              ))}
            </div>

            {leftTab === 'Button Parts' ? (
              <>
                <div className="palette">
                  {[
                    { id: 'default', title: 'Default', sub: 'Standard segment' },
                    { id: 'tall', title: 'Tall', sub: 'More vertical padding' },
                    { id: 'wide', title: 'Wide', sub: 'More horizontal padding' },
                  ].map((p) => (
                    <div
                      key={p.id}
                      className="paletteItem"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('application/json', JSON.stringify({ kind: 'part', value: p.id }))
                        e.dataTransfer.effectAllowed = 'copy'
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="palettePreview" />
                      <div className="paletteTitle">{p.title}</div>
                      <div className="paletteSub">{p.sub}</div>
                    </div>
                  ))}
                </div>
                <div className="dropHint">ⓘ Drag and drop parts over the device.</div>
              </>
            ) : (
              <>
                <div className="palette">
                  {[
                    { id: 'iconOnly', title: 'Icon', sub: 'Place icon' },
                    { id: 'textOnly', title: 'Text', sub: 'Place text' },
                    { id: 'iconText', title: 'Icon & Text', sub: 'Both' },
                  ].map((p) => (
                    <div
                      key={p.id}
                      className="paletteItem"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('application/json', JSON.stringify({ kind: 'iconText', value: p.id }))
                        e.dataTransfer.effectAllowed = 'copy'
                      }}
                      onClick={() => {
                        if (selectedFrameId) {
                          addButtonToFrame(selectedFrameId)
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="palettePreview" />
                      <div className="paletteTitle">{p.title}</div>
                      <div className="paletteSub">{p.sub}</div>
                    </div>
                  ))}
                </div>
                <div className="dropHint">ⓘ Drag and drop or click to add buttons to selected frame.</div>

                {selectedButton && (
                  <div className="fieldGroup">
                    {(['rightTop', 'center', 'leftBottom'] as const).map((pos) => (
                      <div key={pos} className="field">
                        <div className="label">
                          {pos === 'rightTop' ? 'Right / Top' : pos === 'center' ? 'Center' : 'Left / Bottom'}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {(['empty', 'icon', 'text'] as const).map((content) => (
                            <label key={content} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <input
                                type="radio"
                                name={`${selectedButton.id}-${pos}`}
                                checked={selectedButton.positions[pos] === content}
                                onChange={() =>
                                  updateButton(selectedButton.id, {
                                    positions: { ...selectedButton.positions, [pos]: content },
                                  })
                                }
                              />
                              <span style={{ fontSize: '12px', textTransform: 'capitalize' }}>{content}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="field">
                      <div className="label">Icon</div>
                      <select
                        className="input"
                        value={selectedButton.icon ?? 'light'}
                        onChange={(e) => updateButton(selectedButton.id, { icon: e.target.value as Button['icon'] })}
                      >
                        <option value="light">Light</option>
                        <option value="fan">Fan</option>
                        <option value="scene">Scene</option>
                        <option value="power">Power</option>
                      </select>
                    </div>

                    <div className="field">
                      <div className="label">Text</div>
                      <input
                        className="input"
                        type="text"
                        value={selectedButton.text ?? ''}
                        onChange={(e) => updateButton(selectedButton.id, { text: e.target.value })}
                        placeholder="Enter text"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
        </aside>

        <section className="stage" ref={previewRef}>
          <div className="wallLayer" style={{ background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})` }} />
          <div className="textureLayer" style={{ background: selectedBackgroundMaterial.css }} />

          <div 
            className="switchCard" 
            style={{
              width: `${boardSize.width}px`,
              height: `${boardSize.height}px`,
              aspectRatio: 'unset',
            }}
          >
            <div className="switchSurface">
              <div className="switchGrid" style={switchGridStyle}>
                {frameList.map((frame, idx) => {
                  const frameData = frames[frame.id]
                  const isSelected = selectedFrameId === frame.id
                  const frameButtons = (frameData?.buttons ?? [])
                    .map((btnId) => buttons[btnId])
                    .filter((btn): btn is Button => btn !== undefined)

                  return (
                    <div
                      key={frame.id}
                      className={`frame ${isSelected ? 'frameSelected' : ''}`}
                      style={frameStyleForIndex(idx)}
                      onClick={() => {
                        setSelectedFrameId(frame.id)
                        setSelectedButtonId(null)
                      }}
                      onDragOver={(e) => {
                        e.preventDefault()
                        e.dataTransfer.dropEffect = 'copy'
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        const data = e.dataTransfer.getData('application/json')
                        if (data) {
                          handleDrop(frame.id, data)
                        }
                      }}
                    >
                      {frameData?.texture && (
                        <div
                          className="frameTexture"
                          style={{
                            background: materialPresets.find((m) => m.id === frameData.texture)?.css ?? 'transparent',
                          }}
                        />
                      )}
                      {frameData?.color && (
                        <div className="frameColor" style={{ background: frameData.color }} />
                      )}

                      <div className="frameButtons">
                        {frameButtons.map((btn) => {
                          const isBtnSelected = selectedButtonId === btn.id
                          return (
                            <div
                              key={btn.id}
                              className={`frameButton ${isBtnSelected ? 'frameButtonSelected' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedButtonId(btn.id)
                              }}
                              style={{
                                background: btn.color,
                                backgroundImage: btn.texture
                                  ? materialPresets.find((m) => m.id === btn.texture)?.css
                                  : undefined,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                padding: '8px',
                              }}
                            >
                              {btn.positions.rightTop !== 'empty' && (
                                <div style={{ alignSelf: 'flex-end' }}>
                                  {btn.positions.rightTop === 'icon' ? (
                                    <div className="buttonIcon">{iconGlyph(btn.icon)}</div>
                                  ) : (
                                    <div className="buttonText">{btn.text || 'TEXT'}</div>
                                  )}
                                </div>
                              )}
                              {btn.positions.center !== 'empty' && (
                                <div style={{ alignSelf: 'center' }}>
                                  {btn.positions.center === 'icon' ? (
                                    <div className="buttonIcon">{iconGlyph(btn.icon)}</div>
                                  ) : (
                                    <div className="buttonText">{btn.text || 'TEXT'}</div>
                                  )}
                                </div>
                              )}
                              {btn.positions.leftBottom !== 'empty' && (
                                <div style={{ alignSelf: 'flex-start' }}>
                                  {btn.positions.leftBottom === 'icon' ? (
                                    <div className="buttonIcon">{iconGlyph(btn.icon)}</div>
                                  ) : (
                                    <div className="buttonText">{btn.text || 'TEXT'}</div>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <aside className={`panel ${focusMode ? 'panelHidden' : ''}`} aria-label="Textures / Wall Color">
            <div className="panelHeader">
              <div className="panelTitle">Customize</div>
              <div className="panelTabs">
                {(['Texture', 'Wall Color'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`${'panelTab'} ${panelTab === t ? 'panelTabActive' : ''}`}
                    onClick={() => setPanelTab(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {panelTab === 'Texture' ? (
              <>
                <div className="textureList">
                  {materialPresets.map((tex) => (
                    <div key={tex.id} className="textureItem">
                      <div
                        className={`textureCard ${backgroundMaterialId === tex.id ? 'textureCardActive' : ''}`}
                        onClick={() => {
                          setBackgroundMaterialId(tex.id)
                          setMaterialId(tex.id)
                        }}
                      >
                        <div className="texturePreview" style={{ background: tex.css }} />
                        <div className="textureName">{tex.name}</div>
                      </div>
                      <div className="textureActions">
                        <button
                          type="button"
                          className={`applyModeBtn ${materialId === tex.id && applyMode === 'FRAME' ? 'applyModeBtnActive' : ''}`}
                          onClick={() => {
                            setMaterialId(tex.id)
                            setApplyMode('FRAME')
                            if (selectedFrameId) {
                              applyColorOrTexture(tex.id, true)
                            }
                          }}
                          disabled={!selectedFrameId}
                        >
                          FRAME
                        </button>
                        <button
                          type="button"
                          className={`applyModeBtn ${materialId === tex.id && applyMode === 'ALL' ? 'applyModeBtnActive' : ''}`}
                          onClick={() => {
                            setMaterialId(tex.id)
                            setApplyMode('ALL')
                            if (selectedFrameId) {
                              applyColorOrTexture(tex.id, true)
                            }
                          }}
                          disabled={!selectedFrameId}
                        >
                          ALL
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="applyModeGroup">
                  <div className="label">Apply To</div>
                  <div className="applyModeButtons">
                    <button
                      type="button"
                      className={`applyModeBtn ${applyMode === 'FRAME' ? 'applyModeBtnActive' : ''}`}
                      onClick={() => setApplyMode('FRAME')}
                      disabled={!selectedFrameId}
                    >
                      FRAME
                    </button>
                    <button
                      type="button"
                      className={`applyModeBtn ${applyMode === 'BUTTON' ? 'applyModeBtnActive' : ''}`}
                      onClick={() => setApplyMode('BUTTON')}
                      disabled={!selectedButtonId}
                    >
                      BUTTON
                    </button>
                    <button
                      type="button"
                      className={`applyModeBtn ${applyMode === 'ALL' ? 'applyModeBtnActive' : ''}`}
                      onClick={() => setApplyMode('ALL')}
                      disabled={!selectedFrameId}
                    >
                      ALL
                    </button>
                  </div>
                </div>

                <div className="field">
                  <div className="label">Wall Color</div>
                  <div className="colorPreview" style={{ background: wallHex }} />
                  <button
                    type="button"
                    className="input"
                    style={{ marginTop: '8px', cursor: 'pointer', textAlign: 'left' }}
                    onClick={() => {
                      const currentColor = wallColorList.find((c) => c.hex.toLowerCase() === wallHex.toLowerCase())
                      setSelectedColorCode(currentColor?.code ?? null)
                      setShowColorPicker(true)
                    }}
                  >
                    {wallColorList.find((c) => c.hex.toLowerCase() === wallHex.toLowerCase())?.code ?? 'Select Color'}
                  </button>
                </div>

                <div className="field">
                  <div className="label">Opacity</div>
                  <input
                    className="input"
                    type="number"
                    min={0}
                    max={1}
                    step={0.01}
                    value={alpha}
                    onChange={(e) => setAlpha(Number(e.target.value))}
                  />
                </div>
              </>
            )}
        </aside>
      </main>

      {showColorPicker && (
        <div className="colorPickerModal" onClick={() => setShowColorPicker(false)}>
          <div className="colorPickerContent" onClick={(e) => e.stopPropagation()}>
            <div className="colorPickerHeader">
              <div className="label">Select Wall Color</div>
              <button
                type="button"
                className="colorPickerClose"
                onClick={() => setShowColorPicker(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="colorPickerGrid">
              {wallColorList.map((color) => (
                <div
                  key={color.code}
                  className={`colorPickerItem ${selectedColorCode === color.code ? 'colorPickerItemSelected' : ''}`}
                  onClick={() => setSelectedColorCode(color.code)}
                >
                  <div className="colorPickerSwatch" style={{ background: color.hex }} />
                  <div className="colorPickerCode">{color.code}</div>
                  <div className="colorPickerName">{color.name}</div>
                </div>
              ))}
            </div>
            <div className="colorPickerActions">
              <button
                type="button"
                className="primaryBtn"
                onClick={() => {
                  const selectedColor = wallColorList.find((c) => c.code === selectedColorCode)
                  if (selectedColor) {
                    setWallHex(selectedColor.hex)
                  }
                  setShowColorPicker(false)
                }}
                disabled={!selectedColorCode}
              >
                OK
              </button>
              <button
                type="button"
                className="input"
                onClick={() => setShowColorPicker(false)}
                style={{ marginLeft: '8px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
