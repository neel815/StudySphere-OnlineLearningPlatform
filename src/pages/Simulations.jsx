import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { simulation } from '../data/simulation';

const Simulations = () => {
  const location = useLocation();
  const [selectedSimulation, setSelectedSimulation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [iframeSrc, setIframeSrc] = useState('');

  const lastPart = location.pathname.split("/").pop().replace(/-/g, " ");
  const capitalized = lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
 
  const filteredSimulations = simulation.filter(sim => sim.category === capitalized); 
 
  const handleSimulationClick = (sim) => {
    setSelectedSimulation(sim);
    setLoading(true);

    setIframeSrc(sim.iframeSrc);

    setTimeout(() => {
      setLoading(false); 
    }, 4000);
  };

  return (
    <div className=''>
      <div className="box-content bg-richblack-800 px-4 mx-auto">
        <div className="mx-auto w-10/12 flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent">
          <p className="text-sm text-richblack-300">
            {`Home / Simulations / `}
            <span className="text-yellow-25">{capitalized}</span>
          </p>
          <p className="text-3xl text-richblack-5">{capitalized}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10 w-10/12 mx-auto">
        {filteredSimulations.map(sim => (
          <div 
            key={sim.id} 
            className="p-4 bg-richblack-800 rounded-lg cursor-pointer hover:bg-richblack-700 transition"
            onClick={() => handleSimulationClick(sim)}
          >
            <img src={sim.image} alt={sim.name} className="w-full h-40 object-cover rounded-md" />
            <p className="mt-2 text-richblack-5 text-lg">{sim.name}</p>
          </div>
        ))}
      </div>

      {selectedSimulation && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center"
          onClick={() => setSelectedSimulation(null)} // Close on clicking outside
        >
          <div 
            className="bg-richblack-900 p-6 rounded-lg w-[1000px] h-[700px] shadow-lg relative animate-fadeIn flex items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <button 
              className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
              onClick={() => setSelectedSimulation(null)}
            >
              X
            </button>
            
            {loading ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                <p className="text-white mt-4">Loading simulation...</p>
              </div>
            ) : (
              <iframe 
                src={iframeSrc} 
                width="950" 
                height="650" 
                allowFullScreen 
                className="border rounded-md"
                onLoad={() => setLoading(false)} 
              ></iframe>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Simulations;