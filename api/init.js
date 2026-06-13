import pool from './_db.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id         SERIAL PRIMARY KEY,
        txn_date   DATE          NOT NULL,
        payee      VARCHAR(255)  NOT NULL,
        amount     NUMERIC(12,2) NOT NULL,
        memo       TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)
    res.status(200).json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}