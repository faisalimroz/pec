import { useState } from 'react'
import { Toolbar } from 'primereact/toolbar'
import '../../../styles/table-style.css'
import { TabView, TabPanel } from 'primereact/tabview'
import BMDailyTable from './bm-daily-work'
import BMInspectionTable from './bm-inspection'
import BMWorkCompletionTable from './bm-work-completion'

export default function ItsMain() {
  const [activeIndex, setActiveIndex] = useState(0)

  const leftToolbarTemplate = () => {
    return (
      <div className='flex items-center gap-3 mb-4'>
        <button
          onClick={() => setActiveIndex(0)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 0 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Daily Work Report
        </button>

        <button
          onClick={() => setActiveIndex(1)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 1 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Inspection Report
        </button>

        <button
          onClick={() => setActiveIndex(2)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 2 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Work Completion Report
        </button>
      </div>
    )
  }

  return (
    <div className=''>
      <div className='ml-4'>
        <Toolbar
          className='rounded-none border-none p-0 bg-white'
          left={leftToolbarTemplate}
        ></Toolbar>

        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          {/* 1st tab  */}
          <TabPanel>
            <BMDailyTable />
          </TabPanel>

          {/* 2nd Tab  */}
          <TabPanel>
            <BMInspectionTable />
          </TabPanel>

          {/* 3rd Tab  */}
          <TabPanel>
            <BMWorkCompletionTable />
          </TabPanel>
        </TabView>
      </div>
    </div>
  )
}
