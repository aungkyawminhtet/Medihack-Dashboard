import { StaffMember } from "../types/transport";

export const staffData: StaffMember[] = [
    {
        id: "STAFF-1",
        name: "John Doe",
        role: "Patient Transport",
        status: "available",
        location: {
            x: 200,
            y: 200,
            floor: 1,
            zone: "Emergency",
        },
        currentWorkload: 0,
        completedToday: 0,
    },
    {
        id: "STAFF-2",
        name: "Jane Smith",
        role: "Patient Transport",
        status: "busy",
        location: {
            x: 400,
            y: 300,
            floor: 2,
            zone: "Surgery",
        },
        currentWorkload: 2,
        completedToday: 5,
    }
];
