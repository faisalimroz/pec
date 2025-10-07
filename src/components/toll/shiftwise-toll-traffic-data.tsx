import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { Calendar } from 'primereact/calendar'
import '../../styles/table-style.css'
import { searchKecManual, useKecManual } from '@/api/tollApi'
import { ColumnGroup } from 'primereact/columngroup'
import { Row } from 'primereact/row'
import trailer5axle from '@/assets/ai-assets/vehicle/trailer-5axle.svg'
import trailer4axle from '@/assets/ai-assets/vehicle/trailer-4axle.svg'
import trailer3axle from '@/assets/ai-assets/vehicle/truck-3axle.svg'
import mediumTruck9 from '@/assets/ai-assets/vehicle/medium-truck11.svg'
import mediumTruck8 from '@/assets/ai-assets/vehicle/medium-truck8.svg'
import miniTruck from '@/assets/ai-assets/vehicle/mini-truck.svg'
import bigBus from '@/assets/ai-assets/vehicle/big-bus.svg'
import meduiumBus from '@/assets/ai-assets/vehicle/medium-bus.svg'
import miniBus from '@/assets/ai-assets/vehicle/mini-bus.svg'
import microBus from '@/assets/ai-assets/vehicle/micro-bus.svg'
import pickUp from '@/assets/ai-assets/vehicle/pickup.svg'
import car from '@/assets/ai-assets/vehicle/car.svg'
import bike from '@/assets/ai-assets/vehicle/bike.svg'
import { Dropdown } from 'primereact/dropdown'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { Dialog } from 'primereact/dialog'
import RefreshButton from '@/components/refresh-button'
import { useAuth } from '@/provider/authProvider'
import { Bike } from 'lucide-react'
import TollGroupWithIcons from '../ui/tollbuttons'
import { set } from 'date-fns'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from '@radix-ui/react-icons'
import { InputText } from 'primereact/inputtext'
interface Product {
    lane: number;
    totaltrailer5xl: number;
    totaltrailer4xl: number;
    totaltrailer3xl: number;
    totalmedium_truck9: number;
    totalmedium_truck8: number;
    totalmini_truck: number;
    totalbigbus: number;
    totalmedium_truck: number;
    totalmini_bus: number;
    totalmicro_bus: number;
    totalpickup: number;
    totalcar: number;
    totalbike: number;
    timestamp: string;
    shift: string;
    totalVehicles: number;
    totalAmount: number;
}


export default function VehicleDetectTollTable() {
    const [products, setProducts] = useState<any>([])
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
    const dt = useRef<DataTable<Product[]>>(null)
    const [date, setDate] = useState<string>('')
    const [date2, setDate2] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [totalOverallVehicles, setTotalOverallVehicles] = useState<number>(0)
    const [totalTollCollection, setTotalTollCollection] = useState<number>(0)
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [selectedTraffic, setTraffic] = useState(null)
    const [selectedPeriod, setSelectedPeriod] = useState(null)
    const [allData, setAllData] = useState<any>([])
    const [searchKey, setSearchKey] = useState<string>('')
    const [bulkDialog, setBulkDialog] = useState(false)
    const [file, setFile] = useState<any>(null)
    const [uploading, setUploading] = useState(false)
    const [uploadStatus, setUploadStatus] = useState('')

    const [fDate, setFDate] = useState<string>('')
    const [dataType, setDataType] = useState('')

    const [deleteDialog, setDeleteDialog] = useState(false)
    const [deleteDate, setDeleteDate] = useState('')
    const [loading2, setLoading2] = useState(false)

    const [todaysDate, setTodaysDate] = useState('')

    const { roles, permissions } = useAuth()
    const checkRole = permissions.find((p) => p.name === 'toll-manager')
    const checkPermission = checkRole?.children.find(
        (c) => c.name === 'kec-manual-data'
    )

    const hasEditAccess = checkPermission?.edit_authority || false

    const isToll = roles.some((role) =>
        ['superadmin', 'toll-manager'].includes(role.title)
    )
    const itemTemplate = (option: { label: string; value: string }) => {
        return (
            <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                    <path d="M10.5 2.16406H4.5C4.10218 2.16406 3.72064 2.3221 3.43934 2.6034C3.15804 2.88471 3 3.26624 3 3.66406V15.6641C3 16.0619 3.15804 16.4434 3.43934 16.7247C3.72064 17.006 4.10218 17.1641 4.5 17.1641H13.5C13.8978 17.1641 14.2794 17.006 14.5607 16.7247C14.842 16.4434 15 16.0619 15 15.6641V6.66406L10.5 2.16406Z" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M10.5 2.16406V6.66406H15" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12 10.4141H6" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12 13.4141H6" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M7.5 7.41406H6.75H6" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span>{option.label}</span>
            </div>
        );
    };
    const location = [
        { label: 'All', value: 'All' },
        { label: 'Mawa', value: 'Mawa' },
        { label: 'Jinjira', value: 'Jinjira' },

    ]

    const period = [
        { label: 'Daily', value: 'Daily' },
        { label: 'Weekly', value: 'Weekly' },
        { label: 'Monthly', value: 'Monthly' },
        { label: 'Yearly', value: 'Yearly' },
    ]

    const traffic = [
        { label: 'Toll', value: 'Toll' },
        { label: 'Traffic', value: 'Traffic' },
    ]

    const uploadFile = async () => {
        if (!file) {
            setUploadStatus('Please select a file first.')
            return
        }

        setUploading(true)

        const formData = new FormData()
        formData.append('date', formatDate(fDate))
        formData.append('dataType', dataType)
        formData.append('file', file)

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/toll/kecmanual/bulk_upload`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )

            toast.success('File uploaded successfully!')
            setFile(null)
            refetch()
            hideDialog2()
        } catch (error) {
            console.error('Error uploading file:', error)
            toast.error('An error occurred while uploading. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    //   const handleReset = () => {
    //     const initialPayload = {
    //       year: '',
    //       searchQuery: '',
    //       month: '',
    //     }

    //     setDate('')
    //     setDate2('')
    //    setTraffic(null)
    //    setSelectedPeriod(null)
    //    setSelectedLocation(null)
    //    setSearchKey('')
    //     searchAssetManagement(initialPayload).then((result) => {
    //       setProducts(result?.Assets)
    //       setLoading(false)
    //     })
    //   }
    const hideDialog2 = () => {
        setBulkDialog(false)
        setFile(null)
        setUploadStatus('')
    }

    const hideDialog3 = () => {
        setDeleteDialog(false)
        setDeleteDate('')
    }

    const openNew2 = () => {
        setBulkDialog(true)
    }

    const openNew3 = () => {
        setDeleteDialog(true)
    }

    const productDialogFooter2 = (
        <>
            <Button
                label='Cancel'
                icon='pi pi-times'
                className='p-button-text'
                onClick={hideDialog2}
            />
            <Button
                label='Save'
                icon='pi pi-upload'
                className='p-button-text'
                onClick={uploadFile}
                disabled={!file || uploading}
            />
        </>
    )

    const deleteData = async () => {
        try {
            setLoading2(true)

            const res = await axios.delete(
                `${import.meta.env.VITE_BASE_URL}/api/v1/toll/kecmanual/delete/using/date`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    data: {
                        date: formatDate(deleteDate),
                    },
                }
            )

            window.location.reload()
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
        setDeleteDialog(false)
        setDeleteDate('')
    }

    const productDialogFooter3 = (
        <>
            <Button
                label='Cancel'
                icon='pi pi-times'
                className='p-button-text'
                onClick={hideDialog3}
            />
            <Button
                label='Delete'
                icon='pi pi-trash'
                className='p-button-text'
                onClick={deleteData}
                disabled={!deleteDate || loading2}
            />
        </>
    )

    const handleFileChange = (e: { target: { files: any[] } }) => {
        const selectedFile = e.target.files[0]
        if (selectedFile && selectedFile.name.endsWith('.xlsx')) {
            setFile(selectedFile)
            setUploadStatus('')
        } else {
            setFile(null)
            setUploadStatus('Please select a valid .xlsx file.')
        }
    }

    const exportCSV = () => {
        dt.current?.exportCSV()
    }

    const leftToolbarTemplate = () => {
        return (
            <div className=''>
                <div className='px-2 py-2 bg-main text-sm font-semibold text-white rounded-lg'>
                    Document List
                </div>
            </div>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <>
                {hasEditAccess && (

                    <TollGroupWithIcons
                        selectedProducts={selectedProducts}
                        openNew={openNew2}
                        bulkUpload={openNew2}

                    />
                )}
                {/* <RefreshButton className='text-base ml-2' onClick={handleReset} /> */}
            </>
        )
    }

    function formatDate(dateTime?: any) {
        if (!dateTime) return ''
        const date = new Date(dateTime)

        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()

        return `${day}-${month}-${year}`
    }

    function convertToTimeOnly(dateTime: any) {
        const date = new Date(dateTime)

        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        const seconds = date.getSeconds().toString().padStart(2, '0')

        return `${hours}:${minutes}:${seconds}`
    }

    const handleSearch = () => {
        setLoading(true)
        const initialPayload = {
            date: date ? formatDate(date) : '',
            // @ts-ignore
            lane: selectedLocation || '',
            // @ts-ignore
            shift: selectedTraffic || '',
            // @ts-ignore
            dataType: selectedPeriod || '',
        }

        // console.log(initialPayload)

        searchKecManual(initialPayload).then((result) => {
            setProducts(result?.laneData)
            setTotalOverallVehicles(result?.overallTotals?.totalOverallVehicles)
            setTotalTollCollection(result?.overallTotals?.data?.totalOverallAmount)
            setAllData(result?.overallTotals)
            setTodaysDate(result?.date)
            setLoading(false)
        })
    }

    const handleReset = () => {
        const initialPayload = {
            month: '',
            shift: '',
            lane: '',
            dataType: '',
        }

        setDate('')
        setDate2('')
        setTraffic(null)
        setSelectedLocation(null)
        setSelectedPeriod(null)
        searchKecManual(initialPayload).then((result) => {
            setProducts(result?.laneData)
            setTotalOverallVehicles(result?.overallTotals?.totalOverallVehicles)
            setTotalTollCollection(result?.overallTotals?.totalOverallAmount)
            setAllData(result?.overallTotals)
            setTodaysDate(result?.date)
            setLoading(false)
        })
    }

    const filterSearchForm = (
        <div>
            <div className='flex flex-wrap justify-center '>

                <div className='flex  w-fit gap-2  border p-2 rounded-md bg-white '>
                    <Calendar
                        // @ts-ignore
                        value={date}
                        // @ts-ignore
                        onChange={(e) => setDate(e.value)}

                        dateFormat="dd/mm/yy"
                        inputClassName='border-none rounded-none cursor-pointer focus:ring-0 w-28 '
                        placeholder='Start Date'
                        showIcon
                        icon={() => <i className='pi pi-angle-down' />}
                    />
                    <Calendar
                        // @ts-ignore
                        value={date2}
                        // @ts-ignore
                        onChange={(e) => setDate2(e.value)}

                        dateFormat="dd/mm/yy"
                        inputClassName='border-none rounded-none ml-4 cursor-pointer focus:ring-0 w-28'
                        placeholder='End Date'
                        showIcon
                        icon={() => <i className='pi pi-angle-down' />}
                    />
                    <Dropdown
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.value)}
                        options={location}
                        placeholder='Location'
                        itemTemplate={itemTemplate}
                        className='border-none rounded-none ml-4 cursor-pointer ring-0 '
                    />

                    <Dropdown
                        value={selectedTraffic}
                        onChange={(e) => setTraffic(e.value)}
                        options={traffic}
                        placeholder='Traffic'
                        itemTemplate={itemTemplate}
                        className='border-none rounded-none ml-4 cursor-pointer ring-0'
                    />
                    <Dropdown
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.value)}
                        options={period}
                        itemTemplate={itemTemplate}
                        placeholder='Period'
                        className='border-none rounded-none ml-4 cursor-pointer ring-0'
                    />
                </div>

                <div className='flex  w-fit gap-2  border p-2 rounded-md bg-white '>
                    <IconField iconPosition='left' className='relative '>

                        <InputText
                            type='search'
                            placeholder='Search'
                            className='border-none ml-4 focus:ring-0'
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



            </div>
            <h1 className='text-center pt-10 text-xl font-bold text-[#000000]'>Traffic Report</h1>
        </div>

    )

    const [payload, setPayload] = useState<any>({
        date: '',
        lane: '',
        shift: '',
        dataType: '',
    })

    const { data, isLoading, error, refetch } = useKecManual(payload)

    // initial data load
    useEffect(() => {
        if (data) {
            setProducts(data?.laneData)
            setTotalOverallVehicles(data?.overallTotals?.totalOverallVehicles)
            setTotalTollCollection(data?.overallTotals?.totalOverallAmount)
            setAllData(data?.overallTotals)
            setTodaysDate(data?.date)
        }
    }, [data])

    // initial data load
    // useEffect(() => {
    //   setLoading(true)
    //   const initialPayload = {
    //     date_range: '',
    //     time_range: '',
    //     shift: '',
    //     wayTo: '',
    //     scheduleType: '',
    //   }

    //   searchKecManual(initialPayload).then((result) => {
    //     setProducts(result?.data)
    //     setAllData(result)
    //     setTotalOverallVehicles(result.totalOverallVehicles)
    //     setTotalOverallAmount(result.totalOverallAmount)
    //     setLoading(false)
    //   })
    // }, [])

    // console.log(allData)

    const totalSummary = (

        <div className=' font-bold flex justify-between items-center bg-gray-100 p-4 rounded '>
            <div>
                <span className='font-bold text-lg'>Total Vehicle Passing:</span>{' '}
                {totalOverallVehicles}
            </div>
            <div>
                <span className='font-bold text-lg'>Data Showing For Date:</span> {todaysDate}
            </div>
            <div>
                <span className='font-bold text-lg'>Total Toll Collection</span> {totalTollCollection}
            </div>
        </div>

    )

    const vehicleHeaderTemplate = (image: string, label: string) => (
        <div className='flex flex-col items-center'>
            <img src={image} alt={label} className='mb-2' />
            <span className='text-xs'>{label}</span>
        </div>
    )

    const actionBodyTemplate = (rowData: Product) => {
        return (
            <>
                <div className='flex items-center gap-3'>
                    <Link to={`/toll/vehicle-detect-and-toll/${rowData.lane}`}>
                        <Button
                            icon='pi pi-eye text-blue-500 text-lg'
                            text
                            className='text-sm'
                        />
                    </Link>
                </div>
            </>
        )
    }

    const headerGroup = (
        <ColumnGroup>
            <Row>
                <Column
                    header='Payment Method'
                    headerClassName='min-w-[10rem]'
                    rowSpan={2}
                    frozen
                />
                <Column
                    header={vehicleHeaderTemplate(trailer5axle, 'Trailer (Above 4Axle)')}
                    headerClassName='min-w-[10rem]'
                />
                <Column
                    header={vehicleHeaderTemplate(trailer4axle, 'Trailer (4Axle)')}
                    headerClassName='min-w-[10rem]'
                />
                <Column
                    header={vehicleHeaderTemplate(trailer3axle, 'Trailer (3Axle)')}
                    headerClassName='min-w-[10rem]'
                />
                <Column
                    header={vehicleHeaderTemplate(mediumTruck9, 'Medium Truck (8-11)')}
                    headerClassName='min-w-[10rem]'
                />
                <Column
                    header={vehicleHeaderTemplate(mediumTruck8, 'Medium Truck (5-8)')}
                    headerClassName='min-w-[10rem]'
                />
                <Column
                    header={vehicleHeaderTemplate(miniTruck, 'Mini Truck')}
                    headerClassName='min-w-[10rem]'
                />
                <Column
                    header={vehicleHeaderTemplate(bigBus, 'Big Bus')}
                    headerClassName='min-w-[10rem]'
                />
                <Column
                    header={vehicleHeaderTemplate(meduiumBus, 'Medium Bus')}
                    headerClassName='min-w-[10rem]'
                />
                <Column
                    header={vehicleHeaderTemplate(miniBus, 'Mini Bus')}
                    headerClassName='min-w-[10rem]'
                />
                <Column
                    header={vehicleHeaderTemplate(microBus, 'Micro Bus')}
                    headerClassName='min-w-[10rem]'
                />
                <Column
                    header={vehicleHeaderTemplate(pickUp, 'Pickup')}
                    headerClassName='min-w-[10rem]'
                />
                <Column
                    header={vehicleHeaderTemplate(car, 'Car/Jeep')}
                    headerClassName='min-w-[10rem]'
                />
                <Column
                    header={vehicleHeaderTemplate(bike, 'Motorcycle')}
                    headerClassName='min-w-[10rem]'
                />

                <Column
                    header='Total.'
                    headerClassName='min-w-[10rem]'
                    rowSpan={2}
                    frozen
                />
                {/* <Column header='Shift' headerClassName='min-w-[12rem]' rowSpan={2} /> */}
                {/* <Column
          header='Vehicle Passing'
          headerClassName='min-w-[12rem]'
          rowSpan={2}
        /> */}
                {/* <Column
          header='Toll Collection'
          headerClassName='min-w-[10rem]'
          rowSpan={2}
        />
        <Column header='Action' headerClassName='min-w-[10rem]' rowSpan={2} /> */}
            </Row>
        </ColumnGroup>
    )

    const footerGroup = (
        <ColumnGroup>
            <Row>
                <Column
                    footer='Total'
                    colSpan={1}
                    footerStyle={{ textAlign: 'right' }}
                />
                <Column footer={allData?.totaltrailer5xl} />
                <Column footer={allData?.totaltrailer4xl} />
                <Column footer={allData?.totaltrailer3xl} />
                <Column footer={allData?.totalmedium_truck9} />
                <Column footer={allData?.totalmedium_truck8} />
                <Column footer={allData?.totalmini_truck} />
                <Column footer={allData?.totalbigbus} />
                <Column footer={allData?.totalbigbus} />
                <Column footer={allData?.totalmedium_truck} />
                <Column footer={allData?.totalmini_bus} />
                <Column footer={allData?.totalmicro_bus} />
                <Column footer={allData?.totalpickup} />
                <Column footer={allData?.totalcar} />
                <Column footer={allData?.totalbike} />


                {/* <Column />
        <Column /> */}
            </Row>
        </ColumnGroup>
    )

    return (
        <>
            <div className='ml-4'>
                <div>
                    <Toolbar
                        className='rounded-none border-none p-0 bg-background'
                        left={leftToolbarTemplate}
                        right={rightToolbarTemplate}
                    ></Toolbar>

                    {totalSummary}

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
                        rows={12}
                        header={filterSearchForm}
                        showGridlines
                        emptyMessage='No data found!'
                        loading={isLoading || loading}
                        headerColumnGroup={headerGroup}
                        footerColumnGroup={footerGroup}
                        scrollable
                        scrollHeight='600px'
                    >
                        <Column field='lane' frozen />
                        <Column field='trailer5xl' />
                        <Column field='trailer4xl' />
                        <Column field='trailer3xl' />
                        <Column field='medium_truck9' />
                        <Column field='medium_truck8' />
                        <Column field='mini_truck' />
                        <Column field='big_bus' />
                        <Column field='medium_bus' />
                        <Column field='mini_bus' />
                        <Column field='micro_bus' />
                        <Column field='pickup' />
                        <Column field='car' />
                        <Column field='bike' />
                        <Column field='totalVehicles' />
                        <Column
                            field='totalAmount'
                            body={(rowData) => `${rowData.totalAmount?.toLocaleString()}`}
                        />
                        {/* <Column
            body={actionBodyTemplate}
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            header='Action'
            exportable={false}
          ></Column> */}
                    </DataTable>
                </div>

            </div>

            {/* Bulk Upload Dialog  */}
            <Dialog
                visible={bulkDialog}
                style={{ width: '42rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header='Upload Bulk Data'
                modal
                className='p-fluid'
                footer={productDialogFooter2}
                onHide={hideDialog2}
            >
                <div className='grid grid-cols-2 items-center gap-6'>
                    <div>
                        <label htmlFor='date' className='font-bold'>
                            Date
                        </label>
                        <div className='border rounded-md'>
                            <Calendar
                                id='date'
                                // @ts-ignore
                                onChange={(e) => setFDate(e.value)}
                                dateFormat='dd/mm/yy'
                                placeholder='Select Date'
                            />
                        </div>
                    </div>

                    <div>
                        <Dropdown
                            value={dataType}
                            onChange={(e) => setDataType(e.value)}
                            options={traffic}
                            optionLabel='name'
                            placeholder='Select Type'
                            className='mt-5'
                        />
                    </div>

                    <div className='field col-span-2'>
                        <label htmlFor='bulkUpload' className='font-bold'>
                            Select File (.xlsx Only):
                        </label>
                        <br />
                        <input
                            type='file'
                            id='bulkUpload'
                            accept='.xlsx'
                            // @ts-ignore
                            onChange={handleFileChange}
                            disabled={uploading}
                            className='mt-3'
                        />
                        {/* {file && <p>Selected file: {file?.name}</p>} */}
                        {uploadStatus && (
                            <p
                                className={
                                    uploadStatus.includes('success')
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                }
                            >
                                {uploadStatus}
                            </p>
                        )}
                    </div>
                </div>

            </Dialog>

            {/* Delete Item Dialog  */}
            <Dialog
                visible={deleteDialog}
                style={{ width: '42rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header='Delete By Date'
                modal
                className='p-fluid'
                footer={productDialogFooter3}
                onHide={hideDialog3}
            >
                <div className='w-fit justify-center mx-auto gap-6'>
                    <div>
                        <h1 className='font-bold text-center mb-2 text-xl'>Date</h1>
                        <div className='border rounded-md'>
                            <Calendar
                                id='date'
                                // @ts-ignore
                                onChange={(e) => setDeleteDate(e.value)}
                                dateFormat='dd/mm/yy'
                                placeholder='Select Date'
                            />
                        </div>
                    </div>
                </div>
            </Dialog>
            <div className='px4 py-4 bg-white mt-5'>
                <h1 className='text-center text-sm text-[#000000]'>Note: 3rd-2 Shift(00:00 to 06:00)/1st Shift(06:00 to 14:00)/2nd Shift(14:00 to 22:00)/3rd-1 Shift(22:00 to 00:00)</h1>

            </div>
        </>
    )
}
