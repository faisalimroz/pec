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
import { Skeleton } from '@/components/ui/skeleton'

interface VehicleData {
  vehicleType: string
  label: string
  totalVehicles: number
  totalAmount: number
}

interface ApiResponse {
  success: boolean
  date: string
  lane: string
  grandTotalVehicles: number
  grandTotalAmount: number
  result: VehicleData[]
  timestamp: number
}

const SkeletonLoader = () => (
  <div className='space-y-4'>
    <Skeleton className='h-6 w-3/4 mx-auto' />
    <div className='relative h-[240px] w-full'>
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
      dy={12}
      fontSize={12}
      fill='hsl(var(--foreground))'
      textAnchor='start'
    >
      {value?.toLocaleString()}
    </text>
  )
}

export function TollOfTollDash() {
  const [data, setData] = useState<VehicleData[]>([])
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState<string>('')

//  const fetchData = async () => {
//   try {
//     setLoading(true)

//     const response = await axios.get(
//       `${import.meta.env.VITE_BASE_URL}/api/v1/its/vehicle-detect/get/dashboard/toll/data`,
//       {
        
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       }
//     )

//     const payload = response.data
//     const result = Array.isArray(payload.result) ? payload.result : []

//     setData(result)
//     setDate(payload.date || '')
//     console.log('Toll data result:', result)
//   } catch (error) {
//     console.error('Error fetching toll dashboard data:', error)
//     setData([])
//   } finally {
//     setLoading(false)
//   }
// }
const fetchData = async () => {
  try {
    setLoading(true)

    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/v1/its/vehicle-detect/get/dashboard/toll/data`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        params: {
          lane: 'All',        // or your selected lane
          _ts: Date.now(),    // 👈 cache-buster so each URL is unique
        },
      }
    )

    const payload = response.data
    const result = Array.isArray(payload.result) ? payload.result : []

    setData(result)
    setDate(payload.date || '')
    console.log('Toll data result:', result)
  } catch (error) {
    console.error('Error fetching toll dashboard data:', error)
    setData([])
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='w-full rounded-xl overflow-hidden border shadow-md'>
      <div className='bg-[#0a1747] px-4 py-3 text-white flex items-center justify-center gap-2'>

      
        <h2 className='text-[20px] font-bold text-center'>
          Toll Of Toll Plaza: {date}
        </h2>
      </div>

      <div className='mt-3'>
        {loading ? (
          <SkeletonLoader />
        ) : (
          <ResponsiveContainer width='100%' height={320}>
            <BarChart
              layout='vertical'
              data={data}
              margin={{
                top: 5,
                right: 70,
                left: -10,
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
                dataKey='label'
                type='category'
                tick={{ fontSize: 10, fill: 'hsl(var(--foreground))' }}
                width={170}
                stroke='hsl(var(--foreground))'
              />

              <Tooltip
                formatter={(value: number) => [
                  `৳ ${value.toLocaleString()}`,
                  'Total Amount',
                ]}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                }}
              />

              <Bar
                dataKey='totalAmount'
                fill='#0EA5E9'
                barSize={20}
                radius={[0, 4, 4, 0]}
              >
                <LabelList content={<CustomizedLabel />} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
