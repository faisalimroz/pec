import React from "react";

// 1. Interface for a single time slot item
interface WaterLevelCardItem {
    time: string;
    label: string;
    value: string; 
}

// 2. Interface for the single data object received from the API (from the parent component)
interface WaterLevelApiData {
    eightAM: string;
    twelvePM: string;
    twoPM: string;
    sixPM: string;
    // Note: Use a signature index to avoid TypeScript complaints about missing properties
    [key: string]: any; 
}

// 3. Interface for the component props
interface WaterLevelCardsProps {
    dailyData: WaterLevelApiData | null;
}

const WaterLevelCards: React.FC<WaterLevelCardsProps> = ({ dailyData }) => {
    
    // Convert the single API object (if it exists) into the array structure needed for mapping
    const waterLevels: WaterLevelCardItem[] = dailyData ? [
        {
            "time": "8:00 AM",
            "label": "Water Level (PWD)",
            "value": dailyData.eightAM || '0'
        },
        {
            "time": "12:00 PM",
            "label": "Water Level (PWD)",
            "value": dailyData.twelvePM || '0'
        },
        {
            "time": "2:00 PM",
            "label": "Water Level (PWD)",
            "value": dailyData.twoPM || '0'
        },
        {
            "time": "6:00 PM",
            "label": "Water Level (PWD)",
            "value": dailyData.sixPM || '0'
        }
    ] : [];

    if (!dailyData) {
        return <div className="p-4 text-center text-gray-500">No time-slot data available.</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 p-3 w-full">
            {waterLevels.map((item, index) => (
                <div
                    key={index}
                    className="flex flex-col items-center justify-center"
                > 
                    <h2 className="text-xl font-bold text-black">{item.time}</h2>

                    <p className="text-sm text-black mt-1 text-center ">{item.label}</p>

                    <button style={{ backgroundColor: 'rgba(217, 217, 217, 0.34)' }}
                        className="bg-[#D9D9D9] px-5 py-4 mt-4 rounded-xl">
                        <span className="text-base font-semibold text-black">{item.value}</span>
                    </button>
                </div>
            ))}
        </div>
    );
};

export default WaterLevelCards;