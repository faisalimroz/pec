import { DhaleshwariChartDashboard } from '@/components/charts/dhaleshwari-chart-dash'
import { TollOfTollDash } from '@/components/charts/toll-of-toll-dash'
import { TrafficOfTollDash } from '@/components/charts/traffic-toll-dash'
import EmployeeInfo from '@/components/dashboard/employee-info'
import WeatherBoard from '@/components/dashboard/weather-board'

export default function TrafficWeather() {
  return (
    <div className='grid grid-cols-12 gap-2 items-center'>
      <div className='col-span-9 flex items-center justify-center gap-2 my-0'>
        <TollOfTollDash />
        <TrafficOfTollDash />
      </div>
      <div className='col-span-3 my-0'>
        <WeatherBoard />
      </div>
    </div>
  )
}
