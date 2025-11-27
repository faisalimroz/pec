import { useEffect, useState } from 'react'
import axios from 'axios'
import { CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Mail, FileX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/provider/authProvider'
import WaterLevelCards from '../ui/waterCard'

// 1. UPDATED: Interface for the single data object returned within the API's 'data' array
interface WaterLevelApiData {
  _id: string;
  date: string; // e.g., '27-11-2025'
  description: string;
  eightAM: string; 
  twelvePM: string; 
  twoPM: string; 
  sixPM: string; 
  maximumWaterLevel: string; // The value for the large button
  location: string;
  [key: string]: any; 
}

// 2. UPDATED: Interface for the full API response structure
interface ApiResponse {
    success: boolean;
    message: string;
    data: WaterLevelApiData[]; // The core data array
    todayDate: string; // The date string
}

// 3. Keep the original, simple Letter interface (since the component structure relies on it)
interface Letter {
  from: string
  name: string
}

const SkeletonItem = () => (
  <div className='flex items-center gap-3 py-2.5'>
    <Skeleton className='h-4 w-4' />
    <Skeleton className='h-4 w-full' />
  </div>
)

const NoLettersFound = () => (
  <div className='flex flex-col items-center justify-center py-8 text-muted-foreground'>
    <FileX className='h-12 w-12 mb-4' />
    <p className='text-sm text-center'>No EDMS Letters Found</p>
  </div>
)

// 4. FIX: Define getFormattedDate here (before use)
const getFormattedDate = (): string => {
    const date = new Date();
    return date.toLocaleDateString('en-GB', { 
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).replace(/\//g, '-'); 
};


export function EDMSLettersList() {
  // 5. MODIFIED: Retain 'letters' state (to preserve original structure) but use a new state for water data
  const [letters, setLetters] = useState<Letter[]>([])
  const [dailyDataArray, setDailyDataArray] = useState<WaterLevelApiData[]>([])
  const [loading, setLoading] = useState(true)

  const { permissions } = useAuth()
  const edmsPermission = permissions.find((p) => p.name === 'edms')
  const dispatchedPermission = edmsPermission?.children.find(
    (c) => c.name === 'dispatched'
  )

  const othersPermission = edmsPermission?.children.find(
    (c) => c.name === 'others'
  )

  const recievedPermission = edmsPermission?.children.find(
    (c) => c.name === 'received'
  )

  const DispatchHasEditAccess = dispatchedPermission?.view_authority || false
  const OthersHasEditAccess = othersPermission?.view_authority || false
  const RecievedHasEditAccess = recievedPermission?.view_authority || false

  const hasEditAccess =
    DispatchHasEditAccess || OthersHasEditAccess || RecievedHasEditAccess

  const LetterItem = ({ from, name }: Letter) => {
    const maxChars = 50
    const ellipsisName =
      name.length > maxChars ? `${name.slice(0, maxChars)}...` : name

    const getRoute = (from: string) => {
      const fromLower = from.toLowerCase()
      if (fromLower.includes('dispatched')) {
        return '/edms/dispatched'
      } else if (fromLower.includes('received')) {
        return '/edms/received'
      } else {
        return '/edms/others'
      }
    }

    return (
      <>
        {hasEditAccess ? (
          <Link
            to={getRoute(from)}
            className='block hover:bg-accent rounded-md transition-colors'
          >
            <div className='flex items-center gap-3 py-3 px-2 border-b'>
              <Mail className='h-4 w-4 shrink-0 font-medium text-gray-900' />
              <p className='leading-tight text-foreground truncate font-medium text-gray-900'>
                {from} &rarr; {ellipsisName}
              </p>
            </div>
          </Link>
        ) : (
          <div className='flex items-center gap-3 py-3 px-2 border-b'>
            <Mail className='h-4 w-4 shrink-0 font-medium text-gray-900' />
            <p className='text-sm leading-tight text-foreground truncate font-medium text-gray-900'>
              {from} &rarr; {ellipsisName}
            </p>
          </div>
        )}
      </>
    )
  }

  // 6. Data extraction for rendering
  const todayWaterLevelData: WaterLevelApiData | null = dailyDataArray.length > 0 ? dailyDataArray[0] : null;

  const maxWaterLevel = todayWaterLevelData?.maximumWaterLevel || 'N/A';
  
  // Display current date if data is missing, otherwise display the date from the fetched record
  const displayDate = todayWaterLevelData?.date || getFormattedDate(); 

  const buttonText = loading 
    ? 'Loading...' 
    : (maxWaterLevel !== 'N/A' ? `${maxWaterLevel} PWD` : 'N/A PWD');


  const fetchData = async () => {
    try {
      setLoading(true)
      // 🚨 Fetching the water level data
      const response = await axios.get<ApiResponse>(
       `${import.meta.env.VITE_BASE_URL}/api/v1/rtw/daily-water-level-report/data/today-water-level`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      
      // Store the water data for use in the card component
      setDailyDataArray(response.data.data) 
      
      // Retain original 'letters' logic if needed, otherwise it's safe to skip this line:
      // setLetters(response.data) 
      
      console.log(response.data.data,'water level')

    } catch (error) {
      console.error('Error fetching water level:', error)
      setDailyDataArray([])
      setLetters([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])


  return (
    <div className='w-full bg-white rounded-xl overflow-hidden border shadow-md h-auto md:h-[300px] xl:h-[400px] '>
      <div className='bg-[#0a1747] px-4 py-3 text-white flex items-center gap-2 '>
        <div className='flex justify-between items-center w-full'>
          <div className='flex gap-3'>
            <div className='mt-1'>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g clip-path="url(#clip0_2054_51433)">
                  <path d="M9.98958 18.3131C14.592 18.3131 18.3229 14.5822 18.3229 9.97982C18.3229 5.37744 14.592 1.64648 9.98958 1.64648C5.38721 1.64648 1.65625 5.37744 1.65625 9.97982C1.65625 14.5822 5.38721 18.3131 9.98958 18.3131Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M9.98828 6.64648V9.97982" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M9.98828 13.3125H9.99828" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </g>
                <defs>
                  <clipPath id="clip0_2054_51433">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <span className='text-base font-bold'>Daily Water Level Records</span>
          </div>
          <div className='flex gap-2 '>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M16 2V6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M8 2V6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M3 10H21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <h1 className='text-basae font-bold'>{displayDate}</h1>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
              <path d="M9.28516 18.5566L15.2852 12.5566L9.28516 6.55664" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </div>



      </div>
      <div className='bg-main flex flex-col justify-center items-center h-[40%]'>
        <div className='flex flex-items-center  gap-2 '>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="23" viewBox="0 0 22 23" fill="none">
            <g clip-path="url(#clip0_2054_51452)">
              <path d="M3.51898 15.847C3.66198 15.9278 3.81741 15.9651 3.97284 15.9651C4.29925 15.9651 4.61633 15.791 4.78731 15.4864L6.82346 11.8368L9.13629 12.4088C9.55596 12.5114 9.99117 12.3156 10.1901 11.9301L11.6543 9.08257L14.4272 9.42452C14.5854 9.44378 14.7459 9.42217 14.8934 9.36176C15.0409 9.30136 15.1704 9.20416 15.2696 9.07946L18.3348 5.23096L18.4715 5.86823C18.5648 6.30655 18.9534 6.60498 19.3824 6.60498C19.4477 6.60498 19.5129 6.59876 19.5782 6.58322C19.6979 6.55761 19.8113 6.50866 19.9121 6.43915C20.0128 6.36965 20.0988 6.28096 20.1652 6.17817C20.2316 6.07538 20.2771 5.96049 20.2991 5.8401C20.321 5.71971 20.319 5.59616 20.2932 5.47654L19.743 2.91192L19.7336 2.88394C19.7243 2.84042 19.7088 2.8 19.6932 2.75959C19.687 2.74405 19.6808 2.7254 19.6715 2.70985C19.6653 2.70053 19.6621 2.68809 19.659 2.67877C19.6435 2.64768 19.6248 2.6197 19.6062 2.59173C19.6 2.58551 19.5969 2.57618 19.5938 2.56997C19.5627 2.52334 19.5254 2.48292 19.4881 2.44562C19.4787 2.4394 19.4725 2.43319 19.4632 2.42386C19.4321 2.39277 19.3948 2.3679 19.3606 2.34303C19.3499 2.33469 19.3385 2.3274 19.3264 2.32127C19.2849 2.2948 19.2412 2.27192 19.1959 2.25288C19.1896 2.24978 19.1865 2.24667 19.1803 2.24667C19.1306 2.22802 19.0808 2.21247 19.0311 2.20315L18.9751 2.19382C18.9378 2.1876 18.9005 2.18449 18.8601 2.18449H18.7824L16.2333 2.33371C15.7204 2.3648 15.3256 2.80622 15.3567 3.31915C15.3878 3.83207 15.8292 4.21754 16.3421 4.19578L16.8022 4.16781L14.135 7.5127L11.2346 7.15521C10.846 7.10858 10.4699 7.30753 10.2896 7.6557L8.86584 10.4255L6.57788 9.85973C6.37933 9.81007 6.16995 9.82733 5.98221 9.90883C5.79448 9.99033 5.63889 10.1315 5.5396 10.3105L3.15527 14.5849C2.90658 15.0294 3.06823 15.5983 3.51898 15.847ZM1.86518 19.0831V1.50681C1.86518 0.990776 1.44863 0.574219 0.932592 0.574219C0.416558 0.574219 0 0.990776 0 1.50681V20.0157C0 20.5317 0.416558 20.9482 0.932592 20.9482H9.56839C9.59142 20.6097 9.68357 20.2795 9.83916 19.9779C9.99474 19.6764 10.2105 19.4099 10.473 19.195C10.4326 19.1608 10.3953 19.1204 10.3549 19.0831H1.86518ZM17.3493 12.4741L16.9172 12.129C16.3092 11.6384 15.5598 11.3558 14.7792 11.3227C13.9986 11.2897 13.2279 11.5081 12.5807 11.9456L11.5268 12.6544C11.4251 12.7225 11.3378 12.81 11.27 12.9119C11.2021 13.0138 11.155 13.128 11.1313 13.2481C11.1076 13.3683 11.1078 13.4918 11.132 13.6119C11.1561 13.7319 11.2037 13.846 11.2719 13.9476C11.41 14.1524 11.6235 14.2942 11.8659 14.342C12.1083 14.3898 12.3597 14.3396 12.5651 14.2025L13.619 13.4937C13.9368 13.2789 14.3152 13.1717 14.6985 13.1879C15.0818 13.2042 15.4498 13.3429 15.7484 13.5839L16.1805 13.9289C16.8426 14.4605 17.6602 14.731 18.4778 14.731C19.2052 14.731 19.9326 14.5165 20.5543 14.0875L21.6144 13.3569C22.0371 13.0647 22.146 12.4834 21.8537 12.0606C21.7134 11.8572 21.4981 11.7178 21.2551 11.6729C21.0121 11.6281 20.7612 11.6814 20.5574 11.8213L19.4974 12.5518C18.8446 12.9995 17.9617 12.9684 17.3493 12.4741ZM20.5574 15.6667L19.4974 16.3972C19.178 16.6154 18.7971 16.7255 18.4106 16.7115C18.024 16.6976 17.6521 16.5602 17.3493 16.3195L16.9172 15.9744C16.3092 15.4838 15.5598 15.2011 14.7792 15.1681C13.9986 15.1351 13.2279 15.3534 12.5807 15.791L11.5268 16.4998C11.4251 16.5679 11.3378 16.6554 11.27 16.7573C11.2021 16.8592 11.155 16.9734 11.1313 17.0935C11.1076 17.2136 11.1078 17.3372 11.132 17.4573C11.1561 17.5773 11.2037 17.6914 11.2719 17.793C11.34 17.8947 11.4275 17.982 11.5294 18.0499C11.6313 18.1177 11.7456 18.1649 11.8657 18.1885C11.9858 18.2122 12.1094 18.212 12.2294 18.1878C12.3494 18.1637 12.4635 18.1161 12.5651 18.0479L13.619 17.3391C13.9368 17.1243 14.3152 17.0171 14.6985 17.0333C15.0818 17.0495 15.4498 17.1883 15.7484 17.4293L16.1805 17.7743C16.8426 18.3059 17.6602 18.5764 18.4778 18.5764C19.2052 18.5764 19.9326 18.365 20.5543 17.9329L21.6144 17.2023C22.0371 16.9101 22.146 16.3288 21.8537 15.906C21.7129 15.7032 21.4977 15.5643 21.2549 15.5194C21.0121 15.4746 20.7614 15.5275 20.5574 15.6667ZM20.5574 19.5152L19.4974 20.2457C19.178 20.4639 18.7971 20.574 18.4106 20.56C18.024 20.546 17.6521 20.4087 17.3493 20.168L16.9172 19.8229C16.3092 19.3323 15.5598 19.0496 14.7792 19.0166C13.9986 18.9836 13.2279 19.2019 12.5807 19.6395L11.5268 20.3483C11.4251 20.4164 11.3378 20.5039 11.27 20.6058C11.2021 20.7077 11.155 20.8219 11.1313 20.942C11.1076 21.0621 11.1078 21.1857 11.132 21.3057C11.1561 21.4258 11.2037 21.5399 11.2719 21.6415C11.41 21.8463 11.6235 21.9881 11.8659 22.0359C12.1083 22.0837 12.3597 22.0335 12.5651 21.8964L13.619 21.1876C13.9368 20.9728 14.3152 20.8656 14.6985 20.8818C15.0818 20.898 15.4498 21.0368 15.7484 21.2778L16.1805 21.6228C16.8426 22.1544 17.6602 22.4248 18.4778 22.4248C19.2052 22.4248 19.9326 22.2135 20.5543 21.7814L21.6144 21.0508C22.0371 20.7586 22.146 20.1773 21.8537 19.7545C21.7845 19.6535 21.696 19.5672 21.5933 19.5004C21.4906 19.4337 21.3757 19.3879 21.2553 19.3657C21.1349 19.3434 21.0112 19.3452 20.8915 19.3708C20.7717 19.3965 20.6582 19.4455 20.5574 19.5152Z" fill="white" />
            </g>
            <defs>
              <clipPath id="clip0_2054_51452">
                <rect width="22" height="22" fill="white" transform="translate(0 0.5)" />
              </clipPath>
            </defs>
          </svg>
          <h1 className='text-[20px] font-bold text-white' >Maximum Water Level</h1>
        </div>
        <div>
          <button className='bg-lightviolet py-3 px-7 text-white rounded-lg'>
            {buttonText}
          </button>
        </div>

      </div>
      <div className='bg-white h-[45%] '>
        <WaterLevelCards dailyData={todayWaterLevelData} />
      </div>
  
    </div>
  )
}