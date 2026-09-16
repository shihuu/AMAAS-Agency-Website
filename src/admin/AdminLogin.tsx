import React, { useState } from 'react';
import { getSupabase } from '../lib/supabase';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Loader2, Sparkles, UserPlus } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);
    setLoading(true);

    const supabase = getSupabase();
    if (!supabase) {
      setErrorMsg('Supabase is not configured. Please check your environment variables.');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Sign up first admin user
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
        } else if (data.user) {
          // If email confirmation is required by Supabase settings:
          if (data.session) {
            // Also try to insert into admin_users if table exists
            try {
              await supabase.from('admin_users').upsert({
                user_id: data.user.id,
                email: data.user.email || email,
                role: 'admin',
              }, { onConflict: 'user_id' });
            } catch {
              // Ignore if table not yet created
            }
            onLoginSuccess();
          } else {
            setInfoMsg('Account created! Please check your email to confirm registration or sign in below.');
            setIsSignUp(false);
          }
        }
      } else {
        // Sign in with password
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
        } else if (data.session) {
          onLoginSuccess();
        }
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrorMsg('Please enter your admin email address first.');
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    const supabase = getSupabase();
    if (!supabase) return;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/admin',
      });
      if (error) {
        setErrorMsg(error.message);
      } else {
        setInfoMsg('Password reset instructions sent to your email.');
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#05090e] text-[#f1f5f9] flex flex-col justify-center items-center px-4 sm:px-6 relative overflow-hidden selection:bg-[#38bdf8]/30">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-[#0284c7]/15 to-[#38bdf8]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-96 h-96 bg-[#0369a1]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0c1929] to-[#071320] border border-[#38bdf8]/30 shadow-[0_0_25px_rgba(56,189,248,0.18)] mb-4">
            <ShieldCheck className="w-7 h-7 text-[#38bdf8]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
            AMAAS CMS
          </h1>
          <p className="mt-2 text-sm text-[#94a3b8]">
            {isSignUp ? 'Initialize your administrative account' : 'Sign in with your verified Supabase credentials'}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-[#0b1320]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-2xl relative">
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <span className="leading-relaxed">{errorMsg}</span>
            </div>
          )}

          {infoMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/20 text-[#7dd3fc] text-xs sm:text-sm flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#38bdf8] mt-0.5 shrink-0" />
              <span className="leading-relaxed">{infoMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1.5 uppercase tracking-wider">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@amaas.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070e17] border border-white/[0.1] text-white placeholder-[#475569] text-sm focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-[#38bdf8]/80 hover:text-[#38bdf8] transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070e17] border border-white/[0.1] text-white placeholder-[#475569] text-sm focus:outline-none focus:border-[#38bdf8] focus:ring-1 focus:ring-[#38bdf8] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] hover:from-[#0369a1] hover:to-[#0284c7] text-white font-medium text-sm transition-all shadow-[0_0_20px_rgba(14,165,233,0.25)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : isSignUp ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Register Admin Account</span>
                </>
              ) : (
                <>
                  <span>Access CMS Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg(null);
                setInfoMsg(null);
              }}
              className="text-xs text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
            >
              {isSignUp ? (
                <span>Already registered? <strong className="text-[#38bdf8]">Sign in here</strong></span>
              ) : (
                <span>Need to setup the first admin? <strong className="text-[#38bdf8]">Create admin account</strong></span>
              )}
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center text-xs text-[#64748b]">
          <span>Protected by Supabase Auth with Row Level Security (RLS)</span>
        </div>
      </div>
    </div>
  );
};
