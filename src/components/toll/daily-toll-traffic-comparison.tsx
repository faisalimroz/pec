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
import { toast } from 'sonner'
import { FilePreview } from '@/components/file-preview';
import "../../styles/table-style.css";
import RefreshButton from '@/components/refresh-button'

interface PeriodData {
  totalRevenue: number;
  totalVehicles: number;
}

interface PaymentComparisonItem {
  key: string;
  label?: string;
  p1: PeriodData;
  p2: PeriodData;
  changes: {
    amountPctChange: number;
    vehiclesDiff: number;
    vehiclesPctChange: number | null;
  };
}

interface VehicleComparisonItem {
  key: string;
  p1: number;
  p2: number;
  diff: number;
  pctChange: number;
}

interface PeriodTotal {
  totalAmount: number;
  totalVehicles: number;
}

interface ComparisonResult {
  meta: any;
  period1: PeriodTotal;
  period2: PeriodTotal;
  paymentComparison: Record<string, PaymentComparisonItem>;
  vehicleComparison: Record<string, VehicleComparisonItem>;
  chartData?: {
    labels: string[];
    dataset1: number[];
    dataset2: number[];
  };
}

const locationType = [
  { name: 'All', value: 'All' },
  { name: 'Mawa', value: 'Mawa' },
  { name: 'Janjira', value: 'Janjira' },
];

const VEHICLE_LABELS: Record<string, string> = {
  trailer5xl: 'Trailer (Above 4Axle)',
  trailer4xl: 'Trailer (4Axle)',
  trailer3xl: 'Trailer (3Axle)',
  medium_truck9: 'Medium Truck (8-11)',
  medium_truck8: 'Medium Truck (5-8)',
  mini_truck: 'Mini Truck',
  big_bus: 'Big Bus',
  medium_bus: 'Medium Bus',
  mini_bus: 'Mini Bus',
  micro_bus: 'Micro Bus',
  pickup: 'Pickup',
  car: 'Car/Jeep',
  bike: 'Motorcycle',
};

const PAYMENT_METHODS: Record<string, string> = {
  cash: "Cash",
  exempt: "Exempt",
  credit: "Credit",
  office: "Office",
  eptag: "EP Tag",
  eltag: "EL Tag",
  epcard: "EP Card",
  elcard: "EL Card",
};

const itemTemplate = (option: { name: string; code: string }) => (
  <div className="flex items-center gap-2">
    <FileIcon /><span>{option.name}</span>
  </div>
);

const fmtNum = (n: number) => n?.toLocaleString() || '0';
const fmtTk = (n: number) => `${n?.toLocaleString() || '0'}`;
const fmtPct = (n: number) => `${n?.toFixed(2)}%`;

const formatDateForApi = (d?: Date | null): string | null => {
  if (!d) return null;
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};
const getMethodAmount = (
  row: any,
  period: "p1" | "p2",
  isTotalRow: boolean,
  result: any
) => {
  if (isTotalRow) {
    if (period === "p1") return result?.period1?.totalAmount || 0;
    return result?.period2?.totalAmount || 0;
  }

  const key = row.key;
  return row?.[period]?.paymentMap?.[key]?.amount ?? 0;
};

const getMethodShare = (
  row: any,
  period: "p1" | "p2",
  isTotalRow: boolean,
  result: any
) => {
  const total =
    period === "p1"
      ? result?.period1?.totalAmount || 0
      : result?.period2?.totalAmount || 0;

  if (!total || total === 0) return 0;

  const amount = getMethodAmount(row, period, isTotalRow, result);
  return (amount / total) * 100;
};

export default function PeriodFiltersSection() {
  const resultsRef = useRef<HTMLDivElement>(null);

  const [p1, setP1] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [p2, setP2] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [location, setLocation] = useState<string>('All');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [showGraph, setShowGraph] = useState(false);
  const [hideButtons, setHideButtons] = useState(false);

  const handleReset = () => {
    setP1({ start: null, end: null });
    setP2({ start: null, end: null });
    setLocation('All');
    setResult(null);
    setShowGraph(false);
  };

  const toggleGraph = () => setShowGraph(!showGraph);

  const onCompare = async () => {
    const p1Start = formatDateForApi(p1.start);
    const p1End = formatDateForApi(p1.end);
    const p2Start = formatDateForApi(p2.start);
    const p2End = formatDateForApi(p2.end);

    if (!p1Start || !p1End || !p2Start || !p2End) {
      toast.warning('Please select start and end dates for both periods.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/toll/kecmanual/get/period-comparison`,
        {
          p1Start, p1End, p2Start, p2End,
          location: location === 'All' ? '' : location,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      if (res.data?.success) {
        setResult(res.data.result);
        console.log(res.data.result)
        toast.success("Comparison data fetched!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch comparison data.");
    } finally {
      setLoading(false);
    }
  };
  const exportPDF = async () => {
    if (!resultsRef.current) return;

    // Hide buttons
    setHideButtons(true);

    // Wait for UI update
    await new Promise(resolve => setTimeout(resolve, 100));

    const canvas = await html2canvas(resultsRef.current, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pageWidth) / canvas.width;
    const pdfHeight = pdf.internal.pageSize.getHeight();

    if (imgHeight > pdfHeight) {
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pdfHeight);
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, -pdfHeight, pageWidth, imgHeight);
    } else {
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight);
    }

    pdf.save('toll-comparison.pdf');

    // Show buttons again
    setHideButtons(false);
  };
  const handlePrint = () => {
    if (!resultsRef.current) return;

    // Hide buttons
    setHideButtons(true);

    setTimeout(() => {
      const printContents = resultsRef.current.innerHTML;
      const w = window.open('', 'PRINT', 'height=700,width=900');

      if (w) {
        w.document.write(`
        <html>
        <head>
          <title>Comparison</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            .border { border: 1px solid #ddd; }
            .p-4 { padding: 1rem; }
            .grid { display: grid; gap: 1rem; grid-template-columns: repeat(2, 1fr); }
          </style>
        </head>
        <body>${printContents}</body>
        </html>
      `);

        w.document.close();
        w.focus();
        w.print();
        w.close();
      }

      // Show buttons after printing
      setHideButtons(false);
    }, 200); // small delay so UI hides before print opens
  };

  const getDiffs = () => {
    if (!result) return { amountDiff: 0, amountPct: 0, vehicleDiff: 0, vehiclePct: 0 };

    const p1Amt = result.period1.totalAmount;
    const p2Amt = result.period2.totalAmount;
    const amountDiff = p2Amt - p1Amt;
    const amountPct = p1Amt > 0 ? ((amountDiff / p1Amt) * 100).toFixed(2) : '0';
    const p1Veh = result.period1.totalVehicles;
    const p2Veh = result.period2.totalVehicles;
    const vehicleDiff = p2Veh - p1Veh;
    const vehiclePct = p1Veh > 0 ? ((vehicleDiff / p1Veh) * 100).toFixed(2) : '0';

    return { amountDiff, amountPct, vehicleDiff, vehiclePct };
  };

  const diffs = getDiffs();


  const paymentTableData = result ? Object.values(result.paymentComparison) : [];


  const totalRow = result
    ? {
      key: "TOTAL",
      label: "TOTAL",
      p1: { totalRevenue: result.period1.totalAmount, totalVehicles: result.period1.totalVehicles },
      p2: { totalRevenue: result.period2.totalAmount, totalVehicles: result.period2.totalVehicles },
      changes: {
        amountPctChange: result.period1.totalAmount > 0
          ? ((result.period2.totalAmount - result.period1.totalAmount) / result.period1.totalAmount) * 100
          : 0,
      },
      _isTotal: true,
    }
    : null;

  const finalPaymentData = result && totalRow ? [...paymentTableData, totalRow] : paymentTableData;
  const vehicleTableData = result?.vehicleComparison ? Object.values(result.vehicleComparison) : [];

  // --- NEW CODE: Calculate Totals for Second Table ---
  const p1TotalVehicles = vehicleTableData.reduce((sum, item) => sum + (Number(item.p1) || 0), 0);
  const p2TotalVehicles = vehicleTableData.reduce((sum, item) => sum + (Number(item.p2) || 0), 0);
  const diffTotalVehicles = p2TotalVehicles - p1TotalVehicles;
  const pctChangeTotalVehicles = p1TotalVehicles > 0
    ? ((diffTotalVehicles / p1TotalVehicles) * 100).toFixed(2)
    : 0;

  const vehicleTotalRow = {
    key: 'TOTAL',
    p1: p1TotalVehicles,
    p2: p2TotalVehicles,
    diff: diffTotalVehicles,
    pctChange: pctChangeTotalVehicles,
    _isTotal: true
  };

  const finalVehicleData = vehicleTableData.length > 0
    ? [...vehicleTableData, vehicleTotalRow]
    : [];
  // --------------------------------------------------

  const calculateShare = (amount: number, total: number) => {
    if (!total || total === 0) return 0;
    return (amount / total) * 100;
  };

  return (
    <div className="p-6 bg-white border rounded-lg space-y-6">

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#0A2472]">Toll Comparison</h3>
        <RefreshButton handleReset={handleReset} />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-sm font-bold text-gray-600 mb-2">Period 1</h4>
          <div className="flex gap-2">
            <Calendar
              value={p1.start}
              onChange={(e) => setP1({ ...p1, start: e.value as Date })}
              placeholder="Start"
              showIcon
              className="p-inputtext-sm border rounded-md shadow-sm h-10"
              inputClassName="border-none rounded-none bg-transparent text-sm"
              icon={() => <i className="pi pi-calendar" />}
              dateFormat="dd/mm/yy" />
            <Calendar value={p1.end} onChange={(e) => setP1({ ...p1, end: e.value as Date })}
              placeholder="End"
              showIcon

              className="p-inputtext-sm border rounded-md shadow-sm h-10"
              inputClassName="border-none rounded-none bg-transparent text-sm"
              icon={() => <i className="pi pi-calendar" />}
              dateFormat="dd/mm/yy" />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-600 mb-2">Period 2 </h4>
          <div className="flex gap-2">
            <Calendar value={p2.start} onChange={(e) => setP2({ ...p2, start: e.value as Date })}
              placeholder="Start"
              showIcon
              className="p-inputtext-sm border rounded-md shadow-sm h-10"
              inputClassName="border-none rounded-none bg-transparent text-sm"
              icon={() => <i className="pi pi-calendar" />}
              dateFormat="dd/mm/yy" />
            <Calendar value={p2.end} onChange={(e) => setP2({ ...p2, end: e.value as Date })}
              placeholder="End"
              showIcon
              className="p-inputtext-sm border rounded-md shadow-sm h-10"
              inputClassName="border-none rounded-none bg-transparent text-sm"
              icon={() => <i className="pi pi-calendar" />}
              dateFormat="dd/mm/yy" />
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center gap-4 pt-2">
        <Dropdown value={location} onChange={(e) => setLocation(e.value)}
          options={locationType}
          optionLabel="name"
          optionValue="value"
          placeholder="Location"
          className="w-48"
          itemTemplate={itemTemplate} />

      </div>
      <div className="flex justify-center">
        <button onClick={onCompare} disabled={loading} className="px-6 py-3 bg-[#0B1F8F]   text-white rounded-lg font-bold hover:bg-blue-900 transition disabled:opacity-50">
          {loading ? 'Comparing...' : 'Compare Data'}
        </button>
      </div>
      {result && result.period1 && (
        <div ref={resultsRef} className="space-y-8 mt-8 animate-fade-in">

          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="text-xl font-bold text-gray-800">Comparison Report</h3>
            {!hideButtons && (
              <TollButtonIcons
                isGraphVisible={showGraph}
                openNew={toggleGraph}
                exportPDF={exportPDF}
                handlePrint={handlePrint}
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 border border-blue-100 bg-white rounded-xl shadow-sm">
              <h4 className="text-blue-900 font-semibold mb-2">Total Toll</h4>
              <div className="flex justify-between items-end">
                <div><p className="text-sm text-gray-500">Period 1</p><p className="text-xl font-bold text-gray-800">{fmtTk(result.period1.totalAmount)}</p></div>
                <div className="text-right"><p className="text-sm text-gray-500">Period 2</p><p className="text-xl font-bold text-blue-700">{fmtTk(result.period2.totalAmount)}</p></div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Difference:</span>
                <span className={`font-bold ${diffs.amountDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {diffs.amountDiff >= 0 ? '+' : ''}{fmtTk(diffs.amountDiff)} <span className="text-xs ml-1">({diffs.amountPct}%)</span>
                </span>
              </div>
            </div>


            <div className="p-5 border border-gray-200 bg-white rounded-xl shadow-sm">
              <h4 className="text-blue-900 font-semibold mb-2">Total Traffic</h4>
              <div className="flex justify-between items-end">
                <div><p className="text-sm text-gray-500">Period 1</p><p className="text-xl font-bold text-gray-800">{fmtNum(result.period1.totalVehicles)}</p></div>
                <div className="text-right"><p className="text-sm text-gray-500">Period 2</p><p className="text-xl font-bold text-blue-700">{fmtNum(result.period2.totalVehicles)}</p></div>
              </div>
              <div className="mt-3 pt-3 border-t border-purple-200 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Difference:</span>
                <span className={`font-bold ${diffs.vehicleDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {diffs.vehicleDiff >= 0 ? '+' : ''}{fmtNum(diffs.vehicleDiff)} <span className="text-xs ml-1">({diffs.vehiclePct}%)</span>
                </span>
              </div>
            </div>
          </div>


          {showGraph && result.chartData && (
            <div className="p-4 border rounded-lg">
              <h4 className="font-bold text-gray-700 mb-4">Vehicle Count Trend</h4>
              <div className="h-80">
                <Chart type="bar" data={{
                  labels: result.chartData.labels.map(l => VEHICLE_LABELS[l] || l),
                  datasets: [
                    { label: 'Period 1', data: result.chartData.dataset1, backgroundColor: '#1E3A8A' },
                    { label: 'Period 2', data: result.chartData.dataset2, backgroundColor: '#60A5FA' }
                  ]
                }} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          )}


          <div className="border rounded-lg overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-4 py-3 border-b"><h4 className="font-bold text-gray-700">Payment Method Analysis (Revenue)</h4></div>
            <DataTable
              value={finalPaymentData}
              rowClassName={(data) =>
                (data as any)._isTotal ? "bg-blue-100 font-bold border-t-2" : ""
              }
              showGridlines
              stripedRows
            >
              <Column
                field="key"
                header="Method"
                body={(r: any) =>
                  r._isTotal
                    ? "TOTAL"
                    : r.label
                      ? r.label
                      : PAYMENT_METHODS[r.key] || r.key
                }
                headerClassName="bg-red-200"
              />


              <Column
                header="P1 Revenue"
                body={(r: any) => {
                  const isTotal = !!r._isTotal;
                  const amount = getMethodAmount(r, "p1", isTotal, result);
                  return fmtTk(amount);
                }}
                headerClassName="bg-red-200"
              />


              <Column
                header="P1 Share"
                body={(r: any) => {
                  const isTotal = !!r._isTotal;
                  if (isTotal) return "100.00%";
                  const pct = getMethodShare(r, "p1", false, result);
                  return fmtPct(pct);
                }}
                headerClassName="bg-red-200"
              />


              <Column
                header="P2 Revenue"
                body={(r: any) => {
                  const isTotal = !!r._isTotal;
                  const amount = getMethodAmount(r, "p2", isTotal, result);
                  return fmtTk(amount);
                }}
                headerClassName="bg-red-200"
              />


              <Column
                header="P2 Share"
                body={(r: any) => {
                  const isTotal = !!r._isTotal;
                  if (isTotal) return "100.00%";
                  const pct = getMethodShare(r, "p2", false, result);
                  return fmtPct(pct);
                }}
                headerClassName="bg-red-200"
              />


              <Column
                header="Share Change"
                headerClassName="bg-red-200"
                body={(r: any) => {
                  if (r?._isTotal) return "-";

                  const p1Share = getMethodShare(r, "p1", false, result);
                  const p2Share = getMethodShare(r, "p2", false, result);
                  const val = p2Share - p1Share;
                  const displayVal = val.toFixed(2);

                  const color =
                    val > 0 ? "text-green-600" : val < 0 ? "text-red-600" : "text-gray-400";

                  return (
                    <span className={`font-bold ${color}`}>
                      {val > 0 ? "+" : ""}
                      {displayVal}% pts
                    </span>
                  );
                }}
              />
            </DataTable>

          </div>


          <div className="border rounded-lg overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-4 py-3 border-b"><h4 className="font-bold text-gray-700">Vehicle Class Comparison (Traffic)</h4></div>
            <DataTable 
              value={finalVehicleData} 
              showGridlines 
              stripedRows
              rowClassName={(data) => (data._isTotal ? "bg-blue-100 font-bold border-t-2" : "")}
            >
              <Column 
                header="Vehicle Type" 
                body={(r: any) => r._isTotal ? "TOTAL" : (VEHICLE_LABELS[r.key] || r.key)} 
                headerClassName="bg-red-200" 
              />
              <Column field="p1" header="P1 Count" body={(r: any) => fmtNum(r.p1)} headerClassName="bg-red-200" />
              <Column field="p2" header="P2 Count" body={(r: any) => fmtNum(r.p2)} headerClassName="bg-red-200" />
              <Column header="Diff" body={(r: any) => (
                <span className={r.diff > 0 ? 'text-green-600' : r.diff < 0 ? 'text-red-600' : ''}>
                  {r.diff > 0 ? '+' : ''}{fmtNum(r.diff)}
                </span>
              )} headerClassName="bg-red-200" />
              <Column header="% Change" headerClassName="bg-red-200" body={(r: any) => {
                const val = Number(r.pctChange); // Ensure number
                const color = val > 0 ? 'text-green-600' : val < 0 ? 'text-red-600' : 'text-gray-400';
                return <span className={`font-bold ${color}`}>{val > 0 ? '+' : ''}{val}%</span>;
              }}
              />
            </DataTable>
          </div>

        </div>
      )}
    </div>
  );
}