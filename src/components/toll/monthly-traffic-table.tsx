import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { OverlayPanel } from 'primereact/overlaypanel'
import { Calendar } from 'primereact/calendar'
import '../../styles/table-style.css'
import {
  searchMonthlyTrafficReport,
  useMonthlyTrafficReport,
} from '@/api/tollApi'
import { ColumnGroup } from 'primereact/columngroup'
import { Row } from 'primereact/row'
import RefreshButton from '@/components/refresh-button'
import { useAuth } from '@/provider/authProvider'

interface Product {
  id: string | null
  code: string
  name: string
  description: string
  image: string | null
  price: number
  category: string | null
  quantity: number
  inventoryStatus: string
  rating: number
}

export default function MonthlyTrafficTable() {
  const op = useRef<null>(null)

  const { roles, permissions } = useAuth()
  const checkRole = permissions.find((p) => p.name === 'toll-manager')
  const checkPermission = checkRole?.children.find(
    (c) => c.name === 'toll-collect-traffic'
  )

  const hasEditAccess = checkPermission?.edit_authority || false

  const isToll = roles.some((role) =>
    ['superadmin', 'toll-manager'].includes(role.title)
  )
  const [products, setProducts] = useState<any>([])
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const dt = useRef<DataTable<Product[]>>(null)
  const [date, setDate] = useState<string>('')
  const [date2, setDate2] = useState<string>('')
  const [searchKey, setSearchKey] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedCode, setSelectedCode] = useState(null)
  const [allData, setAllData] = useState<any>([])

  const codes = [
    { name: 'Dhaleshwari', code: 'dhaleshwari' },
    { name: 'Bhanga', code: 'bhanga' },
    { name: 'Abdullahpur', code: 'abdullahpur' },
    { name: 'Sreenagar', code: 'sreenagar' },
    { name: 'Pulia', code: 'pulia' },
    { name: 'Maligram', code: 'maligram ' },
  ]

  const exportCSV = () => {
    dt.current?.exportCSV()
  }

  const actionBodyTemplate = (rowData: Product) => {
    return (
      <>
        <Button
          icon='pi pi-ellipsis-v'
          outlined
          className='border-none'
          // @ts-ignore
          onClick={(e) => op.current?.toggle(e)}
        />
        <OverlayPanel ref={op}>
          <div className='flex flex-col space-y-2'>
            <a href=''>Edit</a>
            <a href=''>Delete</a>
            <a href=''>Download Attachment</a>
          </div>
        </OverlayPanel>
        {/* <Button
          icon='pi pi-pencil'
          rounded
          outlined
          className='mr-2'
          onClick={() => editProduct(rowData)}
        /> */}
        {/* <Button
          icon='pi pi-trash'
          rounded
          outlined
          severity='danger'
          onClick={() => confirmDeleteProduct(rowData)}
        /> */}
      </>
    )
  }

  function getMonthName(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', { month: 'long' })
  }

  function getYear(dateString: string) {
    const date = new Date(dateString)
    return date.getFullYear()
  }

  const handleSearch = () => {
    setLoading(true)
    const initialPayload = {
      month: date ? getMonthName(date) : '',
      year: date2 ? getYear(date2) : '',
      searchQuery: searchKey,
    }

    searchMonthlyTrafficReport(initialPayload).then((result) => {
      setProducts(result?.data)
      setAllData(result)

      setLoading(false)
    })
  }

  const handleReset = () => {
    const initialPayload = {
      month: '',
      year: '',
      searchQuery: '',
    }

    setDate('')
    setDate2('')

    searchMonthlyTrafficReport(initialPayload).then((result) => {
      setProducts(result?.data)
      setAllData(result)

      setLoading(false)
    })
  }

  const filterSearchForm = (
    <>
      <div className='flex justify-between gap-6'>
        <div className='flex flex-col space-y-5 items-center justify-center'>
          <div className='flex w-fit gap-2 divide-x-2 border p-1 rounded-md bg-white'>
            <Calendar
              // @ts-ignore
              value={date}
              // @ts-ignore
              onChange={(e) => setDate(e.value)}
              view='month'
              dateFormat='MM'
              inputClassName='border-none rounded-none cursor-pointer focus:ring-0 ring-0'
              placeholder='By Month'
              showIcon
              icon={() => <i className='pi pi-angle-down' />}
            />
            <Calendar
              // @ts-ignore
              value={date2}
              // @ts-ignore
              onChange={(e) => setDate2(e.value)}
              view='year'
              dateFormat='yy'
              inputClassName='border-none rounded-none ml-4 cursor-pointer focus:ring-0 ring-0'
              placeholder='By Year'
              showIcon
              icon={() => <i className='pi pi-angle-down' />}
            />
            {/* <div>
            <Dropdown
              value={selectedCode}
              onChange={(e) => setSelectedCode(e.value)}
              options={codes}
              optionLabel='name'
              placeholder='Select Location'
              className='border-none rounded-none ml-4 cursor-pointer ring-0'
            />
          </div> */}
            <button
              onClick={() => handleSearch()}
              className='border bg-green-500 px-4 py-2.5 rounded-lg'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='white'
                className='size-6'
              >
                <path
                  fillRule='evenodd'
                  d='M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          {/* <button className='w-[100px] h-[55px] font-semibold border text-white bg-gray-500 rounded '>
          Upload
        </button> */}
          {hasEditAccess && (
            <button
              onClick={exportCSV}
              className='bg-gray-600 text-white border-gray-600 border-t border-l border-r font-bold px-4 py-3 rounded-t-md'
            >
              Download Files
            </button>
          )}
          <RefreshButton className='text-base ml-2' onClick={handleReset} />
        </div>
      </div>
      <p className='text-2xl mt-4 font-bold text-center'>
        Data Showing For : (
        {date ? getMonthName(date) : getMonthName(new Date().toISOString())},
        {date2 ? getYear(date2) : getYear(new Date().toISOString())})
      </p>
    </>
  )

  const [payload, setPayload] = useState<any>({
    month: '',
    year: '',
    searchQuery: '',
  })

  const { data, isLoading, error, refetch } = useMonthlyTrafficReport(payload)

  // initial data load
  useEffect(() => {
    if (data) {
      setProducts(data?.data)
      setAllData(data)
    }
  }, [data])

  // initial data load
  // useEffect(() => {
  //   setLoading(true)
  //   const initialPayload = {
  //     month: '',
  //     year: '',
  //     searchQuery: '',
  //   }

  //   searchMonthlyTrafficReport(initialPayload).then((result) => {
  //     setProducts(result?.data)
  //     setAllData(result)
  //     setLoading(false)
  //   })
  // }, [])

  // console.log(products)

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          header='Vehicle Class'
          headerClassName='bg-[#ffc2c2] min-w-[12rem]'
          rowSpan={3}
        />
        <Column
          header='Vehicle Type'
          headerClassName='bg-[#ffc2c2] min-w-[12rem]'
          rowSpan={3}
        />
        <Column
          header='Total'
          headerClassName='bg-[#ffc2c2] min-w-[8rem]'
          rowSpan={3}
        />
        <Column
          header='Average'
          headerClassName='bg-[#ffc2c2] min-w-[8rem]'
          rowSpan={3}
        />
        <Column
          header='%'
          headerClassName='bg-[#ffc2c2] min-w-[8rem]'
          rowSpan={3}
        />
      </Row>
      <Row>
        <Column
          header='Data By Days'
          headerClassName='bg-[#ffc2c2] text-sm'
          bodyClassName='text-sm truncate max-w-xs'
          colSpan={32}
        />
      </Row>
      <Row>
        {Array.from({ length: 31 }).map((_, i) => (
          <Column
            headerClassName='bg-[#ffc2c2] min-w-[8rem]'
            header={`${i + 1}`}
            key={i}
          ></Column>
        ))}
        {/* <Column
          header='Actions'
          headerClassName='bg-[#ffc2c2] text-sm'
          bodyClassName='text-sm truncate max-w-xs'
          colSpan={1}
        /> */}
      </Row>
    </ColumnGroup>
  )

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          footer='Total Vehicle'
          colSpan={2}
          footerStyle={{ textAlign: 'right' }}
        />
        <Column footer={allData?.overallTotalpass} />
        <Column footer={allData?.overallTotalAverage} />
        <Column footer={allData?.overallPercentages} />
        {Array.from({ length: 31 }).map((_, i) => (
          <Column footer={allData?.[`date${i + 1}Total`]} key={i} />
        ))}
        <Column />
      </Row>
    </ColumnGroup>
  )

  const vehicleBodyTemplate = (rowData: any) => {
    const types = rowData?.types
      ?.split('_')
      .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    return <div>{types}</div>
  }

  console.log(allData)

  return (
    <div className='rounded-md'>
      <div>
        <DataTable
          ref={dt}
          value={products}
          selection={selectedProducts}
          onSelectionChange={(e: {
            value: React.SetStateAction<Product[]>
          }) => {
            if (Array.isArray(e.value)) {
              setSelectedProducts(e.value)
            }
          }}
          dataKey='_id'
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
          currentPageReportTemplate='Showing {first} to {last} of {totalRecords} Datas'
          selectionMode='multiple'
          showGridlines
          cellSelection
          emptyMessage='No data found!'
          loading={isLoading || loading}
          header={filterSearchForm}
          headerColumnGroup={headerGroup}
          footerColumnGroup={footerGroup}
          scrollable
          scrollHeight='700px'
        >
          <Column
            field='vehicleId'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            className='min-w-[8rem]'
            frozen
          ></Column>

          <Column
            frozen
            body={vehicleBodyTemplate}
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            className='min-w-[8rem]'
          ></Column>

          <Column
            field='totalpass'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            className='min-w-[8rem]'
          ></Column>

          <Column
            field='average'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            className='min-w-[8rem]'
          ></Column>

          <Column
            field='percentage'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            className='min-w-[8rem]'
          ></Column>

          {Array.from({ length: 31 }).map((_, i) => (
            <Column
              key={i}
              field={`date-${i + 1}`}
              headerClassName='bg-[#ffc2c2] text-sm'
              bodyClassName='text-sm truncate max-w-xs'
            ></Column>
          ))}
          {/* <Column body={actionBodyTemplate} exportable={false}></Column> */}
        </DataTable>
      </div>
    </div>
  )
}
