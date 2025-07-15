import { useState } from 'react'
import { Toolbar } from 'primereact/toolbar'
import '../../../../styles/table-style.css'
import { TabView, TabPanel } from 'primereact/tabview'
import AttendanceTable from './Attendance'
import AccessControlTable from './AccessControll'
import InternetTable from './Internet'
import TmcTable from './Tmc'
import VmsTable from './VmsScreen'
import TollTable from './TollSystem'
import BoothTable from './Booth'
import MiscellTable from './Miscellaneous'
import DailyCheckTable from './DailyCheck'

export default function ElectricityOM() {
  const [activeIndex, setActiveIndex] = useState(0)

  const leftToolbarTemplate = () => {
    return (
      <div className='flex flex-wrap items-center gap-3 mb-4'>
        <button
          onClick={() => setActiveIndex(0)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 0 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Generator
        </button>

        <button
          onClick={() => setActiveIndex(1)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 1 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Network
        </button>

        <button
          onClick={() => setActiveIndex(2)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 2 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Electrical Substation
        </button>

        <button
          onClick={() => setActiveIndex(3)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 3 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Access Control
        </button>

        <button
          onClick={() => setActiveIndex(4)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 4 ? 'bg-main' : 'bg-gray-600'}`}
        >
          TMC
        </button>

        {/* // VMS previously  */}
        <button
          onClick={() => setActiveIndex(5)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 5 ? 'bg-main' : 'bg-gray-600'}`}
        >
          ITS Pole
        </button>

        <button
          onClick={() => setActiveIndex(6)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 6 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Toll System
        </button>

        <button
          onClick={() => setActiveIndex(7)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 7 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Toll Plaza
        </button>

        <button
          onClick={() => setActiveIndex(8)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 8 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Miscellaneous
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
          {/* 1st Tab  */}
          <TabPanel>
            <DailyCheckTable />
          </TabPanel>

          {/* 2nd Tab  */}
          <TabPanel>
            <InternetTable />
          </TabPanel>

          {/* 3rd Tab  */}
          <TabPanel>
            <AccessControlTable />
          </TabPanel>

          {/* 4th Tab  */}
          <TabPanel>
            <AttendanceTable />
          </TabPanel>

          {/* 5th Tab  */}
          <TabPanel>
            <TmcTable />
          </TabPanel>

          {/* 6th Tab  */}
          <TabPanel>
            <VmsTable />
          </TabPanel>

          {/* 7th Tab  */}
          <TabPanel>
            <TollTable />
          </TabPanel>

          {/* 8th Tab  */}
          <TabPanel>
            <BoothTable />
          </TabPanel>

          {/* 9th Tab  */}
          <TabPanel>
            <MiscellTable />
          </TabPanel>
        </TabView>
      </div>
    </div>
  )
}
