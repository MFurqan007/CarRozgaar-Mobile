"use client"
import React, {useState, useEffect} from 'react'
import Image from "next/image";

import CocaColaLogo from '../../../../assets/CocaColaLogo.png'

import { TbScanEye } from "react-icons/tb";
import { useParams } from 'next/navigation'

import { useRouter} from 'next/navigation';


import {db} from '../../../../lib/firebase-config'
// import {storage} from '../../../lib/firebase_config'
import { collection, addDoc, query, where, getDocs, doc, getDoc, serverTimestamp, updateDoc, arrayUnion  } from "firebase/firestore";

export default function Page() {
    const params = useParams()
    const router = useRouter();
    console.log("Params: ",params)
    const [isClicked, setIsClicked] = useState(false);
    const [campaignData, setCampaignData] = useState('');
    const [advData, setAdvData] = useState('');

    useEffect(() => {
      const getData = async () => {
        let cData;
        let aData; 
        try {
          // Reference to the campaign document
          const campaignRef = doc(db, 'Campaigns', params.slug);
          
          // Fetch the document
          const campaignSnap = await getDoc(campaignRef);
  
          if (campaignSnap.exists()) {
            console.log("Campaign Document Data:", campaignSnap.data());
            cData = campaignSnap.data();
            setCampaignData(campaignSnap.data()) // Update state with fetched data
          } else {
            console.log("No such campaign!");
            // setCampaignData(null); // Reset state if campaign doesn't exist
          }
  
          const advertDocRef = doc(db, `CompanyUsers/${cData.CompanyID}/Advertisements/${cData.AdvertID}`);
              
          // Fetch the document
          const advertDocSnap = await getDoc(advertDocRef);
  
          if (advertDocSnap.exists()) {
            console.log("Advertisement Document Data:", advertDocSnap.data());
            aData = advertDocSnap.data();
            setAdvData(advertDocSnap.data());
          } else {
            console.log("No such advertisement document!");
            // return null; // Indicates no document was found
          }
  
        } catch (error) {
          console.error("Error fetching campaign:", error);
          // setCampaignData(null); // Reset state in case of an error
        }
      };
      getData();
      // console.log( "Props Data: ", props.data)
    }, [])

    const handleRegister = async () => {
        setIsClicked(true);
        const uid = localStorage.getItem('uid');
        const campaignId = params.slug;

        // Retrieve the user's document from "UserDrivers" collection
        const userDocRef = doc(db, "UserDrivers", uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const activeAdverts = userData.activeAdverts || [];
          
          // Check the count of elements in the "activeAdverts" array
          if (activeAdverts.length >= 4) {
            alert("Cannot register in adverts more than 4 at a given time.");
            setIsClicked(false);
            return;
          }

          // Check if the user has already registered for a campaign from the same company
          if (activeAdverts.includes(campaignId)) {
            alert("Cannot register for the same company's campaign more than once.");
            setIsClicked(false);
            return;
          }
      
      
          // Proceed with registration
          const userCampaignDoc = {
            uid: uid,
            campaignId: campaignId,
            registrationDate: serverTimestamp(),
          };
      
          await addDoc(collection(db, "UserCampaigns"), userCampaignDoc);
      
          // Update the "activeAdverts" array for the user
          await updateDoc(userDocRef, {
            activeAdverts: arrayUnion(campaignId)
          });
      
          alert("Registration successful.");
        } else {
          alert("User document does not exist.");
        }
        setTimeout(() => setIsClicked(false), 2000); // Reset the pulse effect after 1 second
        
    };
  return (
    <div className='w-full flex flex-col gap-4'>

        <div className='w-full h-auto p-4 gap-8 flex flex-col justify-center items-center ' >
            <div className='w-full h-auto bg-[white] p-4 rounded-[15px] flex flex-col gap-2 items-center shadow-[0px_20px_20px_10px_#00000024]'>
                <img src={advData.StickerURL} className='w-[80%] h-[100px] rounded-[10px]'/>
                <div className='w-full flex justify-between items-center '>
                    <p className='text-[24px] font-bold'>{advData.Name}</p>
                    <p className='text-[20px] font-bold text-[#5CA302]'>{advData.PerHour} rs/hr</p>
                </div>
                <div className='w-full '>
                    <p className='text-[12px]'>{advData.Description}</p>
                </div>  
            </div>

            <div className='flex justify-between items-center p-2 w-full'>
                <div 
                  className='w-[60px] h-[40px] rounded-[10px] bg-[#5E1212] flex justify-center items-center'
                  onClick={() => router.push('./ViewModel')}
                >
                    <TbScanEye className='text-[34px] text-[#F54E4E]'/>
                </div>
                <button 
                  className="btn btn-wide bg-[#F54E4E] flex gap-4"
                  onClick={handleRegister}
                >
                  {
                    isClicked &&
                      <span className="loading loading-spinner text-white"></span>
                  }
                  <span className="text-[20px] font-[500] text-white">Register</span>
                </button>
            </div>
        </div>  

    </div>
  )
}
