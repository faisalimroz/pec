import { twMerge } from 'tailwind-merge'

interface RefreshButtonProps {
  onClick: () => void
  className?: string
}

export default function RefreshButton({
  onClick,
  className,
}: RefreshButtonProps) {
  const baseClasses =
    'bg-white text-gray-800 border-gray-600 text-sm border-t border-l border-r px-4 py-3 rounded-t-md font-bold'

  return (
    <button
      className={twMerge(baseClasses, className)}
      onClick={onClick}
      type='button'
    >
      Refresh Page
    </button>
  )
}
