import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";


const {COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API} = studentEndpoints;

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        }
        script.onerror= () =>{
            resolve(false);
        }
        document.body.appendChild(script);
    })
}


export async function buyCourse(token, courses, userDetails, navigate, dispatch, temp) {
    const toastId = toast.loading("Loading...");
    try{ 
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if(!res) {
            toast.error("RazorPay SDK failed to load");
            return;
        }
        
        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API, 
                                {courses, temp},
                                {
                                    Authorization: `Bearer ${token}`,
                                })
        if(!orderResponse.data.success) {
            throw new Error(orderResponse.data.message);
        }
        let orderData = orderResponse?.data?.data;
        const coinsUsed = orderResponse?.data?.coinsUsed || 0;

        if(orderData) {
            const options = {
                key: "rzp_test_enf1roWX85wGIA",
                currency: orderData.currency,
                amount: orderData.amount,
                order_id: orderData.id,
                name: "StudyNotion",
                description: "Thank You for Purchasing the Course",
                image: rzpLogo,
                prefill: {
                  name: userDetails?.firstName || "Guest",
                  email: userDetails?.email || "guest@example.com"
                },
                handler: function(response) {
                  sendPaymentSuccessEmail(response, orderData.amount, token);
                  verifyPayment({ ...response, courses, coinsUsed }, token, navigate, dispatch);
                }
              };
              console.log(options);
            
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
            paymentObject.on("payment.failed", function(response) {
                toast.error("oops, payment failed");
                console.log(response.error);
            })
        }
        else {
            try{
                await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
                    orderId: 54643523,
                    paymentId: 543323242,
                    orderData,
                },{
                    Authorization: `Bearer ${token}`
                })
            }
            catch(error) {
            }

            const toastId = toast.loading("Verifying Payment....");
            dispatch(setPaymentLoading(true));
            try{
                toast.success("payment Successful, you are added to the course");
                navigate("/dashboard/enrolled-courses");
                dispatch(resetCart());
            }   
            catch(error) {
                console.log("PAYMENT VERIFY ERROR....", error);
                toast.error("Could not verify Payment");
            }
            toast.dismiss(toastId);
            dispatch(setPaymentLoading(false));
        }

    }
    catch(error) {
        console.log("PAYMENT API ERROR.....", error);
        toast.error("Could not make Payment");
    }
    toast.dismiss(toastId);
}

async function sendPaymentSuccessEmail(response, amount, token) {
    try{
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount,
        },{
            Authorization: `Bearer ${token}`
        })
    }
    catch(error) {
        console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
    }
}

//verify payment
async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment....");
    dispatch(setPaymentLoading(true));
    try{
        const response  = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
            Authorization:`Bearer ${token}`,
        })

        if(!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.success("payment Successful, you are addded to the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    }   
    catch(error) {
        console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify Payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}