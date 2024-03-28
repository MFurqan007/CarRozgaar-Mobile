"use client"
import React from 'react'
import { useRouter} from 'next/navigation';
import Upload from '@/components/Upload';
  

export default function page() {
    const router = useRouter();
    
  return (
    <div className='flex flex-col gap-4'>
        <button 
            className='btn'
            onClick={() => router.push('./')}
        >Back</button>
        <Upload/>
    </div>
  )
}

