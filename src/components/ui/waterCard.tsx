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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 p-3 w-full  ">
      {waterLevels.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center  "
        >  
          <h2 className="text-xl font-bold text-black">{item.time}</h2>

   
          <p className="text-sm text-black mt-1 text-center ">{item.label}</p>

   
          <button style={{backgroundColor:'rgba(217, 217, 217, 0.34)'}}

className="bg-[#D9D9D9] px-5 py-4 mt-4 rounded-xl">
            <span className="text-base font-semibold text-black">{item.value}</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default WaterLevelCards;
