import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../firebase";
import { getAuthErrorMessage } from "../utils/authErrors";

const googleProvider = new GoogleAuthProvider();

export default function Auth() {
  const [mode, setMode] = useState("login"); // "login" | "signup" | "phone"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Phone auth state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaRef = useRef(null);
  const recaptchaVerifierRef = useRef(null);

  useEffect(() => {
    if (mode === "phone" && !recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        auth,
        recaptchaRef.current,
        {
          size: "invisible",
        },
      );
    }
  }, [mode]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await signInAnonymously(auth);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPhoneNumber(
        auth,
        phone,
        recaptchaVerifierRef.current,
      );
      setConfirmationResult(result);
      setOtpSent(true);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setOtpSent(false);
    setOtp("");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={mode + otpSent}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-white mb-1">
              {mode === "phone"
                ? "Sign in with phone"
                : mode === "login"
                  ? "Welcome back"
                  : "Create account"}
            </h2>
            <p className="text-neutral-400 text-sm mb-6">
              {mode === "phone"
                ? otpSent
                  ? "Enter the code we sent you"
                  : "We'll text you a one-time code"
                : mode === "login"
                  ? "Log in to track your expenses"
                  : "Sign up to get started"}
            </p>

            {mode !== "phone" && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 outline-none focus:border-indigo-500 transition-colors"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 outline-none focus:border-indigo-500 transition-colors"
                />

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-lg py-2.5 transition-colors"
                >
                  {loading
                    ? "Please wait..."
                    : mode === "login"
                      ? "Log In"
                      : "Sign Up"}
                </motion.button>
              </form>
            )}

            {mode === "phone" && !otpSent && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 outline-none focus:border-indigo-500 transition-colors"
                />
                <p className="text-neutral-600 text-xs">
                  Include your country code (e.g. +91 for India)
                </p>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-lg py-2.5 transition-colors"
                >
                  {loading ? "Sending..." : "Send Code"}
                </motion.button>
              </form>
            )}

            {mode === "phone" && otpSent && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <input
                  type="text"
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white placeholder-neutral-500 outline-none focus:border-indigo-500 transition-colors tracking-widest text-center"
                />

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-lg py-2.5 transition-colors"
                >
                  {loading ? "Verifying..." : "Verify & Log In"}
                </motion.button>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-neutral-500 hover:text-neutral-300 text-xs w-full text-center"
                >
                  Use a different number
                </button>
              </form>
            )}

            {/* Divider + alt options, hidden while entering OTP */}
            {!(mode === "phone" && otpSent) && (
              <>
                <div className="flex items-center gap-3 my-5">
                  <div className="h-px bg-neutral-800 flex-1" />
                  <span className="text-neutral-600 text-xs">or</span>
                  <div className="h-px bg-neutral-800 flex-1" />
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 border border-neutral-700 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </button>

                  {mode !== "phone" ? (
                    <button
                      type="button"
                      onClick={() => switchMode("phone")}
                      disabled={loading}
                      className="w-full bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 border border-neutral-700 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
                    >
                      Continue with phone
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => switchMode("login")}
                      disabled={loading}
                      className="w-full bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 border border-neutral-700 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
                    >
                      Continue with email
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleGuestSignIn}
                    disabled={loading}
                    className="w-full text-neutral-500 hover:text-neutral-300 text-sm py-2 transition-colors"
                  >
                    Continue as guest
                  </button>
                </div>
              </>
            )}

            {mode !== "phone" && (
              <p className="text-neutral-400 text-sm text-center mt-6">
                {mode === "login"
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  onClick={() =>
                    switchMode(mode === "login" ? "signup" : "login")
                  }
                  className="text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  {mode === "login" ? "Sign Up" : "Log In"}
                </button>
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Invisible reCAPTCHA container required by Firebase Phone Auth */}
      <div ref={recaptchaRef}></div>
    </div>
  );
}
