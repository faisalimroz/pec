import React from 'react'
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

const data = [
  // { vehicleType: 'Exemption', percentage: 1.9 },
  { vehicleType: 'Motorcycle', percentage: 13.4 },
  { vehicleType: 'Private Car/Sedan', percentage: 28.3 },
  { vehicleType: 'Pickup/4-Wheeler', percentage: 33.0 },
  { vehicleType: 'Micro Bus', percentage: 43.1 },
  { vehicleType: 'Mini Bus', percentage: 7.6 },
  { vehicleType: 'Small Truck', percentage: 2.4 },
  { vehicleType: 'Bus', percentage: 16.3 },
  { vehicleType: 'Medium Truck', percentage: 9.3 },
  { vehicleType: 'Heavy Truck', percentage: 2.3 },
  { vehicleType: 'Trailer', percentage: 3.3 },
].reverse()

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
      {`${value.toFixed(1)}%`}
    </text>
  )
}

export function BarChartVT() {
  return (
    <Card className='w-full max-w-4xl'>
      <CardHeader>
        <CardTitle className='text-xl text-center font-semibold'>
          Vehicle Type Of Dhaleshwari (%)
        </CardTitle>
      </CardHeader>
      <CardContent>
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
              dataKey='vehicleType'
              type='category'
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              // @ts-ignore
              formatter={(value) => `${value.toFixed(1)}%`}
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
      </CardContent>
    </Card>
  )
}
