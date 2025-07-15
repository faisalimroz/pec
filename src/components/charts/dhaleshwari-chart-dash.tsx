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
    <div className='relative h-[420px] w-full'>
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
      {value.toLocaleString()}
    </text>
  )
}

export function DhaleshwariChartDashboard() {
  const [data, setData] = useState<VehicleData[]>([])
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState<string>('')

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await axios.get<ApiResponse>(
        `${import.meta.env.VITE_BASE_URL}/api/v1/its/vehicle-detect/get/dashboard/traffic/data`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      setData(response.data.result)
      setDate(response.data.date)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  console.log(data)

  const formatYAxisTick = (value: string) => {
    return value
      .replace(/_/g, ' ')
      .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())
  }

  return (
    <Card className='w-full max-w-full border rounded-md'>
      <CardHeader>
        <CardTitle className='text-xl text-center font-semibold'>
          Traffic Of Toll Plaza - {date}
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
                left: 50,
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
                dataKey='types'
                type='category'
                tickFormatter={formatYAxisTick}
                tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
                width={120}
                stroke='hsl(var(--foreground))'
              />
              <Tooltip
                formatter={(value: number) => [
                  value.toLocaleString(),
                  'Total Pass',
                ]}
                labelFormatter={(label) => formatYAxisTick(label as string)}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                }}
              />
              <Bar dataKey='totalPass' fill='hsl(var(--primary))' barSize={20}>
                <LabelList content={<CustomizedLabel />} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
