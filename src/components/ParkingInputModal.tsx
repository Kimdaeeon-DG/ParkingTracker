import React, { useState } from 'react';
import { FloorType, CarType } from '@/utils/types';
import Image from 'next/image';

interface ParkingInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (floor: FloorType, number: string, car: CarType) => void;
  initialFloor?: FloorType;
  initialCar?: CarType;
}

const ParkingInputModal: React.FC<ParkingInputModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialFloor = 'G',
  initialCar = 'G80'
}) => {
  const [floor, setFloor] = useState<FloorType>(initialFloor);
  const [number, setNumber] = useState<string>('');
  // 차량 선택 부분 제거, 초기 선택된 차량만 사용
  const car = initialCar;

  if (!isOpen) return null;

  const handleSave = () => {
    if (number) {
      onSave(floor, number, car);
      setNumber('');
      onClose();
    }
  };

  const handleNumberInput = (digit: string) => {
    if (number.length < 3) {
      setNumber(prev => prev + digit);
    }
  };

  const handleBackspace = () => {
    setNumber(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setNumber('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="glass-effect w-11/12 max-w-md p-6 rounded-2xl">
        {/* 차량 표시 - 더 작게 수정 */}
        <div className="flex justify-center mb-4 w-full">
          <div className="flex items-center justify-center p-2 rounded-xl bg-blue-100 border-blue-500 border-2 shadow-md">
            <div className="car-image-container relative w-16 h-12 mr-2">
              <Image 
                src={`/images/${car}.png`}
                alt={car} 
                fill 
                style={{ objectFit: 'contain' }} 
                priority
              />
            </div>
            <span className="font-bold text-lg">{car}</span>
          </div>
        </div>
        
        {/* 층수 선택 - Y, G, V, P 버튼 */}
        <div className="mb-6 flex justify-center gap-4">
          {/* 지하 1층과 지하 2층 가로 배치 */}
          <div className="flex flex-col items-center">
            <div className="font-bold text-lg mb-2">지하 1층</div>
            <div className="flex gap-2">
              <button
                className={`w-16 h-16 rounded-xl text-2xl font-bold shadow-md ${floor === 'Y' ? 'bg-yellow-300 text-yellow-800 ring-4 ring-yellow-500' : 'bg-gray-100 hover:bg-gray-200'}`}
                onClick={() => setFloor('Y')}
              >
                Y
              </button>
              <button
                className={`w-16 h-16 rounded-xl text-2xl font-bold shadow-md ${floor === 'G' ? 'bg-green-300 text-green-800 ring-4 ring-green-500' : 'bg-gray-100 hover:bg-gray-200'}`}
                onClick={() => setFloor('G')}
              >
                G
              </button>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="font-bold text-lg mb-2">지하 2층</div>
            <div className="flex gap-2">
              <button
                className={`w-16 h-16 rounded-xl text-2xl font-bold shadow-md ${floor === 'V' ? 'bg-violet-300 text-violet-800 ring-4 ring-violet-500' : 'bg-gray-100 hover:bg-gray-200'}`}
                onClick={() => setFloor('V')}
              >
                V
              </button>
              <button
                className={`w-16 h-16 rounded-xl text-2xl font-bold shadow-md ${floor === 'P' ? 'bg-pink-300 text-pink-800 ring-4 ring-pink-500' : 'bg-gray-100 hover:bg-gray-200'}`}
                onClick={() => setFloor('P')}
              >
                P
              </button>
            </div>
          </div>
        </div>
        
        {/* 숫자 표시 */}
        <div className="mb-6 p-4 text-center bg-white rounded-lg shadow-inner">
          <span className="text-4xl font-bold">{number || '번호 입력'}</span>
        </div>
        
        {/* 숫자 키패드 */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              className="p-4 text-xl font-bold bg-white rounded-lg shadow"
              onClick={() => handleNumberInput(num.toString())}
            >
              {num}
            </button>
          ))}
          <button
            className="p-4 text-xl font-bold bg-white rounded-lg shadow"
            onClick={handleClear}
          >
            C
          </button>
          <button
            className="p-4 text-xl font-bold bg-white rounded-lg shadow"
            onClick={() => handleNumberInput('0')}
          >
            0
          </button>
          <button
            className="p-4 text-xl font-bold bg-white rounded-lg shadow"
            onClick={handleBackspace}
          >
            ⌫
          </button>
        </div>
        
        {/* 버튼 */}
        <div className="flex justify-between">
          <button
            className="px-6 py-2 bg-gray-300 rounded-lg"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="px-6 py-2 text-white bg-blue-500 rounded-lg"
            onClick={handleSave}
            disabled={!number}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParkingInputModal;
