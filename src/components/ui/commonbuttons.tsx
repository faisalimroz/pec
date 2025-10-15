import React from "react";

type ButtonGroupWithIconsProps = {
  selectedProducts?: any[];
  openNew: () => void;
  exportCSV: () => void;
  confirmDeleteSelected: () => void;

};

const ButtonGroupWithIcons: React.FC<ButtonGroupWithIconsProps> = ({
  selectedProducts,
  openNew,
  exportCSV,
  confirmDeleteSelected,
 
}) => {
  // SVGs for buttons
  const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M17 8L12 3L7 8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 3V15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  );

  const BulkUpload = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M7 10L12 15L17 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 15V3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  );

  const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 29 28" fill="none">
  <path d="M4 7H6.33333H25" stroke="#FF4141" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M22.6654 7.00065V23.334C22.6654 23.9528 22.4195 24.5463 21.9819 24.9839C21.5444 25.4215 20.9509 25.6673 20.332 25.6673H8.66536C8.04653 25.6673 7.45303 25.4215 7.01545 24.9839C6.57786 24.5463 6.33203 23.9528 6.33203 23.334V7.00065M9.83203 7.00065V4.66732C9.83203 4.04848 10.0779 3.45499 10.5154 3.0174C10.953 2.57982 11.5465 2.33398 12.1654 2.33398H16.832C17.4509 2.33398 18.0444 2.57982 18.4819 3.0174C18.9195 3.45499 19.1654 4.04848 19.1654 4.66732V7.00065" stroke="#FF4141" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12.168 12.834V19.834" stroke="#FF4141" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16.832 12.834V19.834" stroke="#FF4141" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  );

  return (
    <div className="flex space-x-2 mb-1">
      <button
        className="flex items-center gap-2 bg-[#6F90AE] text-white border border-[#E2E8F0]  text-sm h-[40px] px-2 rounded-md font-bold"
        onClick={openNew}
      >
        <UploadIcon />
        Upload Document
      </button>

      <button
        className="flex items-center gap-2 bg-[#0B1F8F]  text-white border border-[#E2E8F0]  font-bold text-sm h-[40px] px-2 rounded-md"
        onClick={exportCSV}
      >
        <BulkUpload />
       Download Files{selectedProducts?.length === 0 ? "" : `(${selectedProducts?.length})`}
      </button>

      <button
        className={`flex items-center gap-2 text-sm h-[40px] px-2 text-[#FF4141] border border-[#F39A9C] font-semibold rounded-md ${
          selectedProducts && selectedProducts.length > 0
            ? "bg-[#FFDBDC]"
            : "bg-[#FFDBDC] cursor-not-allowed"
        }`}
        onClick={confirmDeleteSelected}
        disabled={!selectedProducts || selectedProducts.length === 0}
      >
        <DeleteIcon />
        Delete Selected ({selectedProducts?.length || 0})
      </button>

      {/* <button
        className="flex items-center gap-2  border border-[#E2E8F0]  bg-white text-[#0B1F8F] px-4 py-3 rounded-md font-bold"
        onClick={handleReset}
      >
        <RefreshIcon />
        Refresh
      </button> */}

      
    </div>
  );
};

export default ButtonGroupWithIcons;
