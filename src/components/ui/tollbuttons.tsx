import React from "react";

type TollGroupWithIconsProps = {
  selectedProducts?: any[];
  openNew: () => void;
   bulkUpload: () => void;
 
};

const TollGroupWithIcons: React.FC<TollGroupWithIconsProps> = ({
  selectedProducts,
  openNew,
   bulkUpload,

 
}) => {
  // SVGs for buttons
  const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 29 28" fill="none">
  <path d="M4 7H6.33333H25" stroke="#FF4141" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M22.6654 7.00065V23.334C22.6654 23.9528 22.4195 24.5463 21.9819 24.9839C21.5444 25.4215 20.9509 25.6673 20.332 25.6673H8.66536C8.04653 25.6673 7.45303 25.4215 7.01545 24.9839C6.57786 24.5463 6.33203 23.9528 6.33203 23.334V7.00065M9.83203 7.00065V4.66732C9.83203 4.04848 10.0779 3.45499 10.5154 3.0174C10.953 2.57982 11.5465 2.33398 12.1654 2.33398H16.832C17.4509 2.33398 18.0444 2.57982 18.4819 3.0174C18.9195 3.45499 19.1654 4.04848 19.1654 4.66732V7.00065" stroke="#FF4141" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12.168 12.834V19.834" stroke="#FF4141" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16.832 12.834V19.834" stroke="#FF4141" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  );

  const BulkUpload = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 25 24" fill="none">
  <path d="M3.5 9L3.5 5C3.5 4.46957 3.71071 3.96086 4.08579 3.58579C4.46086 3.21071 4.96957 3 5.5 3L19.5 3C20.0304 3 20.5391 3.21071 20.9142 3.58579C21.2893 3.96086 21.5 4.46957 21.5 5L21.5 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M17.5 14L12.5 9L7.5 14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12.5 9L12.5 21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  );

  const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
  <path d="M12 2V6" stroke="#0B1F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 18V22" stroke="#0B1F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4.92969 4.92969L7.75969 7.75969" stroke="#0B1F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16.2383 16.2402L19.0683 19.0702" stroke="#0B1F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M2 12H6" stroke="#0B1F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M18 12H22" stroke="#0B1F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M4.92969 19.0702L7.75969 16.2402" stroke="#0B1F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16.2383 7.75969L19.0683 4.92969" stroke="#0B1F8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  );

 
  return (
    <div className="flex space-x-2 mb-2">
      <button
        className="flex items-center gap-2 bg-[#0B1F8F] text-white border border-[#E2E8F0]  text-sm h-[40px] px-2 rounded-md font-bold"
        onClick={openNew}
      >
        <EditIcon />
      Delete Data
      </button>

      <button
        className="flex items-center gap-2 bg-[#0B1F8F]  text-white border border-[#E2E8F0]  font-bold  text-sm h-[40px] px-2 rounded-md"
        onClick={ bulkUpload}
      >
        <BulkUpload />
        Bulk Upload
      </button>

     

     

      
    </div>
  );
};

export default TollGroupWithIcons;
