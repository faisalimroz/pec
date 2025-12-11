import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Calendar } from "primereact/calendar";
import "../../styles/table-style.css";
import { searchKecManual, useKecManual } from "@/api/tollApi";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import trailer5axle from "@/assets/ai-assets/vehicle/trailer-5axle.svg";
import trailer4axle from "@/assets/ai-assets/vehicle/trailer-4axle.svg";
import trailer3axle from "@/assets/ai-assets/vehicle/truck-3axle.svg";
import mediumTruck9 from "@/assets/ai-assets/vehicle/medium-truck11.svg";
import mediumTruck8 from "@/assets/ai-assets/vehicle/medium-truck8.svg";
import miniTruck from "@/assets/ai-assets/vehicle/mini-truck.svg";
import bigBus from "@/assets/ai-assets/vehicle/big-bus.svg";
import meduiumBus from "@/assets/ai-assets/vehicle/medium-bus.svg";
import miniBus from "@/assets/ai-assets/vehicle/mini-bus.svg";
import microBus from "@/assets/ai-assets/vehicle/micro-bus.svg";
import pickUp from "@/assets/ai-assets/vehicle/pickup.svg";
import car from "@/assets/ai-assets/vehicle/car.svg";
import bike from "@/assets/ai-assets/vehicle/bike.svg";
import { Dropdown } from "primereact/dropdown";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import RefreshButton from "@/components/refresh-button";
import { useAuth } from "@/provider/authProvider";
import TollGroupWithIcons from "../ui/tollbuttons";

interface Product {
    paymentMethod: string;
    trailer5xl: number;
    trailer4xl: number;
    trailer3xl: number;
    medium_truck9: number;
    medium_truck8: number;
    mini_truck: number;
    big_bus: number;
    medium_bus: number;
    mini_bus: number;
    micro_bus: number;
    pickup: number;
    car: number;
    bike: number;
    total: number;
}

export default function VehicleDetectTollTable() {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const dt = useRef<DataTable<Product>>(null);
    const [date, setDate] = useState<string>("");
    const [date2, setDate2] = useState<string>("");
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [selectedTraffic, setSelectedTraffic] = useState<string | null>(null);
    const [footerTotal, setFooterTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [allData, setAllData] = useState<any>({});
    const [summaryTotal, setSummaryTotal] = useState<number>(0);
    const [todaysDate, setTodaysDate] = useState("");
    
    // Bulk Upload States
    const [bulkLocation, setBulkLocation] = useState<string | null>(null);
    const [bulkDialog, setBulkDialog] = useState(false);
    const [file, setFile] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState("");
    const [formDate, setFormDate] = useState<string>("");

    // Delete States
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deleteDate, setDeleteDate] = useState("");
    const [deleteLocation, setDeleteLocation] = useState<string | null>(null); // New State for Delete Location
    
    const [loading2, setLoading2] = useState(false);
    const { pathname } = useLocation();
    const showAll = pathname.startsWith("/edms");
    const { permissions } = useAuth();
    const tollManagerPermission = permissions.find((p) => p.name === "toll-manager");
    const tollPermission = tollManagerPermission?.children?.find((child) => child.name === "toll-daily-report");
    const hasEditAccess = tollPermission?.edit_authority === true && showAll;

    const locationOptions = [
        { label: "All", value: "All" },
        { label: "Mawa", value: "Mawa" },
        { label: "Jinjira", value: "Jinjira" },
    ];

    const trafficOptions = [
        { label: "Toll", value: "Toll" },
        { label: "Traffic", value: "Traffic" },
    ];

    const itemTemplate = (option: { label: string; value: string }) => (
        <div className="flex items-center gap-2">
            <span>{option.label}</span>
        </div>
    );

    function formatDate(dateTime?: any) {
        if (!dateTime) return '';
        const date = new Date(dateTime);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    useEffect(() => {
        fetchTodaysData();
    }, []);

    const fetchTodaysData = async () => {
        setLoading(true);
        try {
            const today = new Date();
            const todayFormatted = formatDate(today);

            const payload = {
                date_range: `${todayFormatted} to ${todayFormatted}`,
                lane: selectedLocation || "",
                dataType: selectedTraffic || "",
            };

            const result = await searchKecManual(payload);

            setProducts(result?.laneData || []);
            const overallTotals = result?.overallTotals || {};
            setAllData(overallTotals);

            // FIX: Handle both "Traffic" AND null (initial state) as the default view
            if (selectedTraffic === "Toll") {
                // Use consistent naming (totalOverallSum vs totalOverallAmount based on your API)
                const amount = overallTotals.totalOverallAmount || overallTotals.totalOverallSum || 0;
                setSummaryTotal(amount);
                setFooterTotal(amount);
            } else {
                // Default view (Traffic)
                const vehicles = overallTotals.totalOverallVehicles || 0;
                setSummaryTotal(vehicles);
                setFooterTotal(vehicles);
            }

            setTodaysDate(result?.date || "");
            setDate(today as any);
            setDate2(today as any);

        } catch (error) {
            console.error("Initial fetch failed:", error);
            toast.error("Failed to fetch today's data");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const payload = {
                date_range:
                    date && date2 ? `${formatDate(date)} to ${formatDate(date2)}` : "",
                lane: selectedLocation || "",
                dataType: selectedTraffic || "",
            };

            const result = await searchKecManual(payload);
            setProducts(result?.laneData || []);
            const overallTotals = result?.overallTotals || {};
            setAllData(overallTotals);
            
            if (selectedTraffic === "Toll") {
                const amount = overallTotals.totalOverallSum || overallTotals.totalOverallAmount || 0;
                setSummaryTotal(amount);
                setFooterTotal(amount);
            } else {
                const vehicles = overallTotals.totalOverallVehicles || 0;
                setSummaryTotal(vehicles);
                setFooterTotal(vehicles);
            }
            setTodaysDate(result?.date || "");
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        const today = new Date();
        setDate(today as any);
        setDate2(today as any);
        setSelectedTraffic(null);
        setSelectedLocation(null);

        const payload = {
            date_range: `${formatDate(today)} to ${formatDate(today)}`,
            lane: "",
            dataType: "",
        };

        setLoading(true);
        try {
            const result = await searchKecManual(payload);
            setProducts(result?.laneData || []);
            const overallTotals = result?.overallTotals || {};
            setAllData(overallTotals);

            // Reset logic treats null/Traffic the same
            if (selectedTraffic === "Toll") {
                const amount = overallTotals.totalOverallSum || overallTotals.totalOverallAmount || 0;
                setSummaryTotal(amount);
                setFooterTotal(amount);
            } else {
                const vehicles = overallTotals.totalOverallVehicles || 0;
                setSummaryTotal(vehicles);
                setFooterTotal(vehicles);
            }
            setTodaysDate(result?.date || "");
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const uploadFile = async () => {
        if (!file || !formDate || !bulkLocation || bulkLocation === "All") {
            setUploadStatus("Please select file, date, and specific location.");
            return;
        }
        setUploading(true);

        const formData = new FormData();
        formData.append("date", formatDate(formDate));
        formData.append("location", bulkLocation);
        formData.append("file", file);

        try {
            await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/toll/kecmanual/bulk_upload`,
                formData,
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "multipart/form-data" } }
            );
            toast.success("File uploaded successfully!");
            setFile(null);
            setUploadStatus("");
            handleReset();
            hideDialog2();
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error(error.response?.data?.message || "Upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const deleteData = async () => {
        try {
            setLoading2(true);
            await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/v1/toll/kecmanual/delete/using/date`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                data: { 
                    date: formatDate(deleteDate),
                    location: deleteLocation 
                },
            });
            window.location.reload();
            toast.success("Data Deleted Successfully");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Error deleting data");
        } finally {
            setLoading2(false);
            setDeleteDialog(false);
            setDeleteDate("");
            setDeleteLocation(null);
        }
    };

    const hideDialog2 = () => { setBulkDialog(false); setFile(null); setUploadStatus(""); setFormDate(""); setBulkLocation(null); };
    
    const hideDialog3 = () => { 
        setDeleteDialog(false); 
        setDeleteDate(""); 
        setDeleteLocation(null); 
    };
    
    const openNew2 = () => setBulkDialog(true);
    const openNew3 = () => setDeleteDialog(true);

    const productDialogFooter2 = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog2} />
            <Button label="Save" icon="pi pi-upload" className="p-button-text" onClick={uploadFile} disabled={!file || uploading} />
        </>
    );

    const productDialogFooter3 = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog3} />
            <Button 
                label="Delete" 
                icon="pi pi-trash" 
                className="p-button-text" 
                onClick={deleteData} 
                disabled={!deleteDate || !deleteLocation || loading2}
            />
        </>
    );

    const handleFileChange = (e: any) => {
        const f = e.target.files[0];
        if (f && f.name.endsWith(".xlsx")) { setFile(f); setUploadStatus(""); }
        else { setFile(null); setUploadStatus("Please select a valid .xlsx file."); }
    };

    const vehicleHeaderTemplate = (image: string, label: string) => (
        <div className="flex flex-col items-center">
            <img src={image} alt={label} className="mb-2" />
            <span className="text-xs">{label}</span>
        </div>
    );

    const headerGroup = (
        <ColumnGroup>
            <Row>
                <Column header="Payment Method" headerClassName="min-w-[12rem]" rowSpan={2} />
                <Column header={vehicleHeaderTemplate(trailer5axle, "Trailer (>4 Axle)")} headerClassName="min-w-[10rem]" />
                <Column header={vehicleHeaderTemplate(trailer4axle, "Trailer (4 Axle)")} headerClassName="min-w-[10rem]" />
                <Column header={vehicleHeaderTemplate(trailer3axle, "Trailer (3 Axle)")} headerClassName="min-w-[10rem]" />
                <Column header={vehicleHeaderTemplate(mediumTruck9, "Medium Truck (8-11)")} headerClassName="min-w-[10rem]" />
                <Column header={vehicleHeaderTemplate(mediumTruck8, "Medium Truck (5-8)")} headerClassName="min-w-[10rem]" />
                <Column header={vehicleHeaderTemplate(miniTruck, "Mini Truck")} headerClassName="min-w-[10rem]" />
                <Column header={vehicleHeaderTemplate(bigBus, "Big Bus")} headerClassName="min-w-[10rem]" />
                <Column header={vehicleHeaderTemplate(meduiumBus, "Medium Bus")} headerClassName="min-w-[10rem]" />
                <Column header={vehicleHeaderTemplate(miniBus, "Mini Bus")} headerClassName="min-w-[10rem]" />
                <Column header={vehicleHeaderTemplate(microBus, "Micro Bus")} headerClassName="min-w-[10rem]" />
                <Column header={vehicleHeaderTemplate(pickUp, "Pickup")} headerClassName="min-w-[10rem]" />
                <Column header={vehicleHeaderTemplate(car, "Car/Jeep")} headerClassName="min-w-[10rem]" />
                <Column header={vehicleHeaderTemplate(bike, "Motorcycle")} headerClassName="min-w-[10rem]" />
                <Column header="Total" headerClassName="min-w-[10rem]" rowSpan={2} />
            </Row>
        </ColumnGroup>
    );

    const footerGroup = (
        <ColumnGroup>
            <Row>
                <Column footer="Total" colSpan={1} footerStyle={{ textAlign: "right" }} />
                <Column footer={allData?.totaltrailer5xl ?? 0} />
                <Column footer={allData?.totaltrailer4xl ?? 0} />
                <Column footer={allData?.totaltrailer3xl ?? 0} />
                <Column footer={allData?.totalmedium_truck9 ?? 0} />
                <Column footer={allData?.totalmedium_truck8 ?? 0} />
                <Column footer={allData?.totalmini_truck ?? 0} />
                <Column footer={allData?.totalbigbus ?? 0} />
                <Column footer={allData?.totalmedium_truck ?? 0} />
                <Column footer={allData?.totalmini_bus ?? 0} />
                <Column footer={allData?.totalmicro_bus ?? 0} />
                <Column footer={allData?.totalpickup ?? 0} />
                <Column footer={allData?.totalcar ?? 0} />
                <Column footer={allData?.totalbike ?? 0} />
                <Column footer={footerTotal} />
            </Row>
        </ColumnGroup>
    );

    const totalSummary = (
        <div className="font-bold flex justify-between items-center bg-gray-100 p-4 rounded mb-4">
            <div>
                <span className="font-bold text-lg">Total: </span> {footerTotal}
            </div>
            <div>
                <span className="font-bold text-lg">Data Showing For:</span> {todaysDate || new Date().toLocaleDateString()}
            </div>
        </div>
    );

    const leftToolbarTemplate = () => (
        <div className="px-2 py-2 bg-main text-sm font-semibold text-white rounded-lg">
            Traffic Report
        </div>
    );

    const rightToolbarTemplate = () => (
        <>
            {hasEditAccess && (
                <TollGroupWithIcons selectedProducts={selectedProducts} openNew={openNew3} bulkUpload={openNew2} />
            )}
            <div className="mb-1"><RefreshButton handleReset={handleReset} /></div>
        </>
    );

    const filterSearchForm = (
        <div className="flex flex-wrap justify-center">
            <div className="flex w-fit gap-2 divide-x-2 border p-2 rounded-md bg-white">
                <Calendar
                    value={date as any}
                    onChange={(e) => setDate(e.value as any)}
                    dateFormat="dd/mm/yy"
                    inputClassName='p-inputtext-sm border-none rounded-none ml-4 cursor-pointer focus:ring-0'
                    placeholder="Start Date"
                    showIcon
                    icon={() => <i className='pi pi-angle-down' />} />
                <Calendar
                    value={date2 as any}
                    onChange={(e) => setDate2(e.value as any)}
                    dateFormat="dd/mm/yy"
                    inputClassName='p-inputtext-sm border-none rounded-none ml-4 cursor-pointer focus:ring-0'
                    showIcon
                    placeholder='End Date'
                    icon={() => <i className='pi pi-angle-down' />} />
                <Dropdown value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.value)}
                    options={locationOptions}
                    placeholder="Location"
                    className="p-inputtext-sm border-none ml-4 focus:ring-0"
                    itemTemplate={itemTemplate} />
                <Dropdown value={selectedTraffic}
                    onChange={(e) => setSelectedTraffic(e.value)}
                    options={trafficOptions}
                    placeholder="Type"
                    className="p-inputtext-sm border-none ml-4 focus:ring-0"
                    itemTemplate={itemTemplate} />
            </div>
            <div className="flex items-center bg-white border p-2 ">
                <button onClick={handleSearch} className='border bg-green-500 px-4 py-2.5 rounded-lg text-white hover:bg-green-600'>
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white' className='size-6'>
                        <path fillRule='evenodd' d='M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z' clipRule='evenodd' />
                    </svg>
                </button>
            </div>
        </div>
    );

    const [payloadState] = useState<any>({ date: "", lane: "", dataType: "" });
    const { data, isLoading } = useKecManual(payloadState);

    useEffect(() => {
        if (data) {
            const overall = data?.overallTotals || {};
            setProducts(data?.laneData || []);
            setAllData(overall);
            setSummaryTotal(overall.totalAmount || 0);
            setTodaysDate(data?.date || "");
        }
    }, [data]);

    return (
        <div className="ml-4">
            <Toolbar className="rounded-none border-none p-0 bg-background"
                left={leftToolbarTemplate}
                right={rightToolbarTemplate} />

            {totalSummary}

            <div className="card">
                <DataTable
                    ref={dt}
                    value={products}
                    selection={selectedProducts}
                    onSelectionChange={(e: any) => setSelectedProducts(e.value)}
                    dataKey="paymentMethod"
                    rows={12}
                    header={filterSearchForm}
                    showGridlines
                    emptyMessage="No data found!"
                    loading={isLoading || loading}
                    headerColumnGroup={headerGroup}
                    footerColumnGroup={footerGroup}
                    scrollable
                    scrollHeight="600px"
                >
                    <Column field="paymentMethod" />
                    <Column field="trailer5xl" />
                    <Column field="trailer4xl" />
                    <Column field="trailer3xl" />
                    <Column field="medium_truck9" />
                    <Column field="medium_truck8" />
                    <Column field="mini_truck" />
                    <Column field="big_bus" />
                    <Column field="medium_bus" />
                    <Column field="mini_bus" />
                    <Column field="micro_bus" />
                    <Column field="pickup" />
                    <Column field="car" />
                    <Column field="bike" />
                    <Column field="total" />
                </DataTable>
            </div>

            {/* Upload Dialog */}
            <Dialog visible={bulkDialog} style={{ width: "42rem" }} header="Upload Bulk Data" modal footer={productDialogFooter2} onHide={hideDialog2}>
                <div className="grid grid-cols-2 gap-6">
                    <div><label className="font-bold">Date</label><Calendar value={formDate as any} onChange={(e) => setFormDate(e.value as any)} dateFormat="dd/mm/yy" className="w-full" /></div>
                    <div><label className="font-bold">Location</label><Dropdown value={bulkLocation} onChange={(e) => setBulkLocation(e.value)} options={locationOptions.filter(x => x.value !== 'All')} className="w-full" /></div>
                    <div className="col-span-2"><input type="file" accept=".xlsx" onChange={handleFileChange} className="mt-3 w-full border p-2" />{uploadStatus && <p className={uploadStatus.includes("success") ? "text-green-500" : "text-red-500"}>{uploadStatus}</p>}</div>
                </div>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog visible={deleteDialog} style={{ width: "42rem" }} header="Delete By Date & Location" modal footer={productDialogFooter3} onHide={hideDialog3}>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="font-bold block mb-2">Date</label>
                        <Calendar 
                            value={deleteDate as any} 
                            onChange={(e) => setDeleteDate(e.value as any)} 
                            dateFormat="dd/mm/yy" 
                            placeholder="Select Date" 
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="font-bold block mb-2">Location</label>
                        <Dropdown 
                            value={deleteLocation} 
                            onChange={(e) => setDeleteLocation(e.value)} 
                            options={locationOptions.filter(x => x.value !== 'All')} 
                            placeholder="Select Location"
                            className="w-full"
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}