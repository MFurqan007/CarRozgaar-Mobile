"use client"
import React from 'react'
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { RxHamburgerMenu } from "react-icons/rx";

import {auth} from "../lib/firebase-config";
import { getAuth, signOut } from 'firebase/auth';

// import { useSelector, useDispatch } from 'react-redux';
// import { userChange } from '../redux/Features/CurrentUser/currentUser';

export default function MobileMod() {
  const pathname = usePathname();
  const router = useRouter();
  // const dispatch = useDispatch();

  const logout = async () => {
    // const auth = getAuth();

    signOut(auth).then(() => {
        // Sign-out successful.
        // dispatch(userChange(''));

        localStorage.setItem('uid', 'null');
        alert('User signed out.')

        router.push('/Login'); // Redirect to login page or home page as needed
    }).catch((error) => {
        // An error happened.
        console.error('Sign out error', error);
    });
  };

  const ModalTab = {
    card: {
      active: 'w-full h-auto py-2 flex justify-center items-center bg-[#5E1212]',
      inactive: 'w-full h-auto py-2 flex justify-center items-center hover:bg-[#f5a7a7]',
    },
    text: {
      active: 'text-[18px] font-semibold text-[white]',
      inactive: 'text-[18px] font-medium',
    }
  }
  return (
    <>    
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button 
        className="btn btn-circle " 
        onClick={()=>document.getElementById('my_modal_5').showModal()}
      >
        <RxHamburgerMenu className='text-[20px]'/>
      </button>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>

          <div className='mt-4 w-full h-auto '>
            <Link href={"/Home"}>
              <div className={pathname.startsWith("/Home")? ModalTab.card.active: ModalTab.card.inactive} >
                <p className={pathname.startsWith("/Home")? ModalTab.text.active: ModalTab.text.inactive}>Home</p>
              </div>
            </Link>

            <Link href={"/Marketplace"}>
              <div className={pathname.startsWith("/Marketplace")? ModalTab.card.active: ModalTab.card.inactive} >
                <p className={pathname.startsWith("/Marketplace")? ModalTab.text.active: ModalTab.text.inactive}>Marketplace</p>
              </div>
            </Link>

            <Link href={"/Token"}>
              <div className={pathname.startsWith("/Token")? ModalTab.card.active: ModalTab.card.inactive} >
                <p className={pathname.startsWith("/Token")? ModalTab.text.active: ModalTab.text.inactive}>Token</p>
              </div>
            </Link>

            <Link href={"/Wallet"}>
              <div className={pathname.startsWith("/Wallet")? ModalTab.card.active: ModalTab.card.inactive} >
                <p className={pathname.startsWith("/Wallet")? ModalTab.text.active: ModalTab.text.inactive}>Wallet</p>
              </div>
            </Link>

            <Link href={"/Map"}>
              <div className={pathname.startsWith("/Map")? ModalTab.card.active: ModalTab.card.inactive} >
                <p className={pathname.startsWith("/Map")? ModalTab.text.active: ModalTab.text.inactive}>Map</p>
              </div>
            </Link>

            <div 
              className={ModalTab.card.inactive} 
              onClick={logout}
            >
              <p className={ModalTab.text.inactive}>Logout</p>
            </div>

          </div>
        </div>
      </dialog>
    </>
  )
}
