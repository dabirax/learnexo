import { useMutation } from "@tanstack/react-query";
import { confirmSignUpOTPRequest, loginUserRequest, sendOTPToEmailRequest, signupUserRequest } from "./requests";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: loginUserRequest,
    mutationKey: ["loginRequest"],
  });
};

export const useSignupUserMutation = () => {
  return useMutation({
    mutationFn: signupUserRequest,
    mutationKey: ["signupRequest"],
  });
};


export const useConfirmOTPMutation = () => {
  return useMutation({
    mutationFn: confirmSignUpOTPRequest,
    mutationKey: ["confirmSignUpOTPRequest"],
  });
};

export const useSendOtpToEmailMutation = () => {
  return useMutation({
    mutationFn: sendOTPToEmailRequest,
    mutationKey: ["sendOTPToEmailRequest"],
  });
};