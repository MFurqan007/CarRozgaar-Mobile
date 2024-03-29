"use client"
import React, {useState, useEffect} from 'react'
import Image from "next/image";

import CocaColaLogo from '../../../assets/CocaColaLogo.png'
import Link from 'next/link';
import MarketplaceCard from '@/components/MarketplaceCard';

import {db} from '../../../lib/firebase-config'
// import {storage} from '../../../lib/firebase_config'
import { collection, addDoc, query, where, getDocs, doc, getDoc  } from "firebase/firestore";

export default function Page() {
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        const fetchCampaigns = async () => {
          try {
            const querySnapshot = await getDocs(collection(db, 'Campaigns'));
            const campaignsArray = querySnapshot.docs.map(doc => ({
              id: doc.id, // Include document ID if you need to reference the document later
              ...doc.data()
            }));
            console.log(campaignsArray)
            setCampaigns(campaignsArray);
          } catch (error) {
            console.error("Error fetching campaigns:", error);
          }
        };
    
        fetchCampaigns();
    }, []);
  return (
    <div className='w-full flex flex-col gap-4'>
        {/* <div className='w-full h-auto px-4 flex items-end'>
            <p className='text-[28px] font-bold '>CarRozgaar</p>
            <p className='text-[16px] font-bold text-[#F54E4E]'>Marketplace</p>
            
        </div> */}
        <div className='w-full h-auto p-2'>
            {campaigns.map((item, index) => (
                <Link href={`/Marketplace/${item.id}`} key={index} className='mt-2'>            
                    <MarketplaceCard data={item}/>
                </Link>
            ))}
        </div>
    </div>
  )
}
