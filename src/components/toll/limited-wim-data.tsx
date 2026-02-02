import React, { useEffect, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { IconField } from 'primereact/iconfield';
import FileIcon from '../icons/FileIcon';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

interface ShiftData {
  name: string;
  timeframe: string;
  total: number;
  violation: number;
  pass: number;
  location: string;
}

const SHIFT_TIMEFRAMES: Record<string, string> = {
  '3RD-2': '00.00.00 - 05.59.59',
  '1ST':   '06.00.00 - 13.59.59',
  '2ND':   '14.00.00 - 21.59.59',
  '3RD-1': '22.00.00 - 23.59.59',
};

const ORDER: Array<keyof typeof SHIFT_TIMEFRAMES> = ['3RD-2', '1ST', '2ND', '3RD-1'];

const ShiftCard: React.FC<ShiftData> = ({ name, timeframe, total, violation, pass }) => {
  return (
    <div className=" bg-white rounded-xl shadow-md overflow-hidden ">
      <div className="p-5 text-center bg-white border-b border-gray-200 flex  justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-700 ">SHIFT: {name}</h3>
        <p className="text-sm text-[#0B1F8F]">{timeframe}</p>
      </div>
      <div className="p-4 space-y-3">
        <div className="bg-[#0B1F8F] rounded-md px-5 py-3 text-white ">
          <h1 className="font-semibold text-base text-center">Total</h1>
          <hr className="border-gray-300 h-[1px] my-2" />
          <h1 className="font-bold text-xl text-center">{total.toLocaleString()}</h1>
        </div>
        <div className="bg-[#FF4141] rounded-md p-5 text-white ">
          <h1 className="font-semibold text-base text-center">Violation</h1>
          <hr className="border-gray-300 h-[1px] my-2" />
          <h1 className="font-bold text-xl text-center">{violation.toLocaleString()}</h1>
        </div>
        <div className="bg-[#476888] rounded-md p-5 text-white ">
          <h1 className="font-semibold text-base text-center">Pass</h1>
          <hr className="border-gray-300 h-[1px] my-2" />
          <h1 className="font-bold text-xl text-center">{pass.toLocaleString()}</h1>
        </div>
      </div>
    </div>
  );
};

const Wim: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [products, setProducts] = useState<ShiftData[]>(
    ORDER.map((s) => ({
      name: s,
      timeframe: SHIFT_TIMEFRAMES[s],
      total: 0,
      violation: 0,
      pass: 0,
      location: '',
    }))
  );
  const [loading, setLoading] = useState(false);

  const locations = [
    { name: 'Mawa', code: 'Mawa' },
    { name: 'Janjira', code: 'Janjira' },
    
  ];

  const itemTemplate = (option: { name: string; code: string }) => (
    <div className="flex items-center gap-2">
      <FileIcon />
      <span>{option.name}</span>
    </div>
  );

  const ddmmyyyy = (date: Date) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const mapApiToCards = (
    apiItems: Array<{ shiftName: string; total: number | string; pass: number | string; violation: number | string }>,
    location: string
  ): ShiftData[] => {
    const byShift = new Map(apiItems.map((i) => [i.shiftName, i]));
    return ORDER.map((s) => {
      const item = byShift.get(s);
      return {
        name: s,
        timeframe: SHIFT_TIMEFRAMES[s],
        total: Number(item?.total ?? 0),
        pass: Number(item?.pass ?? 0),
        violation: Number(item?.violation ?? 0),
        location: location || '',
      };
    });
  };
   const { pathname } = useLocation();
     

  const fetchShiftStats = async () => {
    try {
      setLoading(true);
    const showAll = pathname.startsWith('/edms');
      let date_range = '';
      if (selectedDate) {
        const d = ddmmyyyy(selectedDate);
        date_range = `${d}`;
      }

      const payload: Record<string, string> = {
      // Add approvedOnly flag
      approved: !showAll ? "true" : "false"
    };
      if (selectedLocation) payload.location = selectedLocation;
      if (date_range) payload.date_range = date_range;

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/toll/limited-wim-data/stats/shift`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        }
      );

      // Accept either { data: [...] } or bare array
      const apiData = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
      setProducts(mapApiToCards(apiData, selectedLocation || ''));
    } catch (e) {
      // On failure, just keep the current products (which are zeros by default)
      console.error('Shift stats fetch failed', e);
    } finally {
      setLoading(false);
    }
  };

  // Load dynamic data on first render as well (no filters)
  useEffect(() => {
    fetchShiftStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    fetchShiftStats();
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <form
        className="flex mx-auto w-fit gap-4 divide-x-2 border p-2 rounded-md bg-white mb-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <Calendar
          // @ts-ignore
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.value as Date)}
          dateFormat="dd/mm/yy"
          inputClassName="border-none rounded-none cursor-pointer focus:ring-0"
          placeholder="Start Date"
          showIcon
          icon={() => <i className="pi pi-angle-down" />}
        />

        <Dropdown
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.value)}
          options={locations}
          optionLabel="name"
          placeholder="Location"
          itemTemplate={itemTemplate}
          className="border-none rounded-none ml-4 cursor-pointer ring-0"
        />

        <IconField iconPosition="left" className="relative" />

        <div>
          <button
            type="submit"
            className="ml-6 border bg-green-500 px-4 py-2.5 rounded-lg disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <svg className="size-6 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" opacity="0.25" />
                <path d="M4 12a8 8 0 0 1 8-8" stroke="white" strokeWidth="4" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="size-6">
                <path
                  fillRule="evenodd"
                  d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </form>

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
