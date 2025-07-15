import bdGov from '@/assets/bg-gov.png'
import kecLogo from '@/assets/ex-logo.png'
import rhdLogo from '@/assets/rhd-logo.png'

const ContractDocument = () => {
  return (
    <div className='max-w-4xl mx-auto p-4 bg-white'>
      {/* Logo Container */}
      <div className='flex justify-center items-center gap-8 my-16'>
        <div className='w-28 h-28'>
          <img
            src={bdGov}
            alt='Government of Bangladesh Logo'
            className='w-full h-full object-contain'
          />
        </div>
        <div className='w-28 h-28'>
          <img
            src={rhdLogo}
            alt='Government of Bangladesh Logo'
            className='w-full h-full object-contain'
          />
        </div>
        <div className='w-32 h-32'>
          <img
            src={kecLogo}
            alt='Korea Expressway Corporation Logo'
            className='w-full h-full object-contain'
          />
        </div>
      </div>

      {/* Document Title Section */}
      <div className='text-center space-y-3 mb-8'>
        <h1 className='font-bold text-lg uppercase'>
          GOVERNMENT OF THE PEOPLE'S REPUBLIC OF BANGLADESH
        </h1>
        <p className='font-bold uppercase'>
          MINISTRY OF ROAD TRANSPORT AND BRIDGES
        </p>
        <p className='font-bold uppercase'>
          ROAD TRANSPORT AND HIGHWAY DIVISION
        </p>
        <p className='font-bold uppercase'>ROADS AND HIGHWAYS DEPARTMENT</p>
      </div>

      {/* Contract Title */}
      <div className='text-center space-y-4 mb-16'>
        <h2 className='font-bold text-2xl uppercase'>CONTRACT DOCUMENT FOR</h2>
        {/* <p className='text-lg font-semibold'>for</p> */}
      </div>

      {/* Service Description */}
      <div className='text-center mb-16'>
        <p className='text-lg leading-relaxed'>
          Service Provider for "Toll Collection activity, Intelligent Transport
          System (ITS) Operation and Operation & Maintenance of N8 Expressway
          under Road Division, Munshigonj for 05(Five) years"
        </p>
      </div>

      {/* Between Section */}
      <div className='text-center text-lg space-y-2 mb-8'>
        <p className='font-bold text-base italic'>Between</p>
        <p className='font-bold'>Roads and Highways Department (RHD)</p>
        <p className='font-bold'>&</p>
        <p className='font-bold'>Korea Expressway Corporation (KEC)</p>
      </div>

      {/* Association Text */}
      <div className='text-center italic mb-16'>
        <p>in association with S-Traffic Co., Ltd, Korea</p>
        <p>and Tele Tell Communications, Bangladesh</p>
      </div>

      <div className='text-center space-y-2'>
        <p className='font-semibold'>Name Of The Service</p>
        <p>
          "Toll Collection activity, Intelligent Transport System (ITS)
          Operation and Operation & Maintenance of Dhaka- Mawa- Bhanga
          Expressway under Road Division, Munshigonj for 05(Five) years" with
          Operation of 20 Nos. TCS System, 8 Nos. additional TCS System. 4 Nos.
          ETC. System, 6 Nos. Weigh Scale including maintenance of toll plaza.
          The N8 Expressway (Jatrabari to Bhanga including Kadamtali link) is
          55km with 4 interchanges and 36 bridges. Huge numbers of vehicles ply
          the roads every day. The objective of the service is Operation and
          Management of Road & Bridge, ITS and web based real-time Modern
          Electronic/ Computerized Toll Collection System by 32 booths along
          with 8 (eight) weigh scales and ITS operation for 5 (five) years.
        </p>
      </div>
    </div>
  )
}

export default ContractDocument
