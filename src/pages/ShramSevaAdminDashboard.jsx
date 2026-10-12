import { useCallback, useEffect, useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import ErrorState from '../components/ErrorState';
import LoadingState from '../components/LoadingState';
import { api } from '../services/api';

function KpiCard({ label, value, accent }) {
  return (
    <article className="hfms-card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gov-muted">{label}</p>
      <p className={`mt-2 text-2xl font-bold tabular-nums ${accent || 'text-gov-navy'}`}>
        {value.toLocaleString('en-IN')}
      </p>
    </article>
  );
}

function formatDateTime(iso) {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

function formatEntryDate(dateKey) {
  if (!dateKey) return '—';
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'full' }).format(new Date(y, m - 1, d));
}

function callStatusLabel(entry) {
  if (entry.callStatus === 'not_connected') return 'Call not connected';
  return entry.querySolved ? 'Call received · Query solved' : 'Call received · Query not solved';
}

function EntryDetailCard({ entry }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-2">
        <div>
          <p className="font-semibold text-gov-navy">{entry.shramikName}</p>
          <p className="text-xs text-gov-muted">
            Mobile: {entry.mobile} · Submitted {formatDateTime(entry.submittedAt)}
          </p>
        </div>
        <span
          className={`rounded-lg px-2 py-0.5 text-xs font-medium ${
            entry.callStatus === 'not_connected'
              ? 'bg-slate-100 text-slate-700'
              : entry.querySolved
                ? 'bg-emerald-50 text-emerald-800'
                : 'bg-amber-50 text-amber-900'
          }`}
        >
          {callStatusLabel(entry)}
        </span>
      </div>
      <dl className="mt-3 space-y-2 text-sm">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-gov-muted">Yojana / scheme</dt>
          <dd className="mt-0.5 text-gov-text">{entry.yojana}</dd>
        </div>
        {entry.reason ? (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-gov-muted">
              Reason / remarks
            </dt>
            <dd className="mt-0.5 whitespace-pre-wrap break-words rounded-lg bg-slate-50 px-3 py-2 text-gov-text">
              {entry.reason}
            </dd>
          </div>
        ) : (
          <p className="text-xs text-gov-muted">No reason or remarks recorded.</p>
        )}
      </dl>
    </article>
  );
}

function KendraDetailPanel({ kendra, range, date, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedDay, setExpandedDay] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getShramSevaKendraEntries(kendra.userId, { range, date });
      setDetail(res);
      const firstDay = res.days?.[0]?.entryDate;
      setExpandedDay(firstDay || null);
    } catch (err) {
      setError(err.message || 'Failed to load entries');
    } finally {
      setLoading(false);
    }
  }, [kendra.userId, range, date]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const entriesForDay = expandedDay ? detail?.entriesByDay?.[expandedDay] || [] : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-end bg-slate-900/40 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="kendra-detail-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl sm:rounded-2xl sm:h-[calc(100vh-2rem)]">
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gov-muted">Kendra account</p>
            <h2 id="kendra-detail-title" className="text-lg font-bold text-gov-navy">
              {kendra.loginId}
            </h2>
            <p className="text-sm text-gov-muted">{kendra.name}</p>
            {detail?.filter?.rangeLabel ? (
              <p className="mt-1 text-xs text-gov-muted">{detail.filter.rangeLabel}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-medium text-gov-navy hover:bg-slate-50"
          >
            Close
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {loading ? <LoadingState label="Loading entries for this account…" /> : null}
          {!loading && error ? <ErrorState message={error} onRetry={load} /> : null}

          {!loading && !error && detail ? (
            <>
              {!detail.days?.length ? (
                <p className="text-sm text-gov-muted">No entries for this account in the selected period.</p>
              ) : (
                <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
                  <nav className="shrink-0 lg:w-52" aria-label="Entry dates">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gov-muted">
                      By day
                    </p>
                    <ul className="space-y-1">
                      {detail.days.map((day) => {
                        const active = expandedDay === day.entryDate;
                        return (
                          <li key={day.entryDate}>
                            <button
                              type="button"
                              onClick={() => setExpandedDay(day.entryDate)}
                              className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                                active
                                  ? 'border-gov-navy/30 bg-gov-navy/5 font-semibold text-gov-navy'
                                  : 'border-slate-100 bg-slate-50/80 text-gov-text hover:border-slate-200'
                              }`}
                            >
                              <span className="block">{formatEntryDate(day.entryDate)}</span>
                              <span className="mt-0.5 block text-xs font-normal tabular-nums text-gov-muted">
                                {day.totalCalls} call{day.totalCalls === 1 ? '' : 's'} · {day.querySolved}{' '}
                                solved
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>

                  <div className="min-w-0 flex-1">
                    {expandedDay ? (
                      <>
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                          <h3 className="text-sm font-bold text-gov-navy">
                            {formatEntryDate(expandedDay)}
                          </h3>
                          <p className="text-xs text-gov-muted">
                            {entriesForDay.length} entr{entriesForDay.length === 1 ? 'y' : 'ies'}
                          </p>
                        </div>
                        <ul className="space-y-3">
                          {entriesForDay.map((entry) => (
                            <li key={entry.id}>
                              <EntryDetailCard entry={entry} />
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <p className="text-sm text-gov-muted">Select a day to view full entry details.</p>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function ShramSevaAdminDashboard() {
  const [range, setRange] = useState('cumulative');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedKendra, setSelectedKendra] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getShramSevaStats({ range, date });
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [range, date]);

  useEffect(() => {
    load();
  }, [load]);

  const totals = data?.totals;

  return (
    <AdminLayout pageTitle="Shram Seva Kendra — Status">
      <div className="space-y-6 pb-10">
        <div className="hfms-card flex flex-wrap items-end gap-4 p-5">
          <div className="min-w-[200px] flex-1">
            <h2 className="text-lg font-bold text-gov-navy">Helpline activity</h2>
            <p className="mt-1 text-sm text-gov-muted">
              Track seva calls across all Kendra accounts. Entry timestamps are stored in IST. Click an
              account to see day-wise entries and full remarks.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <label className="text-sm">
              <span className="mb-1 block text-xs font-medium text-gov-muted">View</span>
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option value="cumulative">All (up to selected date)</option>
                <option value="day">Selected date only</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-xs font-medium text-gov-muted">Date</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />
            </label>
          </div>
        </div>

        {data?.filter?.rangeLabel ? (
          <p className="text-sm text-gov-muted">{data.filter.rangeLabel}</p>
        ) : null}

        {loading ? <LoadingState label="Loading Shram Seva stats…" /> : null}
        {!loading && error ? <ErrorState message={error} onRetry={load} /> : null}

        {!loading && !error && totals ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <KpiCard label="Total Seva calls" value={totals.totalSevaCalls} />
              <KpiCard label="Calls received" value={totals.totalCallsReceived} accent="text-[#1d3d7d]" />
              <KpiCard label="Query solved" value={totals.totalQuerySolved} accent="text-emerald-600" />
              <KpiCard label="Query not solved" value={totals.totalQueryNotSolved} accent="text-gov-saffron" />
              <KpiCard label="Not connected" value={totals.totalCallsNotConnected} accent="text-slate-600" />
            </div>

            <section className="hfms-card overflow-hidden p-0">
              <div className="border-b border-slate-100 px-5 py-4">
                <h3 className="text-sm font-bold text-gov-navy">By Kendra account</h3>
                <p className="text-xs text-gov-muted">
                  Click a row to open day-wise entries with full reason text
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase text-gov-muted">
                    <tr>
                      <th className="px-4 py-3">Account</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Received</th>
                      <th className="px-4 py-3">Solved</th>
                      <th className="px-4 py-3">Not solved</th>
                      <th className="px-4 py-3">Not connected</th>
                      <th className="px-4 py-3">Last entry</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.kendras || []).map((row) => (
                      <tr
                        key={row.userId}
                        className="cursor-pointer border-t border-slate-100 transition-colors hover:bg-gov-navy/[0.04]"
                        onClick={() => setSelectedKendra(row)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedKendra(row);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`View entries for ${row.loginId}`}
                      >
                        <td className="px-4 py-2.5">
                          <p className="font-semibold text-gov-navy">{row.loginId}</p>
                          <p className="text-xs text-gov-muted">{row.name}</p>
                        </td>
                        <td className="px-4 py-2.5 tabular-nums font-medium">{row.totalCalls}</td>
                        <td className="px-4 py-2.5 tabular-nums">{row.callsReceived}</td>
                        <td className="px-4 py-2.5 tabular-nums text-emerald-700">{row.querySolved}</td>
                        <td className="px-4 py-2.5 tabular-nums text-gov-saffron">{row.queryNotSolved}</td>
                        <td className="px-4 py-2.5 tabular-nums">{row.callsNotConnected}</td>
                        <td className="px-4 py-2.5 text-xs text-gov-muted">
                          {formatDateTime(row.lastSubmissionAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {data.recentEntries?.length ? (
              <section className="hfms-card p-5">
                <h3 className="text-sm font-bold text-gov-navy">Recent entries</h3>
                <ul className="mt-4 space-y-3">
                  {data.recentEntries.slice(0, 10).map((entry) => (
                    <li
                      key={entry.id}
                      className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-gov-navy">{entry.shramikName}</p>
                          <p className="text-xs text-gov-muted">
                            {entry.yojana} · {entry.mobile} · {entry.kendraLogin}
                          </p>
                        </div>
                        <p className="text-xs text-gov-muted">{formatDateTime(entry.submittedAt)}</p>
                      </div>
                      <p className="mt-1 text-xs capitalize text-gov-text">{callStatusLabel(entry)}</p>
                      {entry.reason ? (
                        <p className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-white px-3 py-2 text-xs text-gov-text">
                          {entry.reason}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </>
        ) : null}
      </div>

      {selectedKendra ? (
        <KendraDetailPanel
          kendra={selectedKendra}
          range={range}
          date={date}
          onClose={() => setSelectedKendra(null)}
        />
      ) : null}
    </AdminLayout>
  );
}
