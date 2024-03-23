"use client"

import React, {useState, useEffect} from 'react'
import Image from "next/image";

import {db} from '../lib/firebase-config'
// import {storage} from '../../../lib/firebase_config'
import { collection, addDoc, query, where, getDocs, doc, getDoc  } from "firebase/firestore";

export default function MarketplaceCard({data}) {
    const [advertisementData, setAdvertisementData] = useState(null);
    useEffect(() => {
        const fetchAdvertisement = async () => {
        //   if (!companyId || !advertisementId) {
        //     console.log("Company ID or Advertisement ID not provided.");
        //     return;
        //   }
    
          try {
            // Constructing the path to the specific advertisement document
            const advertDocRef = doc(db, `CompanyUsers/${data.CompanyID}/Advertisements/${data.AdvertID}`);
            const advertDocSnap = await getDoc(advertDocRef);
    
            if (advertDocSnap.exists()) {
              console.log("Advertisement Document Data:", advertDocSnap.data());
              setAdvertisementData(advertDocSnap.data()); // Set the fetched data to state
            } else {
              console.log("No such advertisement document!");
              setAdvertisementData(null); // Handle the case where the document does not exist
            }
          } catch (error) {
            console.error("Error fetching advertisement document:", error);
            setAdvertisementData(null); // Handle any errors that occur during fetch
          }
        };
    
        fetchAdvertisement();
      }, [data]);
  return (
    <div>

        {advertisementData && (
    
            <div className='w-full h-auto flex p-3 rounded-[15px] bg-[white] shadow-[0px_20px_20px_10px_#00000024]'>
                <div className='basis-[65%] flex flex-col'>
                    <p className='text-[24px] font-bold'>{advertisementData.Name}</p>
                    <p className='text-[12px]'>{advertisementData.Tagline}</p>
                </div>
                <div className='basis-[35%] flex flex-col items-center'>
                    <img src={advertisementData.StickerURL} className='w-[150px] h-[50px] rounded-[10px]'/>
                    <p className='text-[20px] font-bold text-[#5CA302]'>{advertisementData.PerHour}/hr</p>
                </div>
            </div>
        )}
    </div>
  )
}
