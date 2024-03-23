"use client"
import {auth} from "../lib/firebase-config";
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { onAuthStateChanged } from 'firebase/auth'

// import { useDispatch, useSelector } from 'react-redux';

// import { useSelector, useDispatch } from 'react-redux';
// import { userChange } from '../redux/Features/CurrentUser/currentUser';

const ProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true); 
    const router = useRouter();
    const pathname = usePathname();
    // const dispatch = useDispatch();

    // const initState = useSelector((state) => state.createadvert);
    // console.log("Init State: ", initState);
    // const dispatch = useDispatch();

    useEffect(() => {
        // const func = async () => {
            onAuthStateChanged(auth, (user)=>{
                console.log("User Status Changed:", user);
                if (user == null){
                    // dispatch(userChange(''));
                    router.push('/Login')
                    localStorage.setItem('uid', 'null');
                    setLoading(false)
                    setTimeout(() => {setLoading(false)}, 3000)
                }
                else {
                    setLoading(false)
                }
                // else {
                //     // let value = user.uid;
                //     // console.log(value);
                    
                //     // dispatch(updateField({ field: 'advertName', value }));
                    
                //     if (pathname.startsWith("/Login") || pathname.startsWith("/Company/Signup")){
                //         router.push('/Company/Dashboard')                    
                //     }
                // }
            })
        // }
        // func();
    }, []);

    return (
        <div>
            {
                loading ? (
                    <button className="btn btn-square">
                        <span className="loading loading-spinner"></span>
                    </button>
                ) : (
                    <>{children}</>
                )
            }
        </div>  
    );
};

export default ProtectedRoute;