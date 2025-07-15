import { useEffect, useState } from 'react'
import axios from 'axios'
import { CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Mail, FileX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/provider/authProvider'

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

export function EDMSLettersList() {
  const [letters, setLetters] = useState<Letter[]>([])
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

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await axios.get<Letter[]>(
        `${import.meta.env.VITE_BASE_URL}/api/v1/edms/dispatched/get/dashboard/data`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      setLetters(response.data)
    } catch (error) {
      console.error('Error fetching letters:', error)
      setLetters([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='w-full rounded-xl overflow-hidden border shadow-md'>
      <div className='bg-[#0a1747] px-4 py-3 text-white flex items-center gap-2'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='19'
          height='20'
          viewBox='0 0 19 20'
          fill='none'
        >
          <g clip-path='url(#clip0_177_622)'>
            <path
              d='M0.633415 18.5896C0.672998 18.6292 0.672998 18.6688 0.712581 18.6688C0.712581 18.6688 0.712581 18.6688 0.752165 18.7084C1.02925 19.025 1.42508 19.2625 1.90008 19.3021H2.05841H14.5667C15.5563 19.3021 16.4272 18.7084 16.6647 17.8771L18.7626 9.72294C18.8813 9.3271 18.8022 8.93127 18.5251 8.6146C18.248 8.21877 17.7334 8.02085 17.1397 8.02085H16.4272V4.02294C16.4272 3.07294 15.6751 2.28127 14.7251 2.28127H8.19383C8.07508 2.28127 7.99592 2.2021 7.99592 2.08335C7.99592 1.33127 7.36258 0.697937 6.6105 0.697937H2.05841C1.02925 0.697937 0.197998 1.52919 0.197998 2.55835V17.4021C0.197998 17.8771 0.356331 18.2729 0.633415 18.5896ZM17.6147 9.36669C17.6147 9.36669 17.6542 9.40627 17.6147 9.44585L15.5167 17.6C15.4376 17.8375 15.0417 18.1146 14.5667 18.1146H2.05841C2.01883 18.1146 2.01883 18.1146 1.97925 18.1146C1.78133 18.1146 1.66258 18.0354 1.623 17.9563C1.623 17.9563 1.623 17.9167 1.623 17.8771L3.44383 10.8313C3.48341 10.6729 3.80008 10.4354 4.19591 10.4354H10.6876C11.4001 10.4354 12.0334 10 12.1917 9.40627C12.2313 9.36669 12.3501 9.24794 12.548 9.24794H15.8334H17.1397C17.3772 9.20835 17.5355 9.28752 17.6147 9.36669ZM2.05841 1.88544H6.65008C6.76883 1.88544 6.848 1.9646 6.848 2.08335C6.848 2.83544 7.48133 3.46877 8.23341 3.46877H14.7647C15.0417 3.46877 15.2792 3.70627 15.2792 4.02294V8.02085H12.6272C11.9147 8.02085 11.2813 8.45627 11.123 9.05002C11.0438 9.12919 10.8855 9.20835 10.6876 9.20835H4.19591C3.2855 9.20835 2.45425 9.76252 2.25633 10.5146L1.3855 13.9584V2.55835C1.3855 2.2021 1.70216 1.88544 2.05841 1.88544Z'
              fill='white'
            />
            <path
              d='M3.44385 5.40833H13.3001V6.59583H3.44385V5.40833Z'
              fill='white'
            />
          </g>
          <defs>
            <clipPath id='clip0_177_622'>
              <rect
                width='19'
                height='19'
                fill='white'
                transform='translate(0 0.5)'
              />
            </clipPath>
          </defs>
        </svg>
        <span className='text-[20px] font-bold'>EDMS</span>
      </div>
      <CardContent className='min-h-[280px] m-0'>
        {loading ? (
          <div className='space-y-1'>
            {[...Array(3)].map((_, index) => (
              <SkeletonItem key={index} />
            ))}
          </div>
        ) : letters.length > 0 ? (
          <div className='space-y-4 mt-3'>
            {letters.slice(0, 3).map((letter, index) => (
              <LetterItem key={index} name={letter.name} from={letter.from} />
            ))}
          </div>
        ) : (
          <NoLettersFound />
        )}
      </CardContent>
    </div>
  )
}
