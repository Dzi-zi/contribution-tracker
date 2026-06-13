// All monetary math done in integer cents — no money libraries per project spec

export function formatCurrency(amount) {
  const cents = Math.round(Number(amount) * 100)
  const abs = Math.abs(cents)
  const dollars = Math.floor(abs / 100)
  const centsStr = String(abs % 100).padStart(2, '0')
  const dollarStr = dollars.toLocaleString('en-CA')
  return (cents < 0 ? '-' : '') + `$${dollarStr}.${centsStr}`
}

export function parseCurrency(str) {
  const cleaned = String(str).replace(/[$,\s]/g, '')
  const num = parseFloat(cleaned)
  return isNaN(num) ? null : Math.round(num * 100) / 100
}

export function formatDate(isoDate) {
  if (!isoDate) return ''
  return isoDate.split('T')[0]
}

export function toInputDate(date) {
  if (!date) return ''
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
export function monthName(num) {
  return MONTH_NAMES[num - 1] ?? ''
}

export function validateTransaction({ txn_date, payee, amount }) {
  const errors = []
  if (!txn_date || isNaN(new Date(txn_date).getTime())) {
    errors.push('Please enter a valid date.')
  }
  if (!payee || !payee.trim()) {
    errors.push('Payee name cannot be blank.')
  }
  const amt = parseCurrency(amount)
  if (amt === null || amt <= 0) {
    errors.push('Amount must be a positive number (e.g. 25.00).')
  }
  return errors
}