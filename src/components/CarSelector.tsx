import React from 'react';
import Image from 'next/image';
import { CarType } from '@/utils/types';

interface CarSelectorProps {
  selectedCar: CarType;
  onSelectCar: (car: CarType) => void;
  onOpenModal: (car: CarType) => void;
}

const CarSelector: React.FC<CarSelectorProps> = ({ selectedCar, onSelectCar, onOpenModal }) => {
  return (
    <div className="flex justify-center gap-4 mb-6 w-full">
      <button
        className={`car-selector ${
          selectedCar === 'G80' ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'
        } flex flex-col items-center justify-center p-4 rounded-xl w-5/12 max-w-[200px] aspect-[4/3] transition-all border-2 shadow-md`}
        onClick={() => {
          onSelectCar('G80');
          onOpenModal('G80');
        }}
      >
        <div className="car-image-container relative w-full h-24 mb-2">
          <Image 
            src="/images/G80.png" 
            alt="G80" 
            fill 
            style={{ objectFit: 'contain' }} 
            priority
          />
        </div>
        <span className="font-bold text-xl">G80</span>
      </button>
      
      <button
        className={`car-selector ${
          selectedCar === 'G90' ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'
        } flex flex-col items-center justify-center p-4 rounded-xl w-5/12 max-w-[200px] aspect-[4/3] transition-all border-2 shadow-md`}
        onClick={() => {
          onSelectCar('G90');
          onOpenModal('G90');
        }}
      >
        <div className="car-image-container relative w-full h-24 mb-2">
          <Image 
            src="/images/G90.png" 
            alt="G90" 
            fill 
            style={{ objectFit: 'contain' }} 
            priority
          />
        </div>
        <span className="font-bold text-xl">G90</span>
      </button>
    </div>
  );
};

export default CarSelector;
