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


interface PaymentPeriodData {
  key: string;
  amount: number;
  vehicles: number;
  amountPct: number;
  vehiclesPct: number;
}

interface PaymentComparisonItem {
  key: string;
  label?: string;
  p1: PaymentPeriodData;
  p2: PaymentPeriodData;
  changes: {
    amountPctChange: number;
    vehiclesDiff: number;
    vehiclesPctChange: number | null;
  };
}

interface ShiftComparisonItem {
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
  shiftComparison: Record<string, ShiftComparisonItem>;
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
    <FileIcon />
    <span>{option.name}</span>
  </div>
);

const fmtNum = (n: number) => (n ?? 0).toLocaleString();
const fmtTk = (n: number) => `${(n ?? 0).toLocaleString()}`;
const fmtPct = (n: number) => `${(n ?? 0).toFixed(2)}%`;

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
  result: ComparisonResult | null
) => {
  if (!result) return 0;

  if (isTotalRow) {
    return period === "p1"
      ? result.period1.totalAmount || 0
      : result.period2.totalAmount || 0;
  }

  const amount = row?.[period]?.amount ?? 0;
  return amount;
};

/**
 * Get share (%) of this method in the given period.
 * Uses method amount / period totalAmount * 100.
 */
const getMethodShare = (
  row: any,
  period: "p1" | "p2",
  _isTotalRow: boolean,
  result: ComparisonResult | null
) => {
  if (!result) return 0;

  const total =
    period === "p1"
      ? result.period1.totalAmount || 0
      : result.period2.totalAmount || 0;

  if (!total) return 0;

  const amount = getMethodAmount(row, period, false, result);
  return (amount / total) * 100;
};

// ---------- COMPONENT ----------

export default function PeriodFiltersSection() {
  const resultsRef = useRef<HTMLDivElement>(null);

  const [p1, setP1] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [p2, setP2] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
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
        `${import.meta.env.VITE_BASE_URL}/api/v1/toll/shiftmanual/get/shift-comparison`,
        {
          p1Start,
          p1End,
          p2Start,
          p2End,
          location: location === 'All' ? '' : location,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (res.data?.success) {
        setResult(res.data.result);
        console.log("SHIFT COMPARISON RESULT:", res.data.result);
        toast.success('Comparison data fetched!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch comparison data.');
    } finally {
      setLoading(false);
    }
  };
const exportPDF = async () => {
  if (!resultsRef.current) return;

  setHideButtons(true); // 🔥 hide buttons before export

  await new Promise((resolve) => setTimeout(resolve, 100)); // allow UI to refresh

  const canvas = await html2canvas(resultsRef.current, {
    scale: 2,
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const imgHeight = (canvas.height * pageWidth) / canvas.width;
  const pdfHeight = pdf.internal.pageSize.getHeight();

  if (imgHeight > pdfHeight) {
    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pdfHeight);
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, -pdfHeight, pageWidth, imgHeight);
  } else {
    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
  }

  pdf.save("toll-comparison.pdf");

  setHideButtons(false); // 🔥 show buttons again
};
  // const exportPDF = async () => {
  //   if (!resultsRef.current) return;
  //   const canvas = await html2canvas(resultsRef.current, {
  //     scale: 2,
  //     useCORS: true,
  //   });
  //   const imgData = canvas.toDataURL('image/png');
  //   const pdf = new jsPDF('p', 'mm', 'a4');
  //   const pageWidth = pdf.internal.pageSize.getWidth();
  //   const imgHeight = (canvas.height * pageWidth) / canvas.width;
  //   const pdfHeight = pdf.internal.pageSize.getHeight();

  //   if (imgHeight > pdfHeight) {
  //     pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pdfHeight);
  //     pdf.addPage();
  //     pdf.addImage(imgData, 'PNG', 0, -pdfHeight, pageWidth, imgHeight);
  //   } else {
  //     pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight);
  //   }

  //   pdf.save('toll-comparison.pdf');
  // };
const handlePrint = () => {
  if (!resultsRef.current) return;

  setHideButtons(true); // 🔥 hide buttons

  setTimeout(() => {
    const printContents = resultsRef.current.innerHTML;
    const w = window.open('', 'PRINT', 'height=700,width=900');

    if (w) {
      w.document.write(`
        <html>
        <head><title>Comparison</title>
        <style>
          body { font-family:sans-serif; padding:20px; }
          .border { border:1px solid #ddd; }
          .p-4 { padding:1rem; }
          .grid { display:grid; gap:1rem; grid-template-columns:repeat(2,1fr); }
        </style>
        </head>
        <body>${printContents}</body>
        </html>`
      );
      w.document.close();
      w.focus();
      w.print();
      w.close();
    }

    setHideButtons(false); // 🔥 show again after print
  }, 200); // short delay so UI updates first
};
  // const handlePrint = () => {
  //   if (!resultsRef.current) return;
  //   const printContents = resultsRef.current.innerHTML;
  //   const w = window.open('', 'PRINT', 'height=700,width=900');
  //   if (w) {
  //     w.document.write(
  //       `<html><head><title>Comparison</title><style>body{font-family:sans-serif;padding:20px;}.border{border:1px solid #ddd;}.p-4{padding:1rem;}.grid{display:grid;gap:1rem;grid-template-columns:repeat(2,1fr);}</style></head><body>${printContents}</body></html>`
  //     );
  //     w.document.close();
  //     w.focus();
  //     w.print();
  //     w.close();
  //   }
  // };

  const getDiffs = () => {
    if (!result)
      return { amountDiff: 0, amountPct: '0', vehicleDiff: 0, vehiclePct: '0' };

    const p1Amt = result.period1.totalAmount;
    const p2Amt = result.period2.totalAmount;
    const amountDiff = p2Amt - p1Amt;
    const amountPct =
      p1Amt > 0 ? ((amountDiff / p1Amt) * 100).toFixed(2) : '0';

    const p1Veh = result.period1.totalVehicles;
    const p2Veh = result.period2.totalVehicles;
    const vehicleDiff = p2Veh - p1Veh;
    const vehiclePct =
      p1Veh > 0 ? ((vehicleDiff / p1Veh) * 100).toFixed(2) : '0';

    return { amountDiff, amountPct, vehicleDiff, vehiclePct };
  };

  const diffs = getDiffs();



  const paymentTableData = result
    ? Object.values(result.paymentComparison)
    : [];

  const totalRow = result
    ? {
        key: 'TOTAL',
        label: 'TOTAL',
        p1: {
          key: 'TOTAL',
          amount: result.period1.totalAmount,
          vehicles: result.period1.totalVehicles,
          amountPct: 100,
          vehiclesPct: 100,
        },
        p2: {
          key: 'TOTAL',
          amount: result.period2.totalAmount,
          vehicles: result.period2.totalVehicles,
          amountPct: result.period1.totalAmount
            ? (result.period2.totalAmount / result.period1.totalAmount) * 100
            : 0,
          vehiclesPct: result.period1.totalVehicles
            ? (result.period2.totalVehicles / result.period1.totalVehicles) *
              100
            : 0,
        },
        changes: {
          amountPctChange:
            result.period1.totalAmount > 0
              ? ((result.period2.totalAmount - result.period1.totalAmount) /
                  result.period1.totalAmount) *
                100
              : 0,
          vehiclesDiff: result.period2.totalVehicles - result.period1.totalVehicles,
          vehiclesPctChange:
            result.period1.totalVehicles > 0
              ? ((result.period2.totalVehicles - result.period1.totalVehicles) /
                  result.period1.totalVehicles) *
                100
              : null,
        },
        _isTotal: true,
      }
    : null;

  const finalPaymentData =
    result && totalRow ? [...paymentTableData, totalRow] : paymentTableData;


  const shiftTableData = result?.shiftComparison
    ? Object.values(result.shiftComparison)
    : [];

  return (
    <div className="p-6 bg-white border rounded-lg space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#0A2472]">
          Toll Comparison (Shift-wise)
        </h3>
         <RefreshButton handleReset={handleReset} />
      </div>

     
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-sm font-bold text-gray-600 mb-2">
            Period 1 
          </h4>
          <div className="flex gap-2">
            <Calendar
              value={p1.start}
              onChange={(e) =>
                setP1({ ...p1, start: e.value as Date })
              }
              placeholder="Start"
            showIcon
                  className="p-inputtext-sm border rounded-md shadow-sm h-10"
                  inputClassName="border-none rounded-none bg-transparent text-sm"
                  icon={() => <i className="pi pi-calendar" />}
              dateFormat="dd/mm/yy"
            />
            <Calendar
              value={p1.end}
              onChange={(e) =>
                setP1({ ...p1, end: e.value as Date })
              }
              placeholder="End"
            showIcon
                  className="p-inputtext-sm border rounded-md shadow-sm h-10"
                  inputClassName="border-none rounded-none bg-transparent text-sm"
                  icon={() => <i className="pi pi-calendar" />}
              dateFormat="dd/mm/yy"
            />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-600 mb-2">
            Period 2 
          </h4>
          <div className="flex gap-2">
            <Calendar
              value={p2.start}
              onChange={(e) =>
                setP2({ ...p2, start: e.value as Date })
              }
              placeholder="Start"
          showIcon
                  className="p-inputtext-sm border rounded-md shadow-sm h-10"
                  inputClassName="border-none rounded-none bg-transparent text-sm"
                  icon={() => <i className="pi pi-calendar" />}
              dateFormat="dd/mm/yy"
            />
            <Calendar
              value={p2.end}
              onChange={(e) =>
                setP2({ ...p2, end: e.value as Date })
              }
              placeholder="End"
              showIcon
                  className="p-inputtext-sm border rounded-md shadow-sm h-10"
                  inputClassName="border-none rounded-none bg-transparent text-sm"
                  icon={() => <i className="pi pi-calendar" />}
              dateFormat="dd/mm/yy"
            />
          </div>
        </div>
      </div>

      
      <div className="flex justify-center items-center gap-4 pt-2">
        <Dropdown
          value={location}
          onChange={(e) => setLocation(e.value)}
          options={locationType}
          optionLabel="name"
          optionValue="value"
          placeholder="Location"
          className="w-48"
          itemTemplate={itemTemplate}
        />
       
      </div>
<div className="flex justify-center items-center gap-4 pt-2">
       <button
          onClick={onCompare}
          disabled={loading}
          className="px-6 py-3 bg-[#0B1F8F] text-white rounded-lg font-bold hover:bg-blue-900 transition disabled:opacity-50"
        >
          {loading ? 'Comparing...' : 'Compare Data'}
        </button>
       
      </div>
      {result && result.period1 && (
        <div
          ref={resultsRef}
          className="space-y-8 mt-8 animate-fade-in"
        >
          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="text-xl font-bold text-gray-800">
             Shift Wise Comparison Report
            </h3>
            {
              !hideButtons && 
                <TollButtonIcons 
              isGraphVisible={showGraph}
              openNew={toggleGraph}
              exportPDF={exportPDF}
              handlePrint={handlePrint}
            />
            }
          
          </div>

      
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
            <div className="p-5 border border-gray-100 bg-white rounded-xl shadow-sm">
              <h4 className="text-blue-900 font-semibold mb-2">
                Total Toll
              </h4>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-gray-500">Period 1</p>
                  <p className="text-xl font-bold text-gray-800">
                    {fmtTk(result.period1.totalAmount)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Period 2</p>
                  <p className="text-xl font-bold text-blue-700">
                    {fmtTk(result.period2.totalAmount)}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-blue-200 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Difference:
                </span>
                <span
                  className={`font-bold ${
                    diffs.amountDiff >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {diffs.amountDiff >= 0 ? '+' : ''}
                  {fmtTk(diffs.amountDiff)}{' '}
                  <span className="text-xs ml-1">
                    ({diffs.amountPct}%)
                  </span>
                </span>
              </div>
            </div>

            
            <div className="p-5 border border-gray-100 bg-white rounded-xl shadow-sm">
              <h4 className="text-blue-900 font-semibold mb-2">
                Total Traffic
              </h4>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-gray-500">Period 1</p>
                  <p className="text-xl font-bold text-gray-800">
                    {fmtNum(result.period1.totalVehicles)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Period 2</p>
                  <p className="text-xl font-bold text-purple-700">
                    {fmtNum(result.period2.totalVehicles)}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-purple-200 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Difference:
                </span>
                <span
                  className={`font-bold ${
                    diffs.vehicleDiff >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {diffs.vehicleDiff >= 0 ? '+' : ''}
                  {fmtNum(diffs.vehicleDiff)}{' '}
                  <span className="text-xs ml-1">
                    ({diffs.vehiclePct}%)
                  </span>
                </span>
              </div>
            </div>
          </div>

    
          {showGraph && result.chartData && (
            <div className="p-4 border rounded-lg">
              <h4 className="font-bold text-gray-700 mb-4">
                Shift-wise Traffic Comparison
              </h4>
              <div className="h-80">
                <Chart
                  type="bar"
                  data={{
                    labels: result.chartData.labels, 
                    datasets: [
                      {
                        label: 'Period 1',
                        data: result.chartData.dataset1,
                        backgroundColor: '#1E3A8A',
                      },
                      {
                        label: 'Period 2',
                        data: result.chartData.dataset2,
                        backgroundColor: '#60A5FA',
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
          )}

       
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h4 className="font-bold text-gray-700">
                Payment Method Analysis
              </h4>
            </div>
            <DataTable
              value={finalPaymentData}
              rowClassName={(data) =>
                (data as any)._isTotal
                  ? 'bg-gray-100 font-bold border-t-2'
                  : ''
              }
              showGridlines
              stripedRows
            >
              <Column
                field="key"
                header="Method"
                body={(r: any) =>
                  r._isTotal
                    ? 'TOTAL'
                    : r.label
                    ? r.label
                    : PAYMENT_METHODS[r.key] || r.key
                }
                headerClassName="bg-red-200  "
              />

               <Column
                header="P1 Revenue"
                body={(r: any) => {
                  const isTotal = !!r._isTotal;
                  const amount = getMethodAmount(
                    r,
                    'p1',
                    isTotal,
                    result
                  );
                  return fmtTk(amount);
                }}
                headerClassName="bg-red-200"
              />

      
              <Column
                header="P1 Share"
                body={(r: any) => {
                  const isTotal = !!r._isTotal;
                  if (isTotal) return '100.00%';
                  const pct = getMethodShare(
                    r,
                    'p1',
                    false,
                    result
                  );
                  return fmtPct(pct);
                }}
                headerClassName="bg-red-200"
              />

         
              <Column
                header="P2 Revenue"
                body={(r: any) => {
                  const isTotal = !!r._isTotal;
                  const amount = getMethodAmount(
                    r,
                    'p2',
                    isTotal,
                    result
                  );
                  return fmtTk(amount);
                }}
                headerClassName="bg-red-200"
              />

     
              <Column
                header="P2 Share"
                body={(r: any) => {
                  const isTotal = !!r._isTotal;
                  if (isTotal) return '100.00%';
                  const pct = getMethodShare(
                    r,
                    'p2',
                    false,
                    result
                  );
                  return fmtPct(pct);
                }}
                headerClassName="bg-red-200"
              />

         
              <Column
                header="Share Change"
                headerClassName="bg-red-200"
                body={(r: any) => {
                  if (r?._isTotal) return '-';

                  const p1Share = getMethodShare(
                    r,
                    'p1',
                    false,
                    result
                  );
                  const p2Share = getMethodShare(
                    r,
                    'p2',
                    false,
                    result
                  );
                  const val = p2Share - p1Share;
                  const displayVal = val.toFixed(2);
                  const color =
                    val > 0
                      ? 'text-green-600'
                      : val < 0
                      ? 'text-red-600'
                      : 'text-gray-400';

                  return (
                    <span className={`font-bold ${color}`}>
                      {val > 0 ? '+' : ''}
                      {displayVal}% pts
                    </span>
                  );
                }}
              />
            </DataTable>
          </div>

          {/* Shift Traffic Table */}
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h4 className="font-bold text-gray-700">
                Shift-wise Traffic Comparison
              </h4>
            </div>
            <DataTable value={shiftTableData} showGridlines stripedRows>
              <Column
                header="Shift"
                body={(r: any) => r.key}
                headerClassName="bg-red-200"
              />
              <Column
                field="p1"
                header="P1 Count"
                body={(r: any) => fmtNum(r.p1)}
                headerClassName="bg-red-200"
              />
              <Column
                field="p2"
                header="P2 Count"
                body={(r: any) => fmtNum(r.p2)}
                headerClassName="bg-red-200"
              />
              <Column
                header="Diff"
                body={(r: any) => (
                  <span
                    className={
                      r.diff > 0
                        ? 'text-green-600'
                        : r.diff < 0
                        ? 'text-red-600'
                        : ''
                    }
                  >
                    {r.diff > 0 ? '+' : ''}
                    {fmtNum(r.diff)}
                  </span>
                )}
                headerClassName="bg-red-200"
              />
              <Column
                header="% Change"
                headerClassName="bg-red-200"
                body={(r: any) => {
                  const val = r.pctChange;
                  const color =
                    val > 0
                      ? 'text-green-600'
                      : val < 0
                      ? 'text-red-600'
                      : 'text-gray-400';
                  return (
                    <span className={`font-bold ${color}`}>
                      {val > 0 ? '+' : ''}
                      {val}%
                    </span>
                  );
                }}
              />
            </DataTable>
          </div>
        </div>
      )}
    </div>
  );
}
