import SimulationSelector from "./SimulationSelector"

const AddCourse = () => {
  const [isSimulationSelectorOpen, setIsSimulationSelectorOpen] = useState(false)

  const handleSimulationSelect = (iframeSrc) => {
    setFormData((prev) => ({
      ...prev,
      simulationLink: iframeSrc,
    }))
  }

  return (
    <div className="text-white">
      {/* Simulation Link Input */}
      <div className="relative">
        <label className="text-sm text-richblack-5">Simulation Link</label>
        <div className="relative">
          <input
            id="simulationLink"
            name="simulationLink"
            value={formData.simulationLink}
            onChange={handleChange}
            placeholder="Enter Simulation iframe Link (optional)"
            className="form-style w-full !pr-24"
          />
          <button
            type="button"
            onClick={() => setIsSimulationSelectorOpen(true)}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex-shrink-0 text-[12px] px-3 py-1 bg-richblack-700 text-richblack-50 rounded-md hover:bg-richblack-600 transition-colors"
          >
            Browse
          </button>
        </div>
        <p className="text-xs text-richblack-400 mt-1">
          Add an interactive simulation iframe link from sources like PhET, etc.
        </p>
        <p className="text-xs text-richblack-400">
          Example: https://phet.colorado.edu/sims/html/buoyancy-basics/latest/buoyancy-basics_en.html
        </p>
      </div>

      {/* Simulation Selector Popup */}
      <SimulationSelector
        isOpen={isSimulationSelectorOpen}
        onClose={() => setIsSimulationSelectorOpen(false)}
        onSelect={handleSimulationSelect}
      />
    </div>
  )
}

export default AddCourse 