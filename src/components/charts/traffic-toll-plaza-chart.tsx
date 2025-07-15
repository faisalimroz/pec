import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { searchGraphToll } from '@/api/tollApi'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { Skeleton } from '../ui/skeleton'
import { Toolbar } from 'primereact/toolbar'
import RefreshButton from '@/components/refresh-button'

const SkeletonLoader = () => (
  <div className='space-y-4'>
    <Skeleton className='h-8 w-3/4 mx-auto' />
    <div className='relative h-[400px] w-full'>
      {/* Y-axis labels */}
      <div className='absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between'>
        <Skeleton className='h-4 w-10' />
        <Skeleton className='h-4 w-8' />
        <Skeleton className='h-4 w-10' />
        <Skeleton className='h-4 w-8' />
        <Skeleton className='h-4 w-10' />
      </div>
      {/* Chart area */}
      <div className='absolute left-14 right-0 top-0 bottom-8 bg-gray-100 rounded'>
        {/* Horizontal grid lines */}
        <div className='h-full flex flex-col justify-between'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='border-t border-gray-200 w-full' />
          ))}
        </div>
      </div>
      {/* X-axis labels */}
      <div className='absolute left-14 right-0 bottom-0 flex justify-between'>
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className='h-4 w-8' />
        ))}
      </div>
    </div>
    {/* Loading text */}
    <p className='text-center text-gray-500 font-medium'>
      Graph Data Is Loading. Please Wait...
    </p>
  </div>
)

export default function TrafficOfTollPlazaChart() {
  const [data, setData] = useState<any>([])

  const [date, setDate] = useState<string>('')
  const [date2, setDate2] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const [selectedCode, setSelectedCode] = useState(null)

  const codes = [
    { name: 'Dhaleshwari', code: 'dhaleshwari' },
    { name: 'Bhanga', code: 'bhanga' },
    { name: 'Abdullahpur', code: 'abdullahpur' },
    { name: 'Sreenagar', code: 'sreenagar' },
    { name: 'Pulia', code: 'pulia' },
    { name: 'Maligram', code: 'maligram ' },
  ]

  function getMonthName(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', { month: 'long' })
  }

  function getYear(dateString: string) {
    const date = new Date(dateString)
    return date.getFullYear()
  }

  const handleSearch = () => {
    setLoading(true)
    const initialPayload = {
      month: date ? getMonthName(date) : '',
      year: date2 ? getYear(date2) : '',
      // @ts-ignore
      location: selectedCode?.code || '',
      type: 'traffic',
    }

    searchGraphToll(initialPayload).then((result) => {
      setData(result)
      setLoading(false)
    })
  }

  const handleReset = () => {
    const initialPayload = {
      month: '',
      year: '',
      location: '',
      type: 'traffic',
    }

    setDate('')
    setDate2('')
    setSelectedCode(null)

    searchGraphToll(initialPayload).then((result) => {
      setData(result)
      setLoading(false)
    })
  }

  // initial data load
  useEffect(() => {
    setLoading(true)
    const initialPayload = {
      month: '',
      year: '',
      location: '',
      type: 'traffic',
    }

    searchGraphToll(initialPayload).then((result) => {
      setData(result)
      setLoading(false)
    })
  }, [])

  // console.log(data)

  const rightToolbarTemplate = () => {
    return (
      <div className='space-x-2'>
        <RefreshButton className='text-base ml-2' onClick={handleReset} />
      </div>
    )
  }

  return (
    <>
      <Toolbar
        className='rounded-none border-none p-0 bg-white'
        right={rightToolbarTemplate}
      ></Toolbar>
      <div className='bg-gray-200 p-4 flex justify-between gap-6'>
        <div className='flex flex-col space-y-5 items-center justify-center'>
          <div className='flex w-fit gap-2 divide-x-2 border p-1 rounded-md bg-white'>
            <Calendar
              // @ts-ignore
              value={date}
              // @ts-ignore
              onChange={(e) => setDate(e.value)}
              view='month'
              dateFormat='MM'
              inputClassName='border-none rounded-none cursor-pointer focus:ring-0 ring-0'
              placeholder='By Month'
              showIcon
              icon={() => <i className='pi pi-angle-down' />}
            />
            <Calendar
              // @ts-ignore
              value={date2}
              // @ts-ignore
              onChange={(e) => setDate2(e.value)}
              view='year'
              dateFormat='yy'
              inputClassName='border-none rounded-none ml-4 cursor-pointer focus:ring-0 ring-0'
              placeholder='By Year'
              showIcon
              icon={() => <i className='pi pi-angle-down' />}
            />
            <div>
              <Dropdown
                value={selectedCode}
                onChange={(e) => setSelectedCode(e.value)}
                options={codes}
                optionLabel='name'
                placeholder='Select Location'
                className='border-none rounded-none ml-4 cursor-pointer ring-0'
              />
            </div>

            <button
              onClick={() => handleSearch()}
              className='border bg-green-500 px-4 py-2.5 rounded-lg'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='white'
                className='size-6'
              >
                <path
                  fillRule='evenodd'
                  d='M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
          </div>
        </div>

        {/* <div className='flex items-center gap-2'>
          <button className='w-[100px] h-[55px] font-semibold border text-white bg-gray-500 rounded'>
            Download
          </button>
        </div> */}
      </div>

      <Card className='w-full max-w-full mx-auto my-5'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-center'>
            Traffic Of Toll Plaza (
            {date ? getMonthName(date) : getMonthName(new Date().toISOString())}
            ,{date2 ? getYear(date2) : getYear(new Date().toISOString())})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <SkeletonLoader />
          ) : (
            <ResponsiveContainer width='100%' height={400}>
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis dataKey='day' />
                <YAxis />
                <Tooltip />
                <Line
                  type='linear'
                  dataKey='totalvehicle'
                  stroke='hsl(var(--chart-1))'
                  strokeWidth={1.5}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </>
  )
}
