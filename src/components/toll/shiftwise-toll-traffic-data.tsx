"use client";

import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { toast } from "sonner";
import axios from "axios";

import RefreshButton from "@/components/refresh-button";
import TollGroupWithIcons from "../ui/tollbuttons";
import { useAuth } from "@/provider/authProvider";
import { searchShiftManual } from "@/api/tollApi";

import { IconField } from "primereact/iconfield";
import { InputText } from "primereact/inputtext";

interface RowData {
  paymentMethod: string;
  third2: number;
  first: number;
  second: number;
  third1: number;
  total: number;
}

export default function ShiftManualTable() {
  const [products, setProducts] = useState<RowData[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<RowData[]>([]);
  const dt = useRef<DataTable<RowData[]>>(null);

  const [date, setDate] = useState<any>(null);
  const [date2, setDate2] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedShift, setSelectedShift] = useState<string | null>(null);
  const [selectedTraffic, setSelectedTraffic] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [bulkDialog, setBulkDialog] = useState(false);
  const [formDate, setFormDate] = useState<any>(null);
  const [bulkLocation, setBulkLocation] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteDate, setDeleteDate] = useState<any>(null);
  const [loading2, setLoading2] = useState(false);

  const [overallTotals, setOverallTotals] = useState({
    third2: 0,
    first: 0,
    second: 0,
    third1: 0,
    grandTotal: 0,
  });

  const [searchKey, setSearchKey] = useState("");

  const { permissions } = useAuth();
  const tollManagerPermission = permissions.find((p) => p.name === "toll-manager");
  const tollPermission = tollManagerPermission?.children?.find(
    (child) => child.name === "toll-daily-report"
  );
  const hasEditAccess = tollPermission?.edit_authority === true;

  const locationOptions = [
    { label: "Mawa", value: "Mawa" },
    { label: "Jinjira", value: "Jinjira" },
  ];

  const trafficOptions = [
    { label: "All", value: "" },      // ✅ allow none selection
    { label: "Traffic", value: "Traffic" },
    { label: "Toll", value: "Toll" },
  ];

  const shiftOptions = [
    { label: "All", value: "All" },
    { label: "3rd-2 Shift", value: "3rd-2 Shift" },
    { label: "1st Shift", value: "1st Shift" },
    { label: "2nd Shift", value: "2nd Shift" },
    { label: "3rd-1 Shift", value: "3rd-1 Shift" },
  ];

  function formatDate(dateTime?: any) {
    if (!dateTime) return "";
    const d = new Date(dateTime);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const fetchData = async (payload: any) => {
    setLoading(true);
    try {
      const res = await searchShiftManual(payload);
      setProducts(res?.laneData || []);
      setOverallTotals(
        res?.overallTotals || {
          third2: 0,
          first: 0,
          second: 0,
          third1: 0,
          grandTotal: 0,
        }
      );
    } catch {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData({});
    setSelectedTraffic("");
  }, []);

  const handleSearch = () => {
    const payload = {
      fromDate: date ? formatDate(date) : "",
      toDate: date2 ? formatDate(date2) : "",
      lane: selectedLocation || "",
      shift: selectedShift || "",
      dataType: selectedTraffic || "", // "" => all
    };
    fetchData(payload);
  };

  const handleReset = () => {
    setDate(null);
    setDate2(null);
    setSelectedLocation(null);
    setSelectedShift(null);
    setSelectedTraffic("");
    fetchData({});
  };

  // bulk upload
  const handleFileChange = (e: any) => {
    const f = e.target.files?.[0];
    if (f && f.name.endsWith(".xlsx")) {
      setFile(f);
      setUploadStatus("");
    } else {
      setFile(null);
      setUploadStatus("Please select a valid .xlsx file.");
    }
  };

  const uploadFile = async () => {
    if (!file) return setUploadStatus("Please select a file first.");
    if (!formDate) return setUploadStatus("Please select a date.");
    if (!bulkLocation) return setUploadStatus("Please select a location.");

    setUploading(true);
    const fd = new FormData();
    fd.append("date", formatDate(formDate));
    fd.append("location", bulkLocation);
    fd.append("file", file);

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/toll/shiftmanual/bulk_upload`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("File uploaded successfully!");
      setBulkDialog(false);
      setFile(null);
      setFormDate(null);
      setBulkLocation(null);
      handleSearch();
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // delete
  const deleteData = async () => {
    if (!deleteDate) return;
    setLoading2(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/toll/shiftmanual/delete/using/date`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          data: { date: formatDate(deleteDate) },
        }
      );
      toast.success("Deleted successfully");
      setDeleteDialog(false);
      setDeleteDate(null);
      handleSearch();
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoading2(false);
    }
  };

  const leftToolbarTemplate = () => (
    <div className="px-2 py-2 bg-main text-sm font-semibold text-white rounded-lg">
      Document List
    </div>
  );

  const rightToolbarTemplate = () => (
    <>
      {hasEditAccess && (
        <TollGroupWithIcons
          selectedProducts={selectedProducts}
          openNew={() => setDeleteDialog(true)}
          bulkUpload={() => setBulkDialog(true)}
        />
      )}
      <div className="mb-1">
        <RefreshButton handleReset={handleReset} />
      </div>
    </>
  );

  const filterSearchForm = (
    <div>
      <div className="flex flex-wrap justify-center">
        <div className="flex w-fit gap-2 border p-2 rounded-md bg-white">
          <Calendar
            value={date}
            onChange={(e) => setDate(e.value)}
            dateFormat="dd/mm/yy"
            inputClassName="border-none rounded-none cursor-pointer focus:ring-0 w-28"
            placeholder="Start Date"
            showIcon
            icon={() => <i className="pi pi-angle-down" />}
          />

          <Calendar
            value={date2}
            onChange={(e) => setDate2(e.value)}
            dateFormat="dd/mm/yy"
            inputClassName="border-none rounded-none ml-4 cursor-pointer focus:ring-0 w-28"
            placeholder="End Date"
            showIcon
            icon={() => <i className="pi pi-angle-down" />}
          />

          <Dropdown
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.value)}
            options={locationOptions}
            placeholder="Location"
            className="border-none rounded-none ml-4 cursor-pointer ring-0"
          />

          <Dropdown
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.value)}
            options={shiftOptions}
            placeholder="Shift"
            className="border-none rounded-none ml-4 cursor-pointer ring-0"
          />

          <Dropdown
            value={selectedTraffic}
            onChange={(e) => setSelectedTraffic(e.value)}
            options={trafficOptions}
            placeholder="Traffic / Toll"
            className="border-none rounded-none ml-4 cursor-pointer ring-0"
          />
        </div>

        <div className="flex w-fit gap-2 border p-2 rounded-md bg-white">
          <IconField iconPosition="left" className="relative">
            <InputText
              type="search"
              placeholder="Search"
              className="border-none ml-4 focus:ring-0"
              onChange={(e) => setSearchKey(e.target.value)}
              value={searchKey}
            />
            <button
              onClick={handleSearch}
              className="absolute top-0.5 right-1 border bg-green-500 px-4 py-2.5 rounded-lg"
              type="submit"
            >
              ▶
            </button>
          </IconField>
        </div>
      </div>

      <h1 className="text-center pt-10 text-xl font-bold text-black">
        Shift Wise Toll & Traffic Report
      </h1>
    </div>
  );

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header="Payment Method" frozen />
        <Column header="3rd-2" />
        <Column header="1st" />
        <Column header="2nd" />
        <Column header="3rd-1" />
        <Column header="Total" frozen />
      </Row>
    </ColumnGroup>
  );

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total" footerStyle={{ textAlign: "right" }} />
        <Column footer={overallTotals.third2 ?? 0} />
        <Column footer={overallTotals.first ?? 0} />
        <Column footer={overallTotals.second ?? 0} />
        <Column footer={overallTotals.third1 ?? 0} />
        <Column footer={overallTotals.grandTotal ?? 0} />
      </Row>
    </ColumnGroup>
  );

  return (
    <>
      <div className="ml-4">
        <Toolbar
          className="rounded-none border-none p-0 bg-background"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        />

        <DataTable
          ref={dt}
          value={products}
          selection={selectedProducts}
          onSelectionChange={(e) => {
            if (Array.isArray(e.value)) setSelectedProducts(e.value);
          }}
          dataKey="paymentMethod"
          header={filterSearchForm}
          showGridlines
          emptyMessage="No data found!"
          loading={loading}
          headerColumnGroup={headerGroup}
          footerColumnGroup={footerGroup}
          scrollable
          scrollHeight="600px"
        >
          <Column field="paymentMethod" frozen />
          {/* ✅ correct keys */}
          <Column field="third2" />
          <Column field="first" />
          <Column field="second" />
          <Column field="third1" />
          <Column field="total" frozen />
        </DataTable>
      </div>

      {/* Bulk Upload Dialog */}
      <Dialog
        visible={bulkDialog}
        style={{ width: "42rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Upload Bulk Data"
        modal
        className="p-fluid"
        footer={
          <>
            <Button label="Cancel" className="p-button-text" onClick={() => setBulkDialog(false)} />
            <Button label="Save" icon="pi pi-upload" className="p-button-text" onClick={uploadFile} disabled={!file || uploading} />
          </>
        }
        onHide={() => setBulkDialog(false)}
      >
        <div className="grid grid-cols-2 items-center gap-6">
          <div>
            <label className="font-bold">Date</label>
            <div className="border rounded-md">
              <Calendar
                value={formDate}
                onChange={(e) => setFormDate(e.value)}
                dateFormat="dd/mm/yy"
                placeholder="Select Date"
              />
            </div>
          </div>

          <div>
            <label className="font-bold">Location</label>
            <Dropdown
              value={bulkLocation}
              onChange={(e) => setBulkLocation(e.value)}
              options={locationOptions}
              placeholder="Select Location"
              className="mt-2 w-full"
            />
          </div>

          <div className="field col-span-2">
            <label className="font-bold">Select File (.xlsx Only):</label>
            <input type="file" accept=".xlsx" onChange={handleFileChange} disabled={uploading} className="mt-3" />
            {uploadStatus && <p className="text-red-500 mt-2">{uploadStatus}</p>}
          </div>
        </div>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        visible={deleteDialog}
        style={{ width: "42rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Delete By Date"
        modal
        className="p-fluid"
        footer={
          <>
            <Button label="Cancel" className="p-button-text" onClick={() => setDeleteDialog(false)} />
            <Button label="Delete" icon="pi pi-trash" className="p-button-text" onClick={deleteData} disabled={!deleteDate || loading2} />
          </>
        }
        onHide={() => setDeleteDialog(false)}
      >
        <div className="w-fit mx-auto">
          <h1 className="font-bold text-center mb-2 text-xl">Date</h1>
          <div className="border rounded-md">
            <Calendar value={deleteDate} onChange={(e) => setDeleteDate(e.value)} dateFormat="dd/mm/yy" placeholder="Select Date" />
          </div>
        </div>
      </Dialog>

      <div className="px4 py-4 bg-white mt-5">
        <h1 className="text-center text-sm text-black">
          Note: 3rd-2 Shift(00:00 to 06:00)/1st Shift(06:00 to 14:00)/
          2nd Shift(14:00 to 22:00)/3rd-1 Shift(22:00 to 00:00)
        </h1>
      </div>
    </>
  );
}
