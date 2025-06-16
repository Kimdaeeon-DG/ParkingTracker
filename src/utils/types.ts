export type FloorType = 'B1' | 'B2';
export type CarType = 'G80' | 'G90';

export interface ParkingRecord {
  id: string;
  floor: FloorType;
  number: string;
  created_at: string;
  car?: CarType;
}

export interface ParkingState {
  records: ParkingRecord[];
  currentRecord: ParkingRecord | null;
}
