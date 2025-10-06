import React, { useState, useRef } from 'react'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { Chart } from 'primereact/chart'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import TollButtonIcons from '../ui/comparison-button'
import RefreshButton from '@/components/refresh-button'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import FileIcon from '../icons/FileIcon'

type ShiftKey = '3RD-2' | '1ST' | '2ND' | '3RD-1'
type LocationKey = 'Mawa' | 'Jinjira'

interface PeriodFilters {
  start?: Date | null
  end?: Date | null
  location?: LocationKey | 'All' | null
}

interface ShiftRow {
  shift: ShiftKey
  time: string
  p1Total: number
  p1Violation: number
  p1Pass: number
  p2Total: number
  p2Violation: number
  p2Pass: number
  changePct: number
  _isTotal?: boolean
}

interface LocationRow {
  location: LocationKey | 'Total (All Locations)'
  p1Total: number
  p1Violation: number
  p1Pass: number
  p2Total: number
  p2Violation: number
  p2Pass: number
  changePct: number
  _isTotal?: boolean
}

interface ComparisonResult {
  // topline numbers
  vehicles1: number
  vehicles2: number
  pass1: number
  pass2: number
  violation1: number
  violation2: number
  violationPct1: number
  violationPct2: number

  // chart
  chartLabels: string[]
  chartData1: number[]
  chartData2: number[]

  // detail tables
  shifts: ShiftRow[]
  locations: LocationRow[]
}

const locationType = [
  { name: 'All Locations', value: 'All' },
  { name: 'Mawa', value: 'Mawa' },
  { name: 'Jinjira', value: 'Jinjira' },
]
const itemTemplate = (option: { name: string; code: string }) => {
  return (
    <div className="flex items-center gap-2">
      <FileIcon />
      <span>{option.name}</span>
    </div>
  );
};
const fmtNum = (n: number) => n.toLocaleString()
const pct = (x: number) => `${(x * 100).toFixed(2)}%`
const changePct = (a: number, b: number) => (a ? (b - a) / a : 0)
const changeColor = (v: number) => (v >= 0 ? 'text-green-600' : 'text-red-500')

// ---- helpers to shape “detail” sections from totals ----
const SHIFTS: Record<ShiftKey, { time: string; share: number; violRate: number }> = {
  '3RD-2': { time: '00:00:00–05:59:59', share: 0.34, violRate: 0.0055 },
  '1ST':   { time: '06:00:00–13:59:59', share: 0.07, violRate: 0.0065 },
  '2ND':   { time: '14:00:00–21:59:59', share: 0.23, violRate: 0.0056 },
  '3RD-1': { time: '22:00:00–23:59:59', share: 0.36, violRate: 0.0060 },
}

const LOCATIONS: Record<LocationKey, { share: number; violRate: number }> = {
  Mawa: { share: 0.52, violRate: 0.0046 },
  Jinjira: { share: 0.48, violRate: 0.0049 },
}

function buildShiftRows(v1: number, v2: number): ShiftRow[] {
  const rows = (Object.keys(SHIFTS) as ShiftKey[]).map((k) => {
    const s = SHIFTS[k]
    const p1Total = Math.round(v1 * s.share)
    const p2Total = Math.round(v2 * s.share)
    const p1Violation = Math.round(p1Total * s.violRate)
    const p2Violation = Math.round(p2Total * s.violRate)
    const p1Pass = p1Total - p1Violation
    const p2Pass = p2Total - p2Violation
    return {
      shift: k,
      time: s.time,
      p1Total,
      p1Violation,
      p1Pass,
      p2Total,
      p2Violation,
      p2Pass,
      changePct: changePct(p1Total, p2Total),
    }
  })

  const totals: ShiftRow = {
    shift: '3RD-1', // not shown; just to satisfy typing
    time: 'Total (All Shifts)',
    p1Total: rows.reduce((a, r) => a + r.p1Total, 0),
    p1Violation: rows.reduce((a, r) => a + r.p1Violation, 0),
    p1Pass: rows.reduce((a, r) => a + r.p1Pass, 0),
    p2Total: rows.reduce((a, r) => a + r.p2Total, 0),
    p2Violation: rows.reduce((a, r) => a + r.p2Violation, 0),
    p2Pass: rows.reduce((a, r) => a + r.p2Pass, 0),
    changePct: changePct(
      rows.reduce((a, r) => a + r.p1Total, 0),
      rows.reduce((a, r) => a + r.p2Total, 0)
    ),
    _isTotal: true,
  }

  return [...rows, totals]
}

function buildLocationRows(v1: number, v2: number): LocationRow[] {
  const rows = (Object.keys(LOCATIONS) as LocationKey[]).map((k) => {
    const s = LOCATIONS[k]
    const p1Total = Math.round(v1 * s.share)
    const p2Total = Math.round(v2 * s.share)
    const p1Violation = Math.round(p1Total * s.violRate)
    const p2Violation = Math.round(p2Total * s.violRate)
    const p1Pass = p1Total - p1Violation
    const p2Pass = p2Total - p2Violation
    return {
      location: k,
      p1Total,
      p1Violation,
      p1Pass,
      p2Total,
      p2Violation,
      p2Pass,
      changePct: changePct(p1Total, p2Total),
    }
  })

  const totals: LocationRow = {
    location: 'Total (All Locations)',
    p1Total: rows.reduce((a, r) => a + r.p1Total, 0),
    p1Violation: rows.reduce((a, r) => a + r.p1Violation, 0),
    p1Pass: rows.reduce((a, r) => a + r.p1Pass, 0),
    p2Total: rows.reduce((a, r) => a + r.p2Total, 0),
    p2Violation: rows.reduce((a, r) => a + r.p2Violation, 0),
    p2Pass: rows.reduce((a, r) => a + r.p2Pass, 0),
    changePct: changePct(
      rows.reduce((a, r) => a + r.p1Total, 0),
      rows.reduce((a, r) => a + r.p2Total, 0)
    ),
    _isTotal: true,
  }

  return [...rows, totals]
}

// ======================================================================

export default function WIMComparison() {
  const resultsRef = useRef<HTMLDivElement>(null)
  const shiftTableRef = useRef<DataTable<ShiftRow[]>>(null)
  const locationTableRef = useRef<DataTable<LocationRow[]>>(null)

  const [showGraph, setShowGraph] = useState(false)

  const [p1, setP1] = useState<PeriodFilters>({
    start: new Date('2023-01-01'),
    end: new Date('2023-01-07'),
    location: 'All',
  })
  const [p2, setP2] = useState<PeriodFilters>({
    start: new Date('2023-02-01'),
    end: new Date('2023-02-07'),
    location: 'All',
  })

  const [result, setResult] = useState<ComparisonResult | null>(null)

  // Quick ranges
  const setQuickRange = (
    setter: React.Dispatch<React.SetStateAction<PeriodFilters>>,
    type: 'week' | 'month' | 'quarter'
  ) => {
    const now = new Date()
    let start = new Date(now)
    if (type === 'week') start.setDate(now.getDate() - 7)
    else if (type === 'month') start.setMonth(now.getMonth() - 1)
    else start.setMonth(now.getMonth() - 3)
    setter((prev) => ({ ...prev, start, end: now }))
  }

  // Replace this with your real API call later
  const fetchComparisonData = async (
    _p1: PeriodFilters,
    _p2: PeriodFilters
  ): Promise<ComparisonResult> => {
    // demo series (7 days each)
    const chartLabels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7']
    const chartData1 = [25600, 23800, 25150, 23050, 24600, 25000, 24923]
    const chartData2 = [26000, 24400, 25780, 23800, 25100, 25950, 25140]

    const vehicles1 = chartData1.reduce((a, b) => a + b, 0)
    const vehicles2 = chartData2.reduce((a, b) => a + b, 0)

    // use small violation rate overall (matches your screenshots)
    const violationRate1 = 0.00434
    const violationRate2 = 0.00462

    const violation1 = Math.round(vehicles1 * violationRate1)
    const violation2 = Math.round(vehicles2 * violationRate2)

    const pass1 = vehicles1 - violation1
    const pass2 = vehicles2 - violation2

    const shifts = buildShiftRows(vehicles1, vehicles2)
    const locations = buildLocationRows(vehicles1, vehicles2)

    return {
      vehicles1,
      vehicles2,
      pass1,
      pass2,
      violation1,
      violation2,
      violationPct1: violation1 / vehicles1,
      violationPct2: violation2 / vehicles2,
      chartLabels,
      chartData1,
      chartData2,
      shifts,
      locations,
    }
  }

  const onCompare = async () => {
    const res = await fetchComparisonData(p1, p2)
    setResult(res)
  }

  const handlePrint = () => {
    if (!resultsRef.current) return
    const html = resultsRef.current.innerHTML
    const w = window.open('', 'PRINT', 'height=700,width=900,top=50,left=50')
    if (!w) return
    w.document.write(`<html><head><title>WIM Comparison</title>
      <style>body{font-family:Inter,Arial,sans-serif;padding:16px}</style></head>
      <body>${html}</body></html>`)
    w.document.close()
    w.focus()
    w.print()
    w.close()
  }

  const exportPDF = async () => {
    if (!resultsRef.current) return
    const canvas = await html2canvas(resultsRef.current, { scale: 2, useCORS: true })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const imgWidth = pageWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pdf.internal.pageSize.getHeight()
    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pdf.internal.pageSize.getHeight()
    }
    pdf.save('wim-comparison.pdf')
  }

  const exportCSV = () => {
    shiftTableRef.current?.exportCSV()
    locationTableRef.current?.exportCSV()
  }

  const handleReset = () => {
    setP1({ start: null, end: null, location: 'All' })
    setP2({ start: null, end: null, location: 'All' })
    setResult(null)
  }

  // ---------- UI ----------
  return (
    <div className="space-y-4 space-x-4">
      <h1 className='text-2xl font-bold tracking-tight md:text-3xl pl-4'>
        WIM Data
      </h1>
      <div className="flex items-center justify-between ml-4">
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-[#0B1F8F] text-white rounded-md">WIM Data</button>
          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md">All WIM Data</button>
        </div>
        <RefreshButton handleReset={handleReset} />
      </div>

      {/* Filter panel */}
      <div className="p-5 bg-white border rounded-lg space-y-6">
        <h3 className="text-lg font-semibold">Select Time Periods to Compare</h3>

        <div className="grid md:grid-cols-2 gap-8">
          {/* First period */}
          <div>
            <h4 className="text-sm font-medium text-[#0A2472] mb-2">First Time Period</h4>
            <div className="flex gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-700">Start Date</span>
                <Calendar
                  value={p1.start || null}
                  onChange={(e) => setP1({ ...p1, start: e.value as Date })}
                  dateFormat="dd/mm/yy"
                  placeholder="Start Date"
                  showIcon
                  className="p-inputtext-sm border rounded-md shadow-sm h-10"
                  inputClassName="border-none rounded-none bg-transparent text-sm"
                  icon={() => <i className="pi pi-calendar" />}
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-700">End Date</span>
                <Calendar
                  value={p1.end || null}
                  onChange={(e) => setP1({ ...p1, end: e.value as Date })}
                  dateFormat="dd/mm/yy"
                  placeholder="End Date"
                  showIcon
                  className="p-inputtext-sm border rounded-md shadow-sm h-10"
                  inputClassName="border-none rounded-none bg-transparent text-sm"
                  icon={() => <i className="pi pi-calendar" />}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => setQuickRange(setP1, 'week')} className="px-2 py-2 bg-[#F3F4F6] text-[#374151] text-sm rounded-md font-semibold">Last Week</button>
              <button onClick={() => setQuickRange(setP1, 'month')} className="px-2 py-2 bg-[#F3F4F6] text-[#374151] text-sm rounded-md font-semibold">Last Month</button>
              <button onClick={() => setQuickRange(setP1, 'quarter')} className="px-2 py-2 bg-[#F3F4F6] text-[#374151] text-sm rounded-md font-semibold">Last Quarter</button>
            </div>
          </div>

          {/* Second period */}
          <div className="justify-self-end">
            <h4 className="text-sm font-medium text-[#0A2472] mb-2">Second Time Period</h4>
            <div className="flex gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-700">Start Date</span>
                <Calendar
                  value={p2.start || null}
                  onChange={(e) => setP2({ ...p2, start: e.value as Date })}
                  dateFormat="dd/mm/yy"
                  placeholder="Start Date"
                  showIcon
                  className="p-inputtext-sm border rounded-md shadow-sm h-10"
                  inputClassName="border-none rounded-none bg-transparent text-sm"
                  icon={() => <i className="pi pi-calendar" />}
                />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-700">End Date</span>
                <Calendar
                  value={p2.end || null}
                  onChange={(e) => setP2({ ...p2, end: e.value as Date })}
                  dateFormat="dd/mm/yy"
                  placeholder="End Date"
                  showIcon
                  className="p-inputtext-sm border rounded-md shadow-sm h-10"
                  inputClassName="border-none rounded-none bg-transparent text-sm"
                  icon={() => <i className="pi pi-calendar" />}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => setQuickRange(setP2, 'week')} className="px-2 py-2 bg-[#F3F4F6] text-[#374151] text-sm rounded-md font-semibold">Last Week</button>
              <button onClick={() => setQuickRange(setP2, 'month')} className="px-2 py-2 bg-[#F3F4F6] text-[#374151] text-sm rounded-md font-semibold">Last Month</button>
              <button onClick={() => setQuickRange(setP2, 'quarter')} className="px-2 py-2 bg-[#F3F4F6] text-[#374151] text-sm rounded-md font-semibold">Last Quarter</button>
            </div>
          </div>
        </div>

        {/* Location (kept for future API filters) */}
        <div className="flex justify-center">
          <Dropdown
            value={p1.location || 'All'}
            onChange={(e) => setP1({ ...p1, location: e.value })}
            options={locationType}
            placeholder="Location"
            itemTemplate={itemTemplate}
            optionLabel="name"
            className="w-[260px] bg-[#EFEFEF] border border-[#D1D5DB] text-sm"
          />
        </div>

        <div className="flex justify-center">
          <button onClick={onCompare} className="px-6 bg-[#0B1F8F] rounded-md py-2 text-white">
            Compare Data
          </button>
        </div>

        {result && (
          <div ref={resultsRef} className="space-y-6">
            {/* header + actions */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Comparison Results</h3>
              <TollButtonIcons
                isGraphVisible={showGraph}
                openNew={() => setShowGraph((s) => !s)}
                exportCSV={exportCSV}
                exportPDF={exportPDF}
                handlePrint={handlePrint}
              />
            </div>

            {/* KPI cards */}
            <div className="grid md:grid-cols-4 gap-4">
              {/* Total Vehicle Count */}
              <div className="px-4 py-5 border rounded-lg bg-white">
             
                  <h4 className="font-medium ">Total Vehicle Count</h4>
               
                <hr />
                <div className="mt-2 grid grid-cols-2 text-sm text-gray-500">
                  <span>First Period</span><span className="text-right">Second Period</span>
                </div>
                <div className="mt-1 grid grid-cols-2 items-end">
                  <div className="text-xl font-bold">{fmtNum(result.vehicles1)}</div>
                  <div className="text-xl font-bold text-right">{fmtNum(result.vehicles2)}</div>
                </div>
               
                <div className={`mt-2 text-sm  border-t ${changeColor(changePct(result.vehicles1, result.vehicles2))}`}>
                  Change {pct(changePct(result.vehicles1, result.vehicles2))}
                </div>
              </div>

              {/* Total Violations */}
              <div className="p-4 border rounded-lg bg-white">
                <h4 className="font-medium">Total Violations</h4>
                  <hr />
                <div className="mt-2 grid grid-cols-2 text-sm text-gray-500">
                  <span>First Period</span><span className="text-right">Second Period</span>
                </div>
                <div className="mt-1 grid grid-cols-2 items-end">
                  <div className="text-xl font-bold">{fmtNum(result.violation1)}</div>
                  <div className="text-xl font-bold text-right">{fmtNum(result.violation2)}</div>
                </div>
                <div className={`mt-1 text-sm border-t ${changeColor(changePct(result.violation1, result.violation2))}`}>
                  Change {pct(changePct(result.violation1, result.violation2))}
                </div>
              </div>

              {/* Total Pass Count */}
              <div className="p-4 border rounded-lg bg-white">
                <h4 className="font-medium">Total Pass Count</h4>
                  <hr />
                <div className="mt-2 grid grid-cols-2 text-sm text-gray-500">
                  <span>First Period</span><span className="text-right">Second Period</span>
                </div>
                <div className="mt-1 grid grid-cols-2 items-end">
                  <div className="text-xl font-bold">{fmtNum(result.pass1)}</div>
                  <div className="text-xl font-bold text-right">{fmtNum(result.pass2)}</div>
                </div>
                <div className={`mt-1 text-sm  border-t ${changeColor(changePct(result.pass1, result.pass2))}`}>
                  Change {pct(changePct(result.pass1, result.pass2))}
                </div>
              </div>

              {/* Violation Percentage */}
              <div className="p-4 border rounded-lg bg-white">
                <h4 className="font-medium">Violation Percentage</h4>
                  <hr />
                <div className="mt-2 grid grid-cols-2 text-sm text-gray-500">
                  <span>First Period</span><span className="text-right">Second Period</span>
                </div>
                <div className="mt-1 grid grid-cols-2 items-end">
                  <div className="text-xl font-bold">{pct(result.violationPct1)}</div>
                  <div className="text-xl font-bold text-right">{pct(result.violationPct2)}</div>
                </div>
                <div
                  className={`mt-1 text-sm border-t ${changeColor(
                    changePct(result.violationPct1, result.violationPct2)
                  )}`}
                >
                  Change {pct(changePct(result.violationPct1, result.violationPct2))}
                </div>
              </div>
            </div>

            {/* Graph */}
            {showGraph && (
              <div className="p-4 border rounded-lg bg-white">
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

            {/* Shift Comparison */}
            <div className="p-4 border rounded-lg bg-white">
              <div className="flex items-center justify-between">
                <h4 className="font-medium mb-2">Shift Comparison</h4>
                <div className="text-xs text-gray-500">
                  Period: {p1.start?.toLocaleDateString()} - {p1.end?.toLocaleDateString()} vs{' '}
                  {p2.start?.toLocaleDateString()} - {p2.end?.toLocaleDateString()}
                </div>
              </div>

              <DataTable
                value={result.shifts}
                ref={shiftTableRef as any}
                rowClassName={(r: any) => (r._isTotal ? 'bg-[#E7F3FF] font-medium' : '')}
                showGridlines
              >
                <Column header="Shift" body={(r: ShiftRow) => (r._isTotal ? 'Total (All Shifts)' : r.shift)} headerClassName="bg-red-200 text-sm" />
                <Column header="Time Range" field="time" headerClassName="bg-red-200 text-sm" />
                <Column header="Period 1 Total" body={(r: ShiftRow) => fmtNum(r.p1Total)} headerClassName="bg-red-200 text-sm" />
                <Column header="Period 1 Violation" body={(r: ShiftRow) => <span className="text-red-500">{fmtNum(r.p1Violation)}</span>} headerClassName="bg-red-200 text-sm" />
                <Column header="Period 1 Pass" body={(r: ShiftRow) => <span className="text-blue-700 ">{fmtNum(r.p1Pass)}</span>} headerClassName="bg-red-200 text-sm" />
                <Column header="Period 2 Total" body={(r: ShiftRow) => fmtNum(r.p2Total)} headerClassName="bg-yellow-100 text-sm" />
                <Column header="Period 2 Violation" body={(r: ShiftRow) => <span className="text-red-500">{fmtNum(r.p2Violation)}</span>} headerClassName="bg-yellow-100 text-sm" />
                <Column header="Period 2 Pass" body={(r: ShiftRow) => <span className="text-blue-700 
                
                ">{fmtNum(r.p2Pass)}</span>} headerClassName="bg-yellow-100 text-sm" />
                <Column
                  header="% Change"
                  body={(r: ShiftRow) => <span className={changeColor(r.changePct)}>{pct(r.changePct)}</span>}
                  headerClassName="bg-red-200 text-sm"
                />
              </DataTable>
            </div>

            {/* Location Comparison */}
            <div className="p-4 border rounded-lg bg-white">
              <div className="flex items-center justify-between">
                <h4 className="font-medium mb-2">Location Comparison</h4>
                <div className="text-xs text-gray-500">
                  Period: {p1.start?.toLocaleDateString()} - {p1.end?.toLocaleDateString()} vs{' '}
                  {p2.start?.toLocaleDateString()} - {p2.end?.toLocaleDateString()}
                </div>
              </div>

              <DataTable
                value={result.locations}
                ref={locationTableRef as any}
                rowClassName={(r: any) => (r._isTotal ? 'bg-[#E7F3FF] font-medium' : '')}
                showGridlines
              >
                <Column header="Location" field="location" headerClassName="bg-red-200 text-sm" />
                <Column header="Period 1 Total" body={(r: LocationRow) => fmtNum(r.p1Total)} headerClassName="bg-red-200 text-sm" />
                <Column header="Period 1 Violation" body={(r: LocationRow) => <span className="text-red-500">{fmtNum(r.p1Violation)}</span>} headerClassName="bg-red-200 text-sm" />
                <Column header="Period 1 Pass" body={(r: LocationRow) => <span className="text-blue-700 ">{fmtNum(r.p1Pass)}</span>} headerClassName="bg-red-200 text-sm" />
                <Column header="Period 2 Total" body={(r: LocationRow) => fmtNum(r.p2Total)} headerClassName="bg-yellow-100 text-sm" />
                <Column header="Period 2 Violation" body={(r: LocationRow) => <span className="text-red-500">{fmtNum(r.p2Violation)}</span>} headerClassName="bg-yellow-100 text-sm" />
                <Column header="Period 2 Pass" body={(r: LocationRow) => <span className="text-blue-700 ">{fmtNum(r.p2Pass)}</span>} headerClassName="bg-yellow-100 text-sm" />
                <Column
                  header="% Change"
                  body={(r: LocationRow) => <span className={changeColor(r.changePct)}>{pct(r.changePct)}</span>}
                  headerClassName="bg-red-200 text-sm"
                />
              </DataTable>
            </div>

            
          </div>
        )}
      </div>
    </div>
  )
}
