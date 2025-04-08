import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, signUp } from "../services/operations/authAPI";
import { useNavigate } from "react-router-dom";

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const { signupData, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
  }, []);

  const handleVerifyAndSignup = (e) => {
    e.preventDefault();
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      userType,
    } = signupData;

    dispatch(
      signUp(
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        userType,
        otp,
        navigate
      )
    );
  };

  const renderInput = (inputProps, index) => {
    return (
      <input
        {...inputProps}
        onPaste={(e) => {
          e.preventDefault();
          const pastedData = e.clipboardData.getData('text');
          if (pastedData.length === 6 && /^\d+$/.test(pastedData)) {
            setOtp(pastedData);
          }
        }}
      />
    );
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
      <div className="w-11/12 max-w-[450px] p-8 rounded-lg">
        <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5 text-center">
          Verify your email
        </h1>
        <p className="mt-4 text-[1.125rem] leading-[1.625rem] text-richblack-100 text-center">
          A verification code has been sent to you. Enter the code below
        </p>
        <form onSubmit={handleVerifyAndSignup} className="mt-8">
          <div className="flex flex-col items-center gap-y-4">
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={renderInput}
              containerStyle={{
                justifyContent: "center",
                gap: "12px",
              }}
              inputStyle={{
                width: "48px",
                height: "48px",
                borderRadius: "8px",
                backgroundColor: "#1E293B",
                color: "#FFFFFF",
                fontSize: "24px",
                fontWeight: "bold",
                border: "2px solid #334155",
                outline: "none",
                textAlign: "center",
                caretColor: "#FCD34D",
              }}
              focusStyle={{
                border: "2px solid #FCD34D",
                boxShadow: "0 0 0 2px rgba(252, 211, 77, 0.3)",
              }}
            />
            <button
              type="submit"
              className="mt-8 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
            >
              Verify Email
            </button>
          </div>
        </form>
        <div className="mt-6 flex items-center justify-between">
          <Link to="/login">
            <p className="flex items-center gap-x-2 text-richblack-5">
              <BiArrowBack /> Back to login
            </p>
          </Link>
          <button
            onClick={() => dispatch(sendOtp(signupData.email, navigate))}
            className="flex items-center gap-x-2 text-blue-100"
          >
            <RxCountdownTimer />
            Resend it
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;