import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

// Interface for the data that will populate each shift card
interface ShiftData {
  name: string;
  timeframe: string;
  total: number;
  violation: number;
  pass: number;
  location: string;
  
}

// Demo data for the four shifts shown in the design
const demoShifts: ShiftData[] = [
  {
    name: '3RD-2',
    timeframe: '00.00.00 - 05.59.59',
    total: 58157,
    violation: 320,
    pass: 58157,
    location: 'Dhaka',
  },
  {
    name: '1ST',
    timeframe: '06.00.00 - 13.59.59',
    total: 12061,
    violation: 80,
    pass: 12061,
    location: 'Chittagong',
  },
  {
    name: '2ND',
    timeframe: '14.00.00 - 21.59.59',
    total: 39289,
    violation: 220,
    pass: 39289,
    location: 'Dhaka',
  },
  {
    name: '3RD-1',
    timeframe: '22.00.00 - 23.59.59',
    total: 61716,
    violation: 124,
    pass: 61716,
    location: 'Rajshahi',
  },
];

// Reusable card component for a single shift
const ShiftCard: React.FC<ShiftData> = ({ name, timeframe, total, violation, pass }) => {
  return (
    <div className=" bg-white rounded-xl shadow-md overflow-hidden ">
      <div className="p-5 text-center bg-white border-b border-gray-200 flex  justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700 ">SHIFT: {name}</h3>

        <p className="text-sm text-[#0B1F8F]">{timeframe}</p>
      </div>
      <div className="p-4 space-y-3">
        {/* Total Metric */}
        <div className="bg-[#0B1F8F] rounded-md px-5 py-3 text-white ">
          <h1 className="font-semibold text-base text-center">Total</h1>
          <hr className="border-gray-300 h-[1px] my-2" />
          <h1 className="font-bold text-xl text-center">{total.toLocaleString()}</h1>
        </div>
        {/* Violation Metric */}
        <div className="bg-[#FF4141] rounded-md p-5 text-white ">
          <h1 className="font-semibold text-base text-center">Violation</h1>
           <hr className="border-gray-300 h-[1px] my-2" />
          <h1 className="font-bold text-xl text-center">{violation.toLocaleString()}</h1>
        </div>
        {/* Pass Metric */}
        <div className="bg-[#476888] rounded-md p-5 text-white ">
          <h1 className="font-semibold text-base text-center">Pass</h1>
           <hr className="border-gray-300 h-[1px] my-2" />
          <h1 className="font-bold text-xl text-center">{pass.toLocaleString()}</h1>
        </div>
      </div>
    </div>
  );
};

// Main application component
const Wim: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [products, setProducts] = useState<ShiftData[]>(demoShifts);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const locations = [
    { name: 'Dhaka', code: 'Dhaka' },
    { name: 'Chittagong', code: 'Chittagong' },
    { name: 'Rajshahi', code: 'Rajshahi' },
  ];

  const getMonthName = (date: Date): string => date.toLocaleString('en-US', { month: 'long' });
  const getYear = (date: Date): string => date.getFullYear().toString();

  // Mock API call function
  const searchAssetManagement = (payload: any) => {
    return new Promise<{ Assets: ShiftData[] }>((resolve) => {
      setTimeout(() => {
        let filteredData = demoShifts;
        if (payload.location) {
          filteredData = filteredData.filter(shift =>
            shift.location.toLowerCase() === payload.location.toLowerCase()
          );
        }
        resolve({ Assets: filteredData });
      }, 500); // Simulate network delay
    });
  };

  const handleSearch = () => {
    if (activeTab !== 'all') return;

    setLoading(true);
    const initialPayload = {
      month: selectedDate ? getMonthName(selectedDate) : '',
      year: selectedDate ? getYear(selectedDate) : '',
      location: selectedLocation || '',
    };

    searchAssetManagement(initialPayload).then((result) => {
      setProducts(result.Assets);
      setLoading(false);
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      {/* Header with dropdowns and a search button */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
        <div className="w-full sm:w-auto">
          <Calendar
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.value as Date)}
            dateFormat="dd/mm/yy"
            placeholder="Select Date"
            icon={() => <i className='pi pi-angle-down' />}
            showIcon
            inputClassName='border-none rounded-none cursor-pointer focus:ring-0'
          />
           
        </div>
        <div className="w-full sm:w-auto">
          <Dropdown
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.value)}
            inputClassName='border-none rounded-none cursor-pointer focus:ring-0'
            options={locations}
            optionLabel="name"
            placeholder="Location"
            className="w-full"
          />
        </div>
        <Button label="Search" onClick={handleSearch} loading={loading} />
      </div>

      {/* Grid of Shift Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((shift, index) => (
          <ShiftCard
            key={index}
            name={shift.name}
            timeframe={shift.timeframe}
            total={shift.total}
            violation={shift.violation}
            pass={shift.pass}
            location={shift.location}
          />
        ))}
      </div>
    </div>
  );
};

export default Wim;
