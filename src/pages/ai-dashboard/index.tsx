import { Button } from '@/components/ui/button'
import { Video } from 'lucide-react'
import Logo from '@/assets/ai-assets/logo.png'
import TotalVehicle from '@/components/ai-dashboard/TotalVehicle'
// import WeatherBoard from '@/components/ai-dashboard/WeatherBoard'
import WeatherBoard from '@/components/dashboard/weather-board'

import { ChartBoard } from '@/components/ai-dashboard/ChartBoard'
import VideoFeed from '@/components/ai-dashboard/VideoFeed'
import { Link } from 'react-router-dom'
import { LineChartComponent } from '@/components/ai-dashboard/LineChart'
import { BarChartVT } from '@/components/ai-dashboard/BarChartVT'
import { TrafficOfTollDash } from '@/components/charts/traffic-toll-dash'
import { DhaleshwariChartDashboard } from '@/components/charts/dhaleshwari-chart-dash'
import { TollOfTollDash } from '@/components/charts/toll-of-toll-dash'
import logo from '@/assets/rhd.png'
import kecLogo from '@/assets/ex-pic.png'

export default function AiDashboard() {
  return (
    <>
      <div className='py-2 px-6 flex justify-between items-center bg-main'>
        <div>
          <img className='w-auto h-12' src={logo} alt='' />
        </div>

        <div className='flex items-center gap-4'>
          <Link
            to='/dashboard'
            className='text-blue-700 bg-blue-50  font-semibold py-2 px-4 rounded-full inline-flex items-center hover:bg-blue-400 hover:text-white text-sm'
          >
            <i className='pi pi-arrow-left mr-2' /> Home
          </Link>

          <Button
            variant='secondary'
            className='rounded-full border text-blue-800'
          >
            <Link
              to='/ai-dashboard/view-first-six-frames'
              className='flex items-center'
            >
              <Video className='mr-2 h-4 w-4' /> View All Camera
            </Link>
          </Button>

          <div>
            <img className='w-full h-10' src={kecLogo} alt='' />
          </div>
        </div>
      </div>
      <hr />
      <section className='p-6 bg-[#e2ecfe]'>
        <div className='grid grid-cols-8 gap-3'>
          <div className='col-span-3'>
            <TotalVehicle />
          </div>
          <div className='col-span-5'>
            <div className='grid grid-cols-6 gap-2 items-center'>
              <div className='col-span-3'>
                <ChartBoard />

                {/* <LineChartComponent /> */}
                <TrafficOfTollDash />
              </div>
              <div className='col-span-3'>
                <VideoFeed />
              </div>
            </div>

            <div className='mt-4 grid grid-cols-6 gap-2'>
              <div className='col-span-3'>
                {/* <BarChartVT /> */}
                <TollOfTollDash />
              </div>
              <div className='col-span-3'>
                <iframe
                  src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2281.827946362794!2d90.35027387486845!3d23.649776743514867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755bc3be3d29a65%3A0x75a23b873f4d0353!2zRGhhbGVzaHdhcmkgVG9sbCBQbGF6YSwg4Kai4Ka-4KaV4Ka-LeCmruCmvuCmk-Cmr-CmvOCmviDgpq7gprngpr7gprjgpqHgprzgppU!5e1!3m2!1sen!2sbd!4v1748319418725!5m2!1sen!2sbd'
                  width='600'
                  height='390'
                  allowFullScreen
                  loading='lazy'
                  className='rounded-[12px]'
                ></iframe>
                {/* <WeatherBoard /> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
