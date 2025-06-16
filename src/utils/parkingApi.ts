import { ParkingRecord, FloorType } from './types';
import { loadRecords, addRecord, deleteRecord } from './storage';

export async function fetchRecords(userId: string): Promise<ParkingRecord[]> {
  // 로컬 스토리지에서 데이터 가져오기
  return loadRecords();
}

export async function addRecordToDB(record: Omit<ParkingRecord, 'created_at'> & { user_id?: string }) {
  // user_id는 로컬 스토리지에서는 필요 없으므로 옵셔널로 변경
  const parkingRecord: ParkingRecord = {
    ...record,
    created_at: new Date().toISOString()
  };
  
  // 로컬 스토리지에 저장
  addRecord(parkingRecord);
}

export async function deleteRecordFromDB(id: string, userId?: string) {
  // userId는 로컬 스토리지에서는 필요 없으므로 옵셔널로 변경
  deleteRecord(id);
}
