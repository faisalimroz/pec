// import React, { useState, useEffect, useRef } from 'react'
// import { DataTable } from 'primereact/datatable'
// import { Column } from 'primereact/column'
// import { Toolbar } from 'primereact/toolbar'
// import '@/styles/table-style.css'
// import AdminPanelLayout from '..'
// import { searchTollCollector } from '@/api/adminAPIs'
// import { Calendar } from 'primereact/calendar'

// interface Product {
//   _id: string
//   amount: number
// }

// export default function TollCollectReport() {
//   const [products, setProducts] = useState<any>([])
//   const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
//   const dt = useRef<DataTable<Product[]>>(null)
//   const [loading, setLoading] = useState<boolean>(false)
//   const [date, setDate] = useState<string>('')

//   const exportCSV = () => {
//     dt.current?.exportCSV()
//   }

//   const leftToolbarTemplate = () => {
//     return (
//       <div className=''>
//         <div className='p-3 bg-main text-lg font-semibold text-white rounded-t'>
//           Document List
//         </div>
//       </div>
//     )
//   }

//   const rightToolbarTemplate = () => {
//     return (
//       <div className='space-x-2'>
//         <button
//           className='bg-gray-600 text-white border-gray-600 border-t border-l border-r font-bold px-4 py-3 rounded-t-md'
//           onClick={exportCSV}
//         >
//           Download Files
//         </button>
//       </div>
//     )
//   }

//   function formatDate(dateTime?: any) {
//     if (!dateTime) return ''
//     const date = new Date(dateTime)

//     const day = date.getDate().toString().padStart(2, '0')
//     const month = (date.getMonth() + 1).toString().padStart(2, '0')
//     const year = date.getFullYear()

//     return `${day}-${month}-${year}`
//   }

//   const handleSearch = () => {
//     setLoading(true)
//     const initialPayload = {
//       date: date ? formatDate(date) : '',
//     }

//     searchTollCollector(initialPayload).then((result) => {
//       setProducts(result?.data)
//       setLoading(false)
//     })
//   }

//   const filterSearchForm = (
//     <div className='flex mx-auto w-fit gap-2 divide-x-2 border p-2 rounded-md bg-white'>
//       <Calendar
//         // @ts-ignore
//         value={date}
//         // @ts-ignore
//         onChange={(e) => setDate(e.value)}
//         inputClassName="text-xs border-0 focus:ring-0 py-1.5 px-3 w-32"
//         placeholder='Select Date'
//         showIcon
//         icon={() => <i className='pi pi-angle-down' />}
//       />

//       <button
//         onClick={() => handleSearch()}
//         className='border bg-green-500 px-4 py-2.5 rounded-lg'
//       >
//         <svg
//           xmlns='http://www.w3.org/2000/svg'
//           viewBox='0 0 24 24'
//           fill='white'
//           className='size-6'
//         >
//           <path
//             fillRule='evenodd'
//             d='M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z'
//             clipRule='evenodd'
//           />
//         </svg>
//       </button>
//     </div>
//   )

//   // initial data load
//   useEffect(() => {
//     setLoading(true)
//     const initialPayload = {
//       date: '',
//     }

//     searchTollCollector(initialPayload).then((result) => {
//       setProducts(result?.data)
//       setLoading(false)
//     })
//   }, [])

//   //   console.log(products)

//   return (
//     <AdminPanelLayout>
//       <div className=''>
//         <div className='m-6'>
//           <Toolbar
//             className='rounded-none border-none p-0 bg-white'
//             // left={leftToolbarTemplate}
//             right={rightToolbarTemplate}
//           ></Toolbar>

//           <DataTable
//             ref={dt}           size="small"           height={45}
//             value={products}
//             selection={selectedProducts}
//             onSelectionChange={(e: {
//               value: React.SetStateAction<Product[]>
//             }) => {
//               if (Array.isArray(e.value)) {
//                 setSelectedProducts(e.value)
//               }
//             }}
//             dataKey='_id'
//             paginator
//             rows={10}
//             rowsPerPageOptions={[5, 10, 25]}
//             paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
//             currentPageReportTemplate='Showing {first} to {last} of {totalRecords} Datas'
//             selectionMode='multiple'
//             showGridlines
//             cellSelection
//             emptyMessage='No data found!'
//             loading={loading}
//             header={filterSearchForm}
//           >
//             {/* <Column
//               selectionMode='multiple'
//               headerStyle={{ width: '3rem' }}
//               exportable={false}
//               headerClassName='bg-[#ffc2c2] text-sm'
// bodyClassName='text-xs truncate max-w-xs'
//             ></Column> */}

//             <Column
//               field='name'
//               header='Name'
//               headerClassName='bg-[#ffc2c2] text-sm'
//               bodyClassName='text-xs truncate max-w-xs'
//               sortable
//             ></Column>

//             <Column
//               field='email'
//               headerClassName='bg-[#ffc2c2] text-sm'
//               bodyClassName='text-xs truncate max-w-xs'
//               sortable
//               header='Email'
//             ></Column>

//             <Column
//               field='startTimeDate'
//               headerClassName='bg-[#ffc2c2] text-sm'
//               bodyClassName='text-xs truncate max-w-xs'
//               sortable
//               header='Start Time & Date'
//             ></Column>

//             <Column
//               field='endTimeDate'
//               headerClassName='bg-[#ffc2c2] text-sm'
//               bodyClassName='text-xs truncate max-w-xs'
//               sortable
//               header='End Time & Date'
//             ></Column>
//           </DataTable>
//         </div>
//       </div>
//     </AdminPanelLayout>
//   )
// }
