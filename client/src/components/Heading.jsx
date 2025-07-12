import React from 'react'

function Heading({children}) {
  return (
        <div className="relative text-center mt-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 border-b-3 border-purple-600 pb-2 ">
            {children}
          </h2>

          {/* Cubes on underline center */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-[5px] flex gap-2 items-center">
            <div className="w-2 h-2 bg-purple-600 rotate-45"></div>
            <div className="w-3 h-3 bg-purple-600 rotate-45"></div>
            <div className="w-2 h-2 bg-purple-600 rotate-45"></div>
          </div>
        </div>
  )
}

export default Heading