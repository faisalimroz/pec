import { useEffect, useState } from 'react'
import axios from 'axios'
import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import useIsCollapsed from '@/hooks/use-is-collapsed'
import Sidebar2 from '@/components/sidebar'
import { genInfoLinks } from '@/data/sidelinks'
import { genInfoTopNav, getFilteredNavLinks } from '@/data/topNavLinks'
import { useAuth } from '@/provider/authProvider'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { ColumnGroup } from 'primereact/columngroup'
import { Row } from 'primereact/row'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { toast } from 'sonner'
import { FilePreview } from '@/components/file-preview'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'

export default function AerialPhoto() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()
  const { roles, permissions } = useAuth()
  const checkRole = permissions.find((p) => p.name === 'general-information')
  const checkPermission = checkRole?.children.find(
    (c) => c.name === 'staff-chart'
  )

  const isGeneral = checkPermission?.edit_authority || false

  const userRoles = roles.map((role) => role.title)

  const selectedNav = genInfoTopNav
  const filteredNavLinks = getFilteredNavLinks(selectedNav, userRoles)

  // State for staff data
  const [staffData, setStaffData] = useState<any>([])
  const [editDialog, setEditDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  const [department, setDepartment] = useState('finance_hr')
  const [key_kor_fixed, setKeyKorFixed] = useState(0)
  const [key_kor_current, setKeyKorCurrent] = useState(0)
  const [key_bgd_fixed, setKeyBgdFixed] = useState(0)
  const [key_bgd_current, setKeyBgdCurrent] = useState(0)
  const [nonkey_kec_fixed, setNonKeyKecFixed] = useState(0)
  const [nonkey_kec_current, setNonKeyKecCurrent] = useState(0)
  const [nonkey_contractor_fixed, setNonKeyContractorFixed] = useState(0)
  const [nonkey_contractor_current, setNonKeyContractorCurrent] = useState(0)

  const [logValues, setLogValues] = useState<any>([])

  const locs = [
    { name: 'Financial & HR', value: 'finance_hr' },
    { name: 'Road & Traffic', value: 'road_traffic' },
    { name: 'Toll & ITS', value: 'toll_its' },
  ]

  // Fetching staff data from the API
  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/general/staffchart/get/data_table`
        )
        setStaffData(response.data.data)
      } catch (error) {
        console.error('Error fetching staff data:', error)
      }
    }
    fetchStaffData()
  }, [])

  // Function to fetch default values
  const fetchDefaultValues = async (dept: any) => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/general/staffchart/get/by/${dept}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      if (response.data && response.data.data) {
        const data = response.data.data
        setLogValues(data)
        setKeyKorFixed(data.key_kor_fixed)
        setKeyKorCurrent(data.key_kor_current)
        setKeyBgdFixed(data.key_bgd_fixed)
        setKeyBgdCurrent(data.key_bgd_current)
        setNonKeyKecFixed(data.nonkey_kec_fixed)
        setNonKeyKecCurrent(data.nonkey_kec_current)
        setNonKeyContractorFixed(data.nonkey_contractor_fixed)
        setNonKeyContractorCurrent(data.nonkey_contractor_current)
      }
    } catch (error) {
      console.error('Error fetching default values:', error)
    } finally {
      setLoading(false)
    }
  }

  // Open the dialog and fetch data
  const openDialog = () => {
    setEditDialog(true)
    fetchDefaultValues(department)
  }

  const hideDialog = () => {
    setEditDialog(false)
  }

  const UpdateData = async () => {
    try {
      setLoading(true)
      const data = {
        department,
        key_kor_fixed,
        key_kor_current,
        key_bgd_fixed,
        key_bgd_current,
        nonkey_kec_fixed,
        nonkey_kec_current,
        nonkey_contractor_fixed,
        nonkey_contractor_current,
      }
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/general/staffchart/update/data/${department}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      window.location.reload()
      toast.success('Data Updated Successfully')
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message)
      } else {
        console.log(error)
      }
    } finally {
      setLoading(false)
    }
    setEditDialog(false)
  }

  const productDialogFooter = (
    <>
      <Button
        label='Cancel'
        icon='pi pi-times'
        className='p-button-text'
        onClick={hideDialog}
      />
      <Button
        label='Save'
        icon='pi pi-upload'
        className='p-button-text'
        onClick={UpdateData}
        disabled={!department || loading}
      />
    </>
  )

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          header='SORT'
          rowSpan={2}
          headerClassName='bg-blue-200 text-center font-bold'
        />
        <Column
          header='Total'
          colSpan={2}
          headerClassName='bg-blue-200 text-center font-bold'
        />
        <Column
          header='Financial & HR'
          colSpan={2}
          headerClassName='bg-blue-200 text-center font-bold'
        />
        <Column
          header='Road & Traffic'
          colSpan={2}
          headerClassName='bg-blue-200 text-center font-bold'
        />
        <Column
          header='Toll & ITS'
          colSpan={2}
          headerClassName='bg-blue-200 text-center font-bold'
        />
      </Row>
      <Row>
        <Column header='FIXED' headerClassName='bg-blue-200 text-center' />
        <Column header='CURRENT' headerClassName='bg-blue-200 text-center' />
        <Column header='FIXED' headerClassName='bg-blue-200 text-center' />
        <Column header='CURRENT' headerClassName='bg-blue-200 text-center' />
        <Column header='FIXED' headerClassName='bg-blue-200 text-center' />
        <Column header='CURRENT' headerClassName='bg-blue-200 text-center' />
        <Column header='FIXED' headerClassName='bg-blue-200 text-center' />
        <Column header='CURRENT' headerClassName='bg-blue-200 text-center' />
      </Row>
    </ColumnGroup>
  )

  return (
    <>
      <section className='relative h-full overflow-hidden bg-background'>
        <Sidebar2
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          sideLinks={genInfoLinks}
        />

        <div
          id='content'
          className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-14' : 'md:ml-52'} h-full`}
        >
          <Layout>
            {/* ===== Top Heading ===== */}
            <LayoutHeader>
              <TopNav links={filteredNavLinks} />
              <div className='ml-auto flex items-center space-x-4'>
                <UserNav />
              </div>
            </LayoutHeader>

            {/* ===== Main ===== */}
            <LayoutBody className='space-y-4'>
              <div className='space-y-8 px-4'>
                <h1 className='text-2xl font-bold tracking-tight md:text-3xl mb-4'>
                  Staff Summary
                </h1>

                {isGeneral && (
                  <div className='flex justify-end'>
                    <button
                      className='bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded'
                      onClick={() => openDialog()}
                    >
                      Update Staff Data
                    </button>
                  </div>
                )}

                {/* Staff Summary Table */}
                <DataTable
                  value={staffData}
                  headerColumnGroup={headerGroup}
                  showGridlines
                  responsiveLayout='scroll'
                  rowClassName={(rowData: any) => {
                    if (rowData.category === 'Sum') return 'bg-red-200'
                    if (rowData.category === 'KEY - Sub Total')
                      return 'bg-sky-200'
                    if (rowData.category === 'NON-KEY STAFF - Sub Total')
                      return 'bg-cyan-200'
                    if (rowData.category === 'KEC') return 'bg-gray-100'
                    if (rowData.category === 'Sub-Contractor')
                      return 'bg-gray-100'
                    return ''
                  }}
                >
                  <Column field='category' header='Category' />
                  <Column field='totalFixed' header='Total Fixed' />
                  <Column field='totalCurrent' header='Total Current' />
                  <Column field='financialFixed' header='Financial Fixed' />
                  <Column field='financialCurrent' header='Financial Current' />
                  <Column field='roadFixed' header='Road Fixed' />
                  <Column field='roadCurrent' header='Road Current' />
                  <Column field='tollFixed' header='Toll Fixed' />
                  <Column field='tollCurrent' header='Toll Current' />
                </DataTable>
              </div>
            </LayoutBody>
          </Layout>
        </div>
      </section>

      {/* Update Data  */}
      <Dialog
        visible={editDialog}
        style={{ width: '52rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Update Staff Data'
        modal
        className='p-fluid'
        footer={productDialogFooter}
        onHide={hideDialog}
      >
        <div className='mt-6 border border-gray-200 rounded-lg'>
          <div className='bg-gray-50 px-4 py-2 border-b border-gray-200'>
            <h3 className='text-gray-700 font-semibold'>Document History</h3>
          </div>
          <div className='p-4 space-y-4'>
            <div className='flex justify-between items-start'>
              <div>
                <h4 className='text-sm font-medium text-gray-500'>
                  Created By
                </h4>
                <div className='mt-1'>
                  <p className='text-sm text-gray-900'>
                    {logValues?.creator || 'N/A'}
                  </p>
                  {logValues?.creationTimestamp && (
                    <p className='text-sm text-gray-600'>
                      <span>
                        Date: {logValues?.creationTimestamp.split(' ')[0]}
                      </span>
                      <span className='mx-1'>•</span>
                      <span>
                        Time: {logValues?.creationTimestamp.split(' ')[1]}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h4 className='text-sm font-medium text-gray-500'>
                  Last Modified By
                </h4>
                <div className='mt-1'>
                  <p className='text-sm text-gray-900'>
                    {logValues?.updater || 'N/A'}
                  </p>
                  {logValues?.updatingTimestamp && (
                    <p className='text-sm text-gray-600'>
                      <span>
                        Date: {logValues.updatingTimestamp.split(' ')[0]}
                      </span>
                      <span className='mx-1'>•</span>
                      <span>
                        Time: {logValues?.updatingTimestamp.split(' ')[1]}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Dropdown
            value={department}
            onChange={(e) => {
              setDepartment(e.value)
              fetchDefaultValues(e.value)
            }}
            options={locs}
            optionLabel='name'
            placeholder='Select Location'
            className='my-4'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='text-blue-600 font-bold'>KEY STAFF</p>
          </div>
          <div></div>

          <div>
            <label>KEC (KOR) Fixed</label>
            <InputNumber
              value={key_kor_fixed}
              onValueChange={(e: any) => setKeyKorFixed(e.value)}
            />
          </div>
          <div>
            <label>KEC (KOR) Current</label>
            <InputNumber
              value={key_kor_current}
              onValueChange={(e: any) => setKeyKorCurrent(e.value)}
            />
          </div>

          <div>
            <label>KEC (BGD) Fixed</label>
            <InputNumber
              value={key_bgd_fixed}
              onValueChange={(e: any) => setKeyBgdFixed(e.value)}
            />
          </div>
          <div>
            <label>KEC (BGD) Current</label>
            <InputNumber
              value={key_bgd_current}
              onValueChange={(e: any) => setKeyBgdCurrent(e.value)}
            />
          </div>

          <div>
            <p className='text-blue-600 font-bold'>NON-KEY STAFF</p>
          </div>
          <div></div>

          <div>
            <label>KEC Fixed</label>
            <InputNumber
              value={nonkey_kec_fixed}
              onValueChange={(e: any) => setNonKeyKecFixed(e.value)}
            />
          </div>
          <div>
            <label>KEC Current</label>
            <InputNumber
              value={nonkey_kec_current}
              onValueChange={(e: any) => setNonKeyKecCurrent(e.value)}
            />
          </div>

          <div>
            <label>Sub-Contractor Fixed</label>
            <InputNumber
              value={nonkey_contractor_fixed}
              onValueChange={(e: any) => setNonKeyContractorFixed(e.value)}
            />
          </div>
          <div>
            <label>Sub-Contractor Current</label>
            <InputNumber
              value={nonkey_contractor_current}
              onValueChange={(e: any) => setNonKeyContractorCurrent(e.value)}
            />
          </div>
        </div>
      </Dialog>
    </>
  )
}