import { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { ColumnGroup } from 'primereact/columngroup'
import { Row } from 'primereact/row'
import { searchAccidentZone } from '@/api/roadTrafficAPIs'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { Menu } from 'primereact/menu'
import axios from 'axios'
import { toast } from 'sonner'
import { Dialog } from 'primereact/dialog'
import RefreshButton from '@/components/refresh-button'
import { Toolbar } from 'primereact/toolbar'
import { useAuth } from '@/provider/authProvider'

interface VehicleType {
  title: string
  _id: string
}

interface Product {
  _id: string
  time: string
  date: string
  location: string
  locationChainage: string
  wayTo: string
  shift: string
  zone: string
  injured: number
  death: number
  lane: number
  vehicleType: VehicleType[]
}

export default function AccidentZoneTable() {
  let emptyProduct: Product = {
    _id: '',
    time: '',
    date: '',
    location: '',
    locationChainage: '',
    wayTo: '',
    shift: '',
    zone: '',
    injured: 0,
    death: 0,
    lane: 0,
    vehicleType: [],
  }

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>([])
  const [date, setDate] = useState(null)
  const [date2, setDate2] = useState(null)
  const [zone, setZone] = useState(null)
  const [direction, setDirection] = useState(null)
  const [searchKey, setSearchKey] = useState('')
  const [product, setProduct] = useState<any>(emptyProduct)
  const [products, setProducts] = useState<any>([])

  const [totalAccident, setTotalAccident] = useState(0)
  const [totalDeath, setTotalDeath] = useState(0)
  const [totalInjured, setTotalInjured] = useState(0)
  const [deleteProductDialog, setDeleteProductDialog] = useState<boolean>(false)
  const [loading2, setLoading2] = useState<boolean>(false)

  const { permissions } = useAuth()
  const checkRole = permissions.find((p) => p.name === 'r&t-manager')
  const checkPermission = checkRole?.children.find(
    (c) => c.name === 'patrol-security'
  )

  const isRnT = checkPermission?.edit_authority || false

  const directions = [
    { name: 'To Dhaka', value: 'To Dhaka' },
    { name: 'To Mawa', value: 'To Mawa' },
    { name: 'To Pacchor', value: 'To Pacchor' },
    { name: 'To Bhanga', value: 'To Bhanga' },
  ]

  const actionBodyTemplate = (rowData: Product) => {
    const menuRef = useRef<Menu>(null)
    const items = [
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => confirmDeleteProduct(rowData),
      },
    ]

    return (
      <div className='flex justify-content-center'>
        <Menu model={items} popup ref={menuRef} />
        <Button
          icon='pi pi-ellipsis-v'
          onClick={(e) => menuRef.current?.toggle(e)}
          aria-controls='popup_menu'
          aria-haspopup
          className='p-button-rounded p-button-text'
        />
      </div>
    )
  }

  const confirmDeleteProduct = (product: Product) => {
    setProduct(product)
    setDeleteProductDialog(true)
  }

  const deleteProduct = async () => {
    let _products = products.filter(
      (val: { _id: any }) => val._id !== product._id
    )

    try {
      setLoading2(true)
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/road-traffic/roadsafety/accident/delete/${product._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      refetch()
      toast.success('Data Deleted Successfully')
    } catch (error: any) {
      if (error.response) {
        const { message } = error.response.data
        toast.error(message)
      } else {
        console.log(error)
      }
    } finally {
      setLoading2(false)
    }

    setProducts(_products)
    setDeleteProductDialog(false)
    setProduct(emptyProduct)
  }

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false)
  }

  const deleteProductDialogFooter = (
    <div className='flex justify-end gap-2'>
      <button
        type='button'
        className='text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 font-semibold py-2 px-4 rounded border'
        onClick={hideDeleteProductDialog}
      >
        No
      </button>
      <button
        type='button'
        className='bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded'
        onClick={deleteProduct}
      >
        Yes
      </button>
    </div>
  )

  const codes = [
    { name: 'CH:00+000 TO CH:01+500', value: 'CH:00+000 TO CH:01+500' },
    { name: 'CH:01+501 TO CH:03+000', value: 'CH:01+501 TO CH:03+000' },
    { name: 'CH:03+001 TO CH:04+500', value: 'CH:03+001 TO CH:04+500' },
    { name: 'CH:04+501 TO CH:06+000', value: 'CH:04+501 TO CH:06+000' },
    { name: 'CH:06+001 TO CH:07+500', value: 'CH:06+001 TO CH:07+500' },
    { name: 'CH:07+501 TO CH:09+000', value: 'CH:07+501 TO CH:09+000' },
    { name: 'CH:09+001 TO CH:10+500', value: 'CH:09+001 TO CH:10+500' },
    { name: 'CH:10+501 TO CH:12+000', value: 'CH:10+501 TO CH:12+000' },
    { name: 'CH:12+001 TO CH:13+500', value: 'CH:12+001 TO CH:13+500' },
    { name: 'CH:13+501 TO CH:15+000', value: 'CH:13+501 TO CH:15+000' },
    { name: 'CH:15+001 TO CH:16+500', value: 'CH:15+001 TO CH:16+500' },
    { name: 'CH:16+501 TO CH:18+000', value: 'CH:16+501 TO CH:18+000' },
    { name: 'CH:18+001 TO CH:19+500', value: 'CH:18+001 TO CH:19+500' },
    { name: 'CH:19+501 TO CH:21+000', value: 'CH:19+501 TO CH:21+000' },
    { name: 'CH:21+001 TO CH:22+500', value: 'CH:21+001 TO CH:22+500' },
    { name: 'CH:22+501 TO CH:24+000', value: 'CH:22+501 TO CH:24+000' },
    { name: 'CH:24+001 TO CH:25+500', value: 'CH:24+001 TO CH:25+500' },
    { name: 'CH:25+501 TO CH:27+000', value: 'CH:25+501 TO CH:27+000' },
    { name: 'CH:25+501 TO CH:27+000', value: 'CH:25+501 TO CH:27+000' },
    { name: 'CH:27+001 TO CH:28+500', value: 'CH:27+001 TO CH:28+500' },
    { name: 'CH:28+501 TO CH:30+000', value: 'CH:28+501 TO CH:30+000' },
    { name: 'CH:30+001 TO CH:31+960', value: 'CH:30+001 TO CH:31+960' },
    { name: 'CH:51+500 TO CH:53+000', value: 'CH:51+500 TO CH:53+000' },
    { name: 'CH:53+001 TO CH:54+500', value: 'CH:53+001 TO CH:54+500' },
    { name: 'CH:54+501 TO CH:56+000', value: 'CH:54+501 TO CH:56+000' },
    { name: 'CH:56+001 TO CH:57+500', value: 'CH:56+001 TO CH:57+500' },
    { name: 'CH:57+501 TO CH:59+000', value: 'CH:57+501 TO CH:59+000' },
    { name: 'CH:59+001 TO CH:60+500', value: 'CH:59+001 TO CH:60+500' },
    { name: 'CH:60+501 TO CH:62+000', value: 'CH:60+501 TO CH:62+000' },
    { name: 'CH:62+001 TO CH:63+500', value: 'CH:62+001 TO CH:63+500' },
    { name: 'CH:63+501 TO CH:65+000', value: 'CH:63+501 TO CH:65+000' },
    { name: 'CH:65+001 TO CH:66+500', value: 'CH:65+001 TO CH:66+500' },
    { name: 'CH:66+501 TO CH:68+000', value: 'CH:66+501 TO CH:68+000' },
    { name: 'CH:68+001 TO CH:69+500', value: 'CH:68+001 TO CH:69+500' },
    { name: 'CH:69+501 TO CH:72+000', value: 'CH:69+501 TO CH:72+000' },
  ]

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
      zone: zone || '',
      direction: direction || '',
      searchQuery: searchKey,
    }

    searchAccidentZone(initialPayload).then((result) => {
      setData(result?.accidentData)

      setTotalAccident(result?.totalAccidents)
      setTotalDeath(result?.totalDeath)
      setTotalInjured(result?.totalInjured)
      setLoading(false)
    })
  }

  const handleReset = () => {
    setLoading(true)

    const initialPayload = {
      month: '',
      year: '',
      searchQuery: '',
      zone: '',
      direction: '',
    }

    setDate(null)
    setDate2(null)
    setSearchKey('')
    setZone(null)
    setDirection(null)
    setSearchKey('')

    searchAccidentZone(initialPayload).then((result) => {
      setData(result?.accidentData)

      setTotalAccident(result?.totalAccidents)
      setTotalDeath(result?.totalDeath)
      setTotalInjured(result?.totalInjured)
      setLoading(false)
    })
  }

  // console.log('dtaaaaaaaaaaaaaaaaaaaaaa===============>>', totalAccident)

  const filterSearchForm = (
    <div className='flex flex-col space-y-5 items-center justify-center'>
      <div
        role='search'
        onSubmit={(e) => {
          e.preventDefault()
          handleSearch()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            handleSearch()
          }
        }}
        className='flex mx-auto w-fit gap-2 divide-x-2 border p-2 rounded-md bg-white'
      >
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
            value={zone}
            onChange={(e) => setZone(e.value)}
            options={codes}
            optionLabel='name'
            placeholder='Select Zone'
            className='border-none rounded-none ml-4 cursor-pointer ring-0'
          />
        </div>

        <div>
          <Dropdown
            value={direction}
            onChange={(e) => setDirection(e.value)}
            options={directions}
            optionLabel='name'
            placeholder='Select Direction'
            className='border-none rounded-none ml-4 cursor-pointer ring-0'
          />
        </div>

        <IconField iconPosition='left' className='relative'>
          <InputIcon className='pi pi-search' />
          <InputText
            type='search'
            placeholder='Search'
            className='border-none ml-2 focus:ring-0'
            onChange={(e) => setSearchKey(e.target.value)}
            value={searchKey}
          />

          <button
            onClick={() => handleSearch()}
            className='absolute top-0.5 right-1 border bg-green-500 px-4 py-2.5 rounded-lg'
            type='submit'
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
        </IconField>
      </div>
      <div className='flex w-fit gap-2 divide-x-2 border p-4 rounded-md bg-blue-50 text-gray-600'>
        <h1>Total Accident: {totalAccident}</h1>
        <h1 className='pl-2'>Total Injured: {totalInjured}</h1>
        <h1 className='pl-2'>Total Death: {totalDeath}</h1>
      </div>
    </div>
  )

  const refetch = () => {
    setLoading(true)
    const initialPayload = {
      month: '',
      year: '',
      searchQuery: '',
    }

    searchAccidentZone(initialPayload).then((result) => {
      setData(result?.accidentData)
      setTotalAccident(result?.totalAccidents)
      setTotalDeath(result?.totalDeath)
      setTotalInjured(result?.totalInjured)
      setLoading(false)
    })
  }

  // initial data load
  useEffect(() => {
    refetch()
  }, [])

  const rightToolbarTemplate = () => {
    return (
      <div className='space-x-2'>
        <RefreshButton className='text-base' onClick={handleReset} />
      </div>
    )
  }

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header='Zone' rowSpan={2} headerClassName='min-w-[10rem]' />
        <Column
          header='Accident Number Total per Zone'
          rowSpan={2}
          headerClassName='min-w-[8rem]'
        />
        <Column
          header='Location (Chainage)'
          rowSpan={2}
          headerClassName='min-w-[8rem]'
        />
        <Column header='Direction' rowSpan={2} headerClassName='min-w-[8rem]' />
        <Column header='Date' rowSpan={2} headerClassName='min-w-[8rem]' />
        <Column
          header='Time (24 Hours)'
          rowSpan={2}
          headerClassName='min-w-[12rem]'
        />
        <Column header='Vehicles Types' colSpan={6} className='bg-green-50' />
        <Column header='Casualties' colSpan={2} className='bg-red-50' />
        <Column header='' colSpan={2} className='bg-red-50' />
      </Row>
      <Row>
        <Column header='Bus' className='bg-green-50' />
        <Column header='Truck' className='bg-green-50' />
        <Column header='Covered Van' className='bg-green-50' />
        <Column header='Sedan' className='bg-green-50' />
        <Column header='Motorbike' className='bg-green-50' />
        <Column
          header='Others (Three wheeler/ Unidentified vehicle)'
          className='bg-green-50'
          style={{ width: '150px' }}
        />
        <Column header='Death' className='bg-red-50' />
        <Column header='Injured' className='bg-red-50' />
        {isRnT && <Column header='Actions' className='bg-red-50' />}
      </Row>
    </ColumnGroup>
  )

  return (
    <div>
      <Toolbar
        className='rounded-none border-none p-0 bg-white'
        // left={leftToolbarTemplate}
        right={rightToolbarTemplate}
      ></Toolbar>
      <DataTable
        value={data}
        headerColumnGroup={headerGroup}
        showGridlines
        rowGroupMode='rowspan'
        // @ts-ignore
        groupRowsBy={['zone', 'accidentNumber']}
        stripedRows={false}
        loading={loading}
        // rows={5}
        scrollable
        scrollHeight='600px'
        header={filterSearchForm}
      >
        <Column field='zone' className='font-medium' />
        <Column field='accidentNumber' className='text-center font-medium' />
        <Column field='locationChainage' className='text-center' />
        <Column field='direction' className='text-center' />
        <Column field='date' className='text-center' />
        <Column field='time' className='text-center' />
        <Column field='bus' className='text-center bg-green-50' />
        <Column field='truck' className='text-center bg-green-50' />
        <Column field='covered_van' className='text-center bg-green-50' />
        <Column field='sadan' className='text-center bg-green-50' />
        <Column field='motorbike' className='text-center bg-green-50' />
        <Column field='others' className='text-center bg-green-50' />
        <Column field='death' className='text-center bg-red-50' />
        <Column field='injured' className='text-center bg-red-50' />
        {isRnT && (
          <Column
            body={actionBodyTemplate}
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            header='Actions'
            headerStyle={{ width: '3rem' }}
            exportable={false}
          ></Column>
        )}
      </DataTable>

      <Dialog
        visible={deleteProductDialog}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Confirm'
        modal
        footer={deleteProductDialogFooter}
        onHide={hideDeleteProductDialog}
      >
        <div className='flex flex-col mx-auto text-center space-y-2'>
          <i
            className='pi pi-exclamation-triangle mr-3 text-red-600'
            style={{ fontSize: '2rem' }}
          />
          {product && (
            <span className='text-red-500'>
              Are you sure you want to delete <b>{product.filename}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  )
}
