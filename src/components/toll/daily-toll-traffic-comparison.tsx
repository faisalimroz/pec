import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Calendar } from 'primereact/calendar';
import '../../styles/table-style.css';
import { searchTOllCollectTraffic, useSearchTollTraffic } from '@/api/tollApi';
import axios from 'axios';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { useNavigate } from 'react-router-dom';
import RefreshButton from '@/components/refresh-button';
import { useAuth } from '@/provider/authProvider';

interface Product {
  id: string | null;
  code: string;
  name: string;
  description: string;
  image: string | null;
  price: number;
  category: string | null;
  quantity: number;
  inventoryStatus: string;
  rating: number;
}

export default function TollCollectTrafficTable() {
  const op = useRef<null>(null);
  const navigate = useNavigate();

  const { roles, permissions } = useAuth();
  const checkRole = permissions.find((p) => p.name === 'toll-manager');
  const checkPermission = checkRole?.children.find(
    (c) => c.name === 'toll-collect-traffic'
  );

  const hasEditAccess = checkPermission?.edit_authority || false;

  const isToll = roles.some((role) =>
    ['superadmin', 'toll-manager'].includes(role.title)
  );
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
  };

  const [products, setProducts] = useState<any>([]);
  const [productDialog, setProductDialog] = useState<boolean>(false);
  const [product, setProduct] = useState<any>(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Product[]>>(null);
  const [date, setDate] = useState<string>('');
  const [date2, setDate2] = useState<string>('');
  const [searchKey, setSearchKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loading2, setLoading2] = useState<boolean>(false);
  const [formDate, setFormDate] = useState<string>('');
  const [dataList, setDataList] = useState({
    types: '',
    lane: 0,
    totalpass: 0,
    shift: '',
    location: '',
    vehiclenum: '',
    organization: '',
  });

  // Dummy data for the two tables
  const [paymentData, setPaymentData] = useState([
    {
      paymentMethod: 'Cash',
      period1: 169517,
      period1Total: '43.0%',
      period2: 177993,
      period2Total: '43.0%',
      change: '+5.0%',
    },
    {
      paymentMethod: 'Exempted',
      period1: 84570,
      period1Total: '24.0%',
      period2: 99299,
      period2Total: '24.0%',
      change: '+5.0%',
    },
    {
      paymentMethod: 'Credit',
      period1: 90830,
      period1Total: '23.0%',
      period2: 95161,
      period2Total: '23.0%',
      change: '+5.0%',
    },
    {
      paymentMethod: 'EPTAG',
      period1: 39404,
      period1Total: '10.0%',
      period2: 41374,
      period2Total: '10.0%',
      change: '+5.0%',
    },
    {
      paymentMethod: 'Total',
      period1: 394043,
      period1Total: '100.0%',
      period2: 413745,
      period2Total: '100.0%',
      change: '+5.0%',
    },
  ]);

  const [vehicleData, setVehicleData] = useState([
    {
      vehicleType: 'Trailer (4Axle)',
      firstPeriod: 36086,
      secondPeriod: 38200,
      change: '+5.9%',
    },
    {
      vehicleType: 'Truck (3Axle)',
      firstPeriod: 55671,
      secondPeriod: 58500,
      change: '+5.1%',
    },
    {
      vehicleType: 'Medium Truck (8-11)',
      firstPeriod: 8731,
      secondPeriod: 9100,
      change: '+4.2%',
    },
    {
      vehicleType: 'Medium Truck (5-8)',
      firstPeriod: 55789,
      secondPeriod: 56200,
      change: '+0.7%',
    },
    {
      vehicleType: 'Mini Truck',
      firstPeriod: 17357,
      secondPeriod: 18000,
      change: '+3.7%',
    },
    {
      vehicleType: 'Big Bus',
      firstPeriod: 6491,
      secondPeriod: 7000,
      change: '+7.8%',
    },
    {
      vehicleType: 'Medium Bus',
      firstPeriod: 13447,
      secondPeriod: 14200,
      change: '+5.6%',
    },
    {
      vehicleType: 'Mini Bus',
      firstPeriod: 43690,
      secondPeriod: 44500,
      change: '+1.9%',
    },
    {
      vehicleType: 'Total (All Vehicles)',
      firstPeriod: 396896,
      secondPeriod: 416741,
      change: '+5.0%',
    },
  ]);

  const handleNumberInputChange = (
    e: { value: number | null },
    field: number
  ) => {
    setDataList((prev) => ({ ...prev, [field]: e.value || 0 }));
  };

  const openNew = () => {
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  function formatDate(dateTime?: any) {
    if (!dateTime) return '';
    const date = new Date(dateTime);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  const saveProduct = async () => {
    try {
      setLoading2(true);
      const data = {
        types: dataList.types,
        datetime: formatDate(formDate),
        lane: dataList.lane,
        totalpass: dataList.totalpass,
        shift: dataList.shift,
        location: dataList.location,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/toll/collection/traffic/upload`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const response = res;
      console.log(response);
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading2(false);
    }
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="">
        <div className="p-3 bg-main text-lg font-semibold text-white rounded-t">
          Document List
        </div>
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <>
        {hasEditAccess && (
          <div className="space-x-2">
            <button
              className="bg-white text-gray-800 border-gray-600 border-t border-l border-r px-4 py-3 rounded-t-md font-bold"
              onClick={openNew}
            >
              Upload Document
            </button>
            <button
              className="bg-gray-600 text-white border-gray-600 border-t border-l border-r font-bold px-4 py-3 rounded-t-md"
              onClick={exportCSV}
            >
              Download Files
            </button>
            <button
              className="bg-blue-500 text-white border-blue-300 border-t border-l border-r font-bold px-4 py-3 rounded-t-md"
              onClick={() =>
                navigate('/toll/toll-collect-traffic/update-delete')
              }
            >
              Delete Lists
            </button>
          </div>
        )}
        <RefreshButton className="text-base ml-2" onClick={handleReset} />
      </>
    );
  };

  const actionBodyTemplate = (rowData: Product) => {
    return (
      <>
        <Button
          icon="pi pi-ellipsis-v"
          outlined
          className="border-none"
          // @ts-ignore
          onClick={(e) => op.current?.toggle(e)}
        />
        <OverlayPanel ref={op}>
          <div className="flex flex-col space-y-2">
            <a href="">Edit</a>
            <a href="">Delete</a>
            <a href="">Download Attachment</a>
          </div>
        </OverlayPanel>
      </>
    );
  };

  function getMonthName(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { month: 'long' });
  }

  function getYear(dateString: string) {
    const date = new Date(dateString);
    return date.getFullYear();
  }

  const handleSearch = () => {
    setLoading(true);
    const initialPayload = {
      month: date ? getMonthName(date) : '',
      year: date2 ? getYear(date2) : '',
      searchQuery: searchKey,
    };

    searchTOllCollectTraffic(initialPayload).then((result) => {
      setProducts(result);
      setLoading(false);
    });
  };

  const handleReset = () => {
    const initialPayload = {
      month: '',
      year: '',
    };

    setDate('');
    setDate2('');

    searchTOllCollectTraffic(initialPayload).then((result) => {
      setProducts(result);
      setLoading(false);
    });
  };

  const filterSearchForm = (
    <div className="flex mx-auto w-fit gap-2 divide-x-2 border p-2 rounded-md bg-white">
      <Calendar
        // @ts-ignore
        value={date}
        // @ts-ignore
        onChange={(e) => setDate(e.value)}
        view="month"
        dateFormat="MM"
        inputClassName="border-none rounded-none cursor-pointer focus:ring-0"
        placeholder="By Month"
        showIcon
      />

      <Calendar
        // @ts-ignore
        value={date2}
        // @ts-ignore
        onChange={(e) => setDate2(e.value)}
        view="year"
        dateFormat="yy"
        inputClassName="border-none rounded-none ml-4 cursor-pointer focus:ring-0 focus:border-0"
        placeholder="By Year"
        showIcon
        maxDate={new Date()}
      />

      <button
        onClick={() => handleSearch()}
        className="border bg-green-500 px-4 py-2.5 rounded-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );

  const productDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button
        label="Save"
        loading={loading2}
        icon="pi pi-check"
        onClick={saveProduct}
      />
    </>
  );

  const [payload, setPayload] = useState<any>({
    month: '',
    year: '',
    searchQuery: '',
  });

  const {
    data: tollTrafficData,
    isLoading,
    error,
    refetch,
  } = useSearchTollTraffic(payload);

  useEffect(() => {
    if (tollTrafficData) {
      setProducts(tollTrafficData);
    }
  }, [tollTrafficData]);

  // CSS classes for styling
  const containerClass = 'p-4 rounded-xl shadow-lg bg-white space-y-8';
  const tableHeaderClass = 'bg-[#ffc2c2] text-black font-bold';
  const tableRowClass = (data) => {
    if (data.paymentMethod === 'Total' || data.vehicleType === 'Total (All Vehicles)') {
      return { 'bg-blue-100 font-bold': true };
    }
    return { 'hover:bg-gray-50': true };
  };

  const changeTemplate = (rowData, field) => {
    const value = rowData[field];
    const isPositive = value.startsWith('+');
    return (
      <span className={isPositive ? 'text-green-500' : 'text-red-500'}>
        {value}
      </span>
    );
  };

  return (
    <div className="ml-4">
      <Toast ref={toast} />
      <div className={containerClass}>
        {/* Payment Method Comparison Table */}
        <div className="p-3 text-lg font-semibold text-gray-800 rounded-t-lg" style={{ backgroundColor: '#ffc2c2' }}>
          Payment Method Comparison
        </div>
        <DataTable
          value={paymentData}
          rowClassName={tableRowClass}
          showGridlines={false}
          tableClassName="custom-table"
        >
          <Column
            field="paymentMethod"
            header="Payment Method"
            headerClassName={tableHeaderClass}
          ></Column>
          <Column
            field="period1"
            header="Period 1 (Jan 1-7)"
            headerClassName={tableHeaderClass}
          ></Column>
          <Column
            field="period1Total"
            header="% of Total"
            headerClassName={tableHeaderClass}
          ></Column>
          <Column
            field="period2"
            header="Period 2 (Mar 1-7)"
            headerClassName={tableHeaderClass}
          ></Column>
          <Column
            field="period2Total"
            header="% of Total"
            headerClassName={tableHeaderClass}
          ></Column>
          <Column
            field="change"
            header="% Change"
            headerClassName={tableHeaderClass}
            body={(rowData) => changeTemplate(rowData, 'change')}
          ></Column>
        </DataTable>
        
        {/* View All Button */}
        <div className="flex justify-center p-2">
          <Button label="View All Payment Methods" className="p-button-text text-blue-500 hover:text-blue-700" />
        </div>

        {/* Separator */}
        <div className="my-8"></div>

        {/* Vehicle Type Comparison Table */}
        <div className="p-3 text-lg font-semibold text-gray-800 rounded-t-lg" style={{ backgroundColor: '#ffc2c2' }}>
          Vehicle Type Comparison
        </div>
        <DataTable
          value={vehicleData}
          rowClassName={tableRowClass}
          showGridlines={false}
          tableClassName="custom-table"
        >
          <Column
            field="vehicleType"
            header="Vehicle Type"
            headerClassName={tableHeaderClass}
          ></Column>
          <Column
            field="firstPeriod"
            header="First Period (Jan 1-7)"
            headerClassName={tableHeaderClass}
          ></Column>
          <Column
            field="secondPeriod"
            header="Second Period (Mar 1-7)"
            headerClassName={tableHeaderClass}
          ></Column>
          <Column
            field="change"
            header="Change"
            headerClassName={tableHeaderClass}
            body={(rowData) => changeTemplate(rowData, 'change')}
          ></Column>
        </DataTable>

        {/* View All Button */}
        <div className="flex justify-center p-2">
          <Button label="View All Vehicle Types" className="p-button-text text-blue-500 hover:text-blue-700" />
        </div>
      </div>

      {/* Upload data dialog */}
      <Dialog
        visible={productDialog}
        style={{ width: '52rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header="Upload Document"
        modal
        className="p-fluid"
        footer={productDialogFooter}
        onHide={hideDialog}
      >
        <>
          <div className="grid grid-cols-2 items-center gap-6">
            <div className="field">
              <label htmlFor="types" className="font-bold">
                Vehicle Type
              </label>
              <Dropdown
                id="types"
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
                placeholder="Select Vehicle type"
              />
            </div>

            <div className="field">
              <label htmlFor="lane" className="font-bold">
                Lane
              </label>
              <Dropdown
                id="lane"
                value={dataList.lane}
                options={[1, 2, 3, 4, 5, 6]}
                onChange={(e) =>
                  setDataList((prev) => ({ ...prev, lane: e.value }))
                }
                placeholder="Select Lane"
              />
            </div>

            <div className="field">
              <label htmlFor="totalpass">Total Pass</label>
              <InputNumber
                id="totalpass"
                value={dataList.totalpass}
                //@ts-ignore
                onValueChange={(e) => handleNumberInputChange(e, 'totalpass')}
              />
            </div>

            <div className="field">
              <label htmlFor="shift" className="font-bold">
                Shift
              </label>
              <Dropdown
                id="shift"
                value={dataList.shift}
                options={['12 AM - 08 AM', '08 AM - 04 PM', '04 PM - 12 AM']}
                onChange={(e) =>
                  setDataList((prev) => ({ ...prev, shift: e.value }))
                }
                placeholder="Select Shift"
              />
            </div>

            <div className="field">
              <label htmlFor="location" className="font-bold">
                Location
              </label>
              <Dropdown
                id="location"
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
                placeholder="Select Location"
              />
            </div>

            <div>
              <label htmlFor="date" className="font-bold">
                Date
              </label>
              <div className="border rounded-md">
                <Calendar
                  id="date"
                  // @ts-ignore
                  onChange={(e) => setFormDate(e.value)}
                  dateFormat="dd/mm/yy"
                  inputClassName="border-0 focus:ring-0 cursor-pointer"
                  className="focus:ring-0"
                  placeholder="Select Date"
                />
              </div>
            </div>
          </div>
        </>
      </Dialog>
    </div>
  );
}