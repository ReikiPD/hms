import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10  mt-40 text-sm'>

        <div>
        <p className='text-xl font-medium mb-5'>Hospital Management System</p>
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>The primary goals of developing a Hospital Management System (HMS) are to enhance operational efficiency, improve patient care, and reduce administrative workloads.</p>
        </div>

        

        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>021 124784124</li>
            <li>rson@gmail.com</li>
            <li>Jl. Jambore No.1, RT.8/RW.7, Cibubur, Kec. Ciracas, Kota Jakarta Timur, Jawa Barat 13720</li>
          </ul>
        </div>

      </div>


    </div>
  )
}

export default Footer
