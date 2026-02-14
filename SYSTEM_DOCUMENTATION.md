# Patient Transport Logistics System

## Overview
A comprehensive smart patient stretcher and wheelchair management system for healthcare facilities, featuring real-time location tracking, staff workload balancing, optimal placement suggestions, and request queuing.

## Features Implemented

### 1. Location Tracking System
- **Interactive Map**: Custom SVG-based map with pan and zoom controls
- **Multi-Floor Support**: Track equipment and staff across 3 hospital floors
- **Real-time Updates**: Equipment and staff locations update every 3 seconds
- **Zone-Based Layout**: Hospital divided into zones (Emergency, Surgery, ICU, Radiology, etc.)
- **Visual Indicators**: 
  - Color-coded status markers (available, in-use, requested, maintenance)
  - Animated pulse effects for urgent requests
  - Battery level indicators for powered equipment
  - Workload badges on staff markers

### 2. Staff Workload Balancing
- **Automatic Load Distribution**: System assigns requests to staff with lowest workload
- **Real-time Workload Monitoring**: Visual progress bars and metrics
- **Performance Tracking**: Daily completion counts and active request tracking
- **Status Management**: Available, busy, and off-duty states
- **Alerts**: High workload warnings and rebalancing suggestions

### 3. Request & Queuing System
- **Priority-Based Queue**: Emergency, urgent, and routine request priorities
- **Smart Assignment**: Automatic matching of requests to available staff and equipment
- **Request Lifecycle**: Pending → Assigned → In-Progress → Completed/Cancelled
- **Detailed Request Cards**: Patient info, origin/destination, equipment type, timing
- **One-Click Actions**: Assign and cancel buttons with toast notifications

### 4. Optimal Placement Suggestions
- **AI-Powered Recommendations**: Analyzes demand patterns across zones
- **Priority Scoring**: 1-10 scale based on urgency and impact
- **Reason Explanation**: Clear rationale for each suggestion
- **Actionable Insights**: One-click application of suggestions

### 5. Equipment Management
- **Status Tracking**: Available, in-use, requested, maintenance states
- **Battery Monitoring**: Real-time battery levels for stretchers
- **Maintenance Scheduling**: Last service date and alerts
- **Assignment Tracking**: Links to staff and active requests

### 6. Analytics Dashboard
- **Key Metrics**: Total requests, completion rate, response time, utilization
- **Request Distribution**: Priority breakdown (emergency/urgent/routine)
- **Staff Performance**: Workload averages and completion statistics
- **Equipment Utilization**: Type-specific usage rates and status breakdown

## Technology Stack

### Current Implementation (React Web)
- **React 18.3.1**: Component-based UI framework
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Utility-first styling
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **Sonner**: Toast notifications
- **Custom SVG Map**: Interactive visualization

### Aruba AP Integration
- **AP-535**: Large-scale deployment with BLE 5.0, Zigbee, and Wi-Fi 6
- **AP-503H**: Room-level tracking with compact design
- **Tracking Technologies**: BLE beacons, Zigbee tags, Wi-Fi triangulation
- **Management**: Aruba Central unified platform

## React Native Migration Guide

### Components to Migrate

#### 1. Map Component (`TransportMap.tsx`)
**Web Implementation**: Custom SVG with mouse events
**React Native Approach**:
```typescript
// Use react-native-svg for rendering
import Svg, { G, Circle, Rect, Text } from 'react-native-svg';
// Use PanResponder for gestures
import { PanResponder, Animated } from 'react-native';
// Or use react-native-maps for a real map view
import MapView, { Marker } from 'react-native-maps';
```

**Considerations**:
- Replace mouse events with touch gestures (PanResponder)
- Use Animated API for smooth pan/zoom
- Consider react-native-gesture-handler for better performance
- Indoor positioning requires custom floor plan overlays

#### 2. Navigation & Layout
**Web Implementation**: CSS Grid and Flexbox
**React Native Approach**:
```typescript
import { View, ScrollView, SafeAreaView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
```

**Layout Changes**:
- Replace CSS Grid with Flexbox
- Use SafeAreaView for notch/home indicator
- Bottom tabs instead of sidebar navigation
- Stack navigation for details screens

#### 3. UI Components
**Web to React Native Mapping**:

| Web Component | React Native Alternative |
|--------------|-------------------------|
| `<div>` | `<View>` |
| `<button>` | `<TouchableOpacity>` or `<Button>` |
| `<input>` | `<TextInput>` |
| `<ScrollArea>` | `<ScrollView>` or `<FlatList>` |
| Radix UI | React Native Paper or NativeBase |
| Sonner toasts | react-native-toast-message |

#### 4. Real-time Location Updates
**Web Implementation**: setInterval with state updates
**React Native Approach**:
```typescript
import { useEffect } from 'react';
import BackgroundTimer from 'react-native-background-timer';

// For foreground updates
useEffect(() => {
  const interval = setInterval(() => {
    updateLocations();
  }, 3000);
  return () => clearInterval(interval);
}, []);

// For background location tracking
import BackgroundGeolocation from 'react-native-background-geolocation';
```

### Platform-Specific Features

#### iOS
- **Indoor Positioning**: Core Location with iBeacon support
- **Background Location**: Requires specific permissions and battery optimization
- **Push Notifications**: APNs for request alerts
- **Accessibility**: VoiceOver support for critical alerts

#### Android
- **Indoor Positioning**: Google Nearby or Eddystone beacons
- **Background Services**: Foreground service with notification
- **Push Notifications**: FCM for request alerts
- **Permissions**: Location, Bluetooth, and background execution

### BLE Integration for React Native

```typescript
import BleManager from 'react-native-ble-manager';

// Scan for equipment beacons
BleManager.scan([], 5, true).then(() => {
  console.log('Scanning...');
});

// Listen for discovered devices
BleManagerModule.addListener('BleManagerDiscoverPeripheral', (device) => {
  // Match device UUID to equipment ID
  // Calculate distance from RSSI
  // Update equipment location
});
```

### Data Synchronization

#### Offline Support
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// Cache data locally
await AsyncStorage.setItem('equipment', JSON.stringify(equipment));

// Detect network changes
NetInfo.addEventListener(state => {
  if (state.isConnected) {
    syncWithServer();
  }
});
```

#### Real-time Updates
```typescript
import io from 'socket.io-client';

const socket = io('https://api.hospital.com');

socket.on('location_update', (data) => {
  updateEquipmentLocation(data);
});

socket.on('request_assigned', (data) => {
  showNotification(data);
});
```

### Performance Optimizations

#### List Rendering
```typescript
import { FlatList } from 'react-native';

// Use FlatList for request queue
<FlatList
  data={requests}
  renderItem={({ item }) => <RequestCard request={item} />}
  keyExtractor={item => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
/>
```

#### Memoization
```typescript
import React, { memo, useMemo, useCallback } from 'react';

const RequestCard = memo(({ request, onPress }) => {
  return <TouchableOpacity onPress={onPress}>...</TouchableOpacity>;
});

// Use useMemo for expensive calculations
const sortedRequests = useMemo(() => {
  return requests.sort((a, b) => a.priority - b.priority);
}, [requests]);
```

### Required React Native Packages

```json
{
  "dependencies": {
    "react-native": "0.73.x",
    "@react-navigation/native": "^6.x",
    "@react-navigation/stack": "^6.x",
    "@react-navigation/bottom-tabs": "^6.x",
    "react-native-svg": "^14.x",
    "react-native-maps": "^1.x",
    "react-native-ble-manager": "^11.x",
    "react-native-background-geolocation": "^4.x",
    "react-native-paper": "^5.x",
    "react-native-toast-message": "^2.x",
    "@react-native-async-storage/async-storage": "^1.x",
    "@react-native-community/netinfo": "^11.x",
    "socket.io-client": "^4.x",
    "react-native-gesture-handler": "^2.x",
    "react-native-reanimated": "^3.x"
  }
}
```

### Security Considerations

#### HIPAA Compliance
- **Data Encryption**: Encrypt all patient data at rest and in transit
- **Access Controls**: Role-based permissions for staff
- **Audit Logging**: Track all data access and modifications
- **Secure Storage**: Use KeyChain (iOS) and Keystore (Android)
- **Session Management**: Auto-logout after inactivity
- **No PII Storage**: Avoid storing sensitive patient info on device

#### Network Security
```typescript
// Use certificate pinning
import { CertificatePinning } from 'react-native-certificate-pinning';

// Pin API certificate
await CertificatePinning.fetch('https://api.hospital.com', {
  method: 'GET',
  timeoutInterval: 10000,
  sslPinning: {
    certs: ['cert1', 'cert2']
  }
});
```

### Testing Strategy

#### Unit Tests
```typescript
import { render, fireEvent } from '@testing-library/react-native';

test('assigns request to available staff', () => {
  const { getByText } = render(<RequestQueue requests={mockRequests} />);
  fireEvent.press(getByText('Assign'));
  expect(mockAssignFunction).toHaveBeenCalled();
});
```

#### E2E Tests
```typescript
// Using Detox
describe('Transport System', () => {
  it('should create and assign a request', async () => {
    await element(by.id('new-request-button')).tap();
    await element(by.id('patient-name')).typeText('John Doe');
    await element(by.id('submit-button')).tap();
    await expect(element(by.text('Request created'))).toBeVisible();
  });
});
```

## Deployment Architecture

### Web Application
- Hosted on hospital internal network
- Accessible via desktop workstations and tablets
- Real-time data from Aruba Central API

### Mobile Application
- Distributed via MDM (Mobile Device Management)
- Hospital-issued devices for staff
- Offline capability with sync when reconnected
- Background location tracking with user consent

### API Backend (Future)
```
Hospital Network
├── Aruba Central API (Location Data)
├── Transport System API (Business Logic)
│   ├── REST API for CRUD operations
│   ├── WebSocket for real-time updates
│   └── Authentication/Authorization
├── Database (PostgreSQL/MongoDB)
└── Redis Cache (Real-time data)
```

## Future Enhancements

### Phase 2 Features
1. **Predictive Analytics**: ML-based demand forecasting
2. **Route Optimization**: Shortest path calculation for multi-floor transports
3. **Voice Commands**: Hands-free request creation for staff
4. **AR Navigation**: Augmented reality wayfinding on mobile
5. **Integration**: EMR system integration for patient data
6. **Reporting**: Executive dashboards and KPI tracking

### Phase 3 Features
1. **Smart Scheduling**: Automated transport scheduling for routine procedures
2. **Multi-Site Support**: Manage equipment across multiple hospital campuses
3. **Vendor Integration**: Equipment maintenance tracking with OEM systems
4. **Patient App**: Family notification of transport status
5. **AI Assistant**: Natural language query interface

## License & Usage
This is a demonstration/prototype system. For production deployment in healthcare settings, ensure compliance with HIPAA, HITECH, and local healthcare data regulations.

---

Built with React • Powered by Aruba Access Points • Designed for Healthcare
