# Patient Transport Logistics System - Quick Start Guide

## System Overview

The Patient Transport Logistics System is a real-time management platform for tracking and coordinating stretchers, wheelchairs, and transport staff across a hospital facility.

## Main Interface Components

### 1. Header (Top Bar)
- **System Title**: "Patient Transport Logistics"
- **Real-time Statistics**:
  - Available Equipment (Green)
  - Pending Requests (Orange)
  - Active Staff (Blue)
- **Action Buttons**:
  - Bell icon: View notifications
  - Settings icon: System configuration
  - "New Request" button: Create transport request

### 2. Left Panel - Request & Staff Management
Two tabs:

#### Requests Tab
- **Queue Display**: All transport requests sorted by priority
- **Request Cards Show**:
  - Priority badge (EMERGENCY/URGENT/ROUTINE)
  - Status (Pending/Assigned/In-Progress/Completed)
  - Patient information (Name, ID, Room)
  - Origin and destination zones
  - Requested by (staff member)
  - Time requested
  - Equipment type needed (Stretcher/Wheelchair)
  - Special notes or alerts
- **Actions**:
  - Click to select request
  - "Assign" button: Auto-assigns to best available staff
  - "Cancel" button: Cancel request

#### Staff Tab
- **Staff Cards Show**:
  - Name and role
  - Status (Available/Busy/Off-Duty)
  - Current location (Floor & Zone)
  - Workload progress bar
  - Completed requests today
  - Active request count
- **Alerts**: High workload warnings

### 3. Center Panel - Interactive Map
- **Floor Selector**: Switch between Floor 1, 2, and 3
- **Zone Visualization**: Color-coded hospital zones
  - Emergency (Red)
  - Surgery (Purple)
  - ICU (Orange)
  - Radiology (Cyan)
  - Outpatient (Blue)
  - Cardiology (Pink)
- **Equipment Markers**:
  - Circle markers with icons
  - Color indicates status:
    - Green: Available
    - Blue: In Use
    - Orange: Requested
    - Red: Maintenance
  - Stretcher icon: Bed symbol
  - Wheelchair icon: Wheelchair symbol
  - Battery indicator on stretchers
- **Staff Markers**:
  - Smaller circles with person icon
  - Color indicates status
  - Workload badge shows active requests
- **Map Controls**:
  - Zoom In/Out buttons (top right)
  - Pan: Click and drag map
  - Legend (bottom left)
- **Interactions**:
  - Click any marker to view details in right panel

### 4. Right Panel - Details
Shows detailed information when you click on:

#### Equipment Details
- Equipment name and type
- Current status
- Battery level (stretchers only)
- Current location (zone, floor, coordinates)
- Last maintenance date
- Assigned staff (if in use)
- Active request (if in use)
- Action buttons

#### Staff Details
- Name and role
- Current status
- Workload (with progress bar)
- Current location
- Today's performance (completed vs active)
- Assigned equipment list
- Action buttons

#### Default State
- Shows placeholder when nothing selected
- Instructions to click map markers

## How to Use

### Creating a New Request
1. Click "New Request" button in header
2. (In future update: Fill form with patient info, origin, destination, equipment type)
3. Request appears in queue with priority

### Assigning a Request
**Automatic Assignment** (Recommended):
1. Find pending request in queue
2. Click "Assign" button
3. System automatically:
   - Finds available staff with lowest workload
   - Finds available equipment of requested type
   - Assigns both to request
   - Updates all statuses
   - Shows success notification

**Manual Selection**:
1. Click request card to view details
2. Click staff member to view their status
3. (Future: Drag-and-drop assignment)

### Monitoring Equipment
1. Select desired floor using floor selector
2. View all equipment on that floor
3. Click equipment marker to see:
   - Real-time location
   - Battery status (if applicable)
   - Who is using it
   - Maintenance history
4. Color coding shows availability at a glance

### Monitoring Staff
1. Switch to "Staff" tab in left panel
2. View workload distribution
3. Identify:
   - Available staff (green)
   - Overloaded staff (high workload bar with warning)
4. Click staff card or map marker for details

### Using the Map
1. **Change Floor**: Click Floor 1/2/3 buttons
2. **Zoom**: Use +/- buttons or mouse wheel
3. **Pan**: Click and drag the map
4. **Identify Zones**: Colored zones with labels
5. **Quick Status**: Marker colors show status
6. **Details**: Click any marker for full info

### Reading the Dashboard
Key metrics in header show:
- **Available Equipment**: Green = good, low number = shortage
- **Pending Requests**: Orange = needs attention, high number = backlog
- **Active Staff**: Blue = currently working staff

### Priority System
- **EMERGENCY** (Red): Immediate response required
  - Appears at top of queue
  - Animated pulse on map
  - Highest priority for assignment
- **URGENT** (Orange): Quick response needed
  - Second in queue
  - Should be assigned within minutes
- **ROUTINE** (Blue): Standard transport
  - Normal scheduling
  - Can wait if emergency/urgent pending

### Equipment Status Colors
- **Green (Available)**: Ready to assign
- **Blue (In-Use)**: Currently transporting patient
- **Orange (Requested)**: Assigned but not yet picked up
- **Red (Maintenance)**: Out of service, needs repair

### Staff Status Colors
- **Green (Available)**: Ready for assignment
- **Orange (Busy)**: Currently handling requests
- **Gray (Off-Duty)**: Not available

## Common Scenarios

### Scenario 1: Emergency Transport
1. New emergency request appears (RED badge)
2. Appears at top of queue
3. Click "Assign" immediately
4. System prioritizes available staff
5. Equipment and staff move to origin location
6. Status updates to "In-Progress"
7. Track on map in real-time

### Scenario 2: Workload Balancing
1. Check Staff tab
2. Notice one staff member has high workload (warning)
3. When new request arrives, system automatically assigns to staff with lower workload
4. View balanced distribution across team

### Scenario 3: Equipment Shortage
1. Notice "Available Equipment" count is low
2. Check map for equipment locations
3. See several pieces in low-demand zones
4. (Future: Placement suggestions will recommend redistribution)

### Scenario 4: Tracking Specific Equipment
1. Select appropriate floor
2. Find equipment on map by name/type
3. Click marker to see:
   - Current status
   - If in use: Who has it and for which request
   - Battery level
4. Watch real-time movement on map

## Tips & Best Practices

1. **Keep Queue Clear**: Regularly assign pending requests
2. **Monitor Workload**: Watch for staff overload warnings
3. **Check Battery Levels**: Low battery stretchers need charging
4. **Plan Ahead**: Use floor selector to see equipment distribution
5. **Emergency First**: Always prioritize red-coded requests
6. **Use Details Panel**: Click markers for full context before decisions
7. **Watch Zones**: High-traffic zones may need more equipment

## Keyboard Shortcuts (Future)
- `N`: New request
- `1/2/3`: Switch floors
- `R`: Refresh data
- `Esc`: Close detail panel
- `Space`: Fit map to view

## Troubleshooting

### Equipment Not Moving
- Check if equipment is in "Available" status
- Ensure request has been assigned (not just pending)
- Verify staff member has picked up equipment

### Can't Assign Request
- Check if available staff exists
- Verify equipment type is available
- Review error message in toast notification

### Map Markers Overlapping
- Zoom in using + button
- Pan to specific zone
- Click directly on marker labels

### High Response Time
- Check staff workload in Staff tab
- Look for equipment bottlenecks in specific zones
- Consider rebalancing equipment placement

## Data Update Frequency
- **Equipment Location**: Updates every 3 seconds
- **Staff Location**: Updates every 3 seconds
- **Request Status**: Updates in real-time
- **Workload Metrics**: Updates after each assignment

## Integration with Aruba APs
The system receives real-time location data from:
- **BLE 5.0 beacons** on equipment
- **Zigbee tags** for low-power tracking
- **Wi-Fi triangulation** for staff devices
- **Aruba Central** for unified management

All location updates are processed automatically and displayed on the map.

---

For technical support or feature requests, contact the IT department.
