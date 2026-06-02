// components/ChangePasswordForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useChangePassword } from "./hooks/useChangePassword";
import {
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertTriangleIcon,
} from "@/components/icons";

interface ChangePasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ChangePasswordForm({
  onSuccess,
  onCancel,
}: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const { changePassword, isLoading, error, success, resetState } =
    useChangePassword();

  // Password validation
  const passwordRequirements = [
    { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
    {
      label: "At least one uppercase letter",
      test: (p: string) => /[A-Z]/.test(p),
    },
    {
      label: "At least one lowercase letter",
      test: (p: string) => /[a-z]/.test(p),
    },
    { label: "At least one number", test: (p: string) => /\d/.test(p) },
    {
      label: "At least one special character",
      test: (p: string) => /[@$!%*?&]/.test(p),
    },
  ];

  const isNewPasswordValid = passwordRequirements.every((req) =>
    req.test(newPassword),
  );
  const doPasswordsMatch =
    newPassword === confirmPassword && newPassword.length > 0;
  const isDifferentFromCurrent =
    newPassword !== currentPassword && newPassword.length > 0;

  const isFormValid =
    currentPassword.length > 0 &&
    isNewPasswordValid &&
    doPasswordsMatch &&
    isDifferentFromCurrent;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    const result = await changePassword({
      currentPassword,
      newPassword,
      confirmNewPassword: confirmPassword,
    });

    if (result.success && onSuccess) {
      setTimeout(() => onSuccess(), 3000);
    }
  };

  const handleClose = () => {
    resetState();
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    if (onCancel) onCancel();
  };

  const toggleShowPassword = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Success view
  if (success) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircleIcon className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Password Changed Successfully!
        </h3>
        <p className="text-gray-600 mb-4">
          Your password has been updated. You will be redirected to login in a
          few seconds.
        </p>
        <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
          <div
            className="bg-primary h-1 animate-progress-bar"
            style={{ width: "100%" }}
          />
        </div>
        <button
          onClick={handleClose}
          className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Current Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Password
        </label>
        <div className="relative">
          <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type={showPasswords.current ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            placeholder="Enter current password"
            required
          />
          <button
            type="button"
            onClick={() => toggleShowPassword("current")}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPasswords.current ? (
              <EyeOffIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* New Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          New Password
        </label>
        <div className="relative">
          <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type={showPasswords.new ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            placeholder="Enter new password"
            required
          />
          <button
            type="button"
            onClick={() => toggleShowPassword("new")}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPasswords.new ? (
              <EyeOffIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>

        {/* Password requirements */}
        {newPassword.length > 0 && (
          <div className="mt-3 space-y-1">
            <p className="text-xs font-medium text-gray-600">Requirements:</p>
            {passwordRequirements.map((req, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {req.test(newPassword) ? (
                  <CheckCircleIcon className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <XCircleIcon className="w-3.5 h-3.5 text-gray-300" />
                )}
                <span
                  className={`text-xs ${req.test(newPassword) ? "text-green-700" : "text-gray-500"}`}
                >
                  {req.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm New Password
        </label>
        <div className="relative">
          <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type={showPasswords.confirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:outline-none
              ${
                confirmPassword && !doPasswordsMatch
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary focus:border-primary"
              }`}
            placeholder="Confirm new password"
            required
          />
          <button
            type="button"
            onClick={() => toggleShowPassword("confirm")}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPasswords.confirm ? (
              <EyeOffIcon className="h-5 w-5 text-gray-400" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {confirmPassword && !doPasswordsMatch && (
          <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
        )}
        {confirmPassword &&
          !isDifferentFromCurrent &&
          newPassword.length > 0 && (
            <p className="mt-1 text-sm text-yellow-600">
              New password must be different from current password
            </p>
          )}
      </div>

      {/* Error Display */}
      {error && (
        <div
          className={`rounded-lg p-4 ${
            error.includes("rate") || error.includes("Too many")
              ? "bg-yellow-50 border border-yellow-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <div className="flex items-start gap-3">
            {error.includes("rate") ? (
              <AlertTriangleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
            ) : (
              <XCircleIcon className="w-5 h-5 text-red-600 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">
                {error.includes("rate") ? "Rate Limit Exceeded" : "Error"}
              </p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={handleClose}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className={`flex-1 px-4 py-2.5 rounded-lg text-white transition-colors
            ${
              isFormValid && !isLoading
                ? "bg-primary hover:bg-primary-dark cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Changing...</span>
            </div>
          ) : (
            "Change Password"
          )}
        </button>
      </div>
    </form>
  );
}