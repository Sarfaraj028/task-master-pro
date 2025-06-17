import React from 'react'

function Button({children, onClick }) {
  return (
    <button 
        type='button'
        onClick={onClick}
        className={`bg-purple-600 hover:bg-purple-700 opacity-100 text-white mt-4 px-8 cursor-pointer py-2 rounded-lg transition duration-200`}
        >
        {children}
    </button>
  )
}

export default Button