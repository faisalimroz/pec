import type React from 'react'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CalendarIcon, Clock, TrafficCone } from 'lucide-react'
import { date } from 'zod'

interface DashboardData {
  date: string
  totalPass: number
  totalAmount: number
}
const todaysDate = new Date()

const StatCard = ({
  icon: Icon,
  label,
  value,
  bgColor,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  bgColor: string
}) => (
  <Card
    className={`${bgColor} rounded-[8px] overflow-hidden text-white h-[150px]`}
  >
    <div className='p-2'>
      <div className='  mb-4'>
        <div className='flex flex items-start gap-5'>
          <div className='bg-white/20 p-2.5 rounded-full'>
            <Icon className='w-6 h-6' />
          </div>
          <div className='space-y-6'>
            <span className='text-2xl font-semibold '>{label}</span>

          </div>
        </div>




        <div>
          <p className='text-3xl font-bold tabular-nums p-2'>
            {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
          </p>
        </div>
      </div>
    </div>
  </Card>
)

const SkeletonCard = () => (
  <Card className='rounded-xl overflow-hidden h-[200px]'>
    <div className='p-6'>
      <div className='flex items-center gap-3 mb-4'>
        <Skeleton className='w-10 h-10 rounded-full' />
        <Skeleton className='h-6 w-24' />
      </div>
      <Skeleton className='h-10 w-32' />
    </div>
  </Card>
)

export function TotalTollTraffic() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await axios.get<DashboardData>(
        `${import.meta.env.VITE_BASE_URL}/api/v1/its/vehicle-detect/get/dashboard/total/data`,
        {
          headers: {
              
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      setData(response.data)
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className='w-full rounded-xl overflow-hidden border'>
        <div className='bg-[#0a1747] px-4 py-3 flex items-center gap-2'>
          <Skeleton className='h-6 w-32' />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4'>
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    )
  }

  return (
    <div className='w-full rounded-xl overflow-hidden border shadow-md'>
      <div className='bg-[#0a1747] px-4 py-3 text-white flex items-center gap-2'>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M16 2V6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M8 2V6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M3 10H21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <h2 className='text-[20px] font-bold'>
          {data?.date ? data?.date : new Date().toISOString().split("T")[0]}
        </h2>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-3 p-4 '>
        <StatCard
          icon={TrafficIcon}
          label='TRAFFIC'
          value={data?.totalPass ?? 0}
          bgColor='bg-[#059669]'

        />
        <StatCard
          icon={TakaIcon}
          label='TOLL'
          value={data?.totalAmount ?? 0}
          bgColor='bg-[#0EA5E9]'
        />
      </div>
    </div>
  )
}

const TrafficIcon = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      viewBox='0 0 34 34'
      fill='none'
    >
      <path
        d='M29.3093 20.0751H25.0355V19.0343H26.4051C27.2381 19.0343 27.9155 18.3566 27.9155 17.5236C27.9155 16.3678 28.5486 15.3104 29.5671 14.7643L30.0482 14.5067C30.6914 14.1618 31.0042 13.4546 30.8263 12.7468C30.6487 12.039 30.039 11.5634 29.3091 11.5634H25.0353V10.5226H26.4049C27.2379 10.5226 27.9153 9.84491 27.9153 9.01191C27.9153 7.85612 28.5484 6.79851 29.5671 6.2526L30.048 5.99505C30.6912 5.65037 31.004 4.94317 30.8263 4.23533C30.6485 3.5275 30.0388 3.05192 29.3089 3.05192H25.0276C24.952 1.955 24.0378 1.08502 22.922 1.08502H11.0777C9.96182 1.08502 9.04765 1.955 8.972 3.05192H4.69055C3.96061 3.05192 3.35095 3.5275 3.1733 4.23533C2.99565 4.94317 3.30845 5.65037 3.95169 5.99505L4.43236 6.2526C5.4513 6.79872 6.08412 7.85591 6.08412 9.01191C6.08412 9.84491 6.76179 10.5226 7.59479 10.5226H8.96435V11.5634H4.69055C3.96061 11.5634 3.35095 12.039 3.1733 12.7468C2.99565 13.4546 3.30824 14.1618 3.95169 14.5067L4.43236 14.7643C5.4513 15.3104 6.08412 16.3678 6.08412 17.5236C6.08412 18.3566 6.76179 19.0343 7.59479 19.0343H8.96435V20.0751H4.69055C3.96061 20.0751 3.35095 20.5507 3.1733 21.2585C2.99565 21.9661 3.30824 22.6733 3.95147 23.0182L4.43236 23.276C5.45109 23.8219 6.08412 24.8793 6.08412 26.0353C6.08412 26.8683 6.76179 27.5457 7.59479 27.5457H8.97179C9.04744 28.6427 9.96161 29.5126 11.0774 29.5126H11.8116V32.1716C11.8116 32.5824 12.1446 32.9154 12.5554 32.9154H21.4443C21.855 32.9154 22.188 32.5824 22.188 32.1716V29.5126H22.9222C24.038 29.5126 24.9522 28.6427 25.0279 27.5457H26.4049C27.2379 27.5457 27.9153 26.8683 27.9153 26.0353C27.9153 24.8793 28.5484 23.8219 29.5671 23.276L30.048 23.0182C30.6912 22.6733 31.004 21.9661 30.8263 21.2585C30.6489 20.5507 30.0392 20.0751 29.3093 20.0751ZM20.7007 31.4281H13.2993V29.5944H20.7007V31.4281ZM29.3093 13.0507C29.3403 13.0507 29.3692 13.0507 29.3839 13.1089C29.3986 13.1671 29.3729 13.1809 29.3459 13.1954L28.8648 13.4529C27.3617 14.2585 26.428 15.8183 26.428 17.5234C26.428 17.5363 26.4176 17.5465 26.4051 17.5465H25.0355V13.0507H29.3093ZM29.3839 4.59701C29.3986 4.65502 29.3728 4.66884 29.3456 4.6835L28.8648 4.94105C27.3617 5.74685 26.428 7.30639 26.428 9.01149C26.428 9.02424 26.4176 9.03465 26.4051 9.03465H25.0355V4.53878H29.3093C29.3403 4.53878 29.3694 4.53878 29.3839 4.59701ZM7.59479 9.03465C7.58204 9.03465 7.57162 9.02424 7.57162 9.01149C7.57162 7.30639 6.6379 5.74663 5.13489 4.94105L4.65421 4.6835C4.62701 4.66905 4.6013 4.65523 4.61596 4.59701C4.63062 4.53878 4.65974 4.53878 4.69055 4.53878H8.96435V9.03465H7.59479ZM7.59479 17.5468C7.58204 17.5468 7.57162 17.5363 7.57162 17.5236C7.57162 15.8185 6.6379 14.2587 5.13489 13.4532L4.65421 13.1956C4.62701 13.1812 4.6013 13.1671 4.61596 13.1091C4.63062 13.0509 4.65974 13.0509 4.69055 13.0509H8.96435V17.547L7.59479 17.5468ZM7.57162 26.0355C7.57162 24.3302 6.6379 22.7704 5.1351 21.9651L4.65421 21.7073C4.62701 21.6928 4.6013 21.6788 4.61596 21.6208C4.63062 21.5628 4.65974 21.5628 4.69055 21.5628H8.96435V26.0587H7.59479C7.58204 26.0584 7.57162 26.0482 7.57162 26.0355ZM23.548 27.3997C23.548 27.7446 23.2673 28.0253 22.9224 28.0253H11.0777C10.7326 28.0253 10.4521 27.7446 10.4521 27.3997V3.19748C10.4521 2.85238 10.7328 2.57188 11.0777 2.57188H22.9224C23.2673 2.57188 23.548 2.8526 23.548 3.19748V27.3997ZM29.3456 21.7073L28.8648 21.9651C27.3617 22.7704 26.428 24.3302 26.428 26.0355C26.428 26.0482 26.4176 26.0584 26.4051 26.0584H25.0355V21.5626H29.3093C29.3403 21.5626 29.3692 21.5626 29.3839 21.6206C29.3986 21.679 29.3728 21.6926 29.3456 21.7073Z'
        fill='white'
      />
      <path
        d='M17 3.8811C15.1871 3.8811 13.7122 5.35585 13.7122 7.1689C13.7122 8.98195 15.1869 10.4565 17 10.4565C18.813 10.4565 20.2878 8.98174 20.2878 7.16869C20.2878 5.35564 18.8128 3.8811 17 3.8811ZM17 8.96899C16.0074 8.96899 15.1997 8.16149 15.1997 7.16869C15.1997 6.17589 16.0074 5.36839 17 5.36839C17.9925 5.36839 18.8003 6.17589 18.8003 7.16869C18.8003 8.16149 17.9925 8.96899 17 8.96899Z'
        fill='white'
      />
      <path
        d='M17 12.0109C15.1871 12.0109 13.7122 13.4857 13.7122 15.2987C13.7122 17.1118 15.1869 18.5863 17 18.5863C18.813 18.5863 20.2878 17.1116 20.2878 15.2985C20.2878 13.4855 18.8128 12.0109 17 12.0109ZM17 17.0988C16.0074 17.0988 15.1997 16.2911 15.1997 15.2985C15.1997 14.3059 16.0074 13.4982 17 13.4982C17.9925 13.4982 18.8003 14.3059 18.8003 15.2985C18.8003 16.2911 17.9925 17.0988 17 17.0988Z'
        fill='white'
      />
      <path
        d='M17 20.141C15.1871 20.141 13.7122 21.6157 13.7122 23.4285C13.7122 25.2414 15.1869 26.7163 17 26.7163C18.813 26.7163 20.2878 25.2416 20.2878 23.4285C20.2875 21.6157 18.8128 20.141 17 20.141ZM17 25.2286C16.0074 25.2286 15.1997 24.4209 15.1997 23.4283C15.1997 22.4357 16.0074 21.6282 17 21.6282C17.9925 21.6282 18.8003 22.4357 18.8003 23.4283C18.8003 24.4209 17.9925 25.2286 17 25.2286Z'
        fill='white'
      />
    </svg>
  )
}

const TakaIcon = () => {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 36 36'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <g clip-path='url(#clip0_22_2105)'>
        <path
          d='M5.14697 1.40625V7.03125C8.23679 3.58073 12.7225 1.40625 17.7188 1.40625C27.0386 1.40625 34.5938 8.96147 34.5938 18.2812C34.5938 20.2536 34.2555 22.1469 33.6337 23.9062'
          stroke='white'
          stroke-width='2'
          stroke-miterlimit='10'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
        <g clip-path='url(#clip1_22_2105)'>
          <path
            d='M11.4063 9.26172C10.7188 9.17579 10.0938 9.66016 10.0079 10.3438C9.92192 11.0273 10.4102 11.6563 11.0938 11.7422L11.4024 11.7813C12.0274 11.8594 12.4961 12.3906 12.4961 13.0234L12.5 14.25H11.25C10.5586 14.25 10 14.8086 10 15.5C10 16.1914 10.5586 16.75 11.25 16.75H12.5V23C12.5 25.0703 14.1797 26.75 16.25 26.75H17.5C21.6407 26.75 25 23.3906 25 19.25V18C25 15.9297 23.3204 14.25 21.25 14.25H20.625C19.9336 14.25 19.375 14.8086 19.375 15.5C19.375 16.1914 19.9336 16.75 20.625 16.75H21.25C21.9415 16.75 22.5 17.3086 22.5 18V19.25C22.5 22.0117 20.2618 24.25 17.5 24.25H16.25C15.5586 24.25 15 23.6914 15 23V16.75H16.25C16.9415 16.75 17.5 16.1914 17.5 15.5C17.5 14.8086 16.9415 14.25 16.25 14.25H15V13.0195C15 11.1289 13.5899 9.53125 11.7149 9.29688L11.4063 9.25782V9.26172Z'
            fill='white'
          />
        </g>
        <path
          d='M30.9375 34.5938V28.9688L30.8939 28.93C27.803 32.4049 23.2977 34.5938 18.2812 34.5938C8.96147 34.5938 1.40625 27.0385 1.40625 17.7188C1.40625 15.7464 1.74459 13.8531 2.36644 12.0938'
          stroke='white'
          stroke-width='2'
          stroke-miterlimit='10'
          stroke-linecap='round'
          stroke-linejoin='round'
        />
      </g>
      <defs>
        <clipPath id='clip0_22_2105'>
          <rect width='36' height='36' fill='white' />
        </clipPath>
        <clipPath id='clip1_22_2105'>
          <rect
            width='15'
            height='20'
            fill='white'
            transform='translate(10 8)'
          />
        </clipPath>
      </defs>
    </svg>
  )
}
