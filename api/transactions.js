import pool from './_db.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query(
        'SELECT * FROM transactions ORDER BY txn_date DESC, id DESC'
      )
      return res.status(200).json(rows)
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'POST') {
    const { txn_date, payee, amount, memo } = req.body
    if (!txn_date || !payee || amount === undefined) {
      return res.status(400).json({ error: 'txn_date, payee, and amount are required' })
    }
    try {
      const { rows } = await pool.query(
        'INSERT INTO transactions (txn_date, payee, amount, memo) VALUES ($1,$2,$3,$4) RETURNING *',
        [txn_date, payee.trim(), amount, memo?.trim() || null]
      )
      return res.status(201).json(rows[0])
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  res.status(405).json({ error: 'Method not allowed' })
}