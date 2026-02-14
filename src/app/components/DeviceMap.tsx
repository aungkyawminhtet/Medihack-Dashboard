import { Device } from '../types/device';
import { Smartphone, Tablet, Laptop, Radio } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface DeviceMapProps {
  devices: Device[];
  selectedDevice: Device | null;
  onDeviceClick: (device: Device) => void;
}

// Convert lat/lng to pixel coordinates
function latLngToPixel(lat: number, lng: number, bounds: any, width: number, height: number) {
  const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * width;
  const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * height;
  return { x, y };
}

function getDeviceIcon(type: Device['type'], size: number = 16) {
  const className = `w-${size/4} h-${size/4}`;
  switch (type) {
    case 'mobile':
      return <Smartphone className={className} />;
    case 'tablet':
      return <Tablet className={className} />;
    case 'laptop':
      return <Laptop className={className} />;
    case 'iot':
      return <Radio className={className} />;
  }
}

function getStatusColor(status: Device['status']) {
  switch (status) {
    case 'online':
      return '#22c55e';
    case 'warning':
      return '#f59e0b';
    case 'offline':
      return '#ef4444';
  }
}

export function DeviceMap({ devices, selectedDevice, onDeviceClick }: DeviceMapProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredDevice, setHoveredDevice] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Map bounds (NYC area)
  const bounds = {
    north: 40.77,
    south: 40.74,
    east: -73.97,
    west: -74.01,
  };

  const width = 800;
  const height = 600;

  // Center map on selected device
  useEffect(() => {
    if (selectedDevice && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      const devicePos = latLngToPixel(
        selectedDevice.location.lat,
        selectedDevice.location.lng,
        bounds,
        width,
        height
      );
      setPan({
        x: containerWidth / 2 - devicePos.x * zoom,
        y: containerHeight / 2 - devicePos.y * zoom,
      });
    }
  }, [selectedDevice]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev * delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative overflow-hidden bg-gray-100"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Map background with grid */}
      <svg
        width="100%"
        height="100%"
        className="absolute inset-0"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {/* Grid pattern */}
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width={width} height={height} fill="#f3f4f6" />
        <rect width={width} height={height} fill="url(#grid)" />
        
        {/* Streets (decorative) */}
        <g opacity="0.3">
          <line x1="0" y1={height * 0.3} x2={width} y2={height * 0.3} stroke="#9ca3af" strokeWidth="3" />
          <line x1="0" y1={height * 0.6} x2={width} y2={height * 0.6} stroke="#9ca3af" strokeWidth="3" />
          <line x1={width * 0.3} y1="0" x2={width * 0.3} y2={height} stroke="#9ca3af" strokeWidth="3" />
          <line x1={width * 0.7} y1="0" x2={width * 0.7} y2={height} stroke="#9ca3af" strokeWidth="3" />
        </g>

        {/* Connection lines between nearby devices */}
        {devices.map((device, i) => {
          const pos1 = latLngToPixel(device.location.lat, device.location.lng, bounds, width, height);
          return devices.slice(i + 1).map(otherDevice => {
            const pos2 = latLngToPixel(otherDevice.location.lat, otherDevice.location.lng, bounds, width, height);
            const distance = Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
            if (distance < 150) {
              return (
                <line
                  key={`${device.id}-${otherDevice.id}`}
                  x1={pos1.x}
                  y1={pos1.y}
                  x2={pos2.x}
                  y2={pos2.y}
                  stroke="#cbd5e1"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                  opacity="0.3"
                />
              );
            }
            return null;
          });
        })}

        {/* Device markers */}
        {devices.map(device => {
          const pos = latLngToPixel(device.location.lat, device.location.lng, bounds, width, height);
          const isSelected = selectedDevice?.id === device.id;
          const isHovered = hoveredDevice === device.id;
          const color = getStatusColor(device.status);

          return (
            <g key={device.id}>
              {/* Pulse animation for moving devices */}
              {device.speed && device.speed > 0 && device.status === 'online' && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="20"
                  fill={color}
                  opacity="0.3"
                  className="animate-ping"
                />
              )}
              
              {/* Selection ring */}
              {isSelected && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="25"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  className="animate-pulse"
                />
              )}

              {/* Device marker */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isHovered || isSelected ? "18" : "15"}
                fill={color}
                stroke="white"
                strokeWidth="3"
                style={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                }}
                onMouseEnter={() => setHoveredDevice(device.id)}
                onMouseLeave={() => setHoveredDevice(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeviceClick(device);
                }}
              />

              {/* Inner dot */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="6"
                fill="white"
                style={{ pointerEvents: 'none' }}
              />

              {/* Device label */}
              {(isHovered || isSelected) && (
                <g>
                  <rect
                    x={pos.x - 60}
                    y={pos.y - 50}
                    width="120"
                    height="30"
                    fill="white"
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    rx="4"
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                  />
                  <text
                    x={pos.x}
                    y={pos.y - 32}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="600"
                    fill="#1f2937"
                  >
                    {device.name}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setZoom(prev => Math.min(3, prev * 1.2))}
          className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          title="Zoom In"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          onClick={() => setZoom(prev => Math.max(0.5, prev / 1.2))}
          className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          title="Zoom Out"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          onClick={() => {
            setZoom(1);
            setPan({ x: 0, y: 0 });
          }}
          className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          title="Reset View"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md">
        <div className="text-sm font-semibold mb-2">Device Status</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Offline</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-md text-xs text-gray-600">
        <div>🖱️ Drag to pan • Scroll to zoom • Click markers for details</div>
      </div>
    </div>
  );
}
