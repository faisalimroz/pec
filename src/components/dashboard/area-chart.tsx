import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const chartData = [
  { month: 'January', amount: 266000 },
  { month: 'February', amount: 505000 },
  { month: 'March', amount: 357000 },
  { month: 'April', amount: 263000 },
  { month: 'May', amount: 339000 },
  { month: 'June', amount: 354000 },
  { month: 'July', amount: 410000 },
  { month: 'August', amount: 460000 },
  { month: 'September', amount: 370000 },
  { month: 'October', amount: 460000 },
  { month: 'November', amount: 530000 },
  { month: 'December', amount: 580000 },
]

const chartConfig = {
  amount: {
    label: 'Amount',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export function AreaChartCom() {
  return (
    <section>
      <div>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              // tickFormatter={(value) => `BDT-${value}`}
              domain={['auto', 'auto']}
            />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dot' />}
            />
            <Area
              dataKey='amount'
              type='natural'
              fill='#16a34a'
              fillOpacity={0.2}
              stroke='#16a34a'
              stackId='a'
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </section>
  )
}
