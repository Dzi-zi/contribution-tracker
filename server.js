import { config } from 'dotenv'
config({ path: '.env.local' })

import express from 'express'

const app = express()
app.use(express.json())

async function loadRoutes() {
  const init         = await import('./api/init.js')
  const transactions = await import('./api/transactions.js')
  const txnById      = await import('./api/transactions/[id].js')
  const summary      = await import('./api/summary.js')

  app.post('/api/init',            (req, res) => init.default(req, res))
  app.all('/api/transactions',     (req, res) => transactions.default(req, res))
  app.all('/api/transactions/:id', (req, res) => {
    req.query.id = req.params.id
    txnById.default(req, res)
  })
  app.get('/api/summary',          (req, res) => summary.default(req, res))
}

await loadRoutes()
app.listen(3001, () => console.log('✓ API running on http://localhost:3001'))