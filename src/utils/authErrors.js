export function getAuthErrorMessage(error) {
  const code = error?.code || "";
  const map = {
    "auth/invalid-credential": "Incorrect email or password. Please try again.",
    "auth/invalid-email": "That email address doesn't look right.",
    "auth/user-not-found": "No account found with that email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/email-already-in-use": "An account already exists with that email.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/too-many-requests":
      "Too many attempts. Please wait a moment and try again.",
    "auth/popup-closed-by-user": "Sign-in was cancelled.",
    "auth/invalid-phone-number":
      "That phone number doesn't look right. Include your country code.",
    "auth/invalid-verification-code":
      "That code is incorrect. Please check and try again.",
    "auth/code-expired": "That code has expired. Please request a new one.",
    "auth/network-request-failed":
      "Network error. Check your connection and try again.",
  };
  return map[code] || "Something went wrong. Please try again.";
}
