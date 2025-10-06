import { useState } from 'react'
import { Toolbar } from 'primereact/toolbar'
import '../../../../styles/table-style.css'
import { TabView, TabPanel } from 'primereact/tabview'
import MonthlyTable from './MonthlyReport'
import IncidentTable from './IncidentReport'
import YearlyTable from './YearlyReport'
import DailyCheckTable from './DailyReport'

export default function ElectricityOM() {
  const [activeIndex, setActiveIndex] = useState(0)

  const leftToolbarTemplate = () => {
    return (
      <div className='flex items-center gap-3'>
        <button
          onClick={() => setActiveIndex(0)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 0 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Daily Report
        </button>

        <button
          onClick={() => setActiveIndex(1)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 1 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Monthly Report
        </button>

        <button
          onClick={() => setActiveIndex(2)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 2 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Yearly Report
        </button>

        <button
          onClick={() => setActiveIndex(3)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 3 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Damage & Incident Report
        </button>
      </div>
    )
  }

  return (
    <div className=''>
      <div className='ml-4'>
        <Toolbar
          className='rounded-none border-none p-0 bg-backgournd'
          left={leftToolbarTemplate}
        ></Toolbar>

        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          <TabPanel>
            <DailyCheckTable />
          </TabPanel>

          {/* 1st tab  */}
          <TabPanel>
            <MonthlyTable />
          </TabPanel>

          {/* 2nd Tab  */}
          <TabPanel>
            <YearlyTable />
          </TabPanel>

          {/* 3rd Tab  */}
          <TabPanel>
            <IncidentTable />
          </TabPanel>

          {/* 4th tab  */}
        </TabView>
      </div>
    </div>
  )
}
