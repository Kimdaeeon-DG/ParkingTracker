import { ParkingRecord, FloorType, CarType } from './types';
import { loadRecords, addRecord, deleteRecord, getAllRecords } from './storage';

// 전체 기록 가져오기
export async function fetchRecords(userId: string): Promise<ParkingRecord[]> {
  // userId는 사용하지 않지만 호환성을 위해 남겨둘
  return getAllRecords();
}

// 특정 차량 타입의 기록만 가져오기
export async function fetchRecordsByCarType(carType: CarType): Promise<ParkingRecord[]> {
  return loadRecords(carType);
}

// 기록 추가
export async function addRecordToDB(record: Omit<ParkingRecord, 'created_at'> & { user_id?: string }) {
  // user_id는 로컬 스토리지에서는 필요 없으므로 옵셔널로 변경
  const parkingRecord: ParkingRecord = {
    ...record,
    created_at: new Date().toISOString()
  };
  
  // 로컬 스토리지에 저장
  addRecord(parkingRecord);
}

// 기록 삭제
export async function deleteRecordFromDB(id: string, userId?: string) {
  // userId는 로컬 스토리지에서는 필요 없으므로 옵셔널로 변경
  deleteRecord(id);
}
