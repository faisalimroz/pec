import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import { Label, Pie, PieChart } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface AccidentData {
  label: string
  value: number
}

interface VehicleAccident {
  type: string
  amount: number
}

interface ApiResponse {
  totalAccidentdata: AccidentData[]
  vehicleAccident: VehicleAccident[]
}

const chartConfig: ChartConfig = {
  value: {
    label: 'Value',
  },
  'Total Accident': {
    label: 'Total Accidents',
    color: '#42ADF3',
  },
  'Total Injured': {
    label: 'Injured',
    color: '#F2E155',
  },
  'Total Death': {
    label: 'Death',
    color: '#F52F2D',
  },
}

export function ChartBoard() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axios.get<ApiResponse>(
          `${import.meta.env.VITE_BASE_URL}/api/v1/road-traffic/roadsafety/accident/accident/overall/data`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        setData(response.data)
      } catch (err) {
        setError('Failed to fetch data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const chartData = useMemo(() => {
    if (!data) return []
    return data.totalAccidentdata.map((item) => ({
      name: item.label,
      value: item.value,
      fill:
        chartConfig[item.label as keyof typeof chartConfig]?.color || '#000000',
    }))
  }, [data])

  const totalIncidents = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0)
  }, [chartData])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!data) return <div>No data available</div>

  return (
    <Card className='flex flex-col mb-4'>
      <div className='flex items-center justify-between p-4'>
        <h1 className='uppercase font-semibold text-sm'>accident rate</h1>
        <h1 className='uppercase font-semibold text-sm'>ACCIDENT CHART</h1>
        <h1 className='uppercase font-semibold text-sm'>by vehicle type</h1>
      </div>
      <CardContent className='flex'>
        <div className='space-y-6'>
          {data.totalAccidentdata.map((item, index) => (
            <div
              key={index}
              className='flex flex-col justify-center items-center border rounded-xl w-[120px] h-[80px] relative'
            >
              <h1 className='uppercase text-xs font-semibold'>{item.label}</h1>
              <h2 className='uppercase text-xs font-semibold'>{item.value}</h2>
              <div
                className='py-1 rounded-full w-full bottom-0 absolute'
                style={{
                  backgroundColor:
                    chartConfig[item.label as keyof typeof chartConfig]?.color,
                }}
              />
            </div>
          ))}
        </div>

        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square w-[300px] max-h-[250px]'
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey='value'
              nameKey='name'
              innerRadius={60}
              strokeWidth={2}
              label
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {totalIncidents.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground'
                        >
                          Overall Incidents
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className='border-l-2 border-dashed pl-2'>
          <ul className='font-semibold space-y-[17px]'>
            {data.vehicleAccident.map((item, index) => (
              <li
                key={index}
                className='flex border-b-2 border-dashed pb-2 gap-x-6 items-center justify-between'
              >
                <span className='block'>
                  {item.type.replace('_', ' ').charAt(0).toUpperCase() +
                    item.type.replace('_', ' ').slice(1)}
                </span>
                <span className='text-blue-800 font-bold block'>
                  {item.amount.toString().padStart(2, '0')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
