import { useEffect, useState } from 'react'
import {
  CloudSun,
  Sunrise,
  Sunset,
  Wind,
  Droplets,
  Gauge,
  Cloud,
} from 'lucide-react'
import Sun from '@/assets/svgs/sun.png'

interface WeatherData {
  location: string
  climate: string
  climateDesc: string
  temperature: number
  maxTemperature: number
  minTemperature: number
  feelsLike: number
  humidity: number
  cloudPercentage: number
  wind: number
  time: number
  pressure: number
  sunrise: number
  sunset: number
}

// Helper function to format date
const formatDate = (
  timestamp: number,
  format: 'dayName' | 'time' | 'date',
  use12Hour = true
): string => {
  if (!timestamp) return ''

  const date = new Date(timestamp * 1000)

  if (format === 'dayName') {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
    return days[date.getDay()]
  }

  if (format === 'date') {
    return date.getDate().toString().padStart(2, '0')
  }

  // Time format
  let hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')

  if (use12Hour) {
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`
  }

  return `${hours.toString().padStart(2, '0')}:${minutes}`
}

export default function WeatherBoard() {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    location: '',
    climate: '',
    climateDesc: '',
    temperature: 0,
    maxTemperature: 0,
    minTemperature: 0,
    feelsLike: 0,
    humidity: 0,
    cloudPercentage: 0,
    wind: 0,
    time: 0,
    pressure: 0,
    sunrise: 0,
    sunset: 0,
  })
  const [loading, setLoading] = useState(true)

  const fetchWeatherData = async () => {
    try {
      setLoading(true)

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=23.777176&lon=90.399452&appid=${
          import.meta.env.VITE_WEATHER_API_KEY
        }&units=metric`
      )

      if (!response.ok) {
        const errorMessage = `Fetching weather data failed: ${response.status}`
        throw new Error(errorMessage)
      }

      const data = await response.json()

      const updateWeatherData = {
        ...weatherData,
        location: data?.name,
        climate: data?.weather[0]?.main,
        climateDesc: data?.weather[0]?.description,
        temperature: data?.main?.temp,
        maxTemperature: data?.main?.temp_max,
        minTemperature: data?.main?.temp_min,
        feelsLike: data?.main?.feels_like,
        humidity: data?.main?.humidity,
        cloudPercentage: data?.clouds?.all,
        wind: data?.wind?.speed,
        time: data?.dt,
        pressure: data?.main?.pressure,
        sunrise: data?.sys?.sunrise,
        sunset: data?.sys?.sunset,
      }

      setWeatherData(updateWeatherData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeatherData()
  }, [])

  if (loading) {
    return (
      <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm'>
        <div className='animate-pulse'>
          <div className='flex justify-between'>
            <div className='space-y-2'>
              <div className='h-12 w-12 rounded-full bg-gray-200'></div>
              <div className='h-4 w-24 bg-gray-200'></div>
              <div className='h-4 w-16 bg-gray-200'></div>
            </div>
            <div className='space-y-2'>
              <div className='h-12 w-24 bg-gray-200'></div>
              <div className='h-4 w-32 bg-gray-200'></div>
              <div className='h-4 w-40 bg-gray-200'></div>
            </div>
          </div>
          <div className='mt-8 grid grid-cols-2 gap-6'>
            <div className='flex items-center space-x-2'>
              <div className='h-8 w-8 rounded-full bg-gray-200'></div>
              <div className='h-4 w-20 bg-gray-200'></div>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='h-8 w-8 rounded-full bg-gray-200'></div>
              <div className='h-4 w-20 bg-gray-200'></div>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='h-8 w-8 rounded-full bg-gray-200'></div>
              <div className='h-4 w-20 bg-gray-200'></div>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='h-8 w-8 rounded-full bg-gray-200'></div>
              <div className='h-4 w-20 bg-gray-200'></div>
            </div>
          </div>
          <div className='mt-8 flex justify-between'>
            <div className='flex items-center space-x-2'>
              <div className='h-6 w-6 rounded-full bg-gray-200'></div>
              <div className='h-4 w-24 bg-gray-200'></div>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='h-6 w-6 rounded-full bg-gray-200'></div>
              <div className='h-4 w-24 bg-gray-200'></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const dayName = formatDate(weatherData.time, 'dayName')
  const dayDate = formatDate(weatherData.time, 'date')
  const currentTime = formatDate(weatherData.time, 'time')
  const sunriseTime = formatDate(weatherData.sunrise, 'time')
  const sunsetTime = formatDate(weatherData.sunset, 'time')

  return (
    <div className='rounded-xl border border-gray-200 bg-white p-[4px] shadow-md'>
      <div className='flex justify-center gap-6 items-end'>
        <div className='flex flex-col items-center'>
          <div className='relative'>
            <img src={Sun} alt='' />
          </div>
          <p className='font-medium text-gray-800'>
            {dayName} {dayDate}
          </p>
          <p className='text-sm text-blue-600 font-semibold'>{currentTime}</p>
        </div>

        <div>
          <h1
            className='text-6xl font-bold'
            style={{
              backgroundImage:
                'linear-gradient(180deg, #296399 54.68%, rgba(255, 255, 255, 0.00) 187.46%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {Math.round(weatherData.temperature)}°
          </h1>
          <p className='text-sm text-gray-600 font-medium text-start'>
            Real Feel {Math.round(weatherData.feelsLike)}°
          </p>
          <p
            className='mt-1 text-xl font-medium text-start'
            style={{
              backgroundImage:
                'linear-gradient(180deg, #296399 54.68%, rgba(255, 255, 255, 0.00) 187.46%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {weatherData.climate}{' '}
          </p>
        </div>
      </div>

      <div className='mt-4 grid grid-cols-2 gap-4'>
        <div className='flex items-center bg-[#FAFAFA] rounded-[12px] justify-center p-2 gap-2'>
          <svg
            width='31'
            height='23'
            viewBox='0 0 31 23'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M19.2855 18.3057C17.9926 18.9273 16.3654 19.2376 14.4064 19.2376C10.7471 19.2376 9.52734 15.976 3.42848 14.5781C4.12985 13.9565 5.14592 13.6462 6.47791 13.6462C10.7252 13.6462 12.9305 18.3057 19.2855 18.3057ZM24.1646 14.1122C22.6665 14.731 20.9885 15.0515 19.2855 15.0441C13.1867 15.0441 11.9669 9.45266 3.42848 11.3165C4.84341 9.76298 6.87677 8.98671 9.52734 8.98671C13.5831 8.98671 16.846 14.1122 24.1646 14.1122ZM29.0437 9.91861C27.4177 10.5402 25.5881 10.8505 23.5547 10.8505C16.2361 10.8505 14.4064 2.46342 3.42848 8.05481C4.03836 5.72506 7.0878 3.86127 10.7471 3.86127C18.6756 3.86127 19.8954 9.91861 29.0437 9.91861Z'
              fill='#3C6EEF'
            />
          </svg>

          <div>
            <p className='font-bold text-gray-800'>{weatherData.humidity}%</p>
            <p className='text-gray-600 text-sm'>Humidity</p>
          </div>
        </div>

        <div className='flex items-center bg-[#FAFAFA] rounded-[12px] justify-center p-2 gap-2'>
          <svg
            width='23'
            height='23'
            viewBox='0 0 23 23'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <g clip-path='url(#clip0_21_566)'>
              <path
                d='M11.7798 17.7449C12.1505 17.7449 12.5061 17.8921 12.7682 18.1543C13.0304 18.4164 13.1777 18.772 13.1777 19.1427C13.1777 19.5135 13.0304 19.869 12.7682 20.1311C12.5061 20.3933 12.1505 20.5406 11.7798 20.5406C11.4091 20.5406 11.0535 20.3933 10.7914 20.1311C10.5292 19.869 10.382 19.5135 10.382 19.1427C10.382 18.772 10.5292 18.4164 10.7914 18.1543C11.0535 17.8921 11.4091 17.7449 11.7798 17.7449ZM18.769 17.7449C19.1398 17.7449 19.4953 17.8921 19.7575 18.1543C20.0196 18.4164 20.1669 18.772 20.1669 19.1427C20.1669 19.5135 20.0196 19.869 19.7575 20.1311C19.4953 20.3933 19.1398 20.5406 18.769 20.5406C18.3983 20.5406 18.0428 20.3933 17.7806 20.1311C17.5185 19.869 17.3712 19.5135 17.3712 19.1427C17.3712 18.772 17.5185 18.4164 17.7806 18.1543C18.0428 17.8921 18.3983 17.7449 18.769 17.7449ZM4.79056 17.7449C5.1613 17.7449 5.51684 17.8921 5.77899 18.1543C6.04114 18.4164 6.18841 18.772 6.18841 19.1427C6.18841 19.5135 6.04114 19.869 5.77899 20.1311C5.51684 20.3933 5.1613 20.5406 4.79056 20.5406C4.41983 20.5406 4.06428 20.3933 3.80213 20.1311C3.53999 19.869 3.39271 19.5135 3.39271 19.1427C3.39271 18.772 3.53999 18.4164 3.80213 18.1543C4.06428 17.8921 4.41983 17.7449 4.79056 17.7449ZM16.4393 6.56208C17.6751 6.56208 18.8602 7.05299 19.7341 7.92682C20.6079 8.80064 21.0988 9.9858 21.0988 11.2216C21.0988 12.4574 20.6079 13.6425 19.7341 14.5163C18.8602 15.3902 17.6751 15.8811 16.4393 15.8811C14.7209 15.8811 13.1683 14.9119 11.7798 12.9717C10.3913 14.9119 8.83873 15.8811 7.12031 15.8811C5.88454 15.8811 4.69937 15.3902 3.82555 14.5163C2.95173 13.6425 2.46082 12.4574 2.46082 11.2216C2.46082 9.9858 2.95173 8.80064 3.82555 7.92682C4.69937 7.05299 5.88454 6.56208 7.12031 6.56208C8.83873 6.56208 10.3913 7.53126 11.7798 9.47147C13.1683 7.53126 14.7209 6.56208 16.4393 6.56208ZM7.12031 8.42588C6.37884 8.42588 5.66775 8.72043 5.14345 9.24472C4.61916 9.76902 4.32461 10.4801 4.32461 11.2216C4.32461 11.963 4.61916 12.6741 5.14345 13.1984C5.66775 13.7227 6.37884 14.0173 7.12031 14.0173C8.28891 14.0173 9.45938 13.2019 10.6233 11.3576L10.7063 11.2206L10.6224 11.0855C9.5069 9.31864 8.38583 8.49484 7.26662 8.42961L7.12031 8.42588ZM16.4393 8.42588C15.2707 8.42588 14.1002 9.24129 12.9363 11.0855L12.8524 11.2216L12.9363 11.3576C14.0527 13.1245 15.1728 13.9483 16.293 14.0135L16.4393 14.0173C17.1808 14.0173 17.8919 13.7227 18.4162 13.1984C18.9405 12.6741 19.235 11.963 19.235 11.2216C19.235 10.4801 18.9405 9.76902 18.4162 9.24472C17.8919 8.72043 17.1808 8.42588 16.4393 8.42588ZM11.7798 1.90259C11.9634 1.90259 12.1451 1.93874 12.3147 2.00899C12.4843 2.07924 12.6384 2.18221 12.7682 2.31201C12.898 2.44181 13.001 2.59591 13.0712 2.7655C13.1415 2.9351 13.1777 3.11687 13.1777 3.30044C13.1777 3.484 13.1415 3.66577 13.0712 3.83537C13.001 4.00496 12.898 4.15906 12.7682 4.28886C12.6384 4.41867 12.4843 4.52163 12.3147 4.59188C12.1451 4.66213 11.9634 4.69828 11.7798 4.69828C11.4091 4.69828 11.0535 4.55101 10.7914 4.28886C10.5292 4.02672 10.382 3.67117 10.382 3.30044C10.382 2.9297 10.5292 2.57416 10.7914 2.31201C11.0535 2.04986 11.4091 1.90259 11.7798 1.90259ZM4.79056 1.90259C4.97413 1.90259 5.1559 1.93874 5.3255 2.00899C5.49509 2.07924 5.64919 2.18221 5.77899 2.31201C5.90879 2.44181 6.01176 2.59591 6.08201 2.7655C6.15225 2.9351 6.18841 3.11687 6.18841 3.30044C6.18841 3.484 6.15225 3.66577 6.08201 3.83537C6.01176 4.00496 5.90879 4.15906 5.77899 4.28886C5.64919 4.41867 5.49509 4.52163 5.3255 4.59188C5.1559 4.66213 4.97413 4.69828 4.79056 4.69828C4.41983 4.69828 4.06428 4.55101 3.80213 4.28886C3.53999 4.02672 3.39271 3.67117 3.39271 3.30044C3.39271 2.9297 3.53999 2.57416 3.80213 2.31201C4.06428 2.04986 4.41983 1.90259 4.79056 1.90259ZM18.769 1.90259C18.9526 1.90259 19.1344 1.93874 19.304 2.00899C19.4736 2.07924 19.6277 2.18221 19.7575 2.31201C19.8873 2.44181 19.9902 2.59591 20.0605 2.7655C20.1307 2.9351 20.1669 3.11687 20.1669 3.30044C20.1669 3.484 20.1307 3.66577 20.0605 3.83537C19.9902 4.00496 19.8873 4.15906 19.7575 4.28886C19.6277 4.41867 19.4736 4.52163 19.304 4.59188C19.1344 4.66213 18.9526 4.69828 18.769 4.69828C18.3983 4.69828 18.0428 4.55101 17.7806 4.28886C17.5185 4.02672 17.3712 3.67117 17.3712 3.30044C17.3712 2.9297 17.5185 2.57416 17.7806 2.31201C18.0428 2.04986 18.3983 1.90259 18.769 1.90259Z'
                fill='#3C6EEF'
              />
            </g>
            <defs>
              <clipPath id='clip0_21_566'>
                <rect
                  width='22.3656'
                  height='22.3656'
                  fill='white'
                  transform='translate(0.597046 0.0388184)'
                />
              </clipPath>
            </defs>
          </svg>

          <div>
            <p className='font-bold text-gray-800'>
              {weatherData.pressure} hpa
            </p>
            <p className='text-sm text-gray-600'>Air Pressure</p>
          </div>
        </div>

        <div className='flex items-center bg-[#FAFAFA] rounded-[12px] justify-center p-2 gap-2'>
          <Wind className='mr-2 h-6 w-6 text-blue-500' />
          <div>
            <p className='font-bold text-gray-800'>
              {Math.round(weatherData.wind)} km/h
            </p>
            <p className='text-sm text-gray-600'>Wind Speed</p>
          </div>
        </div>

        <div className='flex items-center bg-[#FAFAFA] rounded-[12px] justify-center p-2 gap-2'>
          <svg
            width='23'
            height='23'
            viewBox='0 0 23 23'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M3.9479 4.29236H7.6755V6.15616H3.9479V4.29236ZM15.1307 18.2708H18.8583V20.1346H15.1307V18.2708ZM2.08411 8.95185H6.7436V10.8156H2.08411V8.95185ZM8.6074 8.95185H11.4031V10.8156H8.6074V8.95185ZM13.2669 8.95185H18.8583V10.8156H13.2669V8.95185ZM3.9479 13.6113H9.5393V15.4751H3.9479V13.6113ZM11.4031 13.6113H14.1988V15.4751H11.4031V13.6113ZM16.0626 13.6113H20.7221V15.4751H16.0626V13.6113ZM9.5393 4.29236H20.7221V6.15616H9.5393V4.29236ZM2.08411 18.2708H13.2669V20.1346H2.08411V18.2708Z'
              fill='#3C6EEF'
            />
          </svg>

          <div>
            <p className='font-bold text-gray-800'>
              {weatherData.cloudPercentage}%
            </p>
            <p className='text-sm text-gray-600'>Fog</p>
          </div>
        </div>
      </div>

      <div className='mt-8 flex justify-center gap-3'>
        <div className='flex items-center bg-[#FAFAFA] rounded-[10px] p-2'>
          <Sunrise className='mr-2 h-5 w-5 text-gray-800' />
          <p className='font-medium text-gray-800'>
            Sunrise <span className='font-bold'>{sunriseTime}</span>
          </p>
        </div>

        <div className='flex items-center bg-[#FAFAFA] rounded-[10px] p-2'>
          <Sunset className='mr-2 h-5 w-5 text-gray-800' />
          <p className='font-medium text-gray-800'>
            Sunset <span className='font-bold'>{sunsetTime}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
