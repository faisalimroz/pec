import { EDMSLettersList } from '@/components/charts/edms-chart'
import { TotalTollTraffic } from '@/components/charts/total-toll-traffic'
import EmployeeInfo from '@/components/dashboard/employee-info'

export default function AccidentWindy() {
  return (
    <div className='grid grid-cols-12 gap-2'>
      <div className='col-span-9 flex gap-2 my-0'>
        <TotalTollTraffic />

        <EmployeeInfo />
      </div>
      <div className='col-span-3'>
        <iframe
          className='rounded-[12px]'
          width={'100%'}
          height='300'
          src='https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=mm&metricTemp=°C&metricWind=km/h&zoom=6&overlay=wind&product=ecmwf&level=surface&lat=22.106&lon=91.165&message=true'
          //  frameborder='0'
        ></iframe>
        {/* <EDMSLettersList /> */}
      </div>
    </div>
  )
}
