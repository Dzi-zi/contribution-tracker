import pool from './_db.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { rows: byMonth } = await pool.query(`
      SELECT
        EXTRACT(MONTH FROM txn_date)::int AS month,
        SUM(amount)::float               AS total,
        AVG(amount)::float               AS avg
      FROM transactions
      WHERE EXTRACT(YEAR FROM txn_date) = EXTRACT(YEAR FROM CURRENT_DATE)
      GROUP BY month
      ORDER BY month
    `)

    const { rows: byYear } = await pool.query(`
      SELECT
        EXTRACT(YEAR FROM txn_date)::int AS year,
        SUM(amount)::float               AS total,
        AVG(amount)::float               AS avg,
        COUNT(*)::int                    AS count
      FROM transactions
      GROUP BY year
      ORDER BY year
    `)

    const yearlyWithChange = byYear.map((row, i) => ({
      ...row,
      change:    i === 0 ? null : +(row.total - byYear[i - 1].total).toFixed(2),
      changePct: i === 0 ? null : +(((row.total - byYear[i - 1].total) / byYear[i - 1].total) * 100).toFixed(1)
    }))

    res.status(200).json({ byMonth, byYear: yearlyWithChange })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}