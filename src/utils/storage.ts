import { ParkingRecord, CarType } from './types';

// 차량 타입별로 별도의 스토리지 키 사용
const getStorageKey = (carType?: CarType): string => {
  if (!carType) return 'parking-records-all';
  return `parking-records-${carType}`;
};

// 특정 차량 타입의 기록 저장
export const saveRecords = (records: ParkingRecord[], carType?: CarType): void => {
  if (typeof window !== 'undefined') {
    // 특정 차량 타입의 기록 저장
    if (carType) {
      localStorage.setItem(getStorageKey(carType), JSON.stringify(records));
    }
    
    // 전체 기록도 함께 저장 (모든 차량 기록을 합쳐서)
    const allRecords = getAllRecords();
    localStorage.setItem(getStorageKey(), JSON.stringify(allRecords));
  }
};

// 특정 차량 타입의 기록 로드
export const loadRecords = (carType?: CarType): ParkingRecord[] => {
  if (typeof window !== 'undefined') {
    const key = getStorageKey(carType);
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(`Failed to parse saved records for ${carType || 'all'}:`, e);
      }
    }
  }
  return [];
};

// 모든 차량 타입의 기록을 합쳐서 반환
export const getAllRecords = (): ParkingRecord[] => {
  const g80Records = loadRecords('G80');
  const g90Records = loadRecords('G90');
  
  // 모든 기록을 날짜 순으로 정렬
  return [...g80Records, ...g90Records].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

// 기록 추가
export const addRecord = (record: ParkingRecord): ParkingRecord[] => {
  if (!record.car) {
    console.error('Car type is required for adding a record');
    return [];
  }
  
  // 해당 차량 타입의 기존 기록 로드
  const records = loadRecords(record.car);
  
  // 새 기록을 추가하고 최대 10개만 유지
  const newRecords = [record, ...records].slice(0, 10);
  
  // 해당 차량 타입의 기록 저장
  saveRecords(newRecords, record.car);
  
  // 전체 기록 반환
  return getAllRecords();
};

// 기록 삭제
export const deleteRecord = (id: string): ParkingRecord[] => {
  // 삭제할 기록 찾기
  const allRecords = getAllRecords();
  const recordToDelete = allRecords.find(r => r.id === id);
  
  if (!recordToDelete || !recordToDelete.car) {
    return allRecords;
  }
  
  // 해당 차량 타입의 기록에서 삭제
  const carRecords = loadRecords(recordToDelete.car);
  const newCarRecords = carRecords.filter(r => r.id !== id);
  
  // 변경된 기록 저장
  saveRecords(newCarRecords, recordToDelete.car);
  
  // 전체 기록 반환
  return getAllRecords();
};
