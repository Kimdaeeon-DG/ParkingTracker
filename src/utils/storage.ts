import { ParkingRecord } from './types';

const STORAGE_KEY = 'parking-records';

export const saveRecords = (records: ParkingRecord[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }
};

export const loadRecords = (): ParkingRecord[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved records:', e);
      }
    }
  }
  return [];
};

export const addRecord = (record: ParkingRecord): ParkingRecord[] => {
  const records = loadRecords();
  const newRecords = [record, ...records].slice(0, 10); // 최대 10개 기록만 유지
  saveRecords(newRecords);
  return newRecords;
};

export const deleteRecord = (id: string): ParkingRecord[] => {
  const records = loadRecords();
  const newRecords = records.filter((r) => r.id !== id);
  saveRecords(newRecords);
  return newRecords;
};
