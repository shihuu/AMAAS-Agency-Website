import React, { useState, useEffect } from 'react';
import { getSupabase } from '../lib/supabase';
import { checkIsAdmin } from '../lib/cmsData';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { Loader2, ShieldAlert, LogOut, Copy, Check, RefreshCw } from 'lucide-react';

export const AdminApp: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    // 1. Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        verifyAdmin(session.user);
      } else {
        setLoading(false);
      }
    });

    // 2. Listen to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        verifyAdmin(session.user);
      } else {
        setIsAuthorized(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const verifyAdmin = async (user: any) => {
    setLoading(true);
    const { isAdmin, error } = await checkIsAdmin(user.id, user.email);

    if (isAdmin) {
      setIsAuthorized(true);
      setAuthError(null);
    } else {
      setIsAuthorized(false);
      if (error === 'admin_users_table_missing') {
        setAuthError('The admin_users table has not been created yet in your Supabase database schema.');
      } else {
        setAuthError(error || 'Unauthorized: Your account does not have admin permissions in the admin_users table.');
      }
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSession(null);
    setIsAuthorized(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#05090e] text-[#f1f5f9] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-7 h-7 text-[#38bdf8] animate-spin" />
        <span className="text-xs font-mono text-[#94a3b8]">Verifying administrative security...</span>
      </div>
    );
  }

  // If unauthenticated: show login
  if (!session) {
    return <AdminLogin onLoginSuccess={() => setLoading(true)} />;
  }

  // If authenticated but unauthorized:
  if (isAuthorized === false) {
    const grantSql = `INSERT INTO public.admin_users (user_id, email, role) VALUES ('${session.user.id}', '${session.user.email}', 'admin') ON CONFLICT (user_id) DO UPDATE SET role = 'admin';`;

    const handleCopyGrantSql = () => {
      navigator.clipboard.writeText(grantSql);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    };

    return (
      <div className="min-h-screen w-full bg-[#05090e] text-[#f1f5f9] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-[#08101d] border border-amber-500/30 shadow-2xl space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-white font-display">Administrator Authorization Required</h2>
            <p className="text-xs text-[#94a3b8] leading-relaxed mt-1.5">
              {authError || 'Your account is authenticated via Supabase Auth, but has not yet been registered in the admin_users table.'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#05090e] border border-white/[0.08] text-xs space-y-2">
            <div className="flex items-center justify-between text-[#94a3b8]">
              <span>Account Email:</span>
              <span className="font-mono text-white font-medium">{session.user.email}</span>
            </div>
            <div className="flex items-center justify-between text-[#94a3b8]">
              <span>Auth User ID:</span>
              <span className="font-mono text-xs text-[#38bdf8] truncate max-w-[200px]">{session.user.id}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
            Run this in your <strong>Supabase SQL Editor</strong> to authorize this account:
            <div className="mt-2 font-mono text-[11px] p-2 bg-[#05090e] rounded-lg border border-white/[0.06] overflow-x-auto text-[#cbd5e1] select-all">
              {grantSql}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            <button
              onClick={handleCopyGrantSql}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSql ? 'SQL Copied!' : 'Copy Grant SQL'}</span>
            </button>

            <button
              onClick={() => verifyAdmin(session.user)}
              className="w-full py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <RefreshCw className="w-4 h-4 text-[#38bdf8]" />
              <span>Re-check Access</span>
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 rounded-xl text-red-400 hover:text-red-300 text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer pt-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out & Switch Account</span>
          </button>
        </div>
      </div>
    );
  }

  // Authenticated & Authorized: show dashboard
  return (
    <AdminDashboard
      onLogout={handleLogout}
      userEmail={session.user.email}
      userId={session.user.id}
    />
  );
};
