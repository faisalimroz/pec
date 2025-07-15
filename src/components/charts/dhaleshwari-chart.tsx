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
import { useEffect, useState } from 'react'
import { searchMonthlyTrafficGraph } from '@/api/tollApi'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { Skeleton } from '../ui/skeleton'

const CustomizedLabel = (props: any) => {
  const { x, y, width, value } = props
  return (
    <text
      x={x + width + 5}
      y={y + 10}
      fill='#000000'
      textAnchor='start'
      dominantBaseline='middle'
    >
      {`${parseInt(value, 10).toFixed(1)}%`}
    </text>
  )
}

const SkeletonLoader = () => (
  <div className='space-y-4'>
    <Skeleton className='h-6 w-3/4 mx-auto' /> {/* Title skeleton */}
    <div className='relative h-[420px] w-full'>
      {/* Y-axis labels */}
      <div className='absolute left-0 top-0 bottom-0 w-40 flex flex-col justify-between'>
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className='h-4 w-32' />
        ))}
      </div>
      {/* Chart area */}
      <div className='absolute left-44 right-0 top-0 bottom-8 rounded'>
        {/* Skeleton bars */}
        <div className='h-full flex flex-col justify-between py-4'>
          {[...Array(8)].map((_, i) => (
            <div key={i} className='flex items-center space-x-2'>
              <Skeleton className='h-5 w-1/2 bg-blue-200' />
              <Skeleton className='h-4 w-12' /> {/* Percentage label */}
            </div>
          ))}
        </div>
      </div>
      {/* X-axis labels */}
      <div className='absolute left-44 right-0 bottom-0 flex justify-between'>
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

export function DhaleshwariChart() {
  const [data, setData] = useState([])
  const [selectedCode, setSelectedCode] = useState(null)
  const [date, setDate] = useState<string>('')
  const [date2, setDate2] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

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
    }

    searchMonthlyTrafficGraph(initialPayload).then((result) => {
      setData(result)
      setLoading(false)
    })
  }

  // initial data
  useEffect(() => {
    handleSearch()
  }, [])

  console.log(data)

  return (
    <>
      <div className='flex justify-between gap-6 p-4 border'>
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

        <div className='flex items-center gap-2'>
          {/* <button className='w-[100px] h-[55px] font-semibold border text-white bg-gray-500 rounded '>
            Upload
          </button> */}
         
        </div>
      </div>

      <p className='text-2xl my-4 font-bold text-center'>Data Showing For : (
            {date ? getMonthName(date) : getMonthName(new Date().toISOString())}
            ,{date2 ? getYear(date2) : getYear(new Date().toISOString())})
      </p>

      <Card className='w-full max-w-full border rounded-none'>
        <CardHeader>
          <CardTitle className='text-xl text-center font-semibold'>
            Vehicle Type Of Dhaleshwari (%)
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
                  right: 30,
                  left: 50,
                  bottom: 5,
                }}
              >
                <CartesianGrid horizontal={false} />
                <XAxis
                  type='number'
                  domain={[0, 50]}
                  tickCount={7}
                  tickFormatter={(tick) => `${tick}%`}
                />
                <YAxis
                  dataKey='types'
                  type='category'
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  // @ts-ignore
                  formatter={(value) => `${Math.floor(value)}%`}
                  labelStyle={{ color: 'black' }}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                  }}
                />
                <Bar dataKey='percentage' fill='#42ADF3' barSize={20}>
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
