import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ServiceDetails() {
  return (
    <section className='w-full mx-auto mt-4 text-gray-900 bg-white p-4 rounded-xl shadow-lg space-y-6 ml-4'>
      <CardHeader className='border-b-2 border-gray-200 pb-4'>
        <CardTitle className='text-3xl font-extrabold'>
          Service Details
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6 text-lg leading-relaxed'>
        <p>
          Toll Collection activity, Intelligent Transport System (ITS)
          Operation, and Operation & Maintenance of N8 Project Service start
          date is the Contract Signing date and within 6 months' pre-operation
          period and with the inception of Operation and Maintenance period, the
          Service Provider will start Toll Collection from 01 July 2022 and for
          05 (Five) years.
        </p>
        <div className='bg-gray-50 p-6 rounded-lg shadow-inner'>
          <p className='font-bold'>The Services Include:</p>
          <p className='text-gray-700'>
            Scope of service includes but not limited to the following:
          </p>
          <ul className='list-disc pl-8 space-y-3'>
            <li>
              Operation and Management (O&M) of Electronic/Computerized Toll
              system.
            </li>
            <li>
              Collection of Toll Revenue by 32 booths from vehicles on the N8
              road (Jatrabari, Dhaka to Bhanga, Faridpur including Kadamtali
              link, Dhaka) and deposit the Toll Revenue to the nearest scheduled
              Bank, as instructed by the Employer for 5 (Five) Years.
            </li>
            <li>
              Electronic toll Collection System (ETC.) under RFID system which
              collects charges according to the type of vehicle recorded on the
              RFID tag attached to the vehicle.
            </li>
            <li>
              Supply of Vehicle Detector including two sets of 64 optical
              sensors that can accurately detect vehicles and hooks.
            </li>
            <li>
              Supply of ANPR system that can take a video by receiving a signal
              from a car detector, upload the recognized vehicle plate number to
              servers, manage and use it for review, and automatically displays
              the recognized vehicle plate number at the toll terminal in the
              toll booth.
            </li>
            <li>
              Supply of Vehicle Classification System on Manual Toll Collection
              System (TCS) lane that automatically classifies entering vehicles
              as per Govt. rules.
            </li>
            <li>
              Operation of Manual Toll Collection System (TCS) that collects
              charges by cash or prepaid card or automated RFID.
            </li>
            <li>
              Operation of Motorcycle/Rickshaw Van/Rickshaw/By-cycle/Pushed Cart
              only lane that detects the vehicle, not classify type of vehicle.
            </li>
            <li>Establishing Toll Plaza including Hardware and Software.</li>
            <li>
              Establishing Toll Plaza Monitoring Center at office of Additional
              Chief Engineer, RHD, Dhaka Zone including Hardware and Software
              which will act as Data Centre for this service.
            </li>
            <li>
              Establishing Hyper Converged Infrastructure (HCI) server for
              efficient use of computing resources.
            </li>
            <li>
              Ensure regular backup support for safe storage of all server data.
            </li>
            <li>
              Supply of all types of consumables including stationeries,
              cookeries, toiletries etc. for the operation and maintenance of
              Toll Plaza, as required.
            </li>
            <li>
              Establishing Software to clear charges in connection with clearing
              agencies (RFID issuers, smart card issuers).
            </li>
            <li>Technology Transfer and Institutional Training.</li>
            <li>
              Supply of web-based software developed using DBMS, and servers
              configured as centralized type and duplexed.
            </li>
            <li>
              Networking with authorities that manage vehicle number plate
              information for vehicle classification review processing.
            </li>
            <li>Operation of 6 (Six) Nos. of Weigh Scale at N8 Expressway.</li>
            <li>
              Supply of Vehicle Detection System (VDS), CCTV, Variable Message
              Sign (VMS), Lane Control Sign (LCS) to ensure Traffic Management,
              Safety, and Security support within the project area.
            </li>
            <li>Road & Bridge Routine Maintenance work including repairs.</li>
            <li>
              Submission of report(s) including inter alia daily report(s) which
              includes toll collection, revenue deposit etc. information to
              concerned Executive Engineer, Road and Highways Department (RHD).
            </li>
          </ul>
        </div>
      </CardContent>
    </section>
  )
}
