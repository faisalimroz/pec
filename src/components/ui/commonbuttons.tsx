<div className='space-x-2'>
    <button
        className='bg-white text-gray-800 border-gray-600 border-t border-l border-r px-4 py-3 rounded-t-md font-bold'
        onClick={openNew}
    >
        Upload Document
    </button>
    <button
        className='bg-gray-600 text-white border-gray-600 border-t border-l border-r font-bold px-4 py-3 rounded-t-md'
        onClick={exportCSV}
    >
        Download Files{' '}
        {selectedProducts?.length === 0
            ? '(All)'
            : `(${selectedProducts?.length})`}
    </button>
    <button
        onClick={confirmDeleteSelected}
        disabled={!selectedProducts || selectedProducts.length === 0}
        className={`py-3 px-4 text-base font-semibold text-white rounded-t-md ${selectedProducts && selectedProducts.length > 0
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-gray-400 cursor-not-allowed'
            }`}
    >
        Delete Selected ({selectedProducts?.length || 0})
    </button>
</div>