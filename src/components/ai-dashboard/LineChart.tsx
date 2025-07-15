import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const mockData = [
  { day: 1, amount: 5000 },
  { day: 2, amount: 8000 },
  { day: 3, amount: 2000 },
  { day: 4, amount: 7000 },
  { day: 5, amount: 10000 },
  { day: 6, amount: 25000 },
  { day: 7, amount: 23000 },
  { day: 8, amount: 18000 },
  { day: 9, amount: 6000 },
  { day: 10, amount: 7000 },
  { day: 11, amount: 19000 },
  { day: 12, amount: 22000 },
  { day: 13, amount: 26000 },
  { day: 14, amount: 20000 },
  { day: 15, amount: 23000 },
  { day: 16, amount: 27000 },
  { day: 17, amount: 24000 },
  { day: 18, amount: 21000 },
  { day: 19, amount: 25000 },
  { day: 20, amount: 28000 },
  { day: 21, amount: 22000 },
  { day: 22, amount: 26000 },
  { day: 23, amount: 29000 },
  { day: 24, amount: 23000 },
  { day: 25, amount: 27000 },
  { day: 26, amount: 30000 },
  { day: 27, amount: 25000 },
  { day: 28, amount: 28000 },
  { day: 29, amount: 24000 },
  { day: 30, amount: 26000 },
  { day: 31, amount: 29000 },
]

// Generate mock data for 31 days
const generateChartData = () => {
  return Array.from({ length: 31 }, (_, index) => ({
    day: index + 1,
    amount: Math.floor(Math.random() * (30000 - 1000 + 1)) + 1000,
  }))
}

const chartData = generateChartData()

export function LineChartComponent() {
  return (
    <Card className='w-full mx-auto'>
      <CardHeader>
        <CardTitle className='text-xl text-center font-semibold'>
          Daily Traffic at Toll Plaza (August 2024)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <LineChart
          width={650}
          height={210}
          data={chartData}
          margin={{
            right: 12,
            left: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey='day'
            // label={{
            //   value: 'Day of Month',
            //   position: 'insideBottomRight',
            //   offset: -10,
            // }}
          />
          <YAxis
            domain={[1000, 30000]}
            ticks={[1000, 5000, 10000, 15000, 20000, 25000, 30000]}
            // label={{ value: 'Amount', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          <Line
            dataKey='amount'
            type='linear'
            stroke='#8B9DFF'
            strokeWidth={2}
            dot={{
              fill: '#42ADF3',
            }}
            activeDot={{
              r: 6,
            }}
          />
        </LineChart>
      </CardContent>
    </Card>
  )
}
