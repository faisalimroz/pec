import React, { useEffect, useState } from 'react'
import { LabelList, Pie, PieChart } from 'recharts'
import axios from 'axios'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import redOval from '../../assets/redishOval.svg'
import blueOval from '../../assets/blueOval.svg'
import yellowOval from '../../assets/yellowOval.svg'

interface ChartDataItem {
  name: string
  value: number
  fill: string
}

interface VehicleDataItem {
  type: string
  amount: number
}

interface ApiResponse {
  totalAccidentdata: Array<{ label: string; value: number }>
  vehicleAccident: VehicleDataItem[]
}

const chartConfig: ChartConfig = {
  value: {
    label: 'Value',
  },
  'Total Death': {
    label: 'Death',
    color: '#F52F2D',
  },
  'Total Injured': {
    label: 'Injured',
    color: '#F2E155',
  },
  'Total Accident': {
    label: 'Total Accident',
    color: '#42ADF3',
  },
}

export function PieChartCom(): JSX.Element {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [chartData, setChartData] = useState<ChartDataItem[]>([])
  const [vehicleData, setVehicleData] = useState<VehicleDataItem[]>([])

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

      // Process data for pie chart
      const pieData = response.data.totalAccidentdata.map((item) => ({
        name: item.label,
        value: item.value,
        fill:
          chartConfig[item.label as keyof typeof chartConfig]?.color ||
          '#000000',
      }))
      setChartData(pieData)

      // Process vehicle accident data
      setVehicleData(response.data.vehicleAccident)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className='flex justify-center items-center h-full'>Loading...</div>
    )
  }

  if (!data) {
    return (
      <div className='flex justify-center items-center h-full'>
        No data available
      </div>
    )
  }

  return (
    <section className='flex flex-col'>
      <div className='flex-1'>
        <ChartContainer config={chartConfig} className='mx-auto max-h-[250px]'>
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey='label' />} />
            <Pie data={chartData} dataKey='value' nameKey='name' label></Pie>
          </PieChart>
        </ChartContainer>
      </div>

      <div className='flex items-center gap-4 font-semibold my-3 justify-center'>
        <div className='flex gap-4 font-semibold'>
          <img src={redOval} alt='Red oval' />
          <h1>Death</h1>
        </div>
        <div className='flex gap-4 font-semibold'>
          <img src={yellowOval} alt='Yellow oval' />
          <h1>Injured</h1>
        </div>
        <div className='flex gap-4 font-semibold'>
          <img src={blueOval} alt='Blue oval' />
          <h1>Total Accident</h1>
        </div>
      </div>

      <div className='my-3'>
        <h1 className='uppercase font-semibold text-lg text-blue-800 text-center'>
          accident by vehicle type
        </h1>

        <div className='border border-gray-200 overflow-hidden mt-4'>
          <table className='w-full'>
            <tbody className='divide-y divide-gray-200'>
              {vehicleData.map((item, index) => (
                <tr key={index} className='hover:bg-gray-50'>
                  <td className='p-3 font-semibold'>
                    {item.type.replace('_', ' ').charAt(0).toUpperCase() +
                      item.type.replace('_', ' ').slice(1)}
                  </td>
                  <td className='p-3 text-blue-800 font-bold text-right border-l border-gray-200'>
                    {item.amount.toString().padStart(2, '0')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
