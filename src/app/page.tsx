'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ParkingInputModal from '@/components/ParkingInputModal';
import ParkingRecordList from '@/components/ParkingRecordList';
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

  const handleOpenModal = (car?: CarType) => {
    if (car) setSelectedCar(car);
    setIsModalOpen(true);
  };
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
      <div className="flex justify-center gap-4 mb-6 w-full">
        <button
          className={`car-selector ${selectedCar === 'G80' ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'} flex flex-col items-center justify-center p-5 rounded-xl w-5/12 max-w-[200px] aspect-[4/3] transition-all border-2 shadow-md`}
          onClick={() => {
            setSelectedCar('G80');
            handleOpenModal('G80');
          }}
        >
          <div className="car-image-container relative w-full h-28 mb-2">
            <Image 
              src="/images/G80.png" 
              alt="G80" 
              fill 
              style={{ objectFit: 'contain' }} 
              priority
            />
          </div>
          <span className="font-bold text-2xl">G80</span>
        </button>
        
        <button
          className={`car-selector ${selectedCar === 'G90' ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'} flex flex-col items-center justify-center p-5 rounded-xl w-5/12 max-w-[200px] aspect-[4/3] transition-all border-2 shadow-md`}
          onClick={() => {
            setSelectedCar('G90');
            handleOpenModal('G90');
          }}
        >
          <div className="car-image-container relative w-full h-28 mb-2">
            <Image 
              src="/images/G90.png" 
              alt="G90" 
              fill 
              style={{ objectFit: 'contain' }} 
              priority
            />
          </div>
          <span className="font-bold text-2xl">G90</span>
        </button>
      </div>
      
      {/* 최근 주차 위치 표시 */}
      <div className="flex justify-center mb-6 w-full">
        {currentRecord && currentRecord.car && (
          <div className="text-center p-3 bg-gray-50 rounded-lg shadow-sm w-11/12 max-w-md">
            <p className="text-sm text-gray-500 mb-1">
              {currentRecord.car === 'G80' ? 'G80' : 'G90'} 최근 주차 위치
            </p>
            <p className="text-xl font-bold">
              {currentRecord.floor === 'B1' ? '🟢 지하 1층' : '🌸 지하 2층'} {currentRecord.number}번
            </p>
          </div>
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
