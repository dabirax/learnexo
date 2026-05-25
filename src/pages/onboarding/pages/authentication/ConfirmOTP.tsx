// import React from 'react'
import HeaderText from "../../components/HeaderText";
import MainButton from "../../../../components/ui/MainButton";
import { useLocation, useNavigate } from "react-router-dom";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { confirmSignUpOTPRequest } from "@/utils/queries/auth";
import { toast } from "sonner";
import Spinner from "@/components/ui/Spinner";

const ConfirmOTP = () => {
  const location = useLocation();
  const { email } = location.state;
  console.log(email);
  const navigate = useNavigate();
  const [otpValue, setOtpValue] = useState<string>("");

  const {
    mutate: confirmOTPMutation,
    data: response,
    isPending,
    isError,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: confirmSignUpOTPRequest,
    mutationKey: ["confirmSignupOTPRequest"],
  });

  useEffect(() => {
    if (isError) {
      toast.error(error.message);
    }
  }, [isError, error]);

  if (isSuccess) {
    console.log(response);
    toast.success("OTP verified successfully");
    setTimeout(() => {
      navigate("../../test/personalandcontactinfo");
    }, 2000);
  }

  return (
    <div className="flex flex-col gap-12">
      <HeaderText
        title="Confirm OTP"
        description="Enter the OTP sent to your email to verify your signup status."
      />

      <InputOTP
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS}
        value={otpValue}
        onChange={(value) => setOtpValue(value)}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      <div className="flex flex-col gap-6">
        <MainButton
          onClick={() => {
            if (otpValue.length !== 6) {
              toast.error("Please enter a valid 6-digit OTP");
              return;
            }

            confirmOTPMutation({ otp: otpValue, email });
          }}
        >
          {isPending ? <Spinner /> : "Verify OTP"}
        </MainButton>
      </div>
    </div>
  );
};

export default ConfirmOTP;
