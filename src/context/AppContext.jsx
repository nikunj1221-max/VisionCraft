
// import React, { useState } from 'react'
// import { createContext } from 'react'
// import { toast } from 'react-toastify';
// import axios from 'axios'
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// export const AppContext = createContext() 

//  const AppContextProvider  =(props)=>{
//      const [user ,setUser ] =useState(false);
//      const [showLogin,setShowLogin]= useState('false')
// /*     const [token ,setToken] = useState(localStorage.getItem('token'))
//      const [credit ,setCredit] =useState(false)
// */     const navigate = useNavigate()
//      const backendUrl =import.meta.env.VITE_BACKEND_URL
// /*      const loadCreditsData = async ()=>{
//         try{
//             const {data} = await axios.get(backendUrl + '/api/user/credits' , {
//                 headers:{token} 
//             })
//             if(data.success){
//                 setCredit(data.credits)
//                 setUser(data.user)
//             }
//         }catch(error){
//        toast.error(error.message)
//         }
//       }
// */
//     //   const generateImage = async (prompt)=>{
//     //         try{
//     //            const data =     await axios.post(backendUrl + '/api/image/generate-image' , {prompt} ,{headers: {token}})
//     //            if(data.success){
//     //             loadCreditsData();
//     //             return data.resultImage 
//     //            }
//     //            else{
//     //             toast.error(data.message)
//     //             loadCreditsData();
//     //             if(data.creditBalance ===0){
//     //                 navigate('/buy')
//     //             }
//     //            }
//     //         }catch(error){
                
//     //    toast.error(error.message)
//     //         }
//     //   }
// //     const generateImage = async (prompt) => {
// //   try {
// //     const response = await axios.post(
// //       backendUrl + '/api/image/generate-image',
// //       { prompt }
// //     );

// //     if (response.data.success) {
// //       return response.data.resultImage
// //     } else {
// //       toast.error(response.data.message)

// //       if (response.data.creditBalance === 0) {
// //         navigate('/buycredit');
// //       }
// //     }
// //   } catch (error) {
// //     toast.error(error.message);
// //   }
// // };
// const generateImage = async (prompt) => {

//   try {
// // console.log(import.meta.env.VITE_HF_TOKEN)
//    const generateImage = async (prompt) => {

//   try {

//     const response = await fetch(
//       "https://router.huggingface.co/fal-ai/fal-ai/flux/dev?_subdomain=queue",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${import.meta.env.VITE_HF_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           prompt: prompt,
//         }),
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Failed to generate image");
//     }

//     const blob = await response.blob();

//     const imageUrl = URL.createObjectURL(blob);

//     return imageUrl;

//   } catch (error) {
//     console.log(error);
//     toast.error("Image generation failed");
//   }
// };

//     console.log(response.data);
//  const base64Image = response.data.data[0].b64_json;

//     return `data:image/png;base64,${base64Image}`;

//     return response.data.data[0].url;

//   } catch (error) {
//     console.log(error);
//     toast.error("Image generation failed");
//   }
// };

//        const logout=()=>{
//         // logout disabled while auth is commented out
//        }

//     const value = {
//         user ,setUser ,logout ,showLogin ,setShowLogin  ,backendUrl ,generateImage
//     }


//     return(
//         <AppContext.Provider value ={value}>
//             {props.children}
//         </AppContext.Provider>
//     )
//  }


// export default AppContextProvider

import React, { useState, useEffect } from 'react'
import { createContext } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const [user, setUser] = useState(false)
    const [showLogin, setShowLogin] = useState(false)

    const navigate = useNavigate()

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    // ================= GENERATE IMAGE =================

    // const generateImage = async (prompt) => {

    //     try {

    //         const response = await fetch(
    //             "https://router.huggingface.co/fal-ai/fal-ai/flux/dev?_subdomain=queue",
    //             {
    //                 method: "POST",
    //                 headers: {
    //                     Authorization: `Bearer ${import.meta.env.VITE_HF_TOKEN}`,
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({
    //                     prompt: prompt,
    //                 }),
    //             }
    //         )

    //         if (!response.ok) {
    //             throw new Error("Failed to generate image")
    //         }

    //         const blob = await response.blob()

    //         const imageUrl = URL.createObjectURL(blob)

    //         return imageUrl

    //     } catch (error) {

    //         console.log(error)

    //         toast.error("Image generation failed")
    //     }
    // }
const generateImage = async (prompt) => {

    try {

        const response = await fetch(
            "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_HF_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    inputs: prompt,
                }),
            }
        )

        if (!response.ok) {
            throw new Error("Failed to generate image")
        }

        const blob = await response.blob()

        const imageUrl = URL.createObjectURL(blob)

        return imageUrl

    } catch (error) {

        console.log(error)

        toast.error("Image generation failed")
    }
}
    // ================= LOGOUT =================

    const logout = () => {
        // logout disabled
    }

    // ================= CONTEXT VALUE =================

    const value = {
        user,
        setUser,
        logout,
        showLogin,
        setShowLogin,
        backendUrl,
        generateImage
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider