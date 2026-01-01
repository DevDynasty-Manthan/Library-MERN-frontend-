// src/features/auth/adminApi.js
import apiClient from "../../services/apiClient";

export const getAllStudentUsers = async () => {
  try {
    const response = await apiClient.get('/admin/students/');
    return response.data;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

export const getAllPayments = async () => {
  try {
    const response = await apiClient.get('/admin/payments/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPlansAndSeatData = async () => {
  try {
    const response = await apiClient.get('/admin/seats/');
    return response.data;
  } catch (error) {
    throw error;
  }
};
