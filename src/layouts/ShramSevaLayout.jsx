import { useNavigate } from 'react-router-dom';
import BrandEmblem from '../components/layout/BrandEmblem';
import { COLORS, ORG } from '../constants/theme';
import { useAuth } from '../hooks/useAuth.jsx';

function UserInitial({ name, loginId }) {
  const source = (loginId || name || 'K').trim();
  const initial = source.charAt(0).toUpperCase();
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-md"
      style={{
        background: `linear-gradient(135deg, ${COLORS.portalNavy}, ${COLORS.blue})`,
      }}
      aria-hidden
    >
      {initial}
    </span>
  );
}

export default function ShramSevaLayout({ children, title = 'Shram Seva Form' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayId = user?.loginId || user?.name || 'Kendra user';

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#eef2f8]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.45]"
        aria-hidden
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 0% 0%, rgb(249 115 22 / 0.12), transparent 55%),
            radial-gradient(ellipse 60% 40% at 100% 10%, rgb(29 61 125 / 0.14), transparent 50%),
            radial-gradient(circle at 50% 100%, rgb(23 37 84 / 0.06), transparent 45%)
          `,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23172554' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <header className="relative border-b border-white/60 bg-white/75 shadow-sm backdrop-blur-md">
        <div className="hfms-saffron-rule" />
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <BrandEmblem className="h-11 w-11 ring-2 ring-[#1d3d7d]/10" />
            <div className="min-w-0">
              <p className="truncate text-[10px] font-bold uppercase tracking-[0.12em] text-gov-saffron">
                Shram Seva Kendra
              </p>
              <h1 className="truncate text-base font-bold text-gov-navy sm:text-lg">{title}</h1>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-slate-50/90 px-3 py-1.5 sm:flex">
              <UserInitial name={user?.name} loginId={user?.loginId} />
              <div className="text-left">
                <p className="max-w-[140px] truncate text-xs font-semibold text-gov-navy">
                  {displayId}
                </p>
                <p className="text-[10px] text-gov-muted">{ORG.systemName}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-gov-navy shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>

      <footer className="relative pb-8 pt-2 text-center">
        <p className="text-[11px] font-medium text-gov-muted">{ORG.boardNameShort}</p>
        <p className="mt-0.5 text-[10px] text-slate-400">{ORG.systemName} · Helpline data entry</p>
      </footer>
    </div>
  );
}
