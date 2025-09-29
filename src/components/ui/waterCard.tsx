import React from "react";

interface WaterLevelData {
  time: string;
  label: string;
  value: number;
}

const WaterLevelCards: React.FC = () => {
  const waterLevels: WaterLevelData[] = [
    {
      "time": "8:00 AM",
      "label": "Water Level (PWD)",
      "value": 4694
    },
    {
      "time": "12:00 PM",
      "label": "Water Level (PWD)",
      "value": 13076
    },
    {
      "time": "2:00 PM",
      "label": "Water Level (PWD)",
      "value": 10336
    },
    {
      "time": "6:00 PM",
      "label": "Water Level (PWD)",
      "value": 1295
    }
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 p-3 ">
      {waterLevels.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center bg-white"
        >  
          <h2 className="text-xl font-bold text-black">{item.time}</h2>

   
          <p className="text-sm text-black mt-1 text-center ">{item.label}</p>

   
          <div className="bg-gray-100 px-8 py-4 mt-4 rounded-xl">
            <span className="text-base font-semibold text-black">{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WaterLevelCards;
