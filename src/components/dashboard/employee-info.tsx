import { useEffect, useState } from 'react'
import axios from 'axios'
import { Skeleton } from '@/components/ui/skeleton'

interface WimData { 
  label: string
  value: number
}

interface ApiResponse {
  data: WimData[] // WIM Data for the previous day/shift
  yesterdayDate: string
}

const SkeletonLoader = () => (
  <div className='w-full rounded-xl overflow-hidden bg-white shadow'>
    <div className='bg-[#0a1747] p-4'>
      <Skeleton className='h-6 w-32' />
    </div>
    <div className='p-4 grid grid-cols-1 md:grid-cols-3 gap-4'>
      {[
        { bg: 'bg-main', inner: 'bg-darkblue' },
        { bg: 'bg-redbg', inner: 'bg-darkred' },
        { bg: 'bg-pass', inner: 'bg-darkgray' },
      ].map((color, index) => (
        <div key={index} className={`${color.bg} rounded-xl overflow-hidden`}>
          <div
            className={`${color.inner} relative rounded-lg mx-4 mt-4 mb-2 p-4`}
          >
            <div
              className='absolute inset-0'
              style={{
                background:
                  'linear-gradient(135deg, transparent 50%, rgba(255, 255, 255, 0.15) 50%)',
              }}
            ></div>
            <div className='relative z-10'>
              <Skeleton className='h-6 w-24 bg-white/20 mb-2' />
              <Skeleton className='h-10 w-16 bg-white/20' />
            </div>
          </div>
          <div className='p-4 text-center'>
            <Skeleton className='h-10 w-20 mx-auto bg-white/20 mb-1' />
            <Skeleton className='h-5 w-32 mx-auto bg-white/20' />
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default function AccidentInfo() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Define WIM data labels (must match the labels returned by the controller)
  const WIM_LABEL_TOTAL = 'Total Vehicles' 
  const WIM_LABEL_VIOLATION = 'Total Overload' 
  const WIM_LABEL_PASS = 'Total Pass' 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          // 🚨 UPDATED ENDPOINT: Assuming this new route triggers the controller
          `${import.meta.env.VITE_BASE_URL}/api/v1/toll/limited-wim-data/stats/yesterday-wim-data`, 
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        setData(response.data)
      } catch (err) {
        setError('Failed to fetch data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Helper to get value from the 'data' array
  const getTotalValue = (label: string) => {
    if (!data || !data.data) return 0 
    const item = data.data.find((item) => item.label === label) 
    return item ? item.value : 0
  }

  if (loading) {
    return <SkeletonLoader />
  }

  if (error) {
    return <div>Error: {error}</div>
  }
  
  // Retrieve the values using the WIM labels
  const totalWIM = getTotalValue(WIM_LABEL_TOTAL)
  const totalViolation = getTotalValue(WIM_LABEL_VIOLATION)
  const totalPass = getTotalValue(WIM_LABEL_PASS)

  return (
    <div className='w-full rounded-xl overflow-hidden bg-white shadow-md'>
      <div className='bg-[#0a1747] px-4 py-3 text-white flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M6.58872 10.2675C7.52594 7.89 8.65328 6.25 11.2053 6.25H18.0461C20.5958 6.25 21.7244 7.89 22.6628 10.2675L23.6 12.8112C24.2984 12.8199 24.9399 13.2076 25.2855 13.83C25.4889 14.1845 25.5954 14.5886 25.5939 15V18.28C25.603 19.0459 25.226 19.7622 24.597 20.175C24.2978 20.3661 23.9525 20.4674 23.6 20.4675H5.65028C5.29785 20.4674 4.9525 20.3661 4.65335 20.175C4.02425 19.7622 3.64734 19.0459 3.65641 18.28V15C3.65509 14.5891 3.7616 14.1854 3.96475 13.8312C4.31042 13.2089 4.95195 12.8211 5.65028 12.8125L6.58872 10.2675Z" stroke="white" strokeWidth="1.875" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.58272 20.468C8.58272 19.9503 8.163 19.5305 7.64522 19.5305C7.12746 19.5305 6.70772 19.9503 6.70772 20.468H8.58272ZM7.64522 22.1093H6.70772C6.70772 22.119 6.70787 22.1288 6.70818 22.1385L7.64522 22.1093ZM6.1486 23.7493L6.1151 24.6861C6.13718 24.687 6.15928 24.687 6.18136 24.6863L6.1486 23.7493ZM4.6532 22.108L5.59021 22.138C5.59053 22.128 5.5907 22.118 5.5907 22.108H4.6532ZM5.5907 20.1743C5.5907 19.6565 5.17096 19.2368 4.6532 19.2368C4.13542 19.2368 3.7157 19.6565 3.7157 20.1743H5.5907ZM5.65013 11.873C5.13236 11.873 4.71263 12.2928 4.71263 12.8105C4.71263 13.3283 5.13236 13.748 5.65013 13.748V11.873ZM23.5999 13.748C24.1176 13.748 24.5374 13.3283 24.5374 12.8105C24.5374 12.2928 24.1176 11.873 23.5999 11.873V13.748ZM22.5435 20.4668C22.5435 19.949 22.1237 19.5293 21.606 19.5293C21.0882 19.5293 20.6685 19.949 20.6685 20.4668H22.5435ZM21.606 22.108L22.5417 22.1663C22.5429 22.1469 22.5435 22.1275 22.5435 22.108H21.606ZM24.598 22.108H23.6605C23.6605 22.1275 23.6611 22.1469 23.6624 22.1663L24.598 22.108ZM25.5355 20.1743C25.5355 19.6565 25.1159 19.2368 24.598 19.2368C24.0802 19.2368 23.6605 19.6565 23.6605 20.1743H25.5355ZM7.31251 15.9368C6.79473 15.9368 6.37501 16.3565 6.37501 16.8743C6.37501 17.392 6.79473 17.8118 7.31251 17.8118V15.9368ZM8.53126 17.8118C9.04902 17.8118 9.46876 17.392 9.46876 16.8743C9.46876 16.3565 9.04902 15.9368 8.53126 15.9368V17.8118ZM20.7187 15.9368C20.201 15.9368 19.7812 16.3565 19.7812 16.8743C19.7812 17.392 20.201 17.8118 20.7187 17.8118V15.9368ZM21.9375 17.8118C22.4552 17.8118 22.875 17.392 22.875 16.8743C22.875 16.3565 22.4552 15.9368 21.9375 15.9368V17.8118ZM6.70772 20.468V22.1093H8.58272V20.468H6.70772ZM6.70818 22.1385C6.72013 22.5211 6.43213 22.8013 6.11583 22.8124L6.18136 24.6863C7.57395 24.6375 8.62507 23.4503 8.58227 22.08L6.70818 22.1385ZM6.1821 22.8124C5.86577 22.8011 5.57796 22.5206 5.59021 22.138L3.71617 22.078C3.67227 23.4483 4.72252 24.6364 6.1151 24.6861L6.1821 22.8124ZM5.5907 22.108V20.1743H3.7157V22.108H5.5907ZM5.65013 13.748H23.5999V11.873H5.65013V13.748ZM20.6685 20.4668V22.108H22.5435V20.4668H20.6685ZM20.6704 22.0498C20.6139 22.9576 21.053 23.834 21.8301 24.3171L22.82 22.7246C22.6421 22.6141 22.527 22.4016 22.5417 22.1663L20.6704 22.0498ZM21.8301 24.3171C22.6107 24.8023 23.5932 24.8023 24.3739 24.3171L23.3841 22.7246C23.2096 22.8331 22.9945 22.8331 22.82 22.7246L21.8301 24.3171ZM24.3739 24.3171C25.1511 23.834 25.5902 22.9576 25.5337 22.0498L23.6624 22.1663C23.677 22.4016 23.562 22.6141 23.3841 22.7246L24.3739 24.3171ZM25.5355 22.108V20.1743H23.6605V22.108H25.5355ZM7.31251 17.8118H8.53126V15.9368H7.31251V17.8118ZM20.7187 17.8118H21.9375V15.9368H20.7187V17.8118Z" fill="white" />
          </svg>
          <h2 className='text-[20px] font-bold'>
            WIM Data 
          </h2>
        </div>
        <div>
          <h2 className='text-[20px] font-bold'>
            {data ? data.yesterdayDate : 'N/A'}
          </h2>
        </div>
      </div>

      <div className='mt-4 px-2 gap-4 h-[150px] grid grid-cols-1 md:grid-cols-3'>
        
        {/* WIM TOTAL CARD */}
        <div className='bg-main rounded-xl overflow-hidden '>
          <div className='relative bg-darkblue rounded-lg mx-4 mt-4 mb-2 p-4 text-white overflow-hidden'>
            <div className='relative z-10'>
              <h2 className='text-lg font-bold mb-1'> Total</h2> 
            </div>
          </div>
          <div className='p-4 text-white text-center'>
            <p className='text-3xl font-bold'>
              {totalWIM} 
            </p>
          </div>
        </div>

        {/* WIM VIOLATION CARD */}
        <div className='bg-redbg rounded-xl overflow-hidden'>
          <div className='relative bg-darkred rounded-lg mx-4 mt-4 mb-2 p-4 text-white overflow-hidden'>
            <div className='relative z-10'>
              <h2 className='text-lg font-bold mb-1'>Violation </h2> 
            </div>
          </div>
          <div className='p-4 text-white text-center'>
            <p className='text-3xl font-bold'>
              {totalViolation} 
            </p>
          </div>
        </div>

        {/* WIM PASS CARD */}
        <div className='bg-pass rounded-xl overflow-hidden'>
          <div className='relative bg-darkgray rounded-lg mx-4 mt-4 mb-2 p-4 text-white overflow-hidden'>
            <div className='relative z-10'>
              <h2 className='text-lg font-bold mb-1'>Pass </h2> 
            </div>
          </div>
          <div className='p-4 text-white text-center'>
            <p className='text-3xl font-bold'>{totalPass}</p>
          </div>
        </div>
      </div>
    </div>
  )
}