import { useCallback, useEffect, useState } from 'react';
import ShramSevaLayout from '../layouts/ShramSevaLayout';
import { SHRAM_SEVA_YOJANAS } from '../constants/shramSevaYojanas';
import { COLORS } from '../constants/theme';
import { api } from '../services/api';

const inputBase =
  'w-full rounded-2xl border border-slate-200/90 bg-white px-4 py-3 text-sm text-gov-text shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#1d3d7d] focus:ring-4 focus:ring-[#1d3d7d]/10 disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-100/80 disabled:text-slate-400';

function SectionCard({ step, title, subtitle, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex items-start gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-4 py-3.5 sm:px-5">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white shadow-sm"
          style={{ background: `linear-gradient(135deg, ${COLORS.portalNavy}, ${COLORS.blue})` }}
        >
          {step}
        </span>
        <div>
          <h2 className="text-sm font-bold text-gov-navy">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-xs text-gov-muted">{subtitle}</p> : null}
        </div>
      </div>
      <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">{children}</div>
    </section>
  );
}

function ChoiceTile({ selected, onSelect, title, description, tone = 'navy' }) {
  const selectedStyles =
    tone === 'saffron'
      ? 'border-gov-saffron bg-orange-50/80 ring-2 ring-gov-saffron/25'
      : 'border-[#1d3d7d] bg-[#1d3d7d]/[0.04] ring-2 ring-[#1d3d7d]/15';
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full flex-col rounded-2xl border px-4 py-3.5 text-left transition-all sm:flex-1 ${
        selected
          ? selectedStyles
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80'
      }`}
    >
      <span className={`text-sm font-semibold ${selected ? 'text-gov-navy' : 'text-slate-700'}`}>
        {title}
      </span>
      {description ? (
        <span className="mt-1 text-xs leading-snug text-gov-muted">{description}</span>
      ) : null}
    </button>
  );
}

function WindowStatusBanner({ windowInfo }) {
  const open = windowInfo?.isOpen;
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border px-4 py-4 shadow-sm sm:px-5 ${
        open
          ? 'border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-white'
          : 'border-amber-200/80 bg-gradient-to-br from-amber-50 to-white'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className={`relative mt-0.5 flex h-3 w-3 shrink-0 rounded-full ${
              open ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          >
            {open ? (
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-40" />
            ) : null}
          </span>
          <div>
            <p className={`text-sm font-bold ${open ? 'text-emerald-900' : 'text-amber-950'}`}>
              {open ? 'Entry window is open' : 'Entry window is closed'}
            </p>
            <p className="mt-1 text-xs text-slate-600">
              {windowInfo?.windowLabel || '10:30 AM – 6:10 PM (IST)'}
            </p>
          </div>
        </div>
        {windowInfo?.currentDateTime ? (
          <p className="rounded-xl bg-white/80 px-3 py-1.5 text-xs font-medium tabular-nums text-gov-navy shadow-sm">
            IST · {windowInfo.currentDateTime}
          </p>
        ) : null}
      </div>
      {windowInfo?.message ? (
        <p className="mt-3 text-xs leading-relaxed text-slate-600">{windowInfo.message}</p>
      ) : null}
    </div>
  );
}

export default function ShramSevaFormPage() {
  const [windowInfo, setWindowInfo] = useState(null);
  const [shramikName, setShramikName] = useState('');
  const [mobile, setMobile] = useState('');
  const [yojana, setYojana] = useState('');
  const [callStatus, setCallStatus] = useState('');
  const [querySolved, setQuerySolved] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const loadWindow = useCallback(async () => {
    try {
      const data = await api.getShramSevaWindow();
      setWindowInfo(data);
    } catch {
      setWindowInfo(null);
    }
  }, []);

  useEffect(() => {
    loadWindow();
    const id = setInterval(loadWindow, 30000);
    return () => clearInterval(id);
  }, [loadWindow]);

  const formDisabled = !windowInfo?.isOpen;

  const resetForm = () => {
    setShramikName('');
    setMobile('');
    setYojana('');
    setCallStatus('');
    setQuerySolved('');
    setReason('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.submitShramSevaEntry({
        shramikName,
        mobile,
        yojana,
        callStatus,
        querySolved: callStatus === 'received' ? querySolved === 'yes' : undefined,
        reason: reason.trim() || undefined,
      });
      setSuccess('Entry saved successfully. You can log the next call below.');
      resetForm();
    } catch (err) {
      setError(err.message || 'Could not submit entry');
    } finally {
      setLoading(false);
    }
  };

  const setCallStatusAndReset = (status) => {
    setCallStatus(status);
    setQuerySolved('');
    setReason('');
  };

  return (
    <ShramSevaLayout title="Daily helpline log">
      <div className="space-y-5">
        <div className="relative overflow-hidden rounded-2xl border border-[#1d3d7d]/15 bg-gradient-to-br from-[#1d3d7d] via-[#172554] to-[#0f172a] px-5 py-5 text-white shadow-lg sm:px-6 sm:py-6">
          <div
            className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-20"
            style={{ background: COLORS.saffron }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white opacity-[0.06]"
            aria-hidden
          />
          <p className="relative text-[10px] font-bold uppercase tracking-[0.14em] text-orange-200">
            Today&apos;s seva register
          </p>
          <h2 className="relative mt-1 text-xl font-bold tracking-tight sm:text-2xl">
            Record each helpline call
          </h2>
          <p className="relative mt-2 max-w-md text-sm leading-relaxed text-blue-100/90">
            Enter caller details, select the yojana, and note whether the query was resolved. All
            timestamps are stored in IST.
          </p>
        </div>

        <WindowStatusBanner windowInfo={windowInfo} />

        {(error || success) && (
          <div className="space-y-2">
            {error ? (
              <div
                className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                role="alert"
              >
                <span className="font-semibold">Could not submit</span>
                <span className="text-red-700">{error}</span>
              </div>
            ) : null}
            {success ? (
              <div
                className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
                role="status"
              >
                <span className="font-semibold">Done — </span>
                {success}
              </div>
            ) : null}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <fieldset disabled={formDisabled || loading} className="space-y-5">
            <SectionCard
              step="1"
              title="Caller information"
              subtitle="Name and mobile number of the shramik"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gov-muted">
                    Name of shramik
                  </label>
                  <input
                    className={inputBase}
                    value={shramikName}
                    onChange={(e) => setShramikName(e.target.value)}
                    required
                    placeholder="Enter full name"
                    autoComplete="name"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gov-muted">
                    Mobile number
                  </label>
                  <input
                    className={inputBase}
                    inputMode="numeric"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    required
                    placeholder="10-digit mobile number"
                    autoComplete="tel"
                  />
                  <p className="mt-1.5 text-[11px] text-gov-muted">Digits only · 10 characters</p>
                </div>
              </div>
            </SectionCard>

            <SectionCard step="2" title="Yojana / scheme" subtitle="Select the scheme discussed on the call">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gov-muted">
                Yojana
              </label>
              <select
                className={`${inputBase} cursor-pointer appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                }}
                value={yojana}
                onChange={(e) => setYojana(e.target.value)}
                required
              >
                <option value="">Choose a yojana from the list</option>
                {SHRAM_SEVA_YOJANAS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </SectionCard>

            <SectionCard
              step="3"
              title="Call outcome"
              subtitle="How the call ended and whether the query was solved"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-gov-muted">
                Call status
              </p>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <ChoiceTile
                  selected={callStatus === 'received'}
                  onSelect={() => setCallStatusAndReset('received')}
                  title="Call received"
                  description="You spoke with the caller"
                />
                <ChoiceTile
                  selected={callStatus === 'not_connected'}
                  onSelect={() => setCallStatusAndReset('not_connected')}
                  title="Not connected"
                  description="No answer, switched off, or wrong number"
                />
              </div>

              {callStatus === 'received' ? (
                <div className="mt-5 space-y-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gov-muted">
                    Query solved?
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <ChoiceTile
                      selected={querySolved === 'yes'}
                      onSelect={() => {
                        setQuerySolved('yes');
                        setReason('');
                      }}
                      title="Yes — resolved"
                      description="Caller’s query was addressed"
                      tone="saffron"
                    />
                    <ChoiceTile
                      selected={querySolved === 'no'}
                      onSelect={() => setQuerySolved('no')}
                      title="No — pending"
                      description="Explain why below"
                      tone="saffron"
                    />
                  </div>
                  {querySolved === 'no' ? (
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-gov-navy">
                        Reason <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        className={`${inputBase} min-h-[100px] resize-y`}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        placeholder="Describe why the query could not be solved…"
                      />
                    </div>
                  ) : null}
                </div>
              ) : null}

              {callStatus === 'not_connected' ? (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4">
                  <label className="mb-1.5 block text-xs font-semibold text-gov-navy">
                    Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className={`${inputBase} min-h-[100px] resize-y`}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    placeholder="e.g. switched off, no answer, invalid number…"
                  />
                </div>
              ) : null}
            </SectionCard>

            <button
              type="submit"
              disabled={formDisabled || loading}
              className="group relative w-full overflow-hidden rounded-2xl py-4 text-sm font-bold text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              style={{
                background: `linear-gradient(135deg, ${COLORS.portalNavy} 0%, ${COLORS.navyMid} 50%, ${COLORS.saffronDeep} 140%)`,
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Submitting entry…
                  </>
                ) : (
                  <>Submit entry to register</>
                )}
              </span>
            </button>

            {formDisabled ? (
              <p className="text-center text-xs text-gov-muted">
                Form unlocks when the daily entry window is open.
              </p>
            ) : null}
          </fieldset>
        </form>
      </div>
    </ShramSevaLayout>
  );
}
