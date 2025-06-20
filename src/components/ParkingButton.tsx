import React from 'react';
import { FloorType, CarType } from '@/utils/types';

interface ParkingButtonProps {
  floor: FloorType;
  number: string;
  car?: CarType;
  onClick: () => void;
}

const ParkingButton: React.FC<ParkingButtonProps> = ({ floor, number, car, onClick }) => {
  // 층 코드에 따른 CSS 클래스와 텍스트 지정
  let floorClass = '';
  let floorText = '';
  
  // Y, G는 지하 1층, V, P는 지하 2층
  if (floor === 'Y' || floor === 'G') {
    floorClass = 'bg-green-300';
    floorText = '지하 1층';
  } else {
    floorClass = 'bg-pink-300';
    floorText = '지하 2층';
  }
  
  return (
    <div className="flex flex-col items-center w-full">
      <button 
        className={`parking-button ${floorClass} w-4/5 aspect-square max-w-xs relative shadow-lg`}
        onClick={onClick}
      >
        <span className="text-6xl font-bold text-gray-800">{floor}{number}</span>
        <span className="mt-2 text-lg font-bold text-gray-800">{floorText}</span>
        {car && (
          <div className="absolute bottom-2 right-2 bg-white/80 px-2 py-1 rounded-lg text-xs font-medium">
            {car === 'G80' ? '🚙 G80' : '🚗 G90'}
          </div>
        )}
      </button>
    </div>
  );
};

export default ParkingButton;
