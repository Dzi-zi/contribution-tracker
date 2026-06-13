import pool from '../_db.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { id } = req.query

  if (req.method === 'PUT') {
    const { txn_date, payee, amount, memo } = req.body
    if (!txn_date || !payee || amount === undefined) {
      return res.status(400).json({ error: 'txn_date, payee, and amount are required' })
    }
    try {
      const { rows } = await pool.query(
        'UPDATE transactions SET txn_date=$1, payee=$2, amount=$3, memo=$4 WHERE id=$5 RETURNING *',
        [txn_date, payee.trim(), amount, memo?.trim() || null, id]
      )
      if (!rows.length) return res.status(404).json({ error: 'Not found' })
      return res.status(200).json(rows[0])
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { rowCount } = await pool.query('DELETE FROM transactions WHERE id=$1', [id])
      if (!rowCount) return res.status(404).json({ error: 'Not found' })
      return res.status(200).json({ ok: true })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  res.status(405).json({ error: 'Method not allowed' })
}