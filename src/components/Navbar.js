import React from 'react'
import MobileMod from '../components/MobileMod'

export default function Navbar() {
  return (
        <div className='w-full h-auto px-4 flex justify-between items-center'>
            <p className='text-[28px] font-bold '>CarRozgaar</p>
            {/* This is an Open Modal Menu implement it at the end */}
            <MobileMod/> 
        </div>
  )
}
