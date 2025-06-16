'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ParkingInputModal from '@/components/ParkingInputModal';
import ParkingRecordList from '@/components/ParkingRecordList';
import { FloorType, ParkingRecord, CarType } from '@/utils/types';
import { fetchRecords, fetchRecordsByCarType, addRecordToDB, deleteRecordFromDB } from '@/utils/parkingApi';
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
  
  // G80과 G90 차량의 최신 주차 기록을 찾는 함수
  const findLatestCarRecord = (carType: CarType): ParkingRecord | undefined => {
    // 해당 차량 타입의 기록만 찾아서 가장 최신 기록 반환
    const carRecords = records.filter(record => record.car === carType);
    return carRecords.length > 0 ? carRecords[0] : undefined;
  };
  
  // G80 테두리 색상 결정 함수
  const getG80BorderColor = (): string => {
    const g80Record = findLatestCarRecord('G80');
    if (!g80Record) return 'border-gray-300';
    
    return g80Record.floor === 'B1' 
      ? 'border-8 border-green-500' 
      : 'border-8 border-pink-500';
  };
  
  // G90 테두리 색상 결정 함수
  const getG90BorderColor = (): string => {
    const g90Record = findLatestCarRecord('G90');
    if (!g90Record) return 'border-gray-300';
    
    return g90Record.floor === 'B1' 
      ? 'border-8 border-green-500' 
      : 'border-8 border-pink-500';
  };
  
  // G80 층수 텍스트 가져오기
  const getG80FloorText = (): string => {
    const g80Record = findLatestCarRecord('G80');
    if (!g80Record) return '위치 정보 없음';
    
    return g80Record.floor === 'B1' ? '지하 1층' : '지하 2층';
  };
  
  // G80 번호 가져오기
  const getG80Number = (): string => {
    const g80Record = findLatestCarRecord('G80');
    if (!g80Record) return '';
    
    return `${g80Record.number}`;
  };
  
  // G90 층수 텍스트 가져오기
  const getG90FloorText = (): string => {
    const g90Record = findLatestCarRecord('G90');
    if (!g90Record) return '위치 정보 없음';
    
    return g90Record.floor === 'B1' ? '지하 1층' : '지하 2층';
  };
  
  // G90 번호 가져오기
  const getG90Number = (): string => {
    const g90Record = findLatestCarRecord('G90');
    if (!g90Record) return '';
    
    return `${g90Record.number}`;
  };
  
  // 이전 함수들 - 호환성을 위해 유지
  const getG80Location = () => {
    const g80Record = findLatestCarRecord('G80');
    if (!g80Record) return <div className="text-center mt-2 text-gray-500">위치 정보 없음</div>;
    
    return (
      <div className="text-center mt-2">
        <p className="font-bold text-xl">
          {g80Record.floor === 'B1' ? '지하 1층' : '지하 2층'}
        </p>
        <p className="text-3xl font-black">{g80Record.number}번</p>
      </div>
    );
  };
  
  const getG90Location = () => {
    const g90Record = findLatestCarRecord('G90');
    if (!g90Record) return <div className="text-center mt-2 text-gray-500">위치 정보 없음</div>;
    
    return (
      <div className="text-center mt-2">
        <p className="font-bold text-xl">
          {g90Record.floor === 'B1' ? '지하 1층' : '지하 2층'}
        </p>
        <p className="text-3xl font-black">{g90Record.number}번</p>
      </div>
    );
  };

  const userId = typeof window !== 'undefined' ? getUserId() : '';

  // 로컬 스토리지에서 기록 불러오기
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchRecords('')  // userId는 로컬 스토리지에서 사용하지 않으므로 빈 문자열 전달
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
  }, []);  // userId 의존성 제거

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
      // user_id 삭제 - 로컬 스토리지에서는 필요없음
    };
    setLoading(true);
    try {
      await addRecordToDB(newRecord);
      
      // 전체 기록 갱신
      const updated = await fetchRecords('');
      setRecords(updated);
      
      // 현재 기록 업데이트
      const carRecords = await fetchRecordsByCarType(car);
      setCurrentRecord(carRecords[0] || {
        id: 'default',
        floor: 'B1',
        number: '00',
        created_at: new Date().toISOString(),
        car
      });
    } catch {
      setError('기록 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 기록 삭제
  const handleDeleteRecord = async (id: string) => {
    setDeleteLoadingId(id);
    
    // 삭제할 기록의 차량 타입 확인
    const recordToDelete = records.find(r => r.id === id);
    const carType = recordToDelete?.car;
    
    try {
      await deleteRecordFromDB(id); // userId 삭제 - 로컬 스토리지에서는 필요없음
      
      // 전체 기록 갱신
      const updated = await fetchRecords('');
      setRecords(updated);
      
      // 해당 차량 타입의 기록만 갱신
      if (carType) {
        const carRecords = await fetchRecordsByCarType(carType);
        setCurrentRecord(carRecords[0] || {
          id: 'default',
          floor: 'B1',
          number: '00',
          created_at: new Date().toISOString(),
          car: carType
        });
      } else {
        // 차량 타입을 알 수 없는 경우 처리
        setCurrentRecord(updated[0] || {
          id: 'default',
          floor: 'B1',
          number: '00',
          created_at: new Date().toISOString(),
        });
      }
    } catch {
      setError('기록 삭제에 실패했습니다.');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <h1 className="mb-6 text-2xl font-bold">아빠차 주차 위치</h1>
      
      {/* 차량 선택 버튼 */}
      <div className="flex justify-center gap-6 mb-6 w-full max-w-3xl px-4">
        {/* G90 차량 버튼 */}
        <div className="flex flex-col items-center w-1/2">
          <button
            className={`w-full ${getG90BorderColor()} rounded-lg overflow-hidden shadow-lg`}
            onClick={() => {
              setSelectedCar('G90');
              handleOpenModal('G90');
            }}
          >
            <div className="bg-white p-2 text-center border-b">
              <span className="font-bold text-2xl">G90</span>
            </div>
            <div className="relative w-full aspect-[4/3] bg-white p-2">
              <Image 
                src="/images/G90.png" 
                alt="G90" 
                fill 
                style={{ objectFit: 'contain' }} 
                priority
              />
            </div>
            {/* G90 위치 표시 - 버튼 내부에 포함 */}
            <div className="p-3 text-center bg-gray-50">
              <p className="font-bold text-xl">
                {getG90FloorText()}
              </p>
              <p className="text-5xl font-black">
                {getG90Number()}
              </p>
            </div>
          </button>
        </div>
        
        {/* G80 차량 버튼 */}
        <div className="flex flex-col items-center w-1/2">
          <button
            className={`w-full ${getG80BorderColor()} rounded-lg overflow-hidden shadow-lg`}
            onClick={() => {
              setSelectedCar('G80');
              handleOpenModal('G80');
            }}
          >
            <div className="bg-white p-2 text-center border-b">
              <span className="font-bold text-2xl">G80</span>
            </div>
            <div className="relative w-full aspect-[4/3] bg-white p-2">
              <Image 
                src="/images/G80.png" 
                alt="G80" 
                fill 
                style={{ objectFit: 'contain' }} 
                priority
              />
            </div>
            {/* G80 위치 표시 - 버튼 내부에 포함 */}
            <div className="p-3 text-center bg-gray-50">
              <p className="font-bold text-xl">
                {getG80FloorText()}
              </p>
              <p className="text-5xl font-black">
                {getG80Number()}
              </p>
            </div>
          </button>
        </div>
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
