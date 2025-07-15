import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { Dialog } from 'primereact/dialog'
import { OverlayPanel } from 'primereact/overlaypanel'
import { Calendar } from 'primereact/calendar'
import '../../styles/table-style.css'
import { searchEtcCard, useEtcCard } from '@/api/tollApi'
import axios from 'axios'
import { ColumnGroup } from 'primereact/columngroup'
import { Row } from 'primereact/row'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import { useNavigate } from 'react-router-dom'
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

export default function EtcCardTable() {
  const op = useRef<null>(null)
  const navigate = useNavigate()

  const { roles, permissions } = useAuth()
  const checkRole = permissions.find((p) => p.name === 'toll-manager')
  const checkPermission = checkRole?.children.find(
    (c) => c.name === 'toll-collect-traffic'
  )

  const hasEditAccess = checkPermission?.edit_authority || false

  const isToll = roles.some((role) =>
    ['superadmin', 'toll-manager'].includes(role.title)
  )

  let emptyProduct: Product = {
    id: null,
    code: '',
    name: '',
    image: null,
    description: '',
    category: null,
    price: 0,
    quantity: 0,
    rating: 0,
    inventoryStatus: 'INSTOCK',
  }

  const codes = [
    { name: 'ETC', code: 'etc' },
    { name: 'CARD', code: 'card' },
  ]

  const [products, setProducts] = useState<any>([])
  const [productDialog, setProductDialog] = useState<boolean>(false)
  const [product, setProduct] = useState<any>(emptyProduct)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [submitted, setSubmitted] = useState<boolean>(false)
  const toast = useRef<Toast>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const dt = useRef<DataTable<Product[]>>(null)
  const [date, setDate] = useState<string>('')
  const [date2, setDate2] = useState<string>('')
  const [loading2, setLoading2] = useState<boolean>(false)
  const [formDate, setFormDate] = useState<string>('')
  const [selectedCode, setSelectedCode] = useState(null)
  const [dataList, setDataList] = useState({
    types: '',
    lane: 0,
    totalpass: 0,
    shift: '',
    location: '',
    paytype: '',
  })

  const handleNumberInputChange = (
    e: { value: number | null },
    field: number
  ) => {
    setDataList((prev) => ({ ...prev, [field]: e.value || 0 }))
  }

  const openNew = () => {
    setProduct(emptyProduct)
    setSubmitted(false)
    setProductDialog(true)
  }

  const hideDialog = () => {
    setSubmitted(false)
    setProductDialog(false)
  }

  function formatDate(dateTime?: any) {
    if (!dateTime) return ''
    const date = new Date(dateTime)

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    return `${day}-${month}-${year}`
  }

  const saveProduct = async () => {
    try {
      setLoading2(true)
      const data = {
        types: dataList.types,
        datetime: formatDate(formDate),
        lane: dataList.lane,
        totalpass: dataList.totalpass,
        shift: dataList.shift,
        location: dataList.location,
        paytype: dataList.paytype,
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/toll/collection/etc/card/upload`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const response = res
      console.log(response)
      window.location.reload()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading2(false)
    }
  }

  const exportCSV = () => {
    dt.current?.exportCSV()
  }

  const leftToolbarTemplate = () => {
    return (
      <div className=''>
        <div className='p-3 bg-main text-lg font-semibold text-white rounded-t'>
          Document List
        </div>
      </div>
    )
  }

  const rightToolbarTemplate = () => {
    return (
      <>
        {hasEditAccess && (
          <div className='space-x-2'>
            <button
              className='bg-white text-gray-800 border-gray-600 border-t border-l border-r px-4 py-3 rounded-t-md font-bold'
              onClick={openNew}
            >
              Upload Document
            </button>
            <button
              className='bg-gray-600 text-white border-gray-600 border-t border-l border-r font-bold px-4 py-3 rounded-t-md'
              onClick={exportCSV}
            >
              Download Files
            </button>
            <button
              className='bg-blue-500 text-white border-blue-300 border-t border-l border-r font-bold px-4 py-3 rounded-t-md'
              onClick={() => navigate('/toll/etc/update-delete')}
            >
              Delete Lists
            </button>
          </div>
        )}
        <RefreshButton className='text-base ml-2' onClick={handleReset} />
      </>
    )
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
      // @ts-ignore
      paytype: selectedCode?.code || '',
    }

    searchEtcCard(initialPayload).then((result) => {
      setProducts(result)
      setLoading(false)
    })
  }

  const handleReset = () => {
    const initialPayload = {
      month: '',
      year: '',
      paytype: '',
    }

    setDate('')
    setDate2('')
    setSelectedCode(null)

    searchEtcCard(initialPayload).then((result) => {
      setProducts(result)
      setLoading(false)
    })
  }

  const filterSearchForm = (
    <div className='flex mx-auto w-fit gap-2 divide-x-2 border p-2 rounded-md bg-white'>
      <Calendar
        // @ts-ignore
        value={date}
        // @ts-ignore
        onChange={(e) => setDate(e.value)}
        view='month'
        dateFormat='MM'
        inputClassName='border-none rounded-none cursor-pointer focus:ring-0'
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
        inputClassName='border-none rounded-none ml-4 cursor-pointer focus:ring-0'
        placeholder='By Year'
        showIcon
        icon={() => <i className='pi pi-angle-down' />}
      />

      <div>
        <Dropdown
          value={selectedCode}
          onChange={(e) => setSelectedCode(e.value)}
          options={codes}
          optionLabel='name'
          placeholder='Select Type'
          className='border-none rounded-none ml-4 cursor-pointer ring-0'
        />
      </div>

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
  )

  const productDialogFooter = (
    <>
      <Button label='Cancel' icon='pi pi-times' outlined onClick={hideDialog} />
      <Button
        label='Save'
        loading={loading2}
        icon='pi pi-check'
        onClick={saveProduct}
      />
    </>
  )

  const [payload, setPayload] = useState<any>({
    month: '',
    year: '',
    searchQuery: '',
    payType: '',
  })

  const { data, isLoading, error, refetch } = useEtcCard(payload)

  // initial data load
  useEffect(() => {
    if (data) {
      setProducts(data)
    }
  }, [data])

  // initial data load
  // useEffect(() => {
  //   setLoading(true)
  //   const initialPayload = {
  //     month: '',
  //     year: '',
  //     searchQuery: '',
  //     payType: '',
  //   }

  //   searchEtcCard(initialPayload).then((result) => {
  //     setProducts(result)
  //     setLoading(false)
  //   })
  // }, [])

  // console.log(products)

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header='Date' frozen rowSpan={3} />
      </Row>
      <Row>
        <Column
          header='Traffic'
          headerClassName='bg-[#ffc2c2] text-sm'
          bodyClassName='text-sm truncate max-w-xs'
          colSpan={6}
        />
        <Column header='Toll' headerClassName='bg-blue-400' colSpan={6} />
        <Column header='Totals' colSpan={3} />
      </Row>
      <Row>
        <Column
          headerClassName='bg-[#ffc2c2] text-sm'
          bodyClassName='text-sm truncate max-w-xs'
          header='Dhaleshwari'
        ></Column>

        <Column
          headerClassName='bg-[#ffc2c2] text-sm'
          bodyClassName='text-sm truncate max-w-xs'
          header='Bhanga'
        ></Column>

        <Column
          field='trafficAbdullahpur'
          headerClassName='bg-[#ffc2c2] text-sm'
          bodyClassName='text-sm truncate max-w-xs'
          header='Abdullahpur'
        ></Column>

        <Column
          headerClassName='bg-[#ffc2c2] text-sm'
          bodyClassName='text-sm truncate max-w-xs'
          header='Sreenagar'
        ></Column>

        <Column
          headerClassName='bg-[#ffc2c2] text-sm'
          bodyClassName='text-sm truncate max-w-xs'
          header='Pulia'
        ></Column>

        <Column
          field='trafficmaligram'
          headerClassName='bg-[#ffc2c2] text-sm'
          bodyClassName='text-sm truncate max-w-xs'
          header='Maligram'
        ></Column>

        {/* Toll  */}

        <Column headerClassName='bg-blue-400' header='Dhaleshwari'></Column>

        <Column headerClassName='bg-blue-400' header='Bhanga'></Column>

        <Column headerClassName='bg-blue-400' header='Abdullahpur'></Column>

        <Column headerClassName='bg-blue-400' header='Sreenagar'></Column>

        <Column headerClassName='bg-blue-400' header='Pulia'></Column>

        <Column headerClassName='bg-blue-400' header='Maligram'></Column>

        <Column
          headerClassName='bg-[#ffc2c2] min-w-[8rem]'
          header='Total Traffic'
        ></Column>

        <Column
          headerClassName='bg-blue-400 min-w-[8rem]'
          header='Total Toll'
        ></Column>

        {/* <Column
          rowSpan={3}
          header='Actions'
          headerClassName='bg-[#ffc2c2] text-sm'
          bodyClassName='text-sm truncate max-w-xs'
        ></Column> */}
      </Row>
    </ColumnGroup>
  )

  return (
    <div className='ml-4'>
      <Toast ref={toast} />
      <div className='card'>
        <Toolbar
          className='rounded-none border-none p-0 bg-white'
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>

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
          header={filterSearchForm}
          selectionMode='multiple'
          showGridlines
          cellSelection
          emptyMessage='No Data Found!'
          loading={isLoading || loading}
          headerColumnGroup={headerGroup}
          scrollable
          scrollHeight='660px'
        >
          {/* Traffic  */}
          <Column
            field='date'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            className='min-w-[8rem]'
            frozen
          ></Column>

          <Column
            field='dhaleshwari_traffic'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          <Column
            field='bhanga_traffic'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          <Column
            field='abdullahpur_traffic'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          <Column
            field='sreenagar_traffic'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          <Column
            field='pulia_traffic'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          <Column
            field='maligram_traffic'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          {/* Toll  */}

          <Column
            field='dhaleshwari_toll'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          <Column
            field='bhanga_toll'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          <Column
            field='abdullahpur_toll'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          <Column
            field='sreenagar_toll'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          <Column
            field='pulia_toll'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          <Column
            field='maligram_toll'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          <Column
            field='total_toll'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          <Column
            field='total_traffic'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
          ></Column>

          {/* <Column body={actionBodyTemplate} exportable={false}></Column> */}
        </DataTable>
      </div>

      {/* upload data dialog  */}
      <Dialog
        visible={productDialog}
        style={{ width: '52rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Upload Document'
        modal
        className='p-fluid'
        footer={productDialogFooter}
        onHide={hideDialog}
      >
        <>
          <div className='grid grid-cols-2 items-center gap-6'>
            <div className='field'>
              <label htmlFor='types' className='font-bold'>
                Vehicle Type
              </label>
              <Dropdown
                id='types'
                value={dataList.types}
                options={[
                  'bus',
                  'heavy_truck',
                  'medium_truck',
                  'micro_bus',
                  'mini_bus',
                  'motor_cycle',
                  'four_wheeler',
                  'private_car',
                  'small_truck',
                  'trailer',
                ]}
                onChange={(e) =>
                  setDataList((prev) => ({ ...prev, types: e.value }))
                }
                placeholder='Select Vehicle type'
              />
            </div>

            <div className='field'>
              <label htmlFor='lane' className='font-bold'>
                Lane
              </label>
              <Dropdown
                id='lane'
                value={dataList.lane}
                options={[1, 2, 3, 4, 5, 6]}
                onChange={(e) =>
                  setDataList((prev) => ({ ...prev, lane: e.value }))
                }
                placeholder='Select Lane'
              />
            </div>

            <div className='field'>
              <label htmlFor='totalpass'>Total Pass</label>
              <InputNumber
                id='totalpass'
                value={dataList.totalpass}
                //@ts-ignore
                onValueChange={(e) => handleNumberInputChange(e, 'totalpass')}
              />
            </div>

            <div className='field'>
              <label htmlFor='shift' className='font-bold'>
                Shift
              </label>
              <Dropdown
                id='shift'
                value={dataList.shift}
                options={['12 AM - 08 AM', '08 AM - 04 PM', '04 PM - 12 AM']}
                onChange={(e) =>
                  setDataList((prev) => ({ ...prev, shift: e.value }))
                }
                placeholder='Select Shift'
              />
            </div>

            <div className='field'>
              <label htmlFor='location' className='font-bold'>
                Location
              </label>
              <Dropdown
                id='location'
                value={dataList.location}
                options={[
                  'dhaleshwari',
                  'bhanga',
                  'abdullahpur',
                  'sreenagar',
                  'pulia',
                  'maligram',
                ]}
                onChange={(e) =>
                  setDataList((prev) => ({ ...prev, location: e.value }))
                }
                placeholder='Select Location'
              />
            </div>

            <div className='field'>
              <label htmlFor='paytype' className='font-bold'>
                Payment Type
              </label>
              <Dropdown
                id='paytype'
                value={dataList.paytype}
                options={['etc', 'card']}
                onChange={(e) =>
                  setDataList((prev) => ({ ...prev, paytype: e.value }))
                }
                placeholder='Select Payment Type'
              />
            </div>

            <div>
              <label htmlFor='date' className='font-bold'>
                Date
              </label>
              <div className='border rounded-md'>
                <Calendar
                  id='date'
                  // @ts-ignore
                  onChange={(e) => setFormDate(e.value)}
                  dateFormat='dd/mm/yy'
                  inputClassName='border-0 focus:ring-0 cursor-pointer'
                  className='focus:ring-0'
                  placeholder='Select Date'
                />
              </div>
            </div>
          </div>
        </>
      </Dialog>
    </div>
  )
}
