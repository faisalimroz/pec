import { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import '@/styles/table-style.css'
import axios from 'axios'

export default function StatusPersonnelTable() {
  const [products, setProducts] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)

  const fetchStatusOfPersonnel = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/admin/hr/employee-personal/greetings/personnel/status`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      setProducts(response?.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // initial data load
  useEffect(() => {
    fetchStatusOfPersonnel()
  }, [])

  // console.log(products)

  return (
    <div className='ml-4'>
      <div className='card'>
        <DataTable
          value={products}
          dataKey='_id'
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
          currentPageReportTemplate='Showing {first} to {last} of {totalRecords} Datas'
          showGridlines
          emptyMessage='No data found!'
          loading={loading}
        >
          <Column
            field='currentPersonnel'
            header='Current Personnel'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column>

          <Column
            field='Dhaleshwari'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Dhaleshwari'
          ></Column>

          <Column
            field='Bhanga'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
            header='Bhanga'
          ></Column>

          <Column
            field='Sreenagar'
            header='Sreenagar'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column>

          <Column
            field='Dhaka'
            header='Dhaka Zone'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column>

          <Column
            field='Gulshan'
            header='Gulshan Office'
            headerClassName='bg-[#ffc2c2] text-sm'
            bodyClassName='text-sm truncate max-w-xs'
            sortable
          ></Column>

          <Column
            field='overallPersonnel'
            header='Overall Personnel'
            headerClassName='bg-[#A8ECB5] text-sm'
            sortable
          ></Column>
        </DataTable>
      </div>
    </div>
  )
}
