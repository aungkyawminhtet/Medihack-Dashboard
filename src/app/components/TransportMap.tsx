import React, { useState } from "react";
import { TransportEquipment, StaffMember } from "../types/transport";
import { AccessPoint } from "../types/access-point";
import { FloorConfig } from "../types/floor-config";
import {
  Bed,
  Accessibility,
  User,
  Battery,
  Wrench,
  ZoomIn,
  ZoomOut,
  Layers,
  Radio,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

interface TransportMapProps {
  equipment: TransportEquipment[];
  staff: StaffMember[];
  accessPoints?: AccessPoint[];
  selectedFloor: number;
  floorConfig: FloorConfig[];
  onEquipmentClick: (equipment: TransportEquipment) => void;
  onStaffClick: (staff: StaffMember) => void;
  onAccessPointClick?: (ap: AccessPoint) => void;
}

export function TransportMap({
  equipment,
  staff,
  accessPoints,
  selectedFloor,
  floorConfig,
  onEquipmentClick,
  onStaffClick,
  onAccessPointClick,
}: TransportMapProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showAccessPoints, setShowAccessPoints] = useState(true);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
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

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.2, 0.5));
  };

  const getStatusColor = (status: TransportEquipment["status"]) => {
    switch (status) {
      case "available":
        return "#10b981"; // green
      case "in-use":
        return "#3b82f6"; // blue
      case "requested":
        return "#f59e0b"; // orange
      case "maintenance":
        return "#ef4444"; // red
      default:
        return "#6b7280"; // gray
    }
  };

  const getStaffStatusColor = (status: StaffMember["status"]) => {
    switch (status) {
      case "available":
        return "#10b981"; // green
      case "busy":
        return "#f59e0b"; // orange
      case "off-duty":
        return "#6b7280"; // gray
      default:
        return "#6b7280";
    }
  };

  // Filter equipment and staff by selected floor
  const filteredEquipment = equipment.filter(
    (eq) => eq.location.floor === selectedFloor,
  );
  const filteredStaff = staff.filter((s) => s.location.floor === selectedFloor);

  // Get zones for the selected floor
  const currentFloorConfig = floorConfig.find(
    (f) => f.number === selectedFloor,
  );
  const floorZones = currentFloorConfig?.zones.filter((z) => z.bounds) || [];

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200 bg-white">
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(148,163,184,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.35) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(100,116,139,0.18) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="absolute -top-48 -right-48 h-96 w-96 rounded-full bg-sky-100 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-48 -left-48 h-96 w-96 rounded-full bg-indigo-100 blur-3xl pointer-events-none" />
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomIn}
          className="shadow-lg bg-white/90 text-slate-900 border border-slate-200 hover:bg-white"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomOut}
          className="shadow-lg bg-white/90 text-slate-900 border border-slate-200 hover:bg-white"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
      </div>

      {/* Floor Indicator */}
      <div className="absolute top-4 left-4 z-10">
        <Card className="shadow-lg bg-white/90 text-slate-900 backdrop-blur border border-slate-200">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Floor {selectedFloor}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="text-xs text-slate-600">
              {filteredEquipment.length} Equipment • {filteredStaff.length}{" "}
              Staff
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="shadow-lg bg-white/90 text-slate-900 backdrop-blur border border-slate-200">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-xs">Status Legend</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>In Use</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>Requested</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Maintenance</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Access Points Toggle */}
      <div className="absolute bottom-4 right-4 z-10">
        <Card className="shadow-lg bg-white/90 text-slate-900 backdrop-blur border border-slate-200">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-xs">Access Points</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <Switch
                checked={showAccessPoints}
                onCheckedChange={setShowAccessPoints}
              />
              <Label>Show Access Points</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map SVG */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1000 600"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Hospital Zones */}
          {floorZones.map((zone) => {
            if (!zone.bounds) return null;

            return (
              <g key={zone.id}>
                <rect
                  x={zone.bounds.x}
                  y={zone.bounds.y}
                  width={zone.bounds.width}
                  height={zone.bounds.height}
                  fill={zone.color}
                  fillOpacity={0.05}
                  stroke={zone.color}
                  strokeWidth={2}
                  strokeDasharray="6,6"
                  strokeOpacity={0.55}
                  rx={6}
                />
                <text
                  x={zone.bounds.x + zone.bounds.width / 2}
                  y={zone.bounds.y + 18}
                  textAnchor="middle"
                  fill="#1f2937"
                  fontSize="13"
                  fontWeight="600"
                  letterSpacing="0.4"
                >
                  {zone.name}
                </text>
              </g>
            );
          })}

          {/* Access Points and BLE Coverage */}
          {showAccessPoints &&
            accessPoints &&
            accessPoints
              .filter((ap) => ap.location.floor === selectedFloor)
              .map((ap) => (
                <g key={ap.id}>
                  {/* BLE Range Circle */}
                  {ap.status === "online" && (
                    <circle
                      cx={ap.location.x}
                      cy={ap.location.y}
                      r={ap.bleRange}
                      fill="#3b82f6"
                      fillOpacity={0.05}
                      stroke="#3b82f6"
                      strokeWidth={2}
                      strokeDasharray="5,5"
                      strokeOpacity={0.3}
                    />
                  )}

                  {/* AP Marker */}
                  <g
                    transform={`translate(${ap.location.x}, ${ap.location.y})`}
                    onClick={() => onAccessPointClick && onAccessPointClick(ap)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Marker Circle */}
                    <circle
                      cx={0}
                      cy={0}
                      r={12}
                      fill={
                        ap.status === "online"
                          ? "#3b82f6"
                          : ap.status === "maintenance"
                            ? "#f59e0b"
                            : "#6b7280"
                      }
                      stroke="#fff"
                      strokeWidth={2}
                      opacity={0.9}
                    />

                    {/* Radio waves icon */}
                    <g transform="translate(-6, -6)">
                      <circle cx={6} cy={6} r={2} fill="white" />
                      <path
                        d="M 2 4 Q 2 2, 4 2"
                        stroke="white"
                        strokeWidth={1}
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 10 4 Q 10 2, 8 2"
                        stroke="white"
                        strokeWidth={1}
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 2 8 Q 2 10, 4 10"
                        stroke="white"
                        strokeWidth={1}
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 10 8 Q 10 10, 8 10"
                        stroke="white"
                        strokeWidth={1}
                        fill="none"
                        strokeLinecap="round"
                      />
                    </g>

                    {/* Signal animation for online APs */}
                    {ap.status === "online" && (
                      <circle
                        cx={0}
                        cy={0}
                        r={12}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        opacity={0.6}
                      >
                        <animate
                          attributeName="r"
                          from="12"
                          to="20"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          from="0.6"
                          to="0"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}

                    {/* AP Label */}
                    <text
                      y={25}
                      textAnchor="middle"
                      fill="#1f2937"
                      fontSize="9"
                      fontWeight="500"
                    >
                      {ap.name}
                    </text>

                    {/* Client count badge */}
                    {ap.clients > 0 && (
                      <g transform="translate(8, -8)">
                        <circle
                          cx={0}
                          cy={0}
                          r={6}
                          fill="#10b981"
                          stroke="#fff"
                          strokeWidth={1.5}
                        />
                        <text
                          textAnchor="middle"
                          y={2}
                          fontSize="7"
                          fill="white"
                          fontWeight="700"
                        >
                          {ap.clients}
                        </text>
                      </g>
                    )}
                  </g>
                </g>
              ))}

          {/* Equipment Markers */}
          {filteredEquipment.map((eq) => (
            <g
              key={eq.id}
              transform={`translate(${eq.location.x}, ${eq.location.y})`}
              onClick={() => onEquipmentClick(eq)}
              style={{ cursor: "pointer" }}
            >
              {/* Marker Circle */}
              <circle
                cx={0}
                cy={0}
                r={20}
                fill={getStatusColor(eq.status)}
                stroke="#fff"
                strokeWidth={3}
                opacity={0.9}
              />

              {/* Icon */}
              {eq.type === "stretcher" ? (
                <g transform="translate(-8, -8)">
                  <rect x={2} y={6} width={12} height={4} fill="white" />
                  <circle cx={3} cy={12} r={1.5} fill="white" />
                  <circle cx={13} cy={12} r={1.5} fill="white" />
                </g>
              ) : (
                <g transform="translate(-8, -8)">
                  <circle cx={4} cy={4} r={2} fill="white" />
                  <circle cx={12} cy={4} r={2} fill="white" />
                  <rect x={3} y={6} width={10} height={6} fill="white" rx={1} />
                  <circle cx={4} cy={13} r={1.5} fill="white" />
                  <circle cx={12} cy={13} r={1.5} fill="white" />
                </g>
              )}

              {/* Status pulse animation for requested/emergency */}
              {eq.status === "requested" && (
                <circle
                  cx={0}
                  cy={0}
                  r={20}
                  fill="none"
                  stroke={getStatusColor(eq.status)}
                  strokeWidth={2}
                  opacity={0.6}
                >
                  <animate
                    attributeName="r"
                    from="20"
                    to="30"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.6"
                    to="0"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              {/* Equipment Label */}
              <text
                y={35}
                textAnchor="middle"
                fill="#1f2937"
                fontSize="10"
                fontWeight="500"
              >
                {eq.name}
              </text>

              {/* Battery indicator for stretchers */}
              {eq.type === "stretcher" && eq.batteryLevel !== undefined && (
                <g transform="translate(15, -15)">
                  <rect
                    x={0}
                    y={0}
                    width={20}
                    height={10}
                    fill="white"
                    stroke="#374151"
                    strokeWidth={1}
                    rx={2}
                  />
                  <rect
                    x={1}
                    y={1}
                    width={(18 * eq.batteryLevel) / 100}
                    height={8}
                    fill={eq.batteryLevel > 30 ? "#10b981" : "#ef4444"}
                    rx={1}
                  />
                  <text
                    x={10}
                    y={7}
                    textAnchor="middle"
                    fontSize="6"
                    fill="#374151"
                    fontWeight="600"
                  >
                    {eq.batteryLevel}%
                  </text>
                </g>
              )}
            </g>
          ))}

          {/* Staff Markers */}
          {filteredStaff.map((staff) => (
            <g
              key={staff.id}
              transform={`translate(${staff.location.x}, ${staff.location.y})`}
              onClick={() => onStaffClick(staff)}
              style={{ cursor: "pointer" }}
            >
              {/* Marker Circle */}
              <circle
                cx={0}
                cy={0}
                r={15}
                fill={getStaffStatusColor(staff.status)}
                stroke="#fff"
                strokeWidth={2}
                opacity={0.9}
              />

              {/* Staff Icon */}
              <g transform="translate(-6, -6)">
                <circle cx={6} cy={4} r={2.5} fill="white" />
                <path
                  d="M 6 7 L 6 11 M 3 9 L 9 9"
                  stroke="white"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
              </g>

              {/* Workload indicator */}
              {staff.currentWorkload > 0 && (
                <g transform="translate(10, -10)">
                  <circle
                    cx={0}
                    cy={0}
                    r={8}
                    fill="#ef4444"
                    stroke="#fff"
                    strokeWidth={2}
                  />
                  <text
                    textAnchor="middle"
                    y={3}
                    fontSize="8"
                    fill="white"
                    fontWeight="700"
                  >
                    {staff.currentWorkload}
                  </text>
                </g>
              )}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
