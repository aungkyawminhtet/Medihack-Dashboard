import { TransportEquipment } from "../types/transport";
import { equipmentData } from "../data/EquipmentData";

export const getEquipmentData = (): TransportEquipment[] =>
  equipmentData.map((item) => ({ ...item }));

export const getEquipmentById = (id: string): TransportEquipment | undefined =>
  equipmentData.find((item) => item.id === id);

export { equipmentData };
