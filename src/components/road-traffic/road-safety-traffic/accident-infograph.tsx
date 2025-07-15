import { useState, useEffect } from 'react'
import axios from 'axios'
import RefreshButton from '@/components/refresh-button'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  LabelProps,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { Toolbar } from 'primereact/toolbar'
export function SkeletonLoader() {
  return (
    <div className='space-y-4'>
      <div className='relative h-[600px] w-full'>
        {/* Y-axis labels */}
        <div className='absolute left-0 top-0 bottom-0 w-48 flex flex-col justify-between'>
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className='h-4 w-40' />
          ))}
        </div>
        {/* Chart area */}
        <div className='absolute left-52 right-0 top-0 bottom-8 rounded'>
          <div className='h-full flex flex-col justify-between py-4'>
            {[...Array(8)].map((_, i) => (
              <div key={i} className='flex items-center space-x-2'>
                <Skeleton className='h-8 w-1/2 bg-green-200' />
                <Skeleton className='h-4 w-12' />
              </div>
            ))}
          </div>
        </div>
        {/* X-axis labels */}
        <div className='absolute left-52 right-0 bottom-0 flex justify-between'>
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className='h-4 w-8' />
          ))}
        </div>
      </div>
      <p className='text-center text-gray-500 font-medium'>
        Loading accident data...
      </p>
    </div>
  )
}

interface AccidentData {
  zone: string
  totalAccident: string
}

const CustomizedLabel: React.FC<LabelProps> = (props: any) => {
  const { x, y, width, value } = props
  return (
    <text
      x={x + width + 5}
      y={y}
      dy={4}
      fontSize={12}
      fill='#6b7280'
      textAnchor='start'
    >
      {value}
    </text>
  )
}

export default function RoadSafetyChart() {
  const [zone, setZone] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [data, setData] = useState<AccidentData[]>([])
  const [loading, setLoading] = useState(false)

  const codes = [
    { name: 'CH:00+000 TO CH:01+500', value: 'CH:00+000 TO CH:01+500' },
    { name: 'CH:01+501 TO CH:03+000', value: 'CH:01+501 TO CH:03+000' },
    { name: 'CH:03+001 TO CH:04+500', value: 'CH:03+001 TO CH:04+500' },
    { name: 'CH:04+501 TO CH:06+000', value: 'CH:04+501 TO CH:06+000' },
    { name: 'CH:06+001 TO CH:07+500', value: 'CH:06+001 TO CH:07+500' },
    { name: 'CH:07+501 TO CH:09+000', value: 'CH:07+501 TO CH:09+000' },
    { name: 'CH:09+001 TO CH:10+500', value: 'CH:09+001 TO CH:10+500' },
    { name: 'CH:10+501 TO CH:12+000', value: 'CH:10+501 TO CH:12+000' },
    { name: 'CH:12+001 TO CH:13+500', value: 'CH:12+001 TO CH:13+500' },
    { name: 'CH:13+501 TO CH:15+000', value: 'CH:13+501 TO CH:15+000' },
    { name: 'CH:15+001 TO CH:16+500', value: 'CH:15+001 TO CH:16+500' },
    { name: 'CH:16+501 TO CH:18+000', value: 'CH:16+501 TO CH:18+000' },
    { name: 'CH:18+001 TO CH:19+500', value: 'CH:18+001 TO CH:19+500' },
    { name: 'CH:19+501 TO CH:21+000', value: 'CH:19+501 TO CH:21+000' },
    { name: 'CH:21+001 TO CH:22+500', value: 'CH:21+001 TO CH:22+500' },
    { name: 'CH:22+501 TO CH:24+000', value: 'CH:22+501 TO CH:24+000' },
    { name: 'CH:24+001 TO CH:25+500', value: 'CH:24+001 TO CH:25+500' },
    { name: 'CH:25+501 TO CH:27+000', value: 'CH:25+501 TO CH:27+000' },
    { name: 'CH:25+501 TO CH:27+000', value: 'CH:25+501 TO CH:27+000' },
    { name: 'CH:27+001 TO CH:28+500', value: 'CH:27+001 TO CH:28+500' },
    { name: 'CH:28+501 TO CH:30+000', value: 'CH:28+501 TO CH:30+000' },
    { name: 'CH:30+001 TO CH:31+960', value: 'CH:30+001 TO CH:31+960' },
    { name: 'CH:51+500 TO CH:53+000', value: 'CH:51+500 TO CH:53+000' },
    { name: 'CH:53+001 TO CH:54+500', value: 'CH:53+001 TO CH:54+500' },
    { name: 'CH:54+501 TO CH:56+000', value: 'CH:54+501 TO CH:56+000' },
    { name: 'CH:56+001 TO CH:57+500', value: 'CH:56+001 TO CH:57+500' },
    { name: 'CH:57+501 TO CH:59+000', value: 'CH:57+501 TO CH:59+000' },
    { name: 'CH:59+001 TO CH:60+500', value: 'CH:59+001 TO CH:60+500' },
    { name: 'CH:60+501 TO CH:62+000', value: 'CH:60+501 TO CH:62+000' },
    { name: 'CH:62+001 TO CH:63+500', value: 'CH:62+001 TO CH:63+500' },
    { name: 'CH:63+501 TO CH:65+000', value: 'CH:63+501 TO CH:65+000' },
    { name: 'CH:65+001 TO CH:66+500', value: 'CH:65+001 TO CH:66+500' },
    { name: 'CH:66+501 TO CH:68+000', value: 'CH:66+501 TO CH:68+000' },
    { name: 'CH:68+001 TO CH:69+500', value: 'CH:68+001 TO CH:69+500' },
    { name: 'CH:69+501 TO CH:72+000', value: 'CH:69+501 TO CH:72+000' },
  ]

  function getMonthName(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', { month: 'long' })
  }

  function getYear(dateString: string) {
    const date = new Date(dateString)
    return date.getFullYear()
  }

  const fetchData = async (resetFilters = false) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')

      const payload = resetFilters
        ? {}
        : {
            month: month ? getMonthName(month) : '',
            year: year ? getYear(year) : '',
            zone: zone || '',
          }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/road-traffic/roadsafety/accident/search/data/info_graph`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setData(response.data.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleReset = () => {
    setLoading(true)

    // First reset the state values
    setMonth('')
    setYear('')
    setZone('')

    // Then fetch data with reset flag
    fetchData(true)
  }

  const rightToolbarTemplate = () => {
    return (
      <div className='space-x-2'>
        <RefreshButton className='text-base' onClick={handleReset} />
      </div>
    )
  }

  const getBarColor = (accidents: number) => {
    if (accidents >= 51) return '#dc2626' // Fatal Accident Prone Area
    if (accidents >= 36) return '#facc15' // Accident Prone Area
    if (accidents >= 16) return '#60a5fa' // Risky Area
    return '#22c55e' // Regular
  }

  const chartData = data.map((item) => ({
    zone: item.zone,
    accidents: parseInt(item.totalAccident),
    fill: getBarColor(parseInt(item.totalAccident)),
  }))

  return (
    <div className='w-full bg-white rounded-lg'>
      <Toolbar
        className='rounded-none border-none p-0 bg-white'
        right={rightToolbarTemplate}
      ></Toolbar>
      <div className='flex mx-auto w-fit gap-2 divide-x-2 border p-2 rounded-md bg-white mb-8'>
        <Calendar
          // @ts-ignore
          value={month}
          // @ts-ignore
          onChange={(e) => setMonth(e.value)}
          view='month'
          dateFormat='MM'
          inputClassName='border-none rounded-none cursor-pointer focus:ring-0'
          placeholder='By Month'
          showIcon
          icon={() => <i className='pi pi-angle-down' />}
        />

        <Calendar
          // @ts-ignore
          value={year}
          // @ts-ignore
          onChange={(e) => setYear(e.value)}
          view='year'
          dateFormat='yy'
          inputClassName='border-none rounded-none ml-4 cursor-pointer focus:ring-0'
          placeholder='By Year'
          showIcon
          icon={() => <i className='pi pi-angle-down' />}
        />

        <div>
          <Dropdown
            value={zone}
            onChange={(e) => setZone(e.value)}
            options={codes}
            optionLabel='name'
            placeholder='Select Zone'
            className='border-none rounded-none ml-4 cursor-pointer ring-0'
          />
        </div>

        <Button
          onClick={() => fetchData()}
          className='bg-[#22c55e] hover:bg-[#16a34a] h-10 w-10 p-0'
        >
          <svg
            viewBox='0 0 24 24'
            fill='none'
            className='w-6 h-6'
            stroke='currentColor'
            strokeWidth='2'
          >
            <path d='M9 5l7 7-7 7' />
          </svg>
        </Button>
      </div>

      <div className='flex gap-8'>
        <div className='flex-1 min-h-[100vh]'>
          {loading ? (
            <SkeletonLoader />
          ) : (
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={chartData}
                layout='vertical'
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                barSize={20}
              >
                <CartesianGrid
                  strokeDasharray='3 3'
                  horizontal={true}
                  stroke='#e5e7eb'
                />
                <XAxis
                  type='number'
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  domain={[0, 'dataMax + 5']}
                />
                <YAxis
                  type='category'
                  dataKey='zone'
                  axisLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  width={200}
                />
                <Tooltip
                  cursor={false}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    padding: '8px',
                  }}
                  formatter={(value: number) => [`${value}`, 'Accidents']}
                />
                <Bar dataKey='accidents' fill='#22c55e' radius={[0, 4, 4, 0]}>
                  <LabelList content={<CustomizedLabel />} position='right' />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className='w-1/4 pt-4'>
          <h3 className='text-lg font-semibold mb-6'>Area Type</h3>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <span className='text-sm'>Fatal Accident Prone Area</span>
              <div className='flex items-center gap-2'>
                <div className='w-12 h-2 bg-red-600 rounded' />
                <span className='text-sm'>51-100</span>
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm'>Accident Prone Area</span>
              <div className='flex items-center gap-2'>
                <div className='w-12 h-2 bg-yellow-400 rounded' />
                <span className='text-sm'>36-50</span>
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm'>Risky Area</span>
              <div className='flex items-center gap-2'>
                <div className='w-12 h-2 bg-blue-400 rounded' />
                <span className='text-sm'>16-35</span>
              </div>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm'>Regular</span>
              <div className='flex items-center gap-2'>
                <div className='w-12 h-2 bg-green-500 rounded' />
                <span className='text-sm'>0-15</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
