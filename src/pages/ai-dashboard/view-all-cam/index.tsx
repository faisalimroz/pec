import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowRight, LayoutDashboard } from 'lucide-react'
import Logo from '@/assets/ai-assets/logo.png'

export default function ViewAllCam() {
  return (
    <>
      <div className='p-3 flex gap-2 justify-between items-center'>
        <div>
          <img className='w-[214px] h-[24px]' src={Logo} alt='' />
        </div>

        <div className='flex gap-4'>
          <Link
            to='/dashboard'
            className='text-blue-700 bg-blue-50  font-semibold py-1.5 px-4 rounded-full inline-flex items-center hover:bg-blue-400 hover:text-white text-sm'
          >
            <i className='pi pi-arrow-left mr-2' /> Home
          </Link>

          <Button
            variant='secondary'
            className='rounded-full border text-blue-800'
          >
            <Link to='/ai-dashboard' className='flex items-center'>
              <LayoutDashboard className='mr-2 h-4 w-4' /> AI Dashboard
            </Link>
          </Button>
        </div>
      </div>
      <hr />
      <div className='flex justify-center my-3'>
        <Link
          reloadDocument
          to='/ai-dashboard/view-last-six-frames'
          className='text-blue-700 bg-blue-50  font-semibold py-1.5 px-4 rounded-full inline-flex items-center hover:bg-blue-400 hover:text-white text-xl'
        >
          View Last 6 Frames <ArrowRight className='ml-2' />
        </Link>
      </div>
      <section className='grid grid-cols-3 gap-3 p-4'>
        <div className='w-full h-[450px]'>
          <img
            src={`${import.meta.env.VITE_VIDEO_URL}/api/frame/1`}
            alt='Live Stream'
            className='w-full h-full object-cover rounded-md'
          />
        </div>
        <div className='w-full h-[450px]'>
          <img
            src={`${import.meta.env.VITE_VIDEO_URL}/api/frame/2`}
            alt='Live Stream'
            className='w-full h-full object-cover rounded-md'
          />
        </div>
        <div className='w-full h-[450px]'>
          <img
            src={`${import.meta.env.VITE_VIDEO_URL}/api/frame/3`}
            alt='Live Stream'
            className='w-full h-full object-cover rounded-md'
          />
        </div>
        <div className='w-full h-[450px]'>
          <img
            src={`${import.meta.env.VITE_VIDEO_URL}/api/frame/4`}
            alt='Live Stream'
            className='w-full h-full object-cover rounded-md'
          />
        </div>
        <div className='w-full h-[450px]'>
          <img
            src={`${import.meta.env.VITE_VIDEO_URL}/api/frame/5`}
            alt='Live Stream'
            className='w-full h-full object-cover rounded-md'
          />
        </div>
        <div className='w-full h-[450px]'>
          <img
            src={`${import.meta.env.VITE_VIDEO_URL}/api/frame/6`}
            alt='Live Stream'
            className='w-full h-full object-cover rounded-md'
          />
        </div>
      </section>
    </>
  )
}
