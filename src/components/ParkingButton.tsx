import React from 'react';
import { FloorType } from '@/utils/types';

interface ParkingButtonProps {
  floor: FloorType;
  number: string;
  onClick: () => void;
}

const ParkingButton: React.FC<ParkingButtonProps> = ({ floor, number, onClick }) => {
  const floorClass = floor === 'B1' ? 'b1-floor' : 'b2-floor';
  const floorText = floor === 'B1' ? '🟢 지하 1층' : '🌸 지하 2층';
  
  return (
    <button 
      className={`parking-button ${floorClass} w-4/5 aspect-square max-w-xs`}
      onClick={onClick}
    >
      <span className="text-6xl font-bold text-text-dark">{number}</span>
      <span className="mt-2 text-sm text-text-dark">{floorText}</span>
    </button>
  );
};

export default ParkingButton;
