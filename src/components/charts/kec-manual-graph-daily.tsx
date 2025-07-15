import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  CartesianGrid,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { searchGraphManualYearly } from '@/api/tollApi'
import { Calendar } from 'primereact/calendar'
import RefreshButton from '@/components/refresh-button'
import { Toolbar } from 'primereact/toolbar'

interface VehicleData {
  types: string
  totalPass: number
}

interface ApiResponse {
  date: string
  result: VehicleData[]
}

const SkeletonLoader = () => (
  <div className='space-y-4'>
    <Skeleton className='h-6 w-3/4 mx-auto' />
    <div className='relative h-[340px] w-full'>
      <div className='absolute left-0 top-0 bottom-0 w-40 flex flex-col justify-between'>
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className='h-4 w-32' />
        ))}
      </div>
      <div className='absolute left-44 right-0 top-0 bottom-8 rounded'>
        <div className='h-full flex flex-col justify-between py-4'>
          {[...Array(10)].map((_, i) => (
            <div key={i} className='flex items-center space-x-2'>
              <Skeleton className='h-5 w-1/2 bg-blue-200' />
              <Skeleton className='h-4 w-16' />
            </div>
          ))}
        </div>
      </div>
      <div className='absolute left-44 right-0 bottom-0 flex justify-between'>
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className='h-4 w-12' />
        ))}
      </div>
    </div>
    <p className='text-center text-muted-foreground font-medium'>
      Graph Data Is Loading. Please Wait...
    </p>
  </div>
)

const CustomizedLabel: React.FC<any> = (props) => {
  const { x, y, width, value } = props
  return (
    <text
      x={x + width + 5}
      y={y}
      dy={4}
      fontSize={12}
      fill='hsl(var(--foreground))'
      textAnchor='start'
    >
      {value?.toLocaleString()}
    </text>
  )
}

export default function KecManualDataGraphDaily() {
  const [data, setData] = useState<VehicleData[]>([])
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState<string>('')
  const [date2, setDate2] = useState<string>('')

  function formatDate(dateTime?: any) {
    if (!dateTime) return ''
    const date = new Date(dateTime)

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    return `${day}-${month}-${year}`
  }

  const handleSearch = () => {
    setLoading(true)
    const initialPayload = {
      date: date2 ? formatDate(date2) : '',
    }

    searchGraphManualYearly(initialPayload).then((result) => {
      setData(result?.result)
      setDate(result?.date)
      setLoading(false)
    })
  }

  const handleReset = () => {
    const initialPayload = {
      date: '',
    }

    setDate2('')

    searchGraphManualYearly(initialPayload).then((result) => {
      setData(result?.result)
      // @ts-ignore
      setDate(convertToDateObject(result?.date))
      setLoading(false)
    })
  }

  const convertToDateObject = (dateStr: any) => {
    if (!dateStr) return null // Handle empty values
    const [day, month, year] = dateStr.split('-').map(Number)
    return new Date(year, month - 1, day) // Month is 0-based in JS Date
  }
  // initial data load
  useEffect(() => {
    setLoading(true)
    const initialPayload = {
      date: '',
    }

    searchGraphManualYearly(initialPayload).then((result) => {
      setData(result?.result)
      setLoading(false)
      //@ts-ignore
      setDate(convertToDateObject(result?.date))
    })
  }, [])

  // console.log(date)

  // console.log(data)

  const formatYAxisTick = (value: string) => {
    return value
      .replace(/_/g, ' ')
      .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())
  }

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
      <div className='bg-gray-200 p-4 flex justify-center gap-6'>
        <div className='flex flex-col space-y-5 items-center justify-center'>
          <div className='flex w-fit gap-2 divide-x-2 border p-1 rounded-md bg-white'>
            <Calendar
              // @ts-ignore
              value={date2}
              // @ts-ignore
              onChange={(e) => setDate2(e.value)}
              inputClassName='border-none rounded-none cursor-pointer focus:ring-0 bg-transparent'
              placeholder='By Date'
            />

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
      </div>
      <Card className='w-full max-w-full border rounded-md ml-4 mt-8'>
        <CardHeader>
          <CardTitle className='text-lg text-center font-semibold'>
            Date - {date ? formatDate(date) : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <SkeletonLoader />
          ) : (
            <ResponsiveContainer width='100%' height={420}>
              <BarChart
                layout='vertical'
                data={data}
                margin={{
                  top: 5,
                  right: 50,
                  left: 10,
                  bottom: 5,
                }}
              >
                <CartesianGrid horizontal={false} stroke='hsl(var(--border))' />
                <XAxis
                  type='number'
                  domain={[0, 'dataMax']}
                  tickCount={6}
                  stroke='hsl(var(--foreground))'
                />
                <YAxis
                  dataKey='type'
                  type='category'
                  tickFormatter={formatYAxisTick}
                  tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
                  width={120}
                  stroke='hsl(var(--foreground))'
                />
                <Tooltip
                  formatter={(value: number) => [
                    value.toLocaleString(),
                    'Total Vehicle',
                  ]}
                  labelFormatter={(label) => formatYAxisTick(label as string)}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--foreground))',
                  }}
                />
                <Bar
                  dataKey='totalVehicles'
                  fill='hsl(var(--primary))'
                  barSize={20}
                >
                  <LabelList content={<CustomizedLabel />} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </>
  )
}
