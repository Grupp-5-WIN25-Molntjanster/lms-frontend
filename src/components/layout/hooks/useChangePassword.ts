// hooks/useChangePassword.ts
import { useState } from "react";
import axios from "axios";

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export function useChangePassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const changePassword = async (data: ChangePasswordRequest) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // ✅ NOW USING API GATEWAY instead of direct auth service
      const API_GATEWAY_URL =
        process.env.NEXT_PUBLIC_API_GATEWAY_URL || "https://lms-api-gateway-gge8ghc9fgdmdkcp.polandcentral-01.azurewebsites.net";
      const token = localStorage.getItem("accessToken");

      console.log(
        `📡 Sending request to: ${API_GATEWAY_URL}/auth/Auth/change-password`,
      );

      const response = await axios.post(
        `${API_GATEWAY_URL}/auth/Auth/change-password`, // ← Through API Gateway!
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("✅ Password change response:", response.status);

      if (response.status === 200) {
        setSuccess(true);

        // Store success message
        localStorage.setItem(
          "passwordChangeMessage",
          response.data?.message || "Password changed successfully",
        );

        // Force re-login after 3 seconds
        setTimeout(() => {
          // Clear all auth data
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");

          // Redirect to login with success message
          window.location.href = "/sign-in?passwordChanged=true";
        }, 3000);

        return { success: true, data: response.data };
      }

      return { success: false, data: response.data };
    } catch (err: any) {
      console.error("❌ Password change error:", err);

      // Handle rate limiting from API Gateway (429)
      if (err.response?.status === 429) {
        setError("Too many attempts. Please wait before trying again.");
        return { success: false, error: "rate_limited" };
      }

      // Handle authentication errors (401)
      if (err.response?.status === 401) {
        setError("Your session has expired. Please log in again.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
        return { success: false, error: "unauthorized" };
      }

      // Handle validation errors (400)
      if (err.response?.data) {
        const apiError = err.response.data;

        if (apiError.details && apiError.details.length > 0) {
          setError(apiError.details.join(", "));
        } else if (apiError.message) {
          setError(apiError.message);
        } else if (apiError.error === "password_change_failed") {
          setError(apiError.message || "Failed to change password");
        } else {
          setError("Failed to change password. Please try again.");
        }
      } else if (err.code === "ECONNREFUSED") {
        setError(
          "Cannot connect to server. Please check if API Gateway is running.",
        );
      } else {
        setError("Network error. Please check your connection.");
      }

      return { success: false, error: err.response?.data };
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
    setIsLoading(false);
  };

  return {
    changePassword,
    isLoading,
    error,
    success,
    resetState,
  };
}