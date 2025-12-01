import React, { useState, useRef } from 'react';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import FileIcon from '../icons/FileIcon';
import TollButtonIcons from '../ui/comparison-button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import axios from 'axios';
import "../../styles/table-style.css";
import RefreshButton from "@/components/refresh-button";
type PaymentMethod = 'Cash' | 'Card' | 'ETC' | 'Exempt' | 'Discount';
type VehicleType =
  | 'Trailer (4 Axle)'
  | 'Truck (3 Axle)'
  | 'Medium Truck (8-11)'
  | 'Medium Truck (5-8)'
  | 'Mini Truck'
  | 'Big Bus'
  | 'Medium Bus'
  | 'Mini Bus';

interface PeriodFilters {
  start?: Date | null;
  end?: Date | null;
  location?: string | null;
  vehicleType?: VehicleType | null;
  payment?: PaymentMethod | null;
}

interface ComparisonResult {
  vehicles1: number;
  vehicles2: number;
  revenue1: number;
  revenue2: number;
  avgDaily1: number;
  avgDaily2: number;
  chartLabels: string[];
  chartData1: number[];
  chartData2: number[];
}

const locationType = [
  { name: 'All Locations', value: 'All' },
  { name: 'Mawa', value: 'Mawa' },
  { name: 'Jinjira', value: 'Jinjira' },
];

const itemTemplate = (option: { name: string; code: string }) => {
  return (
    <div className="flex items-center gap-2">
      <FileIcon />
      <span>{option.name}</span>
    </div>
  );
};

const vehicleType = [
  { label: 'Trailer (4 Axle)', value: 'Trailer (4 Axle)' },
  { label: 'Truck (3 Axle)', value: 'Truck (3 Axle)' },
  { label: 'Medium Truck (8-11)', value: 'Medium Truck (8-11)' },
  { label: 'Medium Truck (5-8)', value: 'Medium Truck (5-8)' },
  { label: 'Mini Truck', value: 'Mini Truck' },
  { label: 'Big Bus', value: 'Big Bus' },
  { label: 'Medium Bus', value: 'Medium Bus' },
  { label: 'Mini Bus', value: 'Mini Bus' },
];

const paymentOptions = [
  { label: 'Cash', value: 'Cash' },
  { label: 'Card', value: 'Card' },
  { label: 'ETC', value: 'ETC' },
  { label: 'Exempt', value: 'Exempt' },
  { label: 'Discount', value: 'Discount' },
];

const fmtNum = (n: number) => n.toLocaleString();
const fmtTk = (n: number) => `৳ ${n.toLocaleString()}`;
const pct = (x: number) => `${(x * 100).toFixed(1)}%`;
const pctChange = (a: number, b: number) => {
  if (!a) return 'N/A';
  return `${(((b - a) / a) * 100).toFixed(1)}%`;
};
function buildPaymentBreakdown(total1: number, total2: number) {
  const totalAll = total1 + total2;

  // ✅ If there is no data, return all zeros
  if (totalAll === 0) {
    const rows = (['Cash', 'Exempt', 'Card', 'ETC', 'Discount'] as PaymentMethod[]).map(
      (m) => ({
        method: m,
        p1: 0,
        p1Pct: 0,
        p2: 0,
        p2Pct: 0,
        changePct: 0,
      })
    );

    const totals = {
      method: 'Total',
      p1: 0,
      p1Pct: 0,
      p2: 0,
      p2Pct: 0,
      changePct: 0,
      _isTotal: true,
    };

    return { rows, totals };
  }

  const shares: Record<Exclude<PaymentMethod, 'Discount'>, number> = {
    Cash: 0.43,
    Exempt: 0.24,
    Card: 0.23,
    ETC: 0.1,
  };
  const sumKnown = Object.values(shares).reduce((a, b) => a + b, 0);
  const discountShare = Math.max(0, 1 - sumKnown);

  const rows = (['Cash', 'Exempt', 'Card', 'ETC', 'Discount'] as PaymentMethod[]).map((m) => {
    const s = m === 'Discount' ? discountShare : shares[m as Exclude<PaymentMethod, 'Discount'>];
    const p1 = Math.round(total1 * s);
    const p2 = Math.round(total2 * s);
    return {
      method: m,
      p1,
      p1Pct: total1 ? p1 / total1 : 0,
      p2,
      p2Pct: total2 ? p2 / total2 : 0,
      changePct: p1 ? (p2 - p1) / p1 : 0,
    };
  });

  const sumP1 = rows.reduce((a, r) => a + r.p1, 0);
  const sumP2 = rows.reduce((a, r) => a + r.p2, 0);

  const totals = {
    method: 'Total',
    p1: sumP1,
    p1Pct: sumP1 ? 1 : 0,
    p2: sumP2,
    p2Pct: sumP2 ? 1 : 0,
    changePct: sumP1 ? (sumP2 - sumP1) / sumP1 : 0,
    _isTotal: true,
  };

  return { rows, totals };
}


function buildVehicleBreakdown(total1: number, total2: number) {
  const shares: Record<VehicleType, number> = {
    'Trailer (4 Axle)': 0.091,
    'Truck (3 Axle)': 0.14,
    'Medium Truck (8-11)': 0.022,
    'Medium Truck (5-8)': 0.14,
    'Mini Truck': 0.044,
    'Big Bus': 0.016,
    'Medium Bus': 0.034,
    'Mini Bus': 0.11,
    
  };
  const norm = Object.values(shares).reduce((a, b) => a + b, 0);

  const rows = (Object.keys(shares) as VehicleType[]).map((k) => {
    const s = shares[k] / norm;
    const p1 = Math.round(total1 * s);
    const p2 = Math.round(total2 * s);
    return { type: k, p1, p2, changePct: p1 ? (p2 - p1) / p1 : 0 };
  });

  const totals = {
    type: 'Total (All Vehicles)',
    p1: rows.reduce((a, r) => a + r.p1, 0),
    p2: rows.reduce((a, r) => a + r.p2, 0),
    changePct: rows.reduce((a, r) => a + r.p1, 0)
      ? (rows.reduce((a, r) => a + r.p2, 0) - rows.reduce((a, r) => a + r.p1, 0)) /
        rows.reduce((a, r) => a + r.p1, 0)
      : 0,
    _isTotal: true,
  };

  return { rows, totals };
}

type PresetType = 'week' | 'month' | 'quarter' | null;

const formatDateForApi = (d?: Date | null): string | null => {
  if (!d) return null;
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export default function PeriodFiltersSection() {
  const paymentTableRef = useRef<DataTable<any>>(null);
  const vehicleTableRef = useRef<DataTable<any>>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [showGraph, setShowGraph] = useState<boolean>(false);

  const [p1, setP1] = useState<PeriodFilters>({
    start: null,
    end: null,
});

const [p2, setP2] = useState<PeriodFilters>({
    start: null,
    end: null,
});

  const [info, setInfo] = useState<PeriodFilters>({
    location: 'All',
    vehicleType: null,
    payment: null,
  });

  const [result, setResult] = useState<ComparisonResult | null>(null);

  const [activePreset, setActivePreset] = useState<{ p1: PresetType; p2: PresetType }>({
    p1: null,
    p2: null,
  });

  const setQuickRange = (period: 'p1' | 'p2', preset: 'week' | 'month' | 'quarter') => {
    const now = new Date();
    let start = new Date();

    if (preset === 'week') {
      start.setDate(now.getDate() - 7);
    } else if (preset === 'month') {
      start.setMonth(now.getMonth() - 1);
    } else {
      start.setMonth(now.getMonth() - 3);
    }

    if (period === 'p1') {
      setP1((prev) => ({ ...prev, start, end: now }));
      setActivePreset((prev) => ({ ...prev, p1: preset }));
    } else {
      setP2((prev) => ({ ...prev, start, end: now }));
      setActivePreset((prev) => ({ ...prev, p2: preset }));
    }
  };



  const exportPDF = async () => {
    if (!resultsRef.current) return;
    const canvas = await html2canvas(resultsRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('toll-comparison.pdf');
  };

  const handlePrint = () => {
    if (!resultsRef.current) return;
    const printContents = resultsRef.current.innerHTML;
    const w = window.open('', 'PRINT', 'height=700,width=900,top=50,left=50');
    if (!w) return;
    w.document.write(`
      <html>
        <head>
          <title>Toll & Traffic Comparison</title>
          <style>
            body { font-family: Inter, Arial, sans-serif; padding: 16px; }
            .border { border: 1px solid #e5e7eb; }
            .rounded-lg { border-radius: 0.5rem; }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };
const handleReset = () => {
    setP1({ start: null, end: null }); 
    setP2({ start: null, end: null });
    setActivePreset({ p1: null, p2: null });
    setInfo({ location: 'All', vehicleType: null, payment: null });
    setResult(null);
    setShowGraph(false);
  };
  const toggleGraph = () => setShowGraph((s) => !s);

  const onCompare = async () => {
    const p1Start = formatDateForApi(p1.start);
    const p1End = formatDateForApi(p1.end);
    const p2Start = formatDateForApi(p2.start);
    const p2End = formatDateForApi(p2.end);

    if (!p1Start || !p1End || !p2Start || !p2End) {
      alert('Please select start and end dates for both time periods.');
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/toll/kecmanual/get/period-comparison`,
        {
          p1Start,
          p1End,
          p2Start,
          p2End,
          location: info.location || 'All',
          vehicleType: info.vehicleType || null,
          payment: info.payment || null,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        }
      );

      if (res.data?.success && res.data.result) {
        setResult(res.data.result as ComparisonResult);
      } else {
        alert(res.data?.message || 'Failed to fetch comparison data.');
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching comparison data from server.');
    }
  };

  return (
    <div className="p-6 bg-white border rounded-lg space-y-6">
      <div className='flex justify-between items-center '>
        <h3 className="text-lg font-semibold">Select Time Periods to Compare</h3>
      <RefreshButton handleReset={handleReset} />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* First Time Period */}
        <div>
          <h4 className="text-sm font-medium text-[#0A2472] mb-2">First Time Period</h4>
          <div className="flex w-fit gap-2 divide-x-2 border p-2 rounded-md bg-white">
            <Calendar
              value={p1.start || null}
              onChange={(e) => setP1({ ...p1, start: e.value as Date })}
              placeholder="Start Date"
              inputClassName="border-none rounded-none cursor-pointer focus:ring-0"
              dateFormat="dd/mm/yy"
              showIcon
              icon={() => <i className="pi pi-calendar" />}
            />
            <Calendar
              value={p1.end || null}
              onChange={(e) => setP1({ ...p1, end: e.value as Date })}
              placeholder="End Date"
              inputClassName="border-none rounded-none cursor-pointer focus:ring-0"
              dateFormat="dd/mm/yy"
              showIcon
              icon={() => <i className="pi pi-calendar" />}
            />
          </div>
          {/* <div className="flex gap-2 mt-3">
            <button
              onClick={() => setQuickRange('p1', 'week')}
              disabled={activePreset.p2 === 'week'}
              className="px-2 py-3 bg-[#F3F4F6] text-[#374151] text-lg rounded-md font-semibold disabled:opacity-60"
            >
              Last Week
            </button>
            <button
              onClick={() => setQuickRange('p1', 'month')}
              disabled={activePreset.p2 === 'month'}
              className="px-2 py-3 bg-[#F3F4F6] text-[#374151] text-lg rounded-md font-semibold disabled:opacity-60"
            >
              Last Month
            </button>
            <button
              onClick={() => setQuickRange('p1', 'quarter')}
              disabled={activePreset.p2 === 'quarter'}
              className="px-2 py-3 bg-[#F3F4F6] text-[#374151] text-lg rounded-md font-semibold disabled:opacity-60"
            >
              Last Quarter
            </button>
          </div> */}
        </div>

        {/* Second Time Period */}
        <div>
          <h4 className="text-sm font-medium text-[#0A2472] mb-2">Second Time Period</h4>
          <div className="flex w-fit gap-2 divide-x-2 border p-2 rounded-md bg-white">
            <Calendar
              value={p2.start || null}
              onChange={(e) => setP2({ ...p2, start: e.value as Date })}
              placeholder="Start Date"
              dateFormat="dd/mm/yy"
              inputClassName="border-none rounded-none cursor-pointer focus:ring-0"
              showIcon
              icon={() => <i className="pi pi-calendar" />}
            />
            <Calendar
              value={p2.end || null}
              onChange={(e) => setP2({ ...p2, end: e.value as Date })}
              placeholder="End Date"
              dateFormat="dd/mm/yy"
              inputClassName="border-none rounded-none cursor-pointer focus:ring-0"
              showIcon
              icon={() => <i className="pi pi-calendar" />}
            />
          </div>
          {/* <div className="flex gap-2 mt-3">
            <button
              onClick={() => setQuickRange('p2', 'week')}
              disabled={activePreset.p1 === 'week'}
              className="px-2 py-3 bg-[#F3F4F6] text-[#374151] text-lg rounded-md font-semibold disabled:opacity-60"
            >
              Last Week
            </button>
            <button
              onClick={() => setQuickRange('p2', 'month')}
              disabled={activePreset.p1 === 'month'}
              className="px-2 py-3 bg-[#F3F4F6] text-[#374151] text-lg rounded-md font-semibold disabled:opacity-60"
            >
              Last Month
            </button>
            <button
              onClick={() => setQuickRange('p2', 'quarter')}
              disabled={activePreset.p1 === 'quarter'}
              className="px-2 py-3 bg-[#F3F4F6] text-[#374151] text-lg rounded-md font-semibold disabled:opacity-60"
            >
              Last Quarter
            </button>
          </div> */}
        </div>
      </div>

      {/* Filters */}
      <div className="flex justify-center items-center gap-5">
        <Dropdown
          value={info.location || 'All'}
          onChange={(e) => setInfo({ ...info, location: e.value })}
          options={locationType}
          placeholder="Location"
          optionLabel="name"
          optionValue="value"
          className="w-[300px] bg-[#EFEFEF] border border-[#D1D5DB]"
          itemTemplate={itemTemplate}
        />
        {/* If you want filters for vehicleType/payment, add Dropdowns here using vehicleType & paymentOptions */}
      </div>

      <div className="flex justify-center">
        <button onClick={onCompare} className="px-3 bg-[#0B1F8F] rounded-md py-2 text-white">
          Compare Data
        </button>
      </div>

    
      {result && (
        <div ref={resultsRef} className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Comparison Results</h3>

            <TollButtonIcons
              isGraphVisible={showGraph}
              openNew={toggleGraph}
              exportPDF={exportPDF}
              handlePrint={handlePrint}
            />
          </div>

   
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Total Vehicles</h4>
              <p className="text-xl font-bold">
                {fmtNum(result.vehicles1)} → {fmtNum(result.vehicles2)}
              </p>
              <p className="text-sm text-green-600">
                {pctChange(result.vehicles1, result.vehicles2)} (
                {fmtNum(result.vehicles2 - result.vehicles1)} more vehicles)
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Total Revenue</h4>
              <p className="text-xl font-bold">
                {fmtTk(result.revenue1)} → {fmtTk(result.revenue2)}
              </p>
              <p className="text-sm text-green-600">
                {pctChange(result.revenue1, result.revenue2)} (
                {fmtTk(result.revenue2 - result.revenue1)} more revenue)
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Average Daily Traffic</h4>
              <p className="text-xl font-bold">
                {fmtNum(result.avgDaily1)} → {fmtNum(result.avgDaily2)}
              </p>
              <p className="text-sm text-green-600">
                {pctChange(result.avgDaily1, result.avgDaily2)} (
                {fmtNum(result.avgDaily2 - result.avgDaily1)} more vehicles/day)
              </p>
            </div>
          </div>

          {showGraph && (
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Daily Traffic Volume Comparison</h4>
              <Chart
                type="bar"
                data={{
                  labels: result.chartLabels,
                  datasets: [
                    { label: 'First Period', data: result.chartData1, backgroundColor: '#1E3A8A' },
                    { label: 'Second Period', data: result.chartData2, backgroundColor: '#60A5FA' },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'bottom' } },
                  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
                }}
                style={{ height: 360 }}
              />
            </div>
          )}

          
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-3">Payment Method Comparison</h4>
            {(() => {
              const { rows, totals } = buildPaymentBreakdown(result.vehicles1, result.vehicles2);
              const tableData = [...rows, totals];

              return (
                <DataTable
                  value={tableData}
                  ref={paymentTableRef as any}
                  rows={12}
                  emptyMessage="No data found!"
                  rowClassName={(data: any) => (data._isTotal ? 'bg-[#E7F3FF] font-medium' : '')}
                >
                  <Column
                    header="Payment Method"
                    field="method"
                    headerClassName="bg-[#ffc2c2] text-sm"
                    bodyClassName="text-sm truncate max-w-xs"
                  />
                  <Column
                    header="Period 1"
                    body={(r) => fmtNum(r.p1)}
                    headerClassName="bg-[#ffc2c2] text-sm"
                    bodyClassName="text-sm truncate max-w-xs"
                  />
                  <Column
                    header="% of Total"
                    body={(r) => pct(r.p1Pct)}
                    headerClassName="bg-[#ffc2c2] text-sm"
                    bodyClassName="text-sm truncate max-w-xs"
                  />
                  <Column
                    header="Period 2"
                    body={(r) => fmtNum(r.p2)}
                    headerClassName="bg-[#ffc2c2] text-sm"
                    bodyClassName="text-sm truncate max-w-xs"
                  />
                  <Column
                    header="% of Total"
                    body={(r) => pct(r.p2Pct)}
                    headerClassName="bg-[#ffc2c2] text-sm"
                    bodyClassName="text-sm truncate max-w-xs"
                  />
                  <Column
                    header="% Change"
                    body={(r) => <span className="text-green-600">{pct(r.changePct)}</span>}
                    headerClassName="bg-[#ffc2c2] text-sm"
                    bodyClassName="text-sm truncate max-w-xs"
                  />
                </DataTable>
              );
            })()}
          </div>

      
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-3">Vehicle Type Comparison</h4>
            {(() => {
              const { rows, totals } = buildVehicleBreakdown(result.vehicles1, result.vehicles2);
              const tableData = [...rows, totals];

              return (
                <DataTable
                  value={tableData}
                  ref={vehicleTableRef as any}
                  rows={12}
                  emptyMessage="No data found!"
                  rowClassName={(data: any) => (data._isTotal ? 'bg-[#E7F3FF] font-medium' : '')}
                >
                  <Column
                    header="Vehicle Type"
                    field="type"
                    headerClassName="bg-[#ffc2c2] text-sm"
                    bodyClassName="text-sm truncate max-w-xs"
                  />
                  <Column
                    header="First Period"
                    body={(r) => fmtNum(r.p1)}
                    headerClassName="bg-[#ffc2c2] text-sm"
                    bodyClassName="text-sm truncate max-w-xs"
                  />
                  <Column
                    header="Second Period"
                    body={(r) => fmtNum(r.p2)}
                    headerClassName="bg-[#ffc2c2] text-sm"
                    bodyClassName="text-sm truncate max-w-xs"
                  />
                  <Column
                    header="Change"
                    body={(r) => <span className="text-green-600">{pct(r.changePct)}</span>}
                    headerClassName="bg-[#ffc2c2] text-sm"
                    bodyClassName="text-sm truncate max-w-xs"
                  />
                </DataTable>
              );
            })()}
          </div>
        </div>
      )}

      <div className="bg-blue-50 p-6 rounded-lg border border-[#EFF6FF]">
        <h4 className="font-semibold text-[#1E3A8A] mb-3">How to use this dashboard:</h4>
        <ul className="list-disc list-inside space-y-1.5 text-[#1E3A8A]">
          <li>Select two time periods you want to compare using the date fields above</li>
          {/* <li>Use the preset buttons (Last Week, Last Month, Last Quarter) for quick comparisons</li> */}
          <li>Filter by Location, Date method if needed</li>
          <li>Click "Compare Data" to see the results</li>
          <li>Use the Export or Print buttons to save or print your comparison</li>
        </ul>
      </div>
    </div>
  );
}
