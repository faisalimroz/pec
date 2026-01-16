// import React, { useState, useEffect } from 'react'
// import AdminPanelLayout from '..'
// import { Button } from '@/components/ui/button'
// import { Alert, AlertDescription } from '@/components/ui/alert'

// interface TcData {
//   _id: string
//   name: string
//   email: string
//   startTimeDate?: string
//   endTimeDate?: string
//   createdAt: string
//   updatedAt: string
// }

// interface ApiResponse {
//   message: string
//   data: TcData
// }

// export default function TollCollectorLog() {
//   const [isStarted, setIsStarted] = useState<boolean>(false)
//   const [loading, setLoading] = useState<boolean>(false)
//   const [initialLoading, setInitialLoading] = useState<boolean>(true)
//   const [error, setError] = useState<string | null>(null)
//   const [lastAction, setLastAction] = useState<string | null>(null)

//   useEffect(() => {
//     fetchCurrentStatus()
//   }, [])

//   const fetchCurrentStatus = async () => {
//     setInitialLoading(true)
//     setError(null)
//     try {
//       const response = await fetch(
//         `${import.meta.env.VITE_BASE_URL}/api/v1/auth/tc/get/by/email`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//           },
//         }
//       )
//       if (!response.ok) {
//         throw new Error('Failed to fetch current status')
//       }
//       const data: ApiResponse = await response.json()
//       setIsStarted(!!data.data.startTimeDate && !data.data.endTimeDate)
//       setLastAction(data.data.startTimeDate ? 'started' : 'ended')
//     } catch (err) {
//       setError('Failed to fetch current status')
//     } finally {
//       setInitialLoading(false)
//     }
//   }

//   const handleButtonClick = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const url = isStarted
//         ? `${import.meta.env.VITE_BASE_URL}/api/v1/auth/tc/update`
//         : `${import.meta.env.VITE_BASE_URL}/api/v1/auth/tc/create`
//       const method = isStarted ? 'PUT' : 'POST'

//       const response = await fetch(url, {
//         method,
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json',
//         },
//       })

//       if (!response.ok) {
//         throw new Error('Failed to update time')
//       }

//       setIsStarted(!isStarted)
//       setLastAction(isStarted ? 'ended' : 'started')
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'An unknown error occurred')
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (initialLoading) {
//     return (
//       <AdminPanelLayout>
//         <div className='p-4 max-w-3xl mx-auto flex justify-center items-center h-[50vh]'>
//           <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900'></div>
//         </div>
//       </AdminPanelLayout>
//     )
//   }

//   return (
//     <AdminPanelLayout>
//       <div className='p-4 max-w-3xl mx-auto'>
//         <h1 className='text-5xl font-bold mb-4 text-center'>
//           Toll Collector Log
//         </h1>
//         <div className='flex flex-col items-center'>
//           <div
//             key={isStarted ? 'started' : 'not-started'}
//             className='text-lg mb-4 text-center animate-in fade-in slide-in-from-bottom-5 duration-300'
//           >
//             {isStarted
//               ? 'Your shift is ongoing. Click "End Time" when you\'re done.'
//               : 'Ready to start your shift? Click "Start Time" to begin.'}
//           </div>
//           <Button
//             onClick={handleButtonClick}
//             disabled={loading}
//             className={`my-4 text-2xl p-5 text-white transition-colors duration-300 ease-in-out ${
//               isStarted
//                 ? 'bg-red-500 hover:bg-red-600'
//                 : 'bg-green-500 hover:bg-green-600'
//             }`}
//           >
//             {loading ? 'Processing...' : isStarted ? 'End Time' : 'Start Time'}
//           </Button>
//           {lastAction && (
//             <p className='text-sm text-gray-600 mt-2 animate-in fade-in slide-in-from-bottom-3 duration-300'>
//               Last action: Shift {lastAction} successfully
//             </p>
//           )}
//         </div>
//         {error && (
//           <Alert
//             variant='destructive'
//             className='mt-4 animate-in fade-in slide-in-from-top-5 duration-300'
//           >
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}
//       </div>
//     </AdminPanelLayout>
//   )
// }
