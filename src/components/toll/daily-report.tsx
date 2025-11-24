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
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import RefreshButton from "@/components/refresh-button";
import { useAuth } from "@/provider/authProvider";
import TollGroupWithIcons from "../ui/tollbuttons";
import { IconField } from "primereact/iconfield";
import { InputText } from "primereact/inputtext";

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
    totalVehicles: number;
    totalAmount: number;
}

export default function VehicleDetectTollTable() {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const dt = useRef<DataTable<Product>>(null);

    const [date, setDate] = useState<string>("");
    const [date2, setDate2] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const [totalOverallVehicles, setTotalOverallVehicles] = useState<number>(0);
    const [totalTollCollection, setTotalTollCollection] = useState<number>(0);

    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [selectedTraffic, setSelectedTraffic] = useState<string | null>(null);

    // NEW: for bulk upload form
    const [bulkLocation, setBulkLocation] = useState<string | null>(null);
    const [bulkTraffic, setBulkTraffic] = useState<string | null>(null);

    const [allData, setAllData] = useState<any>({});
    const [searchKey, setSearchKey] = useState<string>("");

    const [bulkDialog, setBulkDialog] = useState(false);
    const [file, setFile] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState("");

    const [deleteDialog, setDeleteDialog] = useState(false);
    const [deleteDate, setDeleteDate] = useState("");
    const [loading2, setLoading2] = useState(false);
    const [formDate, setFormDate] = useState<string>("");
    const [todaysDate, setTodaysDate] = useState("");

    const { pathname } = useLocation();
    const showAll = pathname.startsWith("/edms");
    const { permissions } = useAuth();
    const tollManagerPermission = permissions.find(
        (p) => p.name === "toll-manager"
    );
    const tollPermission = tollManagerPermission?.children?.find(
        (child) => child.name === "toll-daily-report"
    );
    const hasEditAccess = tollPermission?.edit_authority === true && showAll;

    const itemTemplate = (option: { label: string; value: string }) => (
        <div className="flex items-center gap-2">
            <span>{option.label}</span>
        </div>
    );

    const locationOptions = [

        { label: "Mawa", value: "Mawa" },
        { label: "Jinjira", value: "Jinjira" },
    ];

    const trafficOptions = [
        { label: "Toll", value: "Toll" },
        { label: "Traffic", value: "Traffic" },
    ];

    // ---------- helpers ----------
    function formatDate(dateTime?: any) {
        if (!dateTime) return ''
        const date = new Date(dateTime)

        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()

        return `${day}-${month}-${year}`
    }

    const uploadFile = async () => {
        if (!file) {
            setUploadStatus("Please select a file first.");
            return;
        }
        if (!formDate) {
            setUploadStatus("Please select a date.");
            return;
        }
        if (!bulkLocation || bulkLocation === "All") {
            setUploadStatus("Please select a specific location.");
            return;
        }
        // if (!bulkTraffic) {
        //     setUploadStatus("Please select Toll / Traffic.");
        //     return;
        // }

        setUploading(true);

        const formData = new FormData();
        formData.append("date", formatDate(formDate));
        formData.append("location", bulkLocation);
        formData.append("dataType", bulkTraffic);
        formData.append("file", file);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/v1/toll/kecmanual/bulk_upload`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log(response.data);
            toast.success("File uploaded successfully!");
            setFile(null);
            setUploadStatus("");
            refetch();
            hideDialog2();
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.error("An error occurred while uploading. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const hideDialog2 = () => {
        setBulkDialog(false);
        setFile(null);
        setUploadStatus("");
        setFormDate("");
        setBulkLocation(null);
        setBulkTraffic(null);
    };

    const hideDialog3 = () => {
        setDeleteDialog(false);
        setDeleteDate("");
    };

    const openNew2 = () => setBulkDialog(true);
    const openNew3 = () => setDeleteDialog(true);

    const productDialogFooter2 = (
        <>
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-text"
                onClick={hideDialog2}
            />
            <Button
                label="Save"
                icon="pi pi-upload"
                className="p-button-text"
                onClick={uploadFile}
                disabled={!file || uploading}
            />
        </>
    );

    const deleteData = async () => {
        try {
            setLoading2(true);
            await axios.delete(
                `${import.meta.env.VITE_BASE_URL}/api/v1/toll/kecmanual/delete/using/date`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    data: {
                        date: formatDate(deleteDate),
                    },
                }
            );
            window.location.reload();
            toast.success("Data Deleted Successfully");
        } catch (error: any) {
            if (error.response) {
                const { message } = error.response.data;
                toast.error(message);
            } else {
                console.log(error);
            }
        } finally {
            setLoading2(false);
        }
        setDeleteDialog(false);
        setDeleteDate("");
    };

    const productDialogFooter3 = (
        <>
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-text"
                onClick={hideDialog3}
            />
            <Button
                label="Delete"
                icon="pi pi-trash"
                className="p-button-text"
                onClick={deleteData}
                disabled={!deleteDate || loading2}
            />
        </>
    );

    const handleFileChange = (e: { target: { files: any[] } }) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.name.endsWith(".xlsx")) {
            setFile(selectedFile);
            setUploadStatus("");
        } else {
            setFile(null);
            setUploadStatus("Please select a valid .xlsx file.");
        }
    };

    const leftToolbarTemplate = () => (
        <div className="">
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
                    openNew={openNew3}
                    bulkUpload={openNew2}
                />
            )}
            <div className="mb-1">
                <RefreshButton handleReset={handleReset} />
            </div>
        </>
    );

    const handleSearch = () => {
        setLoading(true);
        const payload = {
            date_range: date && date2 ? `${formatDate(date)} to ${formatDate(date2)}` : '',
            lane: selectedLocation || "",
            dataType: selectedTraffic || "",
        };

        searchKecManual(payload).then((result) => {
            setProducts(result?.laneData || []);
            setTotalOverallVehicles(result?.overallTotals?.totalOverallVehicles || 0);
            setTotalTollCollection(result?.overallTotals?.totalOverallAmount || 0);
            setAllData(result?.overallTotals || {});
            setTodaysDate(result?.date || "");
            setLoading(false);
        });
    };

    const handleReset = () => {
        const payload = {
            date: "",
            lane: "",
            dataType: "",
        };

        setDate("");
        setDate2("");
        setSelectedTraffic(null);
        setSelectedLocation(null);

        searchKecManual(payload).then((result) => {
            setProducts(result?.laneData || []);
            setTotalOverallVehicles(result?.overallTotals?.totalOverallVehicles || 0);
            setTotalTollCollection(result?.overallTotals?.totalOverallAmount || 0);
            setAllData(result?.overallTotals || {});
            setTodaysDate(result?.date || "");
            setLoading(false);
        });
    };

    const filterSearchForm = (
        <div>
            <div className="flex flex-wrap justify-center ">
                {/* date + location + traffic */}
                <div className="flex w-fit gap-2 border p-2 rounded-md bg-white ">
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
                        options={locationOptions}
                        placeholder="Location"
                        itemTemplate={itemTemplate}
                        className="border-none rounded-none ml-4 cursor-pointer ring-0"
                    />

                    <Dropdown
                        value={selectedTraffic}
                        onChange={(e) => setSelectedTraffic(e.value)}
                        options={trafficOptions}
                        placeholder="Toll / Traffic"
                        itemTemplate={itemTemplate}
                        className="border-none rounded-none ml-4 cursor-pointer ring-0"
                    />
                </div>

                <div className="flex items-center bg-white border p-2"> 
                    <button
                        onClick={() => handleSearch()}
                       
                        className='border bg-green-500 px-4 py-2.5 rounded-lg cursor-pointer hover:bg-green-600 transition-colors'
                        type='submit'
                    >
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 24 24'
                            fill='white' // Ensure icon is white
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
            </div>

            <h1 className="text-center pt-10 text-xl font-bold text-[#000000]">
                Traffic Report
            </h1>
        </div>
    );

    const [payload, setPayload] = useState<any>({
        date: "",
        lane: "",
        dataType: "",
    });

    const { data, isLoading, error, refetch } = useKecManual(payload);

    useEffect(() => {
        if (data) {
            setProducts(data?.laneData || []);
            setTotalOverallVehicles(data?.overallTotals?.totalOverallVehicles || 0);
            setTotalTollCollection(data?.overallTotals?.totalOverallAmount || 0);
            setAllData(data?.overallTotals || {});
            setTodaysDate(data?.date || "");
        }
    }, [data]);

    const Dates = new Date().toLocaleDateString();

    const totalSummary = (
        <div className="font-bold flex justify-between items-center bg-gray-100 p-4 rounded ">
            <div>
                <span className="font-bold text-lg">Total: </span>{" "}
                {totalOverallVehicles}
            </div>
            <div>
                <span className="font-bold text-lg">Data Showing For Date:</span>{" "}
                {Dates}
            </div>
            {/* <div>
                <span className="font-bold text-lg">Total Toll Collection</span>{" "}
                {totalTollCollection}
            </div> */}
        </div>
    );

    const vehicleHeaderTemplate = (image: string, label: string) => (
        <div className="flex flex-col items-center">
            <img src={image} alt={label} className="mb-2" />
            <span className="text-xs">{label}</span>
        </div>
    );

    const headerGroup = (
        <ColumnGroup>
            <Row>
                <Column
                    header="Payment Method"
                    headerClassName="min-w-[10rem]"
                    rowSpan={2}
                    frozen
                />
                <Column
                    header={vehicleHeaderTemplate(trailer5axle, "Trailer (Above 4Axle)")}
                    headerClassName="min-w-[10rem]"
                />
                <Column
                    header={vehicleHeaderTemplate(trailer4axle, "Trailer (4Axle)")}
                    headerClassName="min-w-[10rem]"
                />
                <Column
                    header={vehicleHeaderTemplate(trailer3axle, "Trailer (3Axle)")}
                    headerClassName="min-w-[10rem]"
                />
                <Column
                    header={vehicleHeaderTemplate(
                        mediumTruck9,
                        "Medium Truck (8-11)"
                    )}
                    headerClassName="min-w-[10rem]"
                />
                <Column
                    header={vehicleHeaderTemplate(
                        mediumTruck8,
                        "Medium Truck (5-8)"
                    )}
                    headerClassName="min-w-[10rem]"
                />
                <Column
                    header={vehicleHeaderTemplate(miniTruck, "Mini Truck")}
                    headerClassName="min-w-[10rem]"
                />
                <Column
                    header={vehicleHeaderTemplate(bigBus, "Big Bus")}
                    headerClassName="min-w-[10rem]"
                />
                <Column
                    header={vehicleHeaderTemplate(meduiumBus, "Medium Bus")}
                    headerClassName="min-w-[10rem]"
                />
                <Column
                    header={vehicleHeaderTemplate(miniBus, "Mini Bus")}
                    headerClassName="min-w-[10rem]"
                />
                <Column
                    header={vehicleHeaderTemplate(microBus, "Micro Bus")}
                    headerClassName="min-w-[10rem]"
                />
                <Column
                    header={vehicleHeaderTemplate(pickUp, "Pickup")}
                    headerClassName="min-w-[10rem]"
                />
                <Column
                    header={vehicleHeaderTemplate(car, "Car/Jeep")}
                    headerClassName="min-w-[10rem]"
                />
                <Column
                    header={vehicleHeaderTemplate(bike, "Motorcycle")}
                    headerClassName="min-w-[10rem]"
                />

                <Column
                    header="Total."
                    headerClassName="min-w-[10rem]"
                    rowSpan={2}
                    frozen
                />
            </Row>
        </ColumnGroup>
    );

    const footerGroup = (
        <ColumnGroup>
            <Row>
                <Column
                    footer="Total"
                    colSpan={1}
                    footerStyle={{ textAlign: "right" }}
                />
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
                <Column footer={allData?.totalOverallVehicles ?? 0} />
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
                    <Column field="paymentMethod" frozen />
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
                    <Column field="totalVehicles" />
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
                footer={productDialogFooter2}
                onHide={hideDialog2}
            >
                <div className="grid grid-cols-2 items-center gap-6">
                    <div>
                        <label htmlFor="date" className="font-bold">
                            Date
                        </label>
                        <div className="border rounded-md">
                            <Calendar
                                id="date"
                                value={formDate as any}
                                onChange={(e) => setFormDate(e.value as string)}
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
                            options={locationOptions.filter((x) => x.value !== "All")}
                            placeholder="Select Location"
                            className="mt-2 w-full"
                        />
                    </div>

                    {/* <div>
                        <label className="font-bold">Toll / Traffic</label>
                        <Dropdown
                            value={bulkTraffic}
                            onChange={(e) => setBulkTraffic(e.value)}
                            options={trafficOptions}
                            placeholder="Select Type"
                            className="mt-2 w-full"
                        />
                    </div> */}

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
                        {uploadStatus && (
                            <p
                                className={
                                    uploadStatus.includes("success")
                                        ? "text-green-500"
                                        : "text-red-500"
                                }
                            >
                                {uploadStatus}
                            </p>
                        )}
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
                footer={productDialogFooter3}
                onHide={hideDialog3}
            >
                <div className="w-fit justify-center mx-auto gap-6">
                    <div>
                        <h1 className="font-bold text-center mb-2 text-xl">Date</h1>
                        <div className="border rounded-md">
                            <Calendar
                                id="date"
                                onChange={(e) => setDeleteDate(e.value as any)}
                                dateFormat="dd/mm/yy"
                                placeholder="Select Date"
                            />
                        </div>
                    </div>
                </div>
            </Dialog>

            <div className="px4 py-4 bg-white mt-5">
                <h1 className="text-center text-sm text-[#000000]">
                    Note: 3rd-2 Shift(00:00 to 06:00)/1st Shift(06:00 to 14:00)/2nd
                    Shift(14:00 to 22:00)/3rd-1 Shift(22:00 to 00:00)
                </h1>
            </div>
        </>
    );
}
