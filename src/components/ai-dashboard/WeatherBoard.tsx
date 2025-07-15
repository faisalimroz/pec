import { useEffect, useState } from 'react'
import sunCloud from '@/assets/ai-assets/svgs/sunCloud.svg'
import { formattedDate } from '@/utils/date-util'

export default function WeatherBoard() {
  const [weatherData, setWeatherData] = useState({
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
  const [loading, setLoading] = useState(false)

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
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeatherData()
  }, [])

  // console.log(weatherData)

  return (
    <div className='border p-4 rounded-xl bg-white h-fit mb-4'>
      <div className='flex items-center gap-4 justify-around'>
        <div>
          <h1 className='uppercase font-bold'>
            {formattedDate(weatherData?.time, 'dayName', false)}
          </h1>
          <h2 className='text-6xl font-bold text-[#0B1F8F]'>
            {Math.round(weatherData?.temperature)}°
          </h2>
        </div>
        {/* // vertical dotter border  */}
        <div className='border-r border-gray-400 border-dashed h-24'></div>
        <div>
          <h1 className='text-[#4F5658]'>
            Real Feel{' '}
            <span className='font-bold text-black'>
              {Math.round(weatherData?.feelsLike)}°
            </span>
          </h1>

          <h1 className='text-[#4F5658]'>
            Wind Speed{' '}
            <span className='font-bold text-black'>
              {Math.round(weatherData?.wind)}km/h
            </span>
          </h1>

          <h1 className='text-[#4F5658]'>
            Air Pressure{' '}
            <span className='font-bold text-black'>
              {weatherData?.pressure} hpa
            </span>
          </h1>

          <h1 className='text-[#4F5658]'>
            Humidity{' '}
            <span className='font-bold text-black'>
              {weatherData?.humidity}%
            </span>
          </h1>
        </div>
        <div>
          <h1 className='font-bold text-center'>
            {formattedDate(weatherData?.time, 'time', false)}
          </h1>
          <img className='mt-2' src={sunCloud} alt='' />
        </div>
        <div>
          <h1 className='text-[#4F5658]'>
            Sunrise{' '}
            <span className='font-bold text-black'>
              {formattedDate(weatherData?.sunrise, 'time', false)}
            </span>
          </h1>

          <h1 className='text-[#4F5658]'>
            Sunset{' '}
            <span className='font-bold text-black'>
              {formattedDate(weatherData?.sunset, 'time', false)}
            </span>
          </h1>
        </div>
      </div>

      {/* <div>
        <h1 className='mt-8 font-semibold text-3xl text-center'>
          Todays Weather Condition
        </h1>

        <h2 className='text-5xl text-center font-bold mt-4'>
          {weatherData?.climate}
        </h2>
      </div> */}
    </div>
  )
}
