import React, { useState, useRef } from "react";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Chart } from "primereact/chart";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import { toast } from "sonner";
import RefreshButton from '@/components/refresh-button'
import "../../styles/table-style.css";
import TollButtonIcons from "../ui/comparison-button";
interface ShiftStats {
  total: number;
  pass: number;
  violation: number;
  violationPct: number;
}

interface ShiftChanges {
  totalDiff: number;
  totalPctChange: number;
  passDiff: number;
  passPctChange: number;
  violationDiff: number;
  violationPctChange: number;
  violationRateDiff: number;
}

interface ShiftComparisonItem {
  shift: string;
  p1: ShiftStats;
  p2: ShiftStats;
  changes: ShiftChanges;
}

interface GlobalStats {
  p1: ShiftStats;
  p2: ShiftStats;
  changes: {
    totalPctChange: number;
    passPctChange: number;
    violationPctChange: number;
    violationRateDiff: number;
  };
}
interface WimShiftComparisonResult {
  meta: any;
  globalStats: GlobalStats;
  shiftComparison?: Record<string, ShiftComparisonItem>;
  charts?: {
    labels: string[];
    totalData: {
      p1: number[];
      p2: number[];
    };
  };
}

const locationOptions = [
  { name: "All", value: "All" },
  { name: "Mawa", value: "Mawa" },
  { name: "Janjira", value: "Janjira" },
];

const fmtNum = (n: number) =>
  typeof n === "number" && !isNaN(n) ? n.toLocaleString() : "0";

const fmtPct = (n: number) =>
  typeof n === "number" && !isNaN(n) ? `${n.toFixed(2)}%` : "0.00%";

const formatDateForApi = (d: Date | null): string | null => {
  if (!d) return null;
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const WimLocationComparison: React.FC = () => {
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const [p1Start, setP1Start] = useState<Date | null>(null);
  const [p1End, setP1End] = useState<Date | null>(null);
  const [p2Start, setP2Start] = useState<Date | null>(null);
  const [p2End, setP2End] = useState<Date | null>(null);

  const [location, setLocation] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(false);
  const [showGraph, setShowGraph] = useState<boolean>(false);

  const [result, setResult] = useState<WimShiftComparisonResult | null>(null);
  const toggleGraph = () => setShowGraph(!showGraph);

  const handleReset = () => {
    setP1Start(null);
    setP1End(null);
    setP2Start(null);
    setP2End(null);
    setLocation("All");
    setResult(null);
    setShowGraph(false);
  };

  const handleCompare = async () => {
    const p1StartStr = formatDateForApi(p1Start);
    const p1EndStr = formatDateForApi(p1End);
    const p2StartStr = formatDateForApi(p2Start);
    const p2EndStr = formatDateForApi(p2End);

    if (!p1StartStr || !p1EndStr || !p2StartStr || !p2EndStr) {
      toast.error("Please select start & end dates for both periods.");
      return;
    }

    const payload = {
      p1Start: p1StartStr,
      p1End: p1EndStr,
      p2Start: p2StartStr,
      p2End: p2EndStr,
      location: location === "All" ? "" : location,
    };

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/toll/all-wim-data/get/wim-comparison`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data?.success) {
        setResult(res.data.result as WimShiftComparisonResult);
        toast.success("Shift comparison data loaded.");
      } else {
        toast.error(res.data?.message || "Failed to load data.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while fetching comparison data.");
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = async () => {
    if (!resultsRef.current) return;
    const canvas = await html2canvas(resultsRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pageWidth) / canvas.width;
    const pageHeight = pdf.internal.pageSize.getHeight();

    if (imgHeight > pageHeight) {
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, -pageHeight, pageWidth, imgHeight);
    } else {
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
    }

    pdf.save("wim-shift-comparison.pdf");
  };

  const handlePrint = () => {
    if (!resultsRef.current) return;
    const content = resultsRef.current.innerHTML;
    const w = window.open("", "PRINT", "height=700,width=900");
    if (!w) return;

    w.document.write(`
      <html>
        <head>
          <title>WIM Shift Comparison</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            .border { border: 1px solid #ddd; }
            .p-4 { padding: 1rem; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);

    w.document.close();
    w.focus();
    w.print();
    w.close();
  };


  const shiftTableData: ShiftComparisonItem[] =
    result && result.shiftComparison
      ? (Object.values(result.shiftComparison) as ShiftComparisonItem[])
      : [];

  const hasChartData =
    !!result &&
    !!result.charts &&
    Array.isArray(result.charts.labels) &&
    Array.isArray(result.charts.totalData?.p1) &&
    Array.isArray(result.charts.totalData?.p2);

  return (
    <div className="p-6 bg-white rounded-lg border space-y-6">

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          WIM Shift-wise Comparison
        </h3>
        <RefreshButton handleReset={handleReset} />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <p className="text-sm font-bold text-gray-600 mb-2">
            Period 1
          </p>
          <div className="flex gap-2">
            <Calendar
              value={p1Start}
              onChange={(e) => setP1Start(e.value as Date)}
              placeholder="Start"
              showIcon
              className="p-inputtext-sm border rounded-md shadow-sm h-10"
              inputClassName="border-none rounded-none bg-transparent text-sm"
              icon={() => <i className="pi pi-calendar" />}
              dateFormat="dd/mm/yy"
            />
            <Calendar
              value={p1End}
              onChange={(e) => setP1End(e.value as Date)}
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
          <p className="text-sm font-bold text-gray-600 mb-2">
            Period 2
          </p>
          <div className="flex gap-2">
            <Calendar
              value={p2Start}
              onChange={(e) => setP2Start(e.value as Date)}
              placeholder="Start"
              showIcon
              className="p-inputtext-sm border rounded-md shadow-sm h-10"
              inputClassName="border-none rounded-none bg-transparent text-sm"
              icon={() => <i className="pi pi-calendar" />}
              dateFormat="dd/mm/yy"
            />
            <Calendar
              value={p2End}
              onChange={(e) => setP2End(e.value as Date)}
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


      <div className="flex justify-center items-center gap-4">
        <Dropdown
          value={location}
          onChange={(e) => setLocation(e.value)}
          options={locationOptions}
          optionLabel="name"
          optionValue="value"
          placeholder="Location"
          className="w-48"
        />

      </div>
      <div className="flex justify-center items-center gap-4">

        <button
          onClick={handleCompare}
          disabled={loading}
          className="px-6 py-3 bg-[#0B1F8F]  text-white rounded-lg font-bold hover:bg-blue-900 disabled:opacity-50"
        >
          {loading ? "Comparing..." : "Compare"}
        </button>
      </div>
      {/* Results */}
      {result && result.globalStats && (
        <div ref={resultsRef} className="space-y-8 mt-4">
          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="text-xl font-bold text-gray-800">Comparison Report</h3>
            <TollButtonIcons isGraphVisible={showGraph}
              openNew={toggleGraph}
              exportPDF={exportPDF}
              handlePrint={handlePrint} />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Vehicle Count */}
            <div className="p-5 border rounded-lg bg-white shadow">
              <h4 className="font-semibold text-gray-800 mb-1">Total Vehicle Count</h4>
              <hr />
              <div className="flex justify-between mt-2">
                <div>
                  <p className="text-sm text-gray-500">Period 1</p>
                  <p className="text-lg font-bold text-gray-800">{fmtNum(result.globalStats.p1.total)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Period 2</p>
                  <p className="text-lg font-bold text-gray-800">{fmtNum(result.globalStats.p2.total)}</p>
                </div>
              </div>
              <hr />
              <p
                className={`mt-2 text-sm font-semibold ${result.globalStats.changes.totalPctChange >= 0
                    ? "text-green-600"
                    : "text-red-600"
                  }`}
              >
                Change: {fmtPct(result.globalStats.changes.totalPctChange)}
              </p>
            </div>

            {/* Total Violations */}
            <div className="p-5 border rounded-lg bg-white shadow">
              <h4 className="font-semibold text-gray-800 mb-1">Total Violations</h4>
              <hr />
              <div className="flex justify-between mt-2">
                <div>
                  <p className="text-sm text-gray-500">Period 1</p>
                  <p className="text-lg font-bold text-gray-800">{fmtNum(result.globalStats.p1.violation)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Period 2</p>
                  <p className="text-lg font-bold text-gray-800">{fmtNum(result.globalStats.p2.violation)}</p>
                </div>
              </div>
              <hr />
              <p
                className={`mt-2 text-sm font-semibold ${result.globalStats.changes.violationPctChange >= 0
                    ? "text-green-600"
                    : "text-red-600"
                  }`}
              >
                Change: {fmtPct(result.globalStats.changes.violationPctChange)}
              </p>
            </div>

            {/* Total Pass Count */}
            <div className="p-5 border rounded-lg bg-white shadow">
              <h4 className="font-semibold text-gray-800 mb-1">Total Pass Count</h4>
              <hr />
              <div className="flex justify-between mt-2">
                <div>
                  <p className="text-sm text-gray-500">Period 1</p>
                  <p className="text-lg font-bold text-gray-800">{fmtNum(result.globalStats.p1.pass)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Period 2</p>
                  <p className="text-lg font-bold text-gray-800">{fmtNum(result.globalStats.p2.pass)}</p>
                </div>
              </div>
              <hr />
              <p
                className={`mt-2 text-sm font-semibold ${result.globalStats.changes.passPctChange >= 0
                    ? "text-green-600"
                    : "text-red-600"
                  }`}
              >
                Change: {fmtPct(result.globalStats.changes.passPctChange)}
              </p>
            </div>

            {/* Violation Percentage */}
            <div className="p-5 border rounded-lg bg-white shadow">
              <h4 className="font-semibold text-gray-800 mb-1">Violation Percentage</h4>
              <hr />
              <div className="flex justify-between mt-2">
                <div>
                  <p className="text-sm text-gray-500">Period 1</p>
                  <p className="text-lg font-bold text-gray-800">{fmtPct(result.globalStats.p1.violationPct)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Period 2</p>
                  <p className="text-lg font-bold text-gray-800">{fmtPct(result.globalStats.p2.violationPct)}</p>
                </div>
              </div>
              <hr />
              <p
                className={`mt-2 text-sm font-semibold ${result.globalStats.changes.violationRateDiff >= 0
                    ? "text-green-600"
                    : "text-red-600"
                  }`}
              >
                Change: {result.globalStats.changes.violationRateDiff.toFixed(2)} pts
              </p>
            </div>
          </div>
          {/* <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
           
            <div className="p-5 border rounded-lg bg-white shadow">
              <h4 className="font-semibold text-gray-800 mb-3">Total Vehicle Count</h4>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">First Period</p>
                  <p className="text-lg font-bold text-gray-800">{fmtNum(result.globalStats.p1.total)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Second Period</p>
                  <p className="text-lg font-bold text-gray-800">{fmtNum(result.globalStats.p2.total)}</p>
                </div>
              </div>
              <p
                className={`mt-4 text-sm font-semibold ${result.globalStats.changes.totalPctChange >= 0
                    ? "text-green-600"
                    : "text-red-600"
                  }`}
              >
                Change: {fmtPct(result.globalStats.changes.totalPctChange)}
              </p>
            </div>

            <div className="p-5 border rounded-lg bg-white shadow">
              <h4 className="font-semibold text-gray-800 mb-3">Total Violations</h4>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">First Period</p>
                  <p className="text-lg font-bold text-gray-800">{fmtNum(result.globalStats.p1.violation)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Second Period</p>
                  <p className="text-lg font-bold text-gray-800">{fmtNum(result.globalStats.p2.violation)}</p>
                </div>
              </div>
              <p
                className={`mt-4 text-sm font-semibold ${result.globalStats.changes.violationPctChange >= 0
                    ? "text-green-600"
                    : "text-red-600"
                  }`}
              >
                Change: {fmtPct(result.globalStats.changes.violationPctChange)}
              </p>
            </div>

            <div className="p-5 border rounded-lg bg-white shadow">
              <h4 className="font-semibold text-gray-800 mb-3">Total Pass Count</h4>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">First Period</p>
                  <p className="text-lg font-bold text-gray-800">{fmtNum(result.globalStats.p1.pass)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Second Period</p>
                  <p className="text-lg font-bold text-gray-800">{fmtNum(result.globalStats.p2.pass)}</p>
                </div>
              </div>
              <p
                className={`mt-4 text-sm font-semibold ${result.globalStats.changes.passPctChange >= 0
                    ? "text-green-600"
                    : "text-red-600"
                  }`}
              >
                Change: {fmtPct(result.globalStats.changes.passPctChange)}
              </p>
            </div>

            <div className="p-5 border rounded-lg bg-white shadow">
              <h4 className="font-semibold text-gray-800 mb-3">Violation Percentage</h4>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">First Period</p>
                  <p className="text-lg font-bold text-gray-800">{fmtPct(result.globalStats.p1.violationPct)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Second Period</p>
                  <p className="text-lg font-bold text-gray-800">{fmtPct(result.globalStats.p2.violationPct)}</p>
                </div>
              </div>
              <p
                className={`mt-4 text-sm font-semibold ${result.globalStats.changes.violationRateDiff >= 0
                    ? "text-green-600"
                    : "text-red-600"
                  }`}
              >
                Change: {result.globalStats.changes.violationRateDiff.toFixed(2)} pts
              </p>
            </div>
          </div> */}

          {showGraph && hasChartData && (
            <div className="p-4 border rounded">
              <h4 className="font-semibold text-gray-700 mb-3">
                Total Count by Shift
              </h4>
              <div className="h-80">
                <Chart
                  type="bar"
                  data={{
                    labels: result!.charts!.labels,
                    datasets: [
                      {
                        label: "Period 1 Total",
                        data: result!.charts!.totalData.p1,
                        backgroundColor: "#1D4ED8",
                      },
                      {
                        label: "Period 2 Total",
                        data: result!.charts!.totalData.p2,
                        backgroundColor: "#93C5FD",
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

          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h4 className="font-bold text-gray-700">
                Shift-wise WIM Analysis
              </h4>
            </div>
            <DataTable
              value={shiftTableData}
              showGridlines
              stripedRows
              emptyMessage="No data found for selected filters."
            >
              <Column
                header="Shift"
                body={(r: ShiftComparisonItem) => r.shift}
                headerClassName="bg-red-200 min-w-[10rem]"
              />

              <Column
                header="P1 Total"
                body={(r: ShiftComparisonItem) => fmtNum(r.p1.total)}
                headerClassName="bg-red-200 min-w-[10rem]"
              />
              <Column
                header="P1 Pass"
                body={(r: ShiftComparisonItem) => fmtNum(r.p1.pass)}
                headerClassName="bg-red-200 min-w-[10rem]"
              />
              <Column
                header="P1 Violation"
                body={(r: ShiftComparisonItem) => fmtNum(r.p1.violation)}
                headerClassName="bg-red-200 min-w-[10rem]"
              />
              <Column
                header="P1 Violation %"
                body={(r: ShiftComparisonItem) => fmtPct(r.p1.violationPct)}
                headerClassName="bg-red-200 min-w-[10rem]"
              />

              <Column
                header="P2 Total"
                body={(r: ShiftComparisonItem) => fmtNum(r.p2.total)}
                headerClassName="bg-red-200 min-w-[10rem]"
              />
              <Column
                header="P2 Pass"
                body={(r: ShiftComparisonItem) => fmtNum(r.p2.pass)}
                headerClassName="bg-red-200 min-w-[10rem]"
              />
              <Column
                header="P2 Violation"
                body={(r: ShiftComparisonItem) => fmtNum(r.p2.violation)}
                headerClassName="bg-red-200 min-w-[10rem]"
              />
              <Column
                header="P2 Violation %"
                body={(r: ShiftComparisonItem) => fmtPct(r.p2.violationPct)}
                headerClassName="bg-red-200 min-w-[10rem]"
              />

              <Column
                header="Total Diff"
                body={(r: ShiftComparisonItem) => {
                  const v = r.changes.totalDiff;
                  const cls =
                    v > 0
                      ? "text-green-600"
                      : v < 0
                        ? "text-red-600"
                        : "text-gray-500";
                  return (
                    <span className={cls}>
                      {v > 0 ? "+" : ""}
                      {fmtNum(v)}
                    </span>
                  );
                }}
                headerClassName="bg-red-200 min-w-[10rem]"
              />
              <Column
                header="Total % Change"
                body={(r: ShiftComparisonItem) => {
                  const v = r.changes.totalPctChange;
                  const cls =
                    v > 0
                      ? "text-green-600"
                      : v < 0
                        ? "text-red-600"
                        : "text-gray-500";
                  return (
                    <span className={cls}>
                      {v > 0 ? "+" : ""}
                      {fmtPct(v)}
                    </span>
                  );
                }}
                headerClassName="bg-red-200"
              />

              <Column 
                header="Violation Rate Difference"
                body={(r: ShiftComparisonItem) => {
                  const v = r.changes.violationRateDiff;
                  const cls =
                    v > 0
                      ? "text-green-600"
                      : v < 0
                        ? "text-red-600"
                        : "text-gray-500";
                  return (
                    <span className={cls}>
                      {v > 0 ? "+" : ""}
                      {v.toFixed(2)} pts
                    </span>
                  );
                }}
                headerClassName="bg-red-200 min-w-[10rem]"
              />
            </DataTable>
          </div>
        </div>
      )}
    </div>
  );
};

export default WimLocationComparison;
