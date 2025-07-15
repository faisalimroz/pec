import { useState } from 'react'
import { Toolbar } from 'primereact/toolbar'
import '../../../../styles/table-style.css'
import { TabView, TabPanel } from 'primereact/tabview'
import AccidentReportTable from '../accident-report-table'
import AccidentZoneTable from '../accident-zone-table'
import AccidentInfograph from '../accident-infograph'
import AccidentList from '../accident-list'

export default function Analysis() {
  const [activeIndex, setActiveIndex] = useState(0)

  const leftToolbarTemplate = () => {
    return (
      <div className='flex items-center gap-3 mb-4'>

        <button
          onClick={() => setActiveIndex(0)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 0 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Accident Zone
        </button>

        <button
          onClick={() => setActiveIndex(1)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 1 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Accident Record
        </button>

        <button
          onClick={() => setActiveIndex(2)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 2 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Accident Infograph
        </button>
        <button
          onClick={() => setActiveIndex(3)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 3 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Accident List
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

          {/* 2nd Tab  */}
          <TabPanel>
            <AccidentZoneTable />
          </TabPanel>
          
          {/* 1st tab  */}
          <TabPanel>
            <AccidentReportTable />
          </TabPanel>

          

          {/* 3rd Tab  */}
          <TabPanel>
            <AccidentInfograph />
          </TabPanel>
          {/* 3rd Tab  */}
          <TabPanel>
            <AccidentList/>
          </TabPanel>
        </TabView>
      </div>
    </div>
  )
}
