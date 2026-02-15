import { TransportEquipment } from "../types/transport";

export const equipmentData: TransportEquipment[] = [
    {
        id: "EQUIP-1",
        type: "stretcher",
        name: "Stretcher 1",
        status: "available",
        location: {
            x: 100,
            y: 150,
            floor: 1,
            zone: "Emergency",
        },
        batteryLevel: 80,
        lastMaintenance: new Date("2024-05-01"),    
    },
    // {
    //     id: "EQUIP-2",
    //     type: "wheelchair",
    //     name: "Wheelchair 1",        
    //     status: "available",
    //     location: {
    //         x: 200,
    //         y: 150,
    //         floor: 2,
    //         zone: "ICU",
    //     },
    //     lastMaintenance: new Date("2024-05-10"),
    // },
];
