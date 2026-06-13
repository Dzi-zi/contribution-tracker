import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, Cell
} from 'recharts'
import { api } from '../utils/api.js'
import { formatCurrency, monthName } from '../utils/format.js'
import './Dashboard.css'

const ALL_MONTHS = [1,2,3,4,5,6,7,8,9,10,11,12]

function StatCard({ label, value, sub, loading, delay = 0 }) {
  if (loading) return (
    <div className="stat-card">
      <div className="skeleton" style={{ height: 13, width: '55%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 28, width: '80%', marginBottom: 6 }} />
      <div className="skeleton" style={{ height: 11, width: '40%' }} />
    </div>
  )
  return (
    <div className="stat-card animate-in" style={{ animationDelay: `${delay}ms` }}>
      <span className="stat-label">{label}</span>
      <span className="stat-value num">{value}</span>
      {sub && <span className="stat-sub">{sub}</span>}
    </div>
  )
}

const Tooltip_ = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-label">{label}</div>
      {payload.map(p => (
        <div key={p.name} className="chart-tooltip-row">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="num">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    api.init()
      .then(() => api.getSummary())
      .then(setSummary)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const monthData = ALL_MONTHS.map(n => {
    const found = summary?.byMonth?.find(r => r.month === n)
    return { name: monthName(n), total: found ? Number(found.total) : 0, avg: found ? Number(found.avg) : 0 }
  })

  const yearData = (summary?.byYear ?? []).map(r => ({
    year: String(r.year), total: Number(r.total), changePct: r.changePct
  }))

  const thisYear   = summary?.byYear?.find(r => r.year === currentYear)
  const totalAll   = summary?.byYear?.reduce((s, r) => s + Number(r.total), 0) ?? 0
  const lastChange = summary?.byYear?.at(-1)?.changePct

  return (
    <div className="dashboard">
      <div className="page-header animate-in">
        <h1>Overview</h1>
        <p className="page-sub">{currentYear} contributions at a glance</p>
      </div>

      {error && <div className="error-box animate-in" style={{ marginBottom: 'var(--space-5)' }}>Could not load data: {error}</div>}

      <div className="stat-grid stagger">
        <StatCard label={`${currentYear} total`}    value={formatCurrency(thisYear?.total ?? 0)}  sub={`${thisYear?.count ?? 0} transactions`}                    loading={loading} delay={0}   />
        <StatCard label="All-time total"             value={formatCurrency(totalAll)}              sub={`across ${summary?.byYear?.length ?? 0} years`}            loading={loading} delay={60}  />
        <StatCard label="Year-over-year"             value={lastChange != null ? `${lastChange > 0 ? '+' : ''}${lastChange}%` : 'No prior year'}  sub={lastChange != null ? (lastChange > 0 ? 'increase' : 'decrease') : undefined}  loading={loading} delay={120} />
        <StatCard label={`${currentYear} monthly avg`} value={formatCurrency(thisYear ? Number(thisYear.total) / 12 : 0)} sub="per month"         loading={loading} delay={180} />
      </div>

      <div className="chart-grid">
        <section className="card chart-card animate-in" style={{ animationDelay: '160ms' }}>
          <h2 className="chart-title">Monthly contributions — {currentYear}</h2>
          {loading ? <div className="skeleton" style={{ height: 220, borderRadius: 'var(--r-md)' }} /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthData} barSize={18} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip content={<Tooltip_ />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="total" name="Total" radius={[3,3,0,0]}>
                  {monthData.map((d, i) => <Cell key={i} fill={d.total === 0 ? 'var(--bg-4)' : 'var(--accent)'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>

        <section className="card chart-card animate-in" style={{ animationDelay: '220ms' }}>
          <h2 className="chart-title">Annual totals</h2>
          {loading ? <div className="skeleton" style={{ height: 220, borderRadius: 'var(--r-md)' }} />
          : yearData.length === 0 ? <div className="chart-empty">No transactions recorded yet</div>
          : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={yearData} barSize={32} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
                <XAxis dataKey="year" tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip content={<Tooltip_ />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="total" name="Total" fill="var(--accent)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>

        <section className="card chart-card animate-in" style={{ animationDelay: '280ms' }}>
          <h2 className="chart-title">Year-over-year change (%)</h2>
          {loading ? <div className="skeleton" style={{ height: 220, borderRadius: 'var(--r-md)' }} />
          : yearData.length < 2 ? <div className="chart-empty">Needs at least two years of data</div>
          : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={yearData.filter(d => d.changePct != null)} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
                <XAxis dataKey="year" tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip cursor={{ stroke: 'var(--border-2)' }} content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null
                  const v = payload[0].value
                  return (
                    <div className="chart-tooltip">
                      <div className="chart-tooltip-label">{label}</div>
                      <div className="chart-tooltip-row">
                        <span style={{ color: v >= 0 ? 'var(--green)' : 'var(--red)' }}>change</span>
                        <span className="num">{v > 0 ? '+' : ''}{v}%</span>
                      </div>
                    </div>
                  )
                }} />
                <Line type="monotone" dataKey="changePct" stroke="var(--accent)" strokeWidth={1.5} dot={{ fill: 'var(--accent)', r: 3, strokeWidth: 0 }} activeDot={{ r: 4, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </section>

        <section className="card chart-card animate-in" style={{ animationDelay: '340ms' }}>
          <h2 className="chart-title">Average per month — {currentYear}</h2>
          {loading ? <div className="skeleton" style={{ height: 220, borderRadius: 'var(--r-md)' }} /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthData} barSize={18} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip content={<Tooltip_ />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="avg" name="Avg" radius={[3,3,0,0]}>
                  {monthData.map((d, i) => <Cell key={i} fill={d.avg === 0 ? 'var(--bg-4)' : '#5a8a6a'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>
      </div>
    </div>
  )
}