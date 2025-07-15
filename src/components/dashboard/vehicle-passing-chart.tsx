import { Dropdown } from 'primereact/dropdown'
import { useState } from 'react'
import gOval from '@/assets/greenOval.svg'
import rOval from '@/assets/redOval.svg'
import { BarChartCom } from './bar-chart'

export default function VehiclePassingChart() {
  const [selectedCity, setSelectedCity] = useState(null)
  const cities = [
    { name: '12 AM - 08 AM', code: 'NY' },
    { name: '08 AM - 04 PM', code: 'RM' },
    { name: '04 PM - 12 AM', code: 'LDN' },
  ]

  return (
    <div className='border rounded-md p-2 shadow-md'>
      <div className='flex items-center justify-between mb-3'>
        <h2 className='text-xl font-bold uppercase'>
          total vehicle passing today
          <span className='text-blue-800 ml-4'>12,792</span>
        </h2>

        <div className='flex items-center gap-3'>
          {/* <Dropdown
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.value)}
            options={cities}
            optionLabel='name'
            placeholder='Schedule Type'
            className='w-full md:w-14rem'
          /> */}

          {/* <Dropdown
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.value)}
            options={cities}
            optionLabel='name'
            placeholder='By Shift'
            className='w-full md:w-14rem'
          /> */}
        </div>
      </div>
      <hr />
      <div className='flex items-center gap-4 font-semibold my-3 justify-end'>
        <div className='flex gap-4 font-semibold'>
          <img src={rOval} alt='' />
          <h1>To Mawa</h1>
        </div>

        <div className='flex gap-4 font-semibold'>
          <img src={gOval} alt='' />
          <h1>To Dhaka</h1>
        </div>
      </div>

      <BarChartCom />
    </div>
  )
}
