import { useState } from 'react'
import '../../styles/table-style.css'
import { TabView, TabPanel } from 'primereact/tabview'
import KecManualDaily from '../charts/kec-manual-graph-daily'
import KecManualDataGraphMonthly from '../charts/kec-manual-graph-monthly'

export function KecManualDataGraph() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className=''>
      <div className='ml-4'>
        <div className='flex items-center gap-3 '>
          <button
            onClick={() => setActiveIndex(0)}
            className={`w-[100px] h-[55px] text-lg font-semibold border-t border-r border-l rounded-t ${activeIndex === 0 ? 'bg-main text-white' : 'bg-white text-gray-800'}`}
          >
            Daily
          </button>

          <button
            onClick={() => setActiveIndex(1)}
            className={`w-[100px] h-[55px] text-lg font-semibold border-t border-r border-l rounded-t ${activeIndex === 1 ? 'bg-main text-white' : 'bg-white text-gray-800'}`}
          >
            Monthly
          </button>
        </div>

        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          {/* 1st tab  */}
          <TabPanel>
            <KecManualDaily />
          </TabPanel>

          {/* 2nd Tab  */}
          <TabPanel>
            <KecManualDataGraphMonthly />
          </TabPanel>
        </TabView>
      </div>
    </div>
  )
}
