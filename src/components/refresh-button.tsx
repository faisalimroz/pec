// import { twMerge } from 'tailwind-merge'

// interface RefreshButtonProps {
//   onClick: () => void
//   className?: string
// }

// export default function RefreshButton({
//   onClick,
//   className,
// }: RefreshButtonProps) {
//   const baseClasses =
//     'bg-white text-gray-800 border-gray-600 text-sm border-t border-l border-r px-4 py-3 rounded-t-md font-bold'

//   return (
//     <button
//       className={twMerge(baseClasses, className)}
//       onClick={onClick}
//       type='button'
//     >
//       Refresh Page
//     </button>
//   )
// }
import React from "react";

type ButtonGroupWithIconsProps = {

  handleReset: () => void; 
};

const Refresh: React.FC<ButtonGroupWithIconsProps> = ({
 
  handleReset,
}) => {

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
    <div className="ml-2">
      <button
        className="flex items-center gap-2  border border-[#E2E8F0]  bg-white text-[#0B1F8F] text-sm h-[30px] px-2 rounded-md font-bold mb-1"
        onClick={handleReset}
      >
        <RefreshIcon />
        Refresh
      </button>
    </div>
  );
};

export default Refresh;
