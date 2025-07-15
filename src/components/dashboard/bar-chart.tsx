import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
const chartData = [
  { month: 'Booth 01', dhaka: 486, mawa: 880 },
  { month: 'Booth 02', dhaka: 305, mawa: 200 },
  { month: 'Booth 03', dhaka: 237, mawa: 120 },
  { month: 'Booth 04', dhaka: 773, mawa: 490 },
  { month: 'Booth 05', dhaka: 509, mawa: 730 },
  { month: 'Booth 06', dhaka: 914, mawa: 340 },
  { month: 'Booth 07', dhaka: 614, mawa: 240 },
  { month: 'Booth 08', dhaka: 250, mawa: 970 },
  { month: 'Booth 09', dhaka: 264, mawa: 340 },
  { month: 'Booth 10', dhaka: 114, mawa: 580 },
  { month: 'Booth 11', dhaka: 314, mawa: 490 },
  { month: 'Booth 12', dhaka: 214, mawa: 240 },
]

const chartConfig = {
  dhaka: {
    label: 'Dhaka',
    color: '#59d555',
  },
  mawa: {
    label: 'Mawa',
    color: '#e26767',
  },
} satisfies ChartConfig

export function BarChartCom() {
  return (
    <section>
      <div>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <YAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              domain={[0, 1000]}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <XAxis
              dataKey='month'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              //   tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dashed' />}
            />
            <Bar dataKey='dhaka' fill='var(--color-dhaka)' radius={4} />
            <Bar dataKey='mawa' fill='var(--color-mawa)' radius={4} />
          </BarChart>
        </ChartContainer>
      </div>
    </section>
  )
}
