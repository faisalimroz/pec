import React from "react";

type TollGroupWithIconsProps = {
  selectedProducts?: any[];
  openNew: () => void;
   bulkUpload: () => void;
  handleReset: () => void; 
};

const TollGroupWithIcons: React.FC<TollGroupWithIconsProps> = ({
  selectedProducts,
  openNew,
   bulkUpload,

  handleReset,
}) => {
  // SVGs for buttons
  const EditIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M12 2.99632H5C4.46957 2.99632 3.96086 3.20703 3.58579 3.58211C3.21071 3.95718 3 4.46589 3 4.99632V18.9963C3 19.5268 3.21071 20.0355 3.58579 20.4105C3.96086 20.7856 4.46957 20.9963 5 20.9963H19C19.5304 20.9963 20.0391 20.7856 20.4142 20.4105C20.7893 20.0355 21 19.5268 21 18.9963V11.9963M18.375 2.62132C18.7728 2.2235 19.3124 2 19.875 2C20.4376 2 20.9772 2.2235 21.375 2.62132C21.7728 3.01914 21.9963 3.55871 21.9963 4.12132C21.9963 4.68393 21.7728 5.2235 21.375 5.62132L12.362 14.6353C12.1245 14.8726 11.8312 15.0462 11.509 15.1403L8.636 15.9803C8.54995 16.0054 8.45874 16.0069 8.37191 15.9847C8.28508 15.9624 8.20583 15.9173 8.14245 15.8539C8.07907 15.7905 8.03389 15.7112 8.01164 15.6244C7.9894 15.5376 7.9909 15.4464 8.016 15.3603L8.856 12.4873C8.95053 12.1654 9.12453 11.8724 9.362 11.6353L18.375 2.62132Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  );

  const BulkUpload = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
  <path d="M3.5 9L3.5 5C3.5 4.46957 3.71071 3.96086 4.08579 3.58579C4.46086 3.21071 4.96957 3 5.5 3L19.5 3C20.0304 3 20.5391 3.21071 20.9142 3.58579C21.2893 3.96086 21.5 4.46957 21.5 5L21.5 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M17.5 14L12.5 9L7.5 14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12.5 9L12.5 21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  );

  const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
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
    <div className="flex space-x-2">
      <button
        className="flex items-center gap-2 bg-[#0B1F8F] text-white border border-[#E2E8F0]  px-4 py-3 rounded-md font-bold"
        onClick={openNew}
      >
        <EditIcon />
        Edit Data
      </button>

      <button
        className="flex items-center gap-2 bg-[#0B1F8F]  text-white border border-[#E2E8F0]  font-bold px-4 py-3 rounded-md"
        onClick={ bulkUpload}
      >
        <BulkUpload />
        Bulk Upload
      </button>

     

      <button
        className="flex items-center gap-2  border border-[#E2E8F0]  bg-white text-[#0B1F8F] px-4 py-3 rounded-md font-bold"
        onClick={handleReset}
      >
        <RefreshIcon />
        Refresh
      </button>

      
    </div>
  );
};

export default TollGroupWithIcons;
