import React from 'react'

function NoPage() {
  return (
    <div className='w-full h-[90vh] flex flex-col justify-center items-center'>
      <h3 className='text-red-600 font-bold text-9xl'>404</h3>
      <p className='font-semibold text-xl mb-3'>Page Not Found!</p>
      <p>"Oops! We couldn't find the page you're looking for."</p>
    </div>
  )
}

export default NoPage