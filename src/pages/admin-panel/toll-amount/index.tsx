import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { Dialog } from 'primereact/dialog'
import '@/styles/table-style.css'
import axios from 'axios'
import { Menu } from 'primereact/menu'
import { toast } from 'sonner'
import { FilePreview } from '@/components/file-preview'
import AdminPanelLayout from '..'
import { InputNumber } from 'primereact/inputnumber'

interface Product {
  _id: string
  amount: number
}

export default function TollAmount() {
  const [products, setProducts] = useState<any>([])
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const dt = useRef<DataTable<Product[]>>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [loading2, setLoading2] = useState<boolean>(false)

  const [updateProductDialog, setUpdateProductDialog] = useState<boolean>(false)
  const [updatedProduct, setUpdatedProduct] = useState<any | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/auth/vehicleamount/vehicle-amount`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      setProducts(res.data.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  // all update dialog func here
  const openUpdateDialog = (product: Product) => {
    setUpdatedProduct({ ...product })
    setUpdateProductDialog(true)
  }

  const hideUpdateDialog = () => {
    setUpdateProductDialog(false)
    setUpdatedProduct(null)
  }

  const handleUpdateProduct = async () => {
    if (!updatedProduct) return

    try {
      setLoading2(true)

      const data = {
        amount: updatedProduct.amount,
      }

      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/auth/vehicleamount/vehicle-amount/${updatedProduct._id}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )

      fetchData()
      hideUpdateDialog()
      toast.success('Data updated successfully')
    } catch (error) {
      console.error(error)
      toast.error('Failed To Update Data')
    } finally {
      setLoading2(false)
    }
  }

  const updateProductDialogFooter = (
    <>
      <Button
        label='Cancel'
        icon='pi pi-times'
        outlined
        onClick={hideUpdateDialog}
      />
      <Button
        label='Update'
        icon='pi pi-check'
        onClick={handleUpdateProduct}
        loading={loading2}
      />
    </>
  )

  // ending all update dialog funcs

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
      <div className='space-x-2'>
        <button
          className='bg-gray-600 text-white border-gray-600 border-t border-l border-r font-bold px-4 py-3 rounded-t-md'
          onClick={exportCSV}
        >
          Download Files
        </button>
      </div>
    )
  }

  const actionBodyTemplate = (rowData: Product) => {
    const menuRef = useRef<Menu>(null)
    const items = [
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => openUpdateDialog(rowData),
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

  // initial data load
  useEffect(() => {
    fetchData()
  }, [])

  //   console.log(products)

  return (
    <AdminPanelLayout>
      <div className=''>
        <div className='m-6'>
          <Toolbar
            className='rounded-none border-none p-0 bg-white'
            // left={leftToolbarTemplate}
            // right={rightToolbarTemplate}
          ></Toolbar>

          <DataTable
            ref={dt}           size="small"           height={45}
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
            loading={loading}
          >
            <Column
              selectionMode='multiple'
              headerStyle={{ width: '3rem' }}
              exportable={false}
              headerClassName='bg-[#ffc2c2] text-sm'
              bodyClassName='text-sm truncate max-w-xs'
            ></Column>

            <Column
              field='slNo'
              header='SL No.'
              headerClassName='bg-[#ffc2c2] text-sm'
              bodyClassName='text-sm truncate max-w-xs'
              sortable
            ></Column>

            <Column
              field='title'
              headerClassName='bg-[#ffc2c2] text-sm'
              bodyClassName='text-sm truncate max-w-xs'
              sortable
              header='Vehicle Type'
            ></Column>

            <Column
              field='amount'
              headerClassName='bg-[#ffc2c2] text-sm'
              bodyClassName='text-sm truncate max-w-xs'
              sortable
              header='Amount'
            ></Column>

            <Column
              body={actionBodyTemplate}
              headerClassName='bg-[#ffc2c2] text-sm'
              bodyClassName='text-sm truncate max-w-xs'
              header='Actions'
              headerStyle={{ width: '3rem' }}
              exportable={false}
            ></Column>
          </DataTable>
        </div>

        {/* update data dialog  */}
        <Dialog
          visible={updateProductDialog}
          style={{ width: '50rem' }}
          header='Update Document'
          modal
          className='p-fluid'
          footer={updateProductDialogFooter}
          onHide={hideUpdateDialog}
        >
          {updatedProduct && (
            <div className='grid grid-cols-2 gap-4'>
              <div className='field'>
                <label htmlFor='amount' className='font-bold'>
                  Amount
                </label>
                <InputNumber
                  id='amount'
                  value={updatedProduct.amount}
                  onChange={(e) =>
                    setUpdatedProduct({
                      ...updatedProduct,
                      amount: e.value,
                    })
                  }
                  required
                />
              </div>
            </div>
          )}
        </Dialog>
      </div>
    </AdminPanelLayout>
  )
}
