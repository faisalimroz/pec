import { AlertCircle, RefreshCcw, Users, HandshakeIcon } from 'lucide-react'

export default function AboutKec() {
  const visionItems = [
    {
      title: 'Safe and Convenient',
      description: 'The values expressway users are supposed to experience',
    },
    {
      title: 'Future Mobility',
      description: 'The novel and innovative services by advanced technology',
    },
    {
      title: 'Platform Corporation',
      description: 'The platform for combining multi modal services with ICT',
    },
  ]

  const coreValues = [
    {
      icon: AlertCircle,
      title: 'Safety',
      description: 'Forgiving Expressway for all road users',
      color: 'text-blue-600',
    },
    {
      icon: RefreshCcw,
      title: 'Innovation',
      description: 'Proactive challenge to future issues',
      color: 'text-orange-600',
    },
    {
      icon: Users,
      title: 'Consensus',
      description: 'Improving social values as a public company',
      color: 'text-purple-500',
    },
    {
      icon: HandshakeIcon,
      title: 'Trust',
      description: 'Fair and transparent administration with responsibility',
      color: 'text-green-500',
    },
  ]
  return (
    <section className='max-w-4xl mx-auto p-6 space-y-12'>
      {/* Company Description */}
      <div className='bg-gray-100 p-6 rounded-lg space-y-4'>
        <p className='text-gray-800 leading-relaxed'>
          KEC has performed O&M services Worldwide. Our O&M technology has
          significantly advanced as Korea experiences various types of weather
          conditions such as typhoons, flooding, and snowstorm. KEC has been
          managing expressways with state-of-the-art O&M such as preventive
          management (pavement, disaster, road structure, safety, congestion of
          traffic, etc.) under the ITS (Intelligent Transport System) & IT
          (Information Technology) system.
        </p>
      </div>

      {/* Mission Section */}
      <div className='space-y-2'>
        <h2 className='text-lg font-semibold flex items-center gap-2'>
          <span className='w-2 h-2 bg-red-600'></span>
          Mission
        </h2>
        <div className='bg-blue-50 p-6 rounded-lg'>
          <p className='text-gray-800'>
            We open up <span className='font-semibold'>roads</span>, connecting{' '}
            <span className='font-semibold'>people</span> and{' '}
            <span className='font-semibold'>cultures</span>, and moving to a{' '}
            <span className='font-semibold'>new world</span>.
          </p>
        </div>
      </div>

      {/* Vision 2030 Section */}
      <div className='space-y-4'>
        <h2 className='text-lg font-semibold flex items-center gap-2'>
          <span className='w-2 h-2 bg-red-600'></span>
          Vision 2030
        </h2>
        <div className='bg-white rounded-lg p-6 border'>
          <h3 className='text-center mb-6 text-lg'>
            A corporation providing a safe and convenient platform for future
            mobility
          </h3>
          <div className='space-y-4'>
            {visionItems.map((item, index) => (
              <div key={index} className='flex gap-4 items-center'>
                <div className='bg-gray-600 text-white px-4 py-2 rounded-md text-sm min-w-[180px]'>
                  {item.title}
                </div>{' '}
                -<p className='text-gray-600 text-base'>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className='space-y-4'>
        <h2 className='text-lg font-semibold flex items-center gap-2'>
          <span className='w-2 h-2 bg-red-600'></span>
          Core Value
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          {coreValues.map((value, index) => (
            <div
              key={index}
              className='flex flex-col items-center text-center space-y-3'
            >
              <div className='relative'>
                <div className='w-24 h-24 rounded-full border-2 border-gray-200 flex items-center justify-center'>
                  <value.icon className={`w-12 h-12 ${value.color}`} />
                </div>
              </div>
              <h3 className='font-semibold text-gray-800'>{value.title}</h3>
              <p className='text-sm text-gray-600'>{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Us  */}
      <div className='bg-gray-100 p-6 rounded-lg space-y-4'>
        <h2 className='text-lg font-semibold text-center'>Contact Us</h2>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='text-sm font-bold text-gray-600 text-nowrap'>Country Office:</p>
            <p className='text-sm text-gray-600'>
              Dhaka, Bangladesh Liaison Office: Rangs FC2 Square, Apt.-9B,
              Plot-6A, Road/Avenue-32, Gulshan 2, Dhaka-1212
            </p>
          </div>

          {/* <div className='flex items-start gap-2'> */}
            
            <div className='ms-8D'>
              <p className='text-sm font-bold text-gray-600 text-nowrap'>
                Project Office:
              </p>
              <p className='text-sm text-gray-600'>
                1. Dhaleshwari Toll Plaza, Keraniganj, Munshiganj.
              </p>
              <p className='text-sm text-gray-600'>
                2. Bhanga Toll Plaza, Bhanga, Faridpur.
              </p>
            </div>
          {/* </div> */}

          <div className='flex flex-col md:flex-row gap-4'>
            <div>
              <p className='text-sm font-bold text-gray-600 text-nowrap'>
              Head Office:
              </p>
              <p className='text-sm text-gray-600'>
                77, Hyeoksin 8-ro, Gimcheon-si, Gyeongsangbuk-do,
                Korea
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
