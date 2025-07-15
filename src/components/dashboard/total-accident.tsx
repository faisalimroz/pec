import { Link } from 'react-router-dom'
import { PieChartCom } from './pie-chart'

export default function TotalAccident() {
  return (
    <div className='border rounded-md shadow-md'>
      <div className='flex items-center justify-between p-3'>
        <h1 className='text-lg font-semibold uppercase text-blue-800'>
          total accident rate
        </h1>

        <Link
          to='/road-and-traffic/accident-report'
          className='text-blue-800 font-semibold underline text-lg underline-offset-1'
        >
          View More
        </Link>
      </div>

      <div className='mt-14'>
        <PieChartCom />
      </div>
    </div>
  )
}
