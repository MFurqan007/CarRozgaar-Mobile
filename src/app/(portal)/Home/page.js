"use client"

import React, {useEffect, useState} from 'react'
import Image from "next/image";

import PepsiLogo from '../../../assets/PepsiLogo.png'
import { MdAccountBalanceWallet } from "react-icons/md";
import Link from 'next/link';

import UploadVid from '@/components/UploadVid';

import { useSelector, useDispatch } from 'react-redux';

import {db} from '../../../lib/firebase-config'
import { useRouter} from 'next/navigation';
// import {storage} from '../../../lib/firebase_config'
import { collection, addDoc, query, where, getDocs, doc, getDoc  } from "firebase/firestore";

function Page() {
    const router = useRouter();
    const [userDriverData, setUserDriverData] = useState(null);
    const [userUploadVid, setUserUploadVid] = useState(true);
    const [vid, setVid] = useState(false);
    // const reduxUid = useSelector(state => state.currentuser.uid);

    // console.log("Home Redux: ", reduxUid)
    useEffect(() => {
        const fetchUserDriver = async () => {
          // Retrieve the uid from local storage
          const uid = localStorage.getItem('uid'); // Make sure 'uid' matches the key used when storing the uid
    
          if (!uid) {
            console.log("No UID found in local storage.");
            return;
          }
    
          try {
            // Reference to the specific document in the UserDrivers collection
            const docRef = doc(db, "UserDrivers", uid);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
              console.log("UserDriver Document Data:", docSnap.data());
              setUserDriverData(docSnap.data()); // Set the document data to state
            } else {
              console.log("No such document!");
              setUserDriverData(null); // Reset state if the document does not exist
            }
          } catch (error) {
            console.error("Error fetching UserDriver document:", error);
            setUserDriverData(null); // Reset state in case of an error
          }
        };
    
        fetchUserDriver();
      }, []);
      
      const closeVideo = () => {
        setVid(false); // This should hide the UploadVid component
      };
  return (
        <div className='w-full flex flex-col gap-6'>
            
            <div className='w-full h-auto p-2 flex items-center justify-between'>
                <div className='w-auto flex items-center gap-3'>
                    <div className="avatar">
                        <div className="w-[60px] rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            <img src={userDriverData && userDriverData.profilePictureUrl} />
                        </div>
                    </div>
                    <p className='text-[#F54E4E] font-semibold text-[24px]'>{userDriverData && userDriverData.name}</p>
                </div>
                <MdAccountBalanceWallet className='text-[32px] text-[rgb(94,18,18)]'/>
            </div>
            <div className='w-full h-auto flex flex-col gap-2 px-2 py-2'>
                <p className='text-[24px] text-[#F54E4E] font-bold'>{`Active Advert`}</p>
                <div className='w-full h-auto bg-[#FAC213] bg-opacity-20 py-6 px-4 flex rounded-[10px]'>
                    <div className='basis-[60%] flex flex-col gap-4'>
                        <p className='font-bold text-[18px]'>{`Pepsi Cola. Co`}</p>
                        <p className='text-[16px]'>{`AGS-941`}</p>
                    </div>
                    <div className='basis-[40%] flex justify-center items-center'>
                        <Image
                            src={PepsiLogo}
                        />
                    </div>
                </div>
            </div>
            <div className='w-full h-auto px-2 flex flex-col py-2 gap-2'>
                {userUploadVid &&
                    <>
                    
                        <div 
                            className='w-full h-auto bg-[#cccc32] p-4 rounded-[15px] flex flex-col'
                            onClick={() => router.push('Home/UploadVid')}
                        >
                            <p className='text-[white] font-[600] text-[20px]'>{`Upload Video`}</p>
                            <p className='text-[white] font-[200] text-[18px]'>{`Upload Video to access functionality`}</p>
                        </div>

                    </>                 
                }
                <div className='w-full h-auto bg-[#F54E4E] p-4 rounded-[15px] flex flex-col'>
                    <p className='text-[white] font-[600] text-[20px]'>{`Let's Start`}</p>
                    <p className='text-[white] font-[200] text-[18px]'>{`Earn while you roam on your every day commute.`}</p>
                </div>  
                <div className='w-full h-auto bg-[#5E1212] p-4 rounded-[15px] flex flex-col'>
                    <p className='text-[white] font-[600] text-[20px]'>{`HotSpots`}</p>
                    <p className='text-[white] font-[200] text-[18px]'>{`Roam through Hotspots to maximize your earnings.`}</p>
                </div>  
                <Link href={'/Marketplace'}>                
                    <div className='w-full h-auto bg-[#5E1212] p-4 rounded-[15px] flex flex-col'>
                        <p className='text-[white] font-[600] text-[20px]'>{`Go to MarketPlace`}</p>
                        <p className='text-[white] font-[200] text-[18px]'>{`Want to find a campaign that fits your choice?`}</p>
                    </div>  
                </Link>
            </div>

        </div>
  )
}

export default Page;
