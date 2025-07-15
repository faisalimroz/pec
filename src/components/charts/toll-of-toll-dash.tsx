import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  CartesianGrid,
} from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'

interface VehicleData {
  types: string
  totalPass: number
}

interface ApiResponse {
  date: string
  result: VehicleData[]
}

const SkeletonLoader = () => (
  <div className='space-y-4'>
    <Skeleton className='h-6 w-3/4 mx-auto' />
    <div className='relative h-[240px] w-full'>
      <div className='absolute left-0 top-0 bottom-0 w-40 flex flex-col justify-between'>
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className='h-4 w-32' />
        ))}
      </div>
      <div className='absolute left-44 right-0 top-0 bottom-8 rounded'>
        <div className='h-full flex flex-col justify-between py-4'>
          {[...Array(10)].map((_, i) => (
            <div key={i} className='flex items-center space-x-2'>
              <Skeleton className='h-5 w-1/2 bg-blue-200' />
              <Skeleton className='h-4 w-16' />
            </div>
          ))}
        </div>
      </div>
      <div className='absolute left-44 right-0 bottom-0 flex justify-between'>
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className='h-4 w-12' />
        ))}
      </div>
    </div>
    <p className='text-center text-muted-foreground font-medium'>
      Graph Data Is Loading. Please Wait...
    </p>
  </div>
)

const CustomizedLabel: React.FC<any> = (props) => {
  const { x, y, width, value } = props
  return (
    <text
      x={x + width + 5}
      y={y}
      dy={4}
      fontSize={12}
      fill='hsl(var(--foreground))'
      textAnchor='start'
    >
      {value?.toLocaleString()}
    </text>
  )
}

export function TollOfTollDash() {
  const [data, setData] = useState<VehicleData[]>([])
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState<string>('')

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await axios.get<ApiResponse>(
        `${import.meta.env.VITE_BASE_URL}/api/v1/its/vehicle-detect/get/dashboard/toll/data`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      setData(response.data?.result)
      setDate(response.data?.date)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // console.log('TOll Data', data)

  const formatYAxisTick = (value: string) => {
    return value
      .replace(/_/g, ' ')
      .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())
  }

  return (
    <div className='w-full rounded-xl overflow-hidden border shadow-md'>
      <div className='bg-[#0a1747] px-4 py-3 text-white flex items-center justify-center gap-2'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='25'
          height='26'
          viewBox='0 0 25 26'
          fill='none'
        >
          <path
            d='M0.85498 14.7209V15.4579C0.85498 15.845 1.16868 16.1587 1.55572 16.1587H13.9814C14.3684 16.1587 14.6822 15.845 14.6822 15.4579V14.7209C14.6822 14.3339 14.3684 14.0201 13.9814 14.0201H1.55572C1.16868 14.0201 0.85498 14.3339 0.85498 14.7209Z'
            fill='white'
          />
          <path
            d='M22.0848 24.0754H20.7364V16.6594C20.7364 15.4451 19.7519 14.4606 18.5376 14.4606C17.3232 14.4606 16.3388 15.4451 16.3388 16.6594V24.0754H13.9643V16.7089H1.57465V24.0754H0.550149C0.397921 24.0754 0.274414 24.1989 0.274414 24.3511C0.274414 24.5034 0.397921 24.6269 0.550149 24.6269H22.0848C22.237 24.6269 22.3605 24.5034 22.3605 24.3511C22.3605 24.1989 22.237 24.0754 22.0848 24.0754ZM12.1187 22.0692C12.1187 22.4405 11.8172 22.7456 11.4422 22.7456H4.09297C3.72165 22.7456 3.41647 22.4405 3.41647 22.0692V18.3265C3.41647 17.9552 3.72165 17.65 4.09297 17.65H11.4422C11.8172 17.65 12.1187 17.9552 12.1187 18.3265V22.0692ZM17.8816 21.872C17.8816 22.0243 17.7581 22.1478 17.6059 22.1478C17.4537 22.1478 17.3302 22.0243 17.3302 21.872V19.7238C17.3302 19.5715 17.4537 19.448 17.6059 19.448C17.7581 19.448 17.8816 19.5715 17.8816 19.7238V21.872ZM17.8816 18.8072C17.8816 18.9594 17.7581 19.0829 17.6059 19.0829C17.4537 19.0829 17.3302 18.9594 17.3302 18.8072V18.6776C17.3302 18.5253 17.4537 18.4018 17.6059 18.4018C17.7581 18.4018 17.8816 18.5253 17.8816 18.6776V18.8072ZM18.898 16.8327H18.1771C18.0249 16.8327 17.9014 16.7092 17.9014 16.5569C17.9014 16.4047 18.0249 16.2812 18.1771 16.2812H18.898C19.0503 16.2812 19.1738 16.4047 19.1738 16.5569C19.1738 16.7092 19.0503 16.8327 18.898 16.8327Z'
            fill='white'
          />
          <path
            d='M9.78052 12.8522H5.85408C5.57466 12.8522 5.34668 13.0802 5.34668 13.3596V13.4699H10.2879V13.3596C10.2879 13.0802 10.0636 12.8522 9.78052 12.8522Z'
            fill='white'
          />
          <path
            d='M20.8008 9.21641L22.5467 11.7918L23.4051 10.1323L21.6603 7.55612L20.8008 9.21641Z'
            fill='white'
          />
          <path
            d='M22.2582 12.3495L20.5121 9.77383L19.6531 11.4331L21.401 14.0068L22.2582 12.3495Z'
            fill='white'
          />
          <path
            d='M20.8208 15.128L21.1128 14.5637L19.3645 11.9895L18.365 13.9147C18.4238 13.9074 18.479 13.9074 18.5378 13.9074C19.4863 13.9074 20.3282 14.3927 20.8208 15.128Z'
            fill='white'
          />
          <path
            d='M23.9863 6.04708C23.3172 5.69781 22.49 5.95885 22.1407 6.62797L21.9487 6.99876L23.6933 9.57473L24.5672 7.88532C24.6738 7.68311 24.7253 7.46987 24.7253 7.25663C24.7253 6.764 24.4532 6.28972 23.9863 6.04708Z'
            fill='white'
          />
          <path
            d='M5.63471 7.76751L6.17254 7.11982C6.26984 7.00278 6.25368 6.82883 6.13664 6.73153C6.01923 6.63423 5.84546 6.65021 5.74816 6.76761L5.21034 7.4153C5.11304 7.53235 5.1292 7.70629 5.24624 7.80359C5.364 7.90091 5.53749 7.88456 5.63471 7.76751Z'
            fill='white'
          />
          <path
            d='M5.75081 9.03704C5.87006 9.12926 6.04342 9.10838 6.13748 8.98677L7.49893 7.21783C7.59156 7.09719 7.5693 6.92396 7.4483 6.83115C7.32767 6.73798 7.15462 6.76096 7.06163 6.88142L5.70018 8.65036C5.60755 8.771 5.62982 8.94423 5.75081 9.03704Z'
            fill='white'
          />
          <path
            d='M1.30849 3.76473H2.0673V13.4699H4.79521V13.3596C4.79521 12.775 5.26949 12.3008 5.85408 12.3008H9.78053C10.3651 12.3008 10.8394 12.775 10.8394 13.3596V13.4699H13.4717V3.76473H14.229C14.616 3.76473 14.9297 3.45098 14.9297 3.06397V2.0739C14.9297 1.68687 14.616 1.37314 14.229 1.37314H1.30849C0.92146 1.37314 0.607666 1.68686 0.607666 2.0739V3.06397C0.607666 3.45098 0.92146 3.76473 1.30849 3.76473ZM11.5305 6.5618V10.4956C11.5305 10.9662 11.1483 11.3486 10.6776 11.3486H4.86146C4.39086 11.3486 4.00849 10.9662 4.00849 10.4956V6.5618C4.00849 6.08752 4.39086 5.70518 4.86146 5.70518H10.6776C11.1483 5.70518 11.5305 6.08752 11.5305 6.5618ZM6.46848 2.2932H6.59809C6.75032 2.2932 6.87382 2.4167 6.87382 2.56893C6.87382 2.72116 6.75032 2.84467 6.59809 2.84467H6.46848C6.31625 2.84467 6.19274 2.72116 6.19274 2.56893C6.19274 2.4167 6.31625 2.2932 6.46848 2.2932ZM2.06569 2.2932H5.55187C5.7041 2.2932 5.82761 2.4167 5.82761 2.56893C5.82761 2.72116 5.7041 2.84467 5.55187 2.84467H2.06569C1.91346 2.84467 1.78995 2.72116 1.78995 2.56893C1.78995 2.4167 1.91346 2.2932 2.06569 2.2932Z'
            fill='white'
          />
          <path
            d='M14.5178 6.82292V6.95253C14.5178 7.10475 14.6413 7.22826 14.7936 7.22826C14.9458 7.22826 15.0693 7.10475 15.0693 6.95253V6.82292C15.0693 6.67069 14.9458 6.54718 14.7936 6.54718C14.6413 6.54718 14.5178 6.67069 14.5178 6.82292Z'
            fill='white'
          />
          <path
            d='M15.0693 11.3553V7.86912C15.0693 7.71689 14.9458 7.59338 14.7936 7.59338C14.6413 7.59338 14.5178 7.71689 14.5178 7.86912V11.3553C14.5178 11.5075 14.6413 11.631 14.7936 11.631C14.9458 11.631 15.0693 11.5075 15.0693 11.3553Z'
            fill='white'
          />
          <path
            d='M8.11091 18.7382H7.9813C7.82907 18.7382 7.70557 18.8617 7.70557 19.014C7.70557 19.1662 7.82907 19.2897 7.9813 19.2897H8.11091C8.26314 19.2897 8.38665 19.1662 8.38665 19.014C8.38665 18.8617 8.26314 18.7382 8.11091 18.7382Z'
            fill='white'
          />
          <path
            d='M7.06468 18.7382H4.9166C4.76438 18.7382 4.64087 18.8617 4.64087 19.014C4.64087 19.1662 4.76438 19.2897 4.9166 19.2897H7.06468C7.21691 19.2897 7.34042 19.1662 7.34042 19.014C7.34042 18.8617 7.21691 18.7382 7.06468 18.7382Z'
            fill='white'
          />
        </svg>
        <h2 className='text-[20px] font-bold text-center'>
          Toll Of Toll Plaza: {date}
        </h2>
      </div>
      <div className='mt-3'>
        {loading ? (
          <SkeletonLoader />
        ) : (
          <ResponsiveContainer width='100%' height={320}>
            <BarChart
              layout='vertical'
              data={data}
              margin={{
                top: 5,
                right: 60,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid horizontal={false} stroke='hsl(var(--border))' />
              <XAxis
                type='number'
                domain={[0, 'dataMax']}
                tickCount={6}
                stroke='hsl(var(--foreground))'
              />
              <YAxis
                dataKey='types'
                type='category'
                tickFormatter={formatYAxisTick}
                tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
                width={120}
                stroke='hsl(var(--foreground))'
              />
              <Tooltip
                formatter={(value: number) => [
                  value.toLocaleString(),
                  'Total Amount',
                ]}
                labelFormatter={(label) => formatYAxisTick(label as string)}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                }}
              />
              <Bar dataKey='totalAmount' fill='#0EA5E9' barSize={20}>
                <LabelList content={<CustomizedLabel />} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
