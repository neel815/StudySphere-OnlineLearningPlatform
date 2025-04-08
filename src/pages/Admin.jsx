import { apiConnector } from '../services/apiconnector';
import { FaTrash } from "react-icons/fa";
import React from 'react';
import { useEffect,useState } from 'react';

const Admin = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [payment,setPayment]=useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        if (username === "admin" && password === "admin123") {
            alert("Login successful");
        } else {
            alert("Invalid credentials");
            return;
        }
        setLoggedIn(true);
    };

    const deletePayment=async(id)=>{
        console.log(id);
        let response = await apiConnector("POST","http://localhost:4000/api/v1/payment/deletePayments",{id});
        getPayment();
    }

    const getPayment = async () => {
        try {
            let response = await apiConnector("GET","http://localhost:4000/api/v1/payment/getPayments");
            console.log(response?.data?.data);
            setPayment(response?.data?.data || ["NOTHING"]);
        } catch (error) {
            console.error("Error fetching payments:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        getPayment();
    }, []);

    return (
        <div className='h-full w-full'>
            <h1 className="text-2xl text-center flex w-full justify-center mt-10 font-bold text-richblack-5">
                <div className='bg-richblack-700 w-[500px] rounded-md p-4'>Admin Dashboard</div>
            </h1>
            <div className="flex justify-center items-center mt-10">
                
                {loggedIn==false &&
                 (
                    <form>
                        <label className="block mb-2 text-sm font-medium text-richblack-5">
                            Username:
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
                            placeholder="Enter your username"
                        />
                        <label className="block mb-2 text-sm font-medium text-richblack-5">
                            Password:
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
                            placeholder="Enter your password"
                        />
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={(e) => handleLogin(e)}
                            type="submit"
                        >
                            Login as Admin
                        </button>
                    </form>
                 )
                 }
                
            </div>
            
            {loggedIn && (
                <div className="mt-10 mb-5 w-full h-full flex flex-col items-center gap-2 justify-center ">
                    {
                        payment.map((pay,index)=>
                        (
                            <div className='flex items-center gap-2 h-full '>
                                <div key={index} className='w-[430px] bg-richblack-700 text-richblack-5 flex flex-col gap-2 p-3 rounded-md'>
                                    <div>
                                        UPI ID :&nbsp;
                                        {pay.upiId}
                                    </div>
                                    <div className=''>
                                        Amount :&nbsp;
                                        {pay.amount}
                                    </div>
                                    <div>
                                        CourseDetails :&nbsp;
                                        {pay.course}
                                    </div>
                                </div>
                                <div className='bg-richblack-700 h-[110px] rounded-md justify-center flex cursor-pointer items-center w-14'
                                    onClick={()=>deletePayment(pay._id)}
                                >
                                    <FaTrash size={16} className='text-white'/>
                                </div>
                            </div>
                        )
                        )
                    }
                </div>
            )}
            <div className='flex justify-center items-center text-lg text-richblack-5'>
                {payment.length==0 && <div className=' bg-richblack-700 p-4 rounded-md'>NO TRANSACTIONS</div>}
            </div>
        </div>
      )
};

export default Admin;
