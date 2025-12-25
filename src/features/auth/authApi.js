import apiClient from "../../services/apiClient";

export const registerUser =  async (userData)=>{
    try{
        const response = await apiClient.post('/onboarding/step1/register', userData);
        return response.data;
    }
    catch(error){
        throw error;
    }
}
export const loginUser =async (loginData)=>{
    try{
        const response = await apiClient.post('/users/login', loginData);
        return response.data;
    }
    catch(error){
        throw error;
    }
}

export const fillAdmissionDetails = async (admissionData)=>{
    try{
        const response = await apiClient.post('/onboarding/step2/admission', admissionData);
        return response.data;
    }
    catch(error){
        throw error;
    }
}
export const getAvailablePlans = async ()=>{
    try{
        const response = await apiClient.get('/plans');
        return response.data;
    }
    catch(error){
        throw error;
    }
}

export const selectPlan = async (planData)=>{
    try{
        const response = await apiClient.post('/onboarding/step3/plan', planData);
        return response.data;
    }
    catch(error){
        throw error;
    }
}

export const getSeats = async (planId)=>{
    try{
        console.log("Fetching seats for planId:", planId);
      const response  = await apiClient.get(`seats/available?planId=${planId}`);
      return response.data;
    }
    catch(error){
        throw error;
    }
}

export const selectSeat = async (seatData)=>{
    try{
        const response = await apiClient.post('/onboarding/step4/seat', seatData);
        return response.data;
    }
    catch(error){
        throw error;
    }
}

export const getSessionDetails = async ()=>{
    try{
        const response = await apiClient.get('/onboarding/status');
        return response.data;
    }
    catch(error){
        throw error;
    }
}

export const createOrder = async (paymentData)=>{
   try{
        const response  = await apiClient.post('/onboarding/step5/create-order', paymentData);
        return response.data;
   }
   catch(error){
    throw error;
   }
}

export const verifyPayment = async (verifyPaymentData)=>{
    try{
       const response  = await apiClient.post('/onboarding/step5/verify-payment', verifyPaymentData);
       return response.data;
    }
    catch(error){
        throw error;
    }
}