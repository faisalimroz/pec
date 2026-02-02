import { useState } from 'react'
import { Toolbar } from 'primereact/toolbar'
import '../../../../styles/table-style.css'
import { TabView, TabPanel } from 'primereact/tabview'
import StationaryTable from './Stationary'
import EquipmentTable from './Equipment'
import ToolTable from './Tool'
import SparePart from './SparePart'

export default function ElectricityMain() {
  const [activeIndex, setActiveIndex] = useState(0)

  const leftToolbarTemplate = () => {
    return (
      <div className='flex items-center gap-3 mb-4'>
        <button
          onClick={() => setActiveIndex(0)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 0 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Equipment
        </button>

        <button
          onClick={() => setActiveIndex(1)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 1 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Spare Parts
        </button>

        <button
          onClick={() => setActiveIndex(2)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 2 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Tools
        </button>
{/* 
        <button
          onClick={() => setActiveIndex(3)}
          className={`p-3 text-sm font-semibold border text-white rounded ${activeIndex === 3 ? 'bg-main' : 'bg-gray-600'}`}
        >
          Stationary
        </button> */}
      </div>
    )
  }

  // console.log(products)

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
          {/* 1st tab  */}
          <TabPanel>
            <EquipmentTable />
          </TabPanel>

          {/* 2nd Tab  */}
          <TabPanel>
            <SparePart />
          </TabPanel>

          {/* 3rd Tab  */}
          <TabPanel>
            <ToolTable />
          </TabPanel>

          {/* 4th Tab  */}
          {/* <TabPanel>
            <StationaryTable />
          </TabPanel> */}
        </TabView>
      </div>
    </div>
  )
}
