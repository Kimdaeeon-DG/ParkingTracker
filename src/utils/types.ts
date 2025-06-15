export type FloorType = 'B1' | 'B2';

export interface ParkingRecord {
  id: string;
  floor: FloorType;
  number: string;
  created_at: string;
}

export interface ParkingState {
  records: ParkingRecord[];
  currentRecord: ParkingRecord | null;
}
