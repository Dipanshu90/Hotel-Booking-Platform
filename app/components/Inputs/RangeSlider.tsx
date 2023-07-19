"use client"

import React, { useCallback, useState } from 'react';

interface RangeSliderProps {
  min: number;
  max: number;
  price: number;
  onChange: (value: number) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({ min, max, price, onChange }) => {
  const [sliderValue, setSliderValue] = useState(price);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    onChange(newValue);
    setSliderValue(newValue);
  }, [onChange]);

  const calculateProgress = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  return (
    <div className='flex flex-row items-center gap-4'>
      <input
        type="range"
        min={min}
        max={max}
        value={sliderValue}
        onChange={handleChange}
        className="flex-grow h-3 rounded-lg appearance-none bg-gray-300 focus:outline-none"
        style={{
          background: `linear-gradient(to right, 
                        #4F46E5 0%, 
                        #4F46E5 
                        ${calculateProgress(sliderValue)}%, 
                        #CBD5E0 ${calculateProgress(sliderValue)}%, 
                        #CBD5E0 100%
                      )`,
        }}
      />
      <style>
        {`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            background-color: #4F46E5;
            border-radius: 50%;
            cursor: pointer;
          }
        `}
      </style>
      <div className="font-light text-xl text-neutral-600">{sliderValue} $</div>
    </div>
  );
};

export default RangeSlider;