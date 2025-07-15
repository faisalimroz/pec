import pic from '@/assets/tollPic.png'

function LiveVideo() {
  return (
    <div className='w-full h-[790px] rounded-[12px] shadow-md'>
      {/* <img
        src={`${import.meta.env.VITE_VIDEO_URL}/api/frame/4`}
        alt='Live Stream'
        className='w-full h-full object-cover rounded-md'
      /> */}
      {/* <img src={pic} alt='' /> */}
      <div className='flex items-center justify-center h-full text-2xl font-bold uppercase bg-gray-200 rounded-md'>
        Live Preview is Not Available Right Now!
      </div>
    </div>
  )
}

export default LiveVideo
