'use client';

import { useState, useEffect } from 'react';
import ParkingButton from '@/components/ParkingButton';
import ParkingInputModal from '@/components/ParkingInputModal';
import ParkingRecordList from '@/components/ParkingRecordList';
import CarSelector from '@/components/CarSelector';
import { FloorType, ParkingRecord, CarType } from '@/utils/types';
import { fetchRecords, addRecordToDB, deleteRecordFromDB } from '@/utils/parkingApi';
import { getUserId } from '@/utils/user';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [records, setRecords] = useState<ParkingRecord[]>([]);
  const [currentRecord, setCurrentRecord] = useState<ParkingRecord | null>(null);
  const [selectedCar, setSelectedCar] = useState<CarType>('G80');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const userId = typeof window !== 'undefined' ? getUserId() : '';

  // Supabase에서 기록 불러오기
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    fetchRecords(userId)
      .then((fetched) => {
        setRecords(fetched);
        setCurrentRecord(fetched[0] || {
          id: 'default',
          floor: 'B1',
          number: '00',
          created_at: new Date().toISOString(),
        });
      })
      .catch((e) => setError('기록을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [userId]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // 기록 저장
  const handleSaveRecord = async (floor: FloorType, number: string, car: CarType) => {
    const newRecord = {
      id: uuidv4(),
      floor,
      number,
      car,
      user_id: userId,
    };
    setLoading(true);
    try {
      await addRecordToDB(newRecord);
      const updated = await fetchRecords(userId);
      setRecords(updated);
      setCurrentRecord(updated[0]);
    } catch {
      setError('기록 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 기록 삭제
  const handleDeleteRecord = async (id: string) => {
    setDeleteLoadingId(id);
    try {
      await deleteRecordFromDB(id, userId);
      const updated = await fetchRecords(userId);
      setRecords(updated);
      setCurrentRecord(updated[0] || {
        id: 'default',
        floor: 'B1',
        number: '00',
        created_at: new Date().toISOString(),
      });
    } catch {
      setError('기록 삭제에 실패했습니다.');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <h1 className="mb-6 text-2xl font-bold">🚗 우리집 주차 위치</h1>
      
      {/* 차량 선택 버튼 */}
      <div className="flex justify-center mb-4">
        <CarSelector selectedCar={selectedCar} onSelectCar={setSelectedCar} />
      </div>
      
      {/* 주차 위치 표시 버튼 */}
      <div className="flex justify-center mb-6">
        {currentRecord && (
          <ParkingButton
            floor={currentRecord.floor}
            number={currentRecord.number}
            car={currentRecord.car}
            onClick={handleOpenModal}
          />
        )}
      </div>
      {/* 에러/로딩 안내 */}
      {error && <div className="mb-4 text-red-500">{error}</div>}
      {loading && <div className="mb-4 text-gray-400">불러오는 중...</div>}
      {/* 주차 기록 목록 (삭제 기능 포함) */}
      <ParkingRecordList records={records} onDelete={handleDeleteRecord} deleteLoadingId={deleteLoadingId} />
      {/* 주차 위치 입력 모달 */}
      <ParkingInputModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveRecord}
        initialFloor={currentRecord?.floor}
        initialCar={selectedCar}
      />
    </div>
  );
}
