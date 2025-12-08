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
  label: string // Updated to match the new `label` structure
  totalVehicles: number
  totalAmount: number // Added to match the new data structure
}

interface ApiResponse {
  date: string
  result: VehicleData[]
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
      dy={12} // Adjusted slightly for centering
      fontSize={12}
      fill='hsl(var(--foreground))'
      textAnchor='start'
    >
      {value?.toLocaleString()}
    </text>
  )
}

export function TrafficOfTollDash() {
  const [data, setData] = useState<VehicleData[]>([])
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState<string>('')

const fetchData = async () => {
  try {
    setLoading(true);
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/v1/its/vehicle-detect/get/dashboard/traffic/data`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    // If your backend returns { success, date, result, ... }
    const payload = response.data;
    const result = Array.isArray(payload.result) ? payload.result : [];
  
    setData(result);
    setDate(payload.date || '');
     console.log(result)
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='w-full rounded-xl overflow-hidden border shadow-md'>
      <div className='bg-[#0a1747] px-4 py-3 text-white flex items-center justify-center gap-2'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='26'
          height='25'
          viewBox='0 0 26 25'
          fill='none'
        >
          {/* SVG Icon Content */}
          <g clip-path='url(#clip0_177_408)'>
            <mask
              id='mask0_177_408'
              maskUnits='userSpaceOnUse'
              x='0'
              y='0'
              width='25'
              height='27'
            >
              <path
                d='M0.5 1.52588e-05H25V26.28H0.5V1.52588e-05Z'
                fill='white'
              />
            </mask>
            <g mask='url(#mask0_177_408)'>
              <path
                d='M23.6166 13.4674L13.5455 23.8834C13.0342 24.4121 12.2053 24.4121 11.694 23.8834L1.62295 13.4674C1.11169 12.9386 1.11169 12.0813 1.62295 11.5525L11.694 1.13656C12.2053 0.607796 13.0342 0.607796 13.5455 1.13656L23.6166 11.5525C24.1278 12.0813 24.1278 12.9386 23.6166 13.4674Z'
                stroke='white'
                stroke-width='1.47832'
                stroke-miterlimit='10'
              />
            </g>
          </g>
        </svg>
        <h2 className='text-[20px] font-bold text-center'>
          Traffic Of Toll Plaza: {date}
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

              {/* FIX: Use 'label' instead of 'types' */}
              <YAxis
                dataKey='label' // Updated to use `label` for Y-axis
                type='category'
                tick={{ fontSize: 10, fill: 'hsl(var(--foreground))' }}
                width={170}
                stroke='hsl(var(--foreground))'
              />

              <Tooltip
                formatter={(value: number) => [
                  value.toLocaleString(),
                  'Total Vehicles',
                ]}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                }}
              />

              {/* FIX: Updated dataKey to 'totalVehicles' */}
              <Bar dataKey='totalVehicles' fill='#059669' barSize={20}>
                <LabelList content={<CustomizedLabel />} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}