import React from "react";

type ButtonGroupWithIconsProps = {
  selectedProducts?: any[];
  openNew: () => void;
  exportCSV: () => void;

};

const ButtonGroup: React.FC<ButtonGroupWithIconsProps> = ({
  selectedProducts,
  openNew,
  exportCSV,
  
}) => {

  const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M17 8L12 3L7 8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 3V15" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  );

  const BulkUpload = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
  <path d="M3.5 9L3.5 5C3.5 4.46957 3.71071 3.96086 4.08579 3.58579C4.46086 3.21071 4.96957 3 5.5 3L19.5 3C20.0304 3 20.5391 3.21071 20.9142 3.58579C21.2893 3.96086 21.5 4.46957 21.5 5L21.5 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M17.5 14L12.5 9L7.5 14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12.5 9L12.5 21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  );

 

  

 
  return (
    <div className="flex space-x-2">
      <button
        className="flex items-center gap-2 bg-[#6F90AE] text-white border border-[#E2E8F0]  px-4 py-3 rounded-md font-bold"
        onClick={openNew}
      >
        <UploadIcon />
        Upload Document
      </button>

      <button
        className="flex items-center gap-2 bg-[#0B1F8F]  text-white border border-[#E2E8F0]  font-bold px-4 py-3 rounded-md"
        onClick={exportCSV}
      >
        <BulkUpload />
        Bulk Upload {selectedProducts?.length === 0 ? "" : `(${selectedProducts?.length})`}
      </button>

      
    </div>
  );
};

export default ButtonGroup;
