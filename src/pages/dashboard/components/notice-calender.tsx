import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Calendar } from 'primereact/calendar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FileText, Info } from 'lucide-react'
import '../styles/style.css'
import { EDMSLettersList } from '@/components/charts/edms-chart'
import { useAuth } from '@/provider/authProvider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronDown } from 'lucide-react'

interface Attachment {
  url: string
  _id: string
}

interface Notice {
  _id: string
  title: string
  description: string
  department: string
  date: string
  name: string
  remarks: string
  attachments: Attachment[]
}

interface ApiResponse {
  Notices: Notice[]
}
const monthOptions = [
  { value: '0', label: 'January' },
  { value: '1', label: 'February' },
  { value: '2', label: 'March' },
  { value: '3', label: 'April' },
  { value: '4', label: 'May' },
  { value: '5', label: 'June' },
  { value: '6', label: 'July' },
  { value: '7', label: 'August' },
  { value: '8', label: 'September' },
  { value: '9', label: 'October' },
  { value: '10', label: 'November' },
  { value: '11', label: 'December' },
];

export default function NoticeCalender(): JSX.Element {
  const [date, setDate] = React.useState<Date | null>(null)
  const [selectedNotice, setSelectedNotice] = React.useState<Notice | null>(
    null
  )
  const { permissions } = useAuth()
  const noticePermission = permissions.find((p) => p.name === 'notice')
  const dispatchedPermission = noticePermission?.children.find(
    (c) => c.name === 'notice'
  )

  const hasEditAccess = dispatchedPermission?.view_authority || false

  const formatDateForApi = (date: Date | null): string => {
    if (!date) return ''
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}-${month}-${year}`
  }

  // Fetch notices based on selected date
  const {
    data: noticesData,
    isLoading,
    refetch,
  } = useQuery<ApiResponse>({
    queryKey: ['notices', formatDateForApi(date)],
    queryFn: async () => {
      // console.log('Fetching notices for date:', formatDateForApi(date))

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/notice/search/data/dashbord`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: date ? formatDateForApi(date) : '',
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      return response.json()
    },
    // Always enabled to fetch initial data
    enabled: true,
  })

  // Get first 6 notices
  const notices = noticesData?.Notices?.slice(0, 6) || []

  // Handle calendar change
  const handleDateChange = (e: { value: Date | null }): void => {
    setDate(e.value)
  }

  // Handle dialog close
  const handleDialogClose = (): void => {
    setSelectedNotice(null)
  }

  const handleReset = (): void => {
    setDate(null)
    refetch()
  }

  // Function to render content based on loading and data state
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className='flex items-center justify-center h-full'>
          <div className='animate-spin h-12 w-12 border-b-2 border-blue-800 rounded-full' />
        </div>
      )
    }

    if (!notices.length) {
      return (
        <div className='flex flex-col items-center justify-center h-full text-gray-500'>
          <p>No Notices Found {date && `For ${formatDateForApi(date)}`}</p>
          {date && (
            <Button variant='outline' className='mt-4' onClick={handleReset}>
              Reset
            </Button>
          )}
        </div>
      )
    }

    return (
      <div className='space-y-3'>
        {notices.map((notice) => (
          <div
            key={notice._id}
            className='flex items-start py-2 cursor-pointer hover:bg-gray-100 border-b'
            onClick={() => setSelectedNotice(notice)}
          >
            <FileText className='min-w-5 h-5 mt-1 mr-3 text-gray-700' />
            <div className=''>
              <span className='font-medium text-gray-900'>{notice.title}</span>
              <span className='font-medium text-gray-900'>
                {' '}
                -- ({notice.date}) -- ({notice.name} / {notice.department})
              </span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className='grid grid-cols-12 gap-2 max-w-full mx-auto bg-none'>

      <div className='col-span-9 flex gap-2 my-0'>
        <div className='w-[50%] '>
          <EDMSLettersList />
        </div>
        <div className='w-[50%]'
        >
          <Card className='flex-1 flex flex-col h-auto md:h-[300px] xl:h-[400px] my-0 overflow-hidden shadow-md'>
            <div className='bg-[#0a1747] text-white px-4 py-3 flex items-center justify-between'>
              <div className='flex items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='19'
                  height='20'
                  viewBox='0 0 19 20'
                  fill='none'
                  className='mr-2'
                >
                  <g clip-path='url(#clip0_177_448)'>
                    <path
                      d='M5.54159 10H13.4583V11.5833H5.54159V10ZM5.54159 14.75H11.0833V13.1667H5.54159V14.75ZM17.4166 6.50558V19.5H1.58325V2.875C1.58325 2.24511 1.83347 1.64102 2.27887 1.19562C2.72427 0.750222 3.32836 0.5 3.95825 0.5L11.411 0.5L17.4166 6.50558ZM11.8749 6.04167H14.7138L11.8749 3.20275V6.04167ZM15.8333 17.9167V7.625H10.2916V2.08333H3.95825C3.74829 2.08333 3.54693 2.16674 3.39846 2.31521C3.24999 2.46367 3.16659 2.66504 3.16659 2.875V17.9167H15.8333Z'
                      fill='white'
                    />
                  </g>
                  <defs>
                    <clipPath id='clip0_177_448'>
                      <rect
                        width='19'
                        height='19'
                        fill='white'
                        transform='translate(0 0.5)'
                      />
                    </clipPath>
                  </defs>
                </svg>
                <span className='font-bold text-[16px]'>Notice Board</span>
              </div>
              {hasEditAccess && (
                <Link to='/admin-panel/notice-board'>
                  <Button
                    variant='secondary'
                    className='bg-white text-black hover:bg-gray-100 h-[31px]'
                  >
                    View More
                  </Button>
                </Link>
              )}
            </div>
            <div className='flex-grow overflow-auto p-4'>{renderContent()}</div>
            {date !== null && (
              <div className='p-2 border-t'>
                <Button variant='outline' size='sm' onClick={handleReset}>
                  Reset Date Filter
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      <div className='col-span-3'>

        <Card className='flex-1 flex flex-col h-auto md:h-[300px] xl:h-[400px] my-0 overflow-hidden shadow-md'>


          <div className='bg-[#0a1747] text-white px-4 py-3 flex items-center justify-between'>
            <div className='flex items-center'>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                <path d="M19.9688 4.46289H5.96875C4.86418 4.46289 3.96875 5.35832 3.96875 6.46289V20.4629C3.96875 21.5675 4.86418 22.4629 5.96875 22.4629H19.9688C21.0733 22.4629 21.9688 21.5675 21.9688 20.4629V6.46289C21.9688 5.35832 21.0733 4.46289 19.9688 4.46289Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M16.9688 2.46289V6.46289" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M8.96875 2.46289V6.46289" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M3.96875 10.4629H21.9688" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span className='font-bold text-[16px] ml-2'>Calendar</span>
            </div>
            {hasEditAccess && (
              <div className="flex items-center gap-2">

                <Select

                  value={String((date ?? new Date()).getMonth())}
                  onValueChange={(m) => {
                    const current = date ?? new Date();
                    const next = new Date(current);
                    next.setMonth(parseInt(m, 10), 1);
                    next.setHours(0, 0, 0, 0);
                    setDate(next);
                  }}
                >
                  <SelectTrigger className="w-[140px] h-[31px] bg-white text-black">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* (Optional) keep the original link if you still want it next to the dropdown */}
                {/* <Link to='/admin-panel/notice-board'>
      <Button
        variant='secondary'
        className='bg-white text-gray-800 hover:bg-gray-100 h-[31px]'
      >
        View More
      </Button>
    </Link> */}
              </div>
            )}

          </div>
          <Calendar
            value={date}
            // @ts-ignore
            onChange={handleDateChange}
            inline
            className='custom-calendar h-[400px]'
          />
        </Card>
      </div>

      <Dialog open={!!selectedNotice} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedNotice?.title}</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <div>
              <h4 className='font-semibold'>Description</h4>
              <p>{selectedNotice?.description}</p>
            </div>
            <div>
              <h4 className='font-semibold'>Details</h4>
              <p>Department: {selectedNotice?.department}</p>
              <p>Date: {selectedNotice?.date}</p>
              <p>Posted By: {selectedNotice?.name}</p>
              <p>Remarks: {selectedNotice?.remarks}</p>
            </div>
            {hasEditAccess && (
              <>
                {selectedNotice?.attachments !== undefined &&
                  selectedNotice?.attachments.length > 0 && (
                    <div>
                      <h4 className='font-semibold'>Attachments</h4>
                      <ul>
                        {selectedNotice?.attachments.map(
                          (attachment: Attachment, index: number) => (
                            <li key={attachment._id}>
                              <a
                                href={attachment.url}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-blue-600 hover:underline'
                              >
                                Attachment {index + 1}
                              </a>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
