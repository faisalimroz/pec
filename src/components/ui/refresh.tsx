import React from "react";

type ButtonGroupWithIconsProps = {

  handleReset: () => void; 
};

const Refresh: React.FC<ButtonGroupWithIconsProps> = ({
 
  handleReset,
}) => {

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
    <div className="ml-2">
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

export default Refresh;
