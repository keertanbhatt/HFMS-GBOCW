import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BrandEmblem from '../components/layout/BrandEmblem';
import { homePathForRole } from '../constants/roles';
import { ASSETS, COLORS, ORG } from '../constants/theme';
import { useAuth } from '../hooks/useAuth.jsx';
import { api } from '../services/api';

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-base text-gov-text outline-none transition placeholder:text-slate-400 focus:border-[#1d3d7d] focus:ring-2 focus:ring-[#1d3d7d]/12 disabled:bg-slate-50 disabled:text-slate-400 sm:py-3';

const ROLES = [
  { id: 'admin', label: 'Admin' },
  { id: 'shram', label: 'Shram Seva' },
  { id: 'accountant', label: 'Accountant', disabled: true, hint: 'Soon' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('admin');
  const [userId, setUserId] = useState('admin@bocw.gujarat.gov.in');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const selectRole = (next) => {
    if (next === 'accountant') return;
    setRole(next);
    setError('');
    if (next === 'admin') setUserId('admin@bocw.gujarat.gov.in');
    if (next === 'shram') setUserId('ShramSevaKendra01');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (role === 'accountant') {
      setError('Accountant login will be available in a later phase.');
      return;
    }
    setLoading(true);
    try {
      const result = await api.login(userId, password);
      login(result);
      navigate(homePathForRole(result.user.role));
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const userIdType = role === 'admin' ? 'email' : 'text';
  const submitLabel = role === 'shram' ? 'Sign in to Shram Seva' : 'Sign in';

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      <aside className="relative min-h-[220px] w-full shrink-0 overflow-hidden sm:min-h-[260px] lg:h-screen lg:min-h-0 lg:w-[52%] xl:w-[55%]">
        <img
          src={ASSETS.loginHeroBackground}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[50%_42%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c2340]/80 via-[#0c2340]/35 to-[#0c2340]/10 lg:from-[#0c2340]/70 lg:via-[#172554]/25" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0a1628]/95 via-[#0c2340]/40 to-transparent" />

        <div className="relative z-10 flex h-full min-h-[220px] flex-col justify-between p-5 sm:min-h-[260px] sm:p-7 lg:min-h-0 lg:p-9">
          <div className="flex items-center gap-2.5">
            <BrandEmblem className="h-9 w-9 shrink-0 ring-2 ring-white/90" />
            <div>
              <p className="text-sm font-bold text-white">{ORG.boardNameShort}</p>
              <p className="text-[11px] text-white/70">{ORG.systemSubtitle}</p>
            </div>
          </div>

          <div className="max-w-md pb-2 lg:pb-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-orange-200/95">
              {ORG.systemName} · {ORG.platformLine}
            </p>
            <h2 className="mt-3 text-xl font-bold leading-snug text-white sm:text-2xl lg:text-[1.65rem]">
              <span className="block">શ્રમિકોનું કલ્યાણ,</span>
              <span className="mt-0.5 block text-orange-300">ગુજરાતની સમૃદ્ધિ</span>
            </h2>
            <p className="mt-3 hidden text-sm leading-relaxed text-white/85 sm:block">
              Scheme finance, welfare programmes, and Shram Seva helpline records — one secure
              portal for the Board.
            </p>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen w-full flex-1 flex-col bg-[#f4f6fa]">
        <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-5 py-8 sm:max-w-[540px] sm:px-8 sm:py-10 lg:max-w-[580px]">
          <div className="mb-6 flex items-center justify-between gap-4 sm:mb-7">
            <Link
              to="/"
              className="text-sm font-medium text-slate-500 transition hover:text-[#1d3d7d]"
            >
              ← Back to home
            </Link>
            <img
              src={ASSETS.govtEmblem}
              alt=""
              className="h-9 w-auto max-w-[52px] object-contain opacity-90"
            />
          </div>

          <div className="hfms-card overflow-hidden">
            <div className="hfms-saffron-rule" />

            <div className="px-7 py-8 sm:px-10 sm:py-10">
              <h1 className="text-2xl font-bold text-[#172554] sm:text-[1.65rem]">Sign in</h1>
              <p className="mt-2 text-base text-slate-500 sm:text-[15px]">
                {role === 'shram'
                  ? 'Shram Seva Kendra daily entry'
                  : 'HFMS administrator access'}
              </p>

              <div className="mt-7 border-b border-slate-200" role="tablist" aria-label="Sign in role">
                <div className="-mb-px flex flex-wrap gap-x-2 gap-y-1 sm:gap-x-4">
                  {ROLES.map((item) => {
                    const active = role === item.id;
                    const disabled = item.disabled;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        disabled={disabled}
                        onClick={() => selectRole(item.id)}
                        className={`relative px-2 pb-3 pt-1 text-base font-semibold transition sm:px-3 ${
                          disabled
                            ? 'cursor-not-allowed text-slate-300'
                            : active
                              ? 'text-[#1d3d7d]'
                              : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {item.label}
                        {item.hint ? (
                          <span className="ml-1 text-xs font-normal text-slate-400">
                            ({item.hint})
                          </span>
                        ) : null}
                        {active && !disabled ? (
                          <span
                            className="absolute inset-x-1 bottom-0 h-0.5 rounded-full bg-[#1d3d7d]"
                            aria-hidden
                          />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="user-id" className="mb-2 block text-sm font-medium text-slate-700 sm:text-[15px]">
                    User ID
                  </label>
                  <input
                    id="user-id"
                    type={userIdType}
                    autoComplete="username"
                    required
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className={inputClass}
                    placeholder={role === 'shram' ? 'ShramSevaKendra01' : 'Email or user ID'}
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <label htmlFor="password" className="text-sm font-medium text-slate-700 sm:text-[15px]">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-sm font-medium text-[#1d3d7d] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`${inputClass} pr-16`}
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2.5 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-[#1d3d7d]"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <label className="flex cursor-pointer items-center gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-[18px] w-[18px] rounded border-slate-300 text-[#1d3d7d]"
                  />
                  <span className="text-sm text-slate-600 sm:text-[15px]">
                    Keep me signed in on this device
                  </span>
                </label>

                {error ? (
                  <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl py-3.5 text-base font-semibold text-white shadow-md transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-55 sm:py-4"
                  style={{ backgroundColor: COLORS.portalNavy }}
                >
                  {loading ? 'Signing in…' : submitLabel}
                </button>
              </form>

              <p className="mt-7 border-l-2 border-[#1d3d7d]/30 pl-4 text-xs leading-relaxed text-slate-500 sm:text-[13px]">
                Authorised use only. Do not share your login credentials. For access issues, contact
                the IT help desk.
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-[10px] text-slate-400">
            © 2026 {ORG.systemName} · {ORG.boardNameShort}
          </p>
        </main>
      </div>
    </div>
  );
}
