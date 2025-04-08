import React, { useState, useEffect } from "react"
import { simulation } from "../../../data/simulation"
import { RxCross2 } from "react-icons/rx"

export default function SimulationSelector({ isOpen, onClose, onSelect }) {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [modalPosition, setModalPosition] = useState(0)

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY
      setModalPosition(scrollY)
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
    } else {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, modalPosition)
    }
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, modalPosition)
    }
  }, [isOpen])

  // Get unique categories
  const categories = [...new Set(simulation.map((sim) => sim.category))]

  // Filter simulations based on category and search query
  const filteredSimulations = simulation.filter((sim) => {
    const matchesCategory = !selectedCategory || sim.category === selectedCategory
    const matchesSearch = sim.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[1001] !mt-0 grid place-items-center overflow-auto bg-black/20 backdrop-blur-lg"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div 
        className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800/90"
      >
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            Select Simulation
          </p>
          <button 
            onClick={onClose}
            className="text-richblack-5 hover:text-yellow-50"
          >
            <RxCross2 className="text-2xl" />
          </button>
        </div>

        <div className="p-6">
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search simulations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-style w-full !bg-richblack-700 !p-3 !text-richblack-5"
              autoFocus
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm ${
                !selectedCategory
                  ? "bg-yellow-50 text-black"
                  : "bg-richblack-700 text-richblack-50 hover:bg-richblack-600"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedCategory === category
                    ? "bg-yellow-50 text-black"
                    : "bg-richblack-700 text-richblack-50 hover:bg-richblack-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Simulations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2">
            {filteredSimulations.map((sim) => (
              <button
                key={sim.id}
                onClick={() => {
                  onSelect(sim.iframeSrc)
                  onClose()
                }}
                className="flex flex-col items-center p-4 rounded-lg bg-richblack-700 hover:bg-richblack-600 transition-all duration-200"
              >
                <img
                  src={sim.image}
                  alt={sim.name}
                  className="w-full h-32 object-cover rounded-md mb-2"
                  loading="lazy"
                />
                <p className="text-sm text-richblack-5 text-center">
                  {sim.name}
                </p>
                <p className="text-xs text-richblack-300 mt-1">
                  {sim.category}
                </p>
              </button>
            ))}
          </div>

          {filteredSimulations.length === 0 && (
            <p className="text-center text-richblack-400 mt-4">
              No simulations found matching your criteria
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-x-4 p-6 bg-richblack-700 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium bg-richblack-300 text-richblack-900 rounded-md hover:bg-richblack-200"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium bg-yellow-50 text-black rounded-md hover:bg-yellow-100"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
} 