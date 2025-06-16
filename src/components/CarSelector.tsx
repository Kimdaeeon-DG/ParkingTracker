import React from 'react';
import { CarType } from '@/utils/types';

interface CarSelectorProps {
  selectedCar: CarType;
  onSelectCar: (car: CarType) => void;
}

const CarSelector: React.FC<CarSelectorProps> = ({ selectedCar, onSelectCar }) => {
  return (
    <div className="flex justify-center gap-4 mb-6 w-full">
      <button
        className={`car-selector ${
          selectedCar === 'G80' ? 'car-selected' : 'car-unselected'
        } flex flex-col items-center justify-center p-4 rounded-xl w-1/3 max-w-[150px] aspect-[4/3] transition-all`}
        onClick={() => onSelectCar('G80')}
      >
        <div className="car-icon text-2xl mb-1">🚙</div>
        <span className="font-medium">G80</span>
      </button>
      
      <button
        className={`car-selector ${
          selectedCar === 'G90' ? 'car-selected' : 'car-unselected'
        } flex flex-col items-center justify-center p-4 rounded-xl w-1/3 max-w-[150px] aspect-[4/3] transition-all`}
        onClick={() => onSelectCar('G90')}
      >
        <div className="car-icon text-2xl mb-1">🚗</div>
        <span className="font-medium">G90</span>
      </button>
    </div>
  );
};

export default CarSelector;
