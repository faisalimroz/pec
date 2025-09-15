import React from 'react'

const Projectoverview = () => {
    return (
        <div className="min-h-screen p-2">
            <div className="w-full flex flex-col justify-center items-center bg-white rounded-lg p-2">
               
                {/* Header */}
                <div className="mb-2 pb-4 w-[80%]">
                    <h1 className="text-[38px] font-bold text-gray-600  text-center">Project Overview</h1>
                 
                </div>

                {/* Description */}
                <div className="mb-2 w-[80%]">
                    <p className="text-gray-700 mb-4 font-semibold text-center">
                        The Padma Bridge Maintenance Dashboard is a centralized digital platform designed to monitor and manage the structural health, traffic flow, environmental conditions, and maintenance activities of the Padma Bridge. It provides real-time data from vibration sensors, crack detectors, and weather monitoring systems to ensure the structural integrity of the bridge. Traffic analytics offer insights into daily vehicle counts, congestion patterns, and live CCTV feeds, enabling quick response to incidents. The dashboard also includes scheduled maintenance tasks, status updates, and team assignments, ensuring transparency and efficiency in operations. Alerts for anomalies—such as increased water levels or unusual vibrations—help proactively prevent damage. With integrated reporting and analytics, the system supports decision-making for engineers, safety supervisors, and government authorities overseeing the ongoing upkeep of this vital infrastructure.
                    </p>

                </div>

               
                <div className="mb-2 w-[70%]">
                  
                    <div className="border  overflow-hidden">
                        <table className="min-w-full border border-gray-300">
                            <tbody>
                                <tr>
                                    <td className="py-4 px-4 font-medium text-gray-700 border border-gray-300">
                                        Project Name
                                    </td>
                                    <td className="py-4 px-4 border border-gray-300">
                                        Padma Bridge Operation & Maintenance System
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-medium text-gray-700 border border-gray-300">
                                        Project Code
                                    </td>
                                    <td className="py-4 px-4 border border-gray-300">PBMMS-2025</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-medium text-gray-700 border border-gray-300">
                                        Start Date
                                    </td>
                                    <td className="py-4 px-4 border border-gray-300">Jan 1, 2025</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-medium text-gray-700 border border-gray-300">
                                        Status
                                    </td>
                                    <td className="py-4 px-4 border border-gray-300">Ongoing</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-medium text-gray-700 border border-gray-300">
                                        Managed By
                                    </td>
                                    <td className="py-4 px-4 border border-gray-300">
                                        Roads and Highways Department (RHD)
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-medium text-gray-700 border border-gray-300">
                                        Supervised By
                                    </td>
                                    <td className="py-4 px-4 border border-gray-300">
                                        Bangladesh Bridge Authority
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>

             
                <div className="  rounded-lg w-[80%]">
                    <p className="text-gray-700 mb-4 font-semibold text-center">
                        The Padma Bridge Maintenance Dashboard is a smart monitoring system that provides real-time updates on the bridge’s structural health, traffic flow, weather conditions, and maintenance activities. It helps engineers and authorities detect issues early, manage incidents, schedule repairs, and ensure the safety and longevity of the bridge through data-driven decision-making.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Projectoverview
