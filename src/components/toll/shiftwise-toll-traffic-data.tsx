import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import axios from "axios";
import { toast } from "sonner";

import RefreshButton from "@/components/refresh-button";
import TollGroupWithIcons from "../ui/tollbuttons"; // adjust path if different
import { useAuth } from "@/provider/authProvider";
import { searchShiftManual } from "@/api/tollApi";

interface ShiftRow {
  paymentMethod: string;
  traffic: number;
  tollAmount: number;
}

interface OverallTotals {
  totalTraffic: number;
  totalTollAmount: number;
}

const locations = [
  { label: "All", value: "All" },
  { label: "Mawa", value: "Mawa" },
  { label: "Jinjira", value: "Jinjira" },
];

const shifts = [
  { label: "All Shift", value: "All" },
  { label: "3rd-2 Shift", value: "3rd-2 Shift" },
  { label: "1st Shift", value: "1st Shift" },
  { label: "2nd Shift", value: "2nd Shift" },
  { label: "3rd-1 Shift", value: "3rd-1 Shift" },
];

type Product = ShiftRow;

export default function ShiftWiseTollTrafficTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>("All");
  const [selectedShift, setSelectedShift] = useState<string>("All");

  const [loading, setLoading] = useState<boolean>(false);
  const [overallTotals, setOverallTotals] = useState<OverallTotals>({
    totalTraffic: 0,
    totalTollAmount: 0,
  });
  const [shownDateRange, setShownDateRange] = useState<string>("");

  // bulk upload
  const [bulkDialog, setBulkDialog] = useState(false);
  const [formDate, setFormDate] = useState<Date | null>(null);
  const [bulkLocation, setBulkLocation] = useState<string>("Mawa");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // delete by date
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteDate, setDeleteDate] = useState<Date | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const dt = useRef<DataTable<Product[]>>(null);

  const { permissions } = useAuth();
  const tollManagerPermission = permissions.find(
    (p) => p.name === "toll-manager"
  );
  const tollPermission = tollManagerPermission?.children?.find(
    (child) => child.name === "toll-daily-report"
  );
  const hasEditAccess = tollPermission?.edit_authority === true;

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const token = localStorage.getItem("token");

  // ---------- helpers ----------
  function formatDate(d?: Date | null): string {
    if (!d) return "";
    const date = new Date(d);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const leftToolbarTemplate = () => (
    <div>
      <div className="px-2 py-2 bg-main text-sm font-semibold text-white rounded-lg">
        Document List
      </div>
    </div>
  );

  const rightToolbarTemplate = () => (
    <>
      {hasEditAccess && (
        <TollGroupWithIcons
          selectedProducts={selectedProducts}
          openNew={() => setDeleteDialog(true)}    // DELETE dialog
          bulkUpload={() => setBulkDialog(true)}   // BULK upload dialog
        />
      )}
      <div className="mb-1">
        <RefreshButton handleReset={handleReset} />
      </div>
    </>
  );

  // ---------- search ----------
  const handleSearch = () => {
    setLoading(true);

    const payload = {
      fromDate: startDate ? formatDate(startDate) : "",
      toDate: endDate ? formatDate(endDate) : "",
      lane: selectedLocation,
      shift: selectedShift,
    };

    // use helper as requested
    searchShiftManual(payload)
      .then((result: any) => {
        setProducts(result?.laneData || []);
        setOverallTotals(
          result?.overallTotals || { totalTraffic: 0, totalTollAmount: 0 }
        );
        setShownDateRange(result?.date || "");
      })
      .catch((err: any) => {
        console.error("Error fetching shift manual data:", err);
        toast.error("Failed to load data.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedLocation("All");
    setSelectedShift("All");
    setProducts([]);
    setOverallTotals({ totalTraffic: 0, totalTollAmount: 0 });
    setShownDateRange("");
  };

  // ---------- bulk upload ----------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) {
      setFile(null);
      return;
    }
    if (!f.name.endsWith(".xlsx")) {
      toast.error("Please select .xlsx file only.");
      setFile(null);
      return;
    }
    setFile(f);
  };

  const uploadFile = async () => {
    if (!file) {
      toast.error("Please select a file.");
      return;
    }
    if (!formDate) {
      toast.error("Please select a date for this sheet.");
      return;
    }
    if (!bulkLocation) {
      toast.error("Please select location.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("date", formatDate(formDate));
      formData.append("location", bulkLocation);
      formData.append("file", file);

      const res = await axios.post(
        `${BASE_URL}/api/v1/toll/shiftmanual/bulk_upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(res.data?.message || "File uploaded successfully.");
      setBulkDialog(false);
      setFile(null);
      setFormDate(null);

      // refresh table with current filters
      handleSearch();
    } catch (err: any) {
      console.error("Error uploading file:", err);
      toast.error(
        err?.response?.data?.message || "Error while uploading file."
      );
    } finally {
      setUploading(false);
    }
  };

  const uploadDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => setBulkDialog(false)}
        disabled={uploading}
      />
      <Button
        label="Save"
        icon="pi pi-upload"
        className="p-button-text"
        onClick={uploadFile}
        disabled={!file || !formDate || uploading}
      />
    </>
  );

  // ---------- delete by date ----------
  const deleteData = async () => {
    if (!deleteDate) {
      toast.error("Please select a date.");
      return;
    }

    setDeleteLoading(true);
    try {
      await axios.delete(
        `${BASE_URL}/api/v1/toll/shiftmanual/delete/using/date`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: {
            date: formatDate(deleteDate),
          },
        }
      );

      toast.success("Data deleted successfully.");
      setDeleteDialog(false);
      setDeleteDate(null);

      // refresh after delete
      handleSearch();
    } catch (err: any) {
      console.error("Error deleting data:", err);
      toast.error(
        err?.response?.data?.message || "Error while deleting data."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const deleteDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => {
          setDeleteDialog(false);
          setDeleteDate(null);
        }}
        disabled={deleteLoading}
      />
      <Button
        label="Delete"
        icon="pi pi-trash"
        className="p-button-text"
        onClick={deleteData}
        disabled={!deleteDate || deleteLoading}
      />
    </>
  );

  // ---------- header (filters) ----------
  const filterSearchForm = (
    <div>
      <div className="flex flex-wrap justify-between gap-4">
        <div className="flex flex-wrap gap-2 border p-2 rounded-md bg-white items-center">
          <Calendar
            value={startDate}
            onChange={(e) => setStartDate(e.value as Date)}
            dateFormat="dd/mm/yy"
            inputClassName="border-none rounded-none cursor-pointer focus:ring-0 w-28"
            placeholder="Start Date"
            showIcon
            icon={() => <i className="pi pi-angle-down" />}
          />
          <Calendar
            value={endDate}
            onChange={(e) => setEndDate(e.value as Date)}
            dateFormat="dd/mm/yy"
            inputClassName="border-none rounded-none cursor-pointer focus:ring-0 w-28"
            placeholder="End Date"
            showIcon
            icon={() => <i className="pi pi-angle-down" />}
          />

          <Dropdown
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.value)}
            options={locations}
            placeholder="Location"
            className="border-none rounded-none ml-4 cursor-pointer ring-0"
          />

          <Dropdown
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.value)}
            options={shifts}
            placeholder="Shift"
            className="border-none rounded-none ml-4 cursor-pointer ring-0"
          />
        </div>

        <div className="flex items-center border p-2 rounded-md bg-white">
          <IconField iconPosition="left" className="relative">
            <InputText
              type="text"
              disabled
              value={shownDateRange}
              className="border-none ml-4 focus:ring-0 w-64"
              placeholder="Date range will show here"
            />
            <button
              onClick={handleSearch}
              className="absolute top-0.5 right-1 border bg-green-500 px-4 py-2.5 rounded-lg"
              type="button"
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
          </IconField>
        </div>
      </div>

      <h1 className="text-center pt-10 text-xl font-bold text-[#000000]">
        Shift Wise Toll &amp; Traffic Data
      </h1>
    </div>
  );

  const totalSummary = (
    <div className="font-bold flex flex-wrap justify-between items-center bg-gray-100 p-4 rounded mt-4 mb-4 gap-4">
      <div>
        <span className="font-bold text-lg">Total Vehicle Passing:</span>{" "}
        {overallTotals.totalTraffic}
      </div>
      <div>
        <span className="font-bold text-lg">Data Showing For:</span>{" "}
        {shownDateRange || "-"}
      </div>
      <div>
        <span className="font-bold text-lg">Total Toll Collection:</span>{" "}
        {overallTotals.totalTollAmount}
      </div>
    </div>
  );

  return (
    <>
      <div className="ml-4">
        <Toolbar
          className="rounded-none border-none p-0 bg-background"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        />
        {totalSummary}

        <DataTable
          ref={dt}
          value={products}
          selection={selectedProducts}
          onSelectionChange={(e) => {
            if (Array.isArray(e.value)) {
              setSelectedProducts(e.value as Product[]);
            }
          }}
          dataKey="paymentMethod"
          rows={10}
          header={filterSearchForm}
          showGridlines
          emptyMessage="No data found!"
          loading={loading}
          scrollable
          scrollHeight="600px"
        >
          <Column
            field="paymentMethod"
            header="Payment Method"
            frozen
            style={{ minWidth: "10rem" }}
          />
          <Column
            field="traffic"
            header="Traffic (Vehicles)"
            style={{ minWidth: "10rem", textAlign: "right" }}
          />
          <Column
            field="tollAmount"
            header="Toll Amount"
            style={{ minWidth: "10rem", textAlign: "right" }}
          />
        </DataTable>
      </div>

      {/* Bulk Upload Dialog */}
      <Dialog
        visible={bulkDialog}
        style={{ width: "42rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Upload Shift Wise Data"
        modal
        className="p-fluid"
        footer={uploadDialogFooter}
        onHide={() => setBulkDialog(false)}
      >
        <div className="grid grid-cols-2 items-center gap-6">
          <div>
            <label htmlFor="date" className="font-bold">
              Date
            </label>
            <div className="border rounded-md">
              <Calendar
                id="date"
                value={formDate}
                onChange={(e) => setFormDate(e.value as Date)}
                dateFormat="dd/mm/yy"
                placeholder="Select Date"
              />
            </div>
          </div>

          <div>
            <label htmlFor="loc" className="font-bold">
              Location
            </label>
            <Dropdown
              id="loc"
              value={bulkLocation}
              onChange={(e) => setBulkLocation(e.value)}
              options={locations.filter((l) => l.value !== "All")}
              optionLabel="label"
              optionValue="value"
              placeholder="Select Location"
              className="mt-1 w-full"
            />
          </div>

          <div className="field col-span-2">
            <label htmlFor="bulkUpload" className="font-bold">
              Select File (.xlsx Only):
            </label>
            <br />
            <input
              type="file"
              id="bulkUpload"
              accept=".xlsx"
              onChange={handleFileChange}
              disabled={uploading}
              className="mt-3"
            />
          </div>
        </div>
      </Dialog>

      {/* Delete Data Dialog */}
      <Dialog
        visible={deleteDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Delete Data By Date"
        modal
        className="p-fluid"
        footer={deleteDialogFooter}
        onHide={() => {
          setDeleteDialog(false);
          setDeleteDate(null);
        }}
      >
        <div className="w-fit justify-center mx-auto gap-6">
          <div>
            <h1 className="font-bold text-center mb-2 text-xl">Date</h1>
            <div className="border rounded-md">
              <Calendar
                id="deleteDate"
                value={deleteDate}
                onChange={(e) => setDeleteDate(e.value as Date)}
                dateFormat="dd/mm/yy"
                placeholder="Select Date"
              />
            </div>
          </div>
        </div>
      </Dialog>

      <div className="px-4 py-4 bg-white mt-5">
        <h1 className="text-center text-sm text-[#000000]">
          Note: 3rd-2 Shift (00:00 to 06:00) / 1st Shift (06:00 to 14:00) / 2nd
          Shift (14:00 to 22:00) / 3rd-1 Shift (22:00 to 00:00)
        </h1>
      </div>
    </>
  );
}
