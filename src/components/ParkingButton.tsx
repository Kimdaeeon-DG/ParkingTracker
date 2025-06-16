import React from 'react';
import { FloorType, CarType } from '@/utils/types';

interface ParkingButtonProps {
  floor: FloorType;
  number: string;
  car?: CarType;
  onClick: () => void;
}

const ParkingButton: React.FC<ParkingButtonProps> = ({ floor, number, car, onClick }) => {
  const floorClass = floor === 'B1' ? 'b1-floor' : 'b2-floor';
  const floorText = floor === 'B1' ? '🟢 지하 1층' : '🌸 지하 2층';
  
  return (
    <div className="flex flex-col items-center w-full">
      <button 
        className={`parking-button ${floorClass} w-4/5 aspect-square max-w-xs relative`}
        onClick={onClick}
      >
        <span className="text-6xl font-bold text-text-dark">{number}</span>
        <span className="mt-2 text-sm text-text-dark">{floorText}</span>
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
