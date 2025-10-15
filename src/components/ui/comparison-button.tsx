import React from "react";

type TollButtonIconsProps = {
    selectedProducts?: any[];
    openNew: () => void;
    exportCSV: () => void;
    exportPDF: () => void;
    handlePrint: () => void;
    isGraphVisible: boolean;
};

const TollButtonIcons: React.FC<TollButtonIconsProps> = ({
    selectedProducts,
    openNew,
    exportCSV,
    exportPDF,
    handlePrint,
    isGraphVisible
}) => {
    // SVGs for buttons
    const VireGrahpIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 19 19" fill="none">
            <path d="M3.125 2.75V14.75C3.125 15.1478 3.28304 15.5294 3.56434 15.8107C3.84564 16.092 4.22718 16.25 4.625 16.25H16.625M6.125 12.5C6.5 11 7.25 7.25 9.125 7.25C10.625 7.25 10.625 9.5 12.125 9.5C14 9.5 15.5 5.75 15.875 4.25" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    );

    const Export = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 19 19" fill="none">
            <path d="M16.625 11.75V14.75C16.625 15.1642 16.4786 15.5178 16.1857 15.8107C15.8928 16.1036 15.5392 16.25 15.125 16.25H4.625C4.21079 16.25 3.85723 16.1036 3.56434 15.8107C3.27145 15.5178 3.125 15.1642 3.125 14.75V11.75" stroke="#0B1F8F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6.125 8L9.875 11.75L13.625 8" stroke="#0B1F8F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9.875 11.75V2.75" stroke="#0B1F8F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    );

   

    const PrintIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 19 19" fill="none">
            <path d="M5.07812 7.25V2H14.0781V7.25" stroke="#0B1F8F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M5.07812 14H3.57812C3.16391 14 2.81036 13.8536 2.51746 13.5607C2.22457 13.2678 2.07812 12.9142 2.07812 12.5V8.75C2.07812 8.33579 2.22457 7.98223 2.51746 7.68934C2.81036 7.39645 3.16391 7.25 3.57812 7.25H15.5781C15.9923 7.25 16.3459 7.39645 16.6388 7.68934C16.9317 7.98223 17.0781 8.33579 17.0781 8.75V12.5C17.0781 12.9142 16.9317 13.2678 16.6388 13.5607C16.3459 13.8536 15.9923 14 15.5781 14H14.0781" stroke="#0B1F8F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <rect x="5.07812" y="11" width="9" height="6" stroke="#0B1F8F" stroke-width="1.5" stroke-linejoin="round" />
        </svg>
    );


    return (
        <div className="flex space-x-2">
            <button
                className="flex items-center gap-2 bg-[#0B1F8F] text-white border border-[#E5E7EB] px-2 py-2 rounded-md font-semibold"
                onClick={openNew}
            >
                <VireGrahpIcon />
                 {isGraphVisible ? "Hide Graph" : "View Graph"}
            </button>

            <button
                className="flex items-center gap-2 bg-white text-[#0B1F8F] border border-[#E5E7EB]  px-2 py-2 rounded-md font-semibold"
                onClick={exportPDF}
            >
                <Export />
                Export PDF 
            </button>

            <button
                className={`flex items-center gap-2 text-[#0B1F8F] bg-white border border-[#E5E7EB] px-2 py-2 rounded-md font-semibold        
                    }`}
                onClick={exportCSV}
               
            >
                <Export />
                Export Excel 
            </button>

            <button
                className="flex items-center gap-2  border border-[#E5E7EB] bg-white text-[#0B1F8F] px-2 py-2 rounded-md font-semibold"
                onClick={handlePrint}
            >
                <PrintIcon />
                Print
            </button>


        </div>
    );
};

export default TollButtonIcons;
