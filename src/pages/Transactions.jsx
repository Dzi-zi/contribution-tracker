import { useEffect, useState, useCallback } from 'react'
import DatePicker from 'react-datepicker'
import { api } from '../utils/api.js'
import { formatCurrency, formatDate, parseCurrency, validateTransaction, toInputDate } from '../utils/format.js'
import { exportToPDF } from '../utils/pdf.js'
import './Transactions.css'

const EMPTY = { txn_date: null, payee: '', amount: '', memo: '' }

function TableSkeleton() {
  return (
    <tbody>
      {[...Array(5)].map((_, i) => (
        <tr key={i} style={{ opacity: 1 - i * 0.15 }}>
          {[90, 160, 80, 140, 96].map((w, j) => (
            <td key={j} style={{ padding: '12px 16px' }}>
              <div className="skeleton" style={{ height: 13, width: w }} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}

export default function Transactions() {
  const [rows,         setRows]        = useState([])
  const [loading,      setLoading]     = useState(true)
  const [form,         setForm]        = useState(EMPTY)
  const [editId,       setEditId]      = useState(null)
  const [errors,       setErrors]      = useState([])
  const [submitting,   setSubmitting]  = useState(false)
  const [deleteTarget, setDeleteTarget]= useState(null)
  const [deleting,     setDeleting]    = useState(false)
  const [sortKey,      setSortKey]     = useState('txn_date')
  const [sortDir,      setSortDir]     = useState('desc')
  const [pdfLoading,   setPdfLoading]  = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    api.getTransactions().then(setRows).catch(console.error).finally(() => setLoading(false))
  }, [])

  useEffect(() => { api.init().then(load) }, [load])

  const sorted = [...rows].sort((a, b) => {
    let av = a[sortKey], bv = b[sortKey]
    if (sortKey === 'amount') { av = Number(av); bv = Number(bv) }
    if (av < bv) return sortDir === 'asc' ? -1 : 1
    if (av > bv) return sortDir === 'asc' ?  1 : -1
    return 0
  })

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  function sortIcon(key) {
    if (sortKey !== key) return <span className="sort-icon none">↕</span>
    return <span className="sort-icon">{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  function clearForm() { setForm(EMPTY); setEditId(null); setErrors([]) }

  async function handleSubmit() {
    const errs = validateTransaction({
      txn_date: form.txn_date ? toInputDate(form.txn_date) : '',
      payee: form.payee, amount: form.amount
    })
    if (errs.length) { setErrors(errs); return }

    setSubmitting(true); setErrors([])
    try {
      const body = { txn_date: toInputDate(form.txn_date), payee: form.payee.trim(), amount: parseCurrency(form.amount), memo: form.memo.trim() || null }
      editId ? await api.updateTransaction(editId, body) : await api.addTransaction(body)
      clearForm(); load()
    } catch (e) {
      setErrors([e.message])
    } finally {
      setSubmitting(false)
    }
  }

  function startEdit(row) {
    setEditId(row.id)
    setForm({ txn_date: new Date(row.txn_date), payee: row.payee, amount: String(Number(row.amount).toFixed(2)), memo: row.memo || '' })
    setErrors([])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function confirmDelete() {
    setDeleting(true)
    try { await api.deleteTransaction(deleteTarget); setDeleteTarget(null); load() }
    catch (e) { console.error(e) }
    finally { setDeleting(false) }
  }

  async function handlePDF() {
    setPdfLoading(true)
    try { exportToPDF(sorted) } finally { setTimeout(() => setPdfLoading(false), 600) }
  }

  const isEditing = editId !== null
  const totalSorted = sorted.reduce((s, r) => s + Number(r.amount), 0)

  return (
    <div className="transactions">
      <section className="card input-panel animate-in">
        <h2 className="panel-title">{isEditing ? 'Edit transaction' : 'Add transaction'}</h2>

        {errors.length > 0 && (
          <div className="error-box" role="alert">
            {errors.map((e, i) => <div key={i}>{e}</div>)}
          </div>
        )}

        <div className="form-grid">
          <div className="field">
            <label htmlFor="txn_date">Date</label>
            <DatePicker
              id="txn_date"
              selected={form.txn_date}
              onChange={d => setForm(f => ({ ...f, txn_date: d }))}
              dateFormat="yyyy-MM-dd"
              placeholderText="YYYY-MM-DD"
              autoComplete="off"
            />
          </div>
          <div className="field">
            <label htmlFor="payee">Payee</label>
            <input id="payee" type="text" placeholder="Organization or recipient" value={form.payee} onChange={e => setForm(f => ({ ...f, payee: e.target.value }))} />
          </div>
          <div className="field">
            <label htmlFor="amount">Amount</label>
            <input id="amount" type="text" placeholder="0.00" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} inputMode="decimal" />
          </div>
          <div className="field field-memo">
            <label htmlFor="memo">Memo <span className="optional">(optional)</span></label>
            <input id="memo" type="text" placeholder="Purpose or note" value={form.memo} onChange={e => setForm(f => ({ ...f, memo: e.target.value }))} />
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-ghost" onClick={clearForm}>Clear</button>
          <button className={`btn btn-primary${submitting ? ' loading' : ''}`} onClick={handleSubmit} disabled={submitting}>
            {isEditing ? 'Save changes' : 'Add transaction'}
          </button>
        </div>
      </section>

      <section className="ledger animate-in" style={{ animationDelay: '100ms' }}>
        <div className="ledger-header">
          <div>
            <h2>Ledger</h2>
            {!loading && <p className="page-sub">{sorted.length} {sorted.length === 1 ? 'transaction' : 'transactions'} &middot; {formatCurrency(totalSorted)}</p>}
          </div>
          <button className={`btn btn-sm${pdfLoading ? ' loading' : ''}`} onClick={handlePDF} disabled={loading || rows.length === 0 || pdfLoading}>
            Export PDF
          </button>
        </div>

        <div className="table-wrap card">
          <table>
            <thead>
              <tr>
                <th onClick={() => toggleSort('txn_date')}>Date {sortIcon('txn_date')}</th>
                <th onClick={() => toggleSort('payee')}>Payee {sortIcon('payee')}</th>
                <th onClick={() => toggleSort('amount')} style={{ textAlign: 'right' }}>Amount {sortIcon('amount')}</th>
                <th>Memo</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            {loading ? <TableSkeleton /> : sorted.length === 0 ? (
              <tbody><tr><td colSpan={5} className="empty-cell">No transactions yet. Add one above.</td></tr></tbody>
            ) : (
              <tbody>
                {sorted.map(row => (
                  <tr key={row.id} className={editId === row.id ? 'row-editing' : ''}>
                    <td className="num td-date">{formatDate(row.txn_date)}</td>
                    <td className="td-payee">{row.payee}</td>
                    <td className="num td-amount">{formatCurrency(row.amount)}</td>
                    <td className="td-memo text-muted">{row.memo || <span className="text-faint">—</span>}</td>
                    <td className="td-actions">
                      <button className="btn btn-sm btn-ghost" onClick={() => startEdit(row)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => setDeleteTarget(row.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </section>

      {deleteTarget && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="del-title">
          <div className="modal">
            <h3 id="del-title" style={{ marginBottom: 'var(--space-3)' }}>Delete transaction</h3>
            <p style={{ marginBottom: 'var(--space-5)', fontSize: 'var(--text-sm)' }}>
              This will permanently remove the transaction from your records.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</button>
              <button className={`btn btn-danger${deleting ? ' loading' : ''}`} onClick={confirmDelete} disabled={deleting}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}