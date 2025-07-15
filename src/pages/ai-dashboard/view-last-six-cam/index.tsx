import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, LayoutDashboard } from 'lucide-react'
import Logo from '@/assets/ai-assets/logo.png'

export default function ViewLastSixCam() {
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
          to='/ai-dashboard/view-first-six-frames'
          className='text-blue-700 bg-blue-50  font-semibold py-1.5 px-4 rounded-full inline-flex items-center hover:bg-blue-400 hover:text-white text-xl'
        >
          <ArrowLeft className='ml-2' /> View First 6 Frames
        </Link>
      </div>
      <section className='grid grid-cols-3 gap-3 p-4'>
        <div className='w-full h-[450px]'>
          <img
            src={`${import.meta.env.VITE_VIDEO_URL}/api/frame/7`}
            alt='Live Stream'
            className='w-full h-full object-cover rounded-md'
          />
        </div>
        <div className='w-full h-[450px]'>
          <img
            src={`${import.meta.env.VITE_VIDEO_URL}/api/frame/8`}
            alt='Live Stream'
            className='w-full h-full object-cover rounded-md'
          />
        </div>
        <div className='w-full h-[450px]'>
          <img
            src={`${import.meta.env.VITE_VIDEO_URL}/api/frame/9`}
            alt='Live Stream'
            className='w-full h-full object-cover rounded-md'
          />
        </div>
        <div className='w-full h-[450px]'>
          <img
            src={`${import.meta.env.VITE_VIDEO_URL}/api/frame/10`}
            alt='Live Stream'
            className='w-full h-full object-cover rounded-md'
          />
        </div>
        <div className='w-full h-[450px]'>
          <img
            src={`${import.meta.env.VITE_VIDEO_URL}/api/frame/11`}
            alt='Live Stream'
            className='w-full h-full object-cover rounded-md'
          />
        </div>
        <div className='w-full h-[450px]'>
          <img
            src={`${import.meta.env.VITE_VIDEO_URL}/api/frame/12`}
            alt='Live Stream'
            className='w-full h-full object-cover rounded-md'
          />
        </div>
      </section>
    </>
  )
}
