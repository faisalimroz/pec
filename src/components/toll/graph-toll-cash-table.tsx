import { useState } from 'react'
import '../../styles/table-style.css'
import { TabView, TabPanel } from 'primereact/tabview'
import TrafficOfTollPlazaChart from '../charts/traffic-toll-plaza-chart'
import TollOfTollPlazaChart from '../charts/toll-of-toll-chart'

export default function RhdBillDetails() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className=''>
      <div className='ml-4'>
        <div className='flex items-center gap-3 '>
          <button
            onClick={() => setActiveIndex(0)}
            className={`w-[100px] h-[55px] text-lg font-semibold border-t border-r border-l rounded-t ${activeIndex === 0 ? 'bg-main text-white' : 'bg-white text-gray-800'}`}
          >
            Traffic
          </button>

          <button
            onClick={() => setActiveIndex(1)}
            className={`w-[100px] h-[55px] text-lg font-semibold border-t border-r border-l rounded-t ${activeIndex === 1 ? 'bg-main text-white' : 'bg-white text-gray-800'}`}
          >
            Toll
          </button>
        </div>

        <TabView
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          {/* 1st tab  */}
          <TabPanel>
            <TrafficOfTollPlazaChart />
          </TabPanel>

          {/* 2nd Tab  */}
          <TabPanel>
            <TollOfTollPlazaChart />
          </TabPanel>
        </TabView>
      </div>
    </div>
  )
}
