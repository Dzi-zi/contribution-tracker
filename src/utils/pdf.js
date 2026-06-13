import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatCurrency, formatDate } from './format.js'

export function exportToPDF(transactions) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

  doc.setFillColor(17, 17, 21)
  doc.rect(0, 0, 297, 30, 'F')
  doc.setTextColor(201, 169, 110)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Contribution Tracker', 14, 18)
  doc.setFontSize(10)
  doc.setTextColor(136, 136, 160)
  doc.setFont('helvetica', 'normal')
  doc.text(`Generated: ${new Date().toLocaleDateString('en-CA')}`, 230, 18)

  const total = transactions.reduce((sum, t) => sum + Number(t.amount), 0)
  doc.setTextColor(74, 222, 128)
  doc.setFontSize(11)
  doc.text(`Total: ${formatCurrency(total)}`, 14, 40)
  doc.setTextColor(136, 136, 160)
  doc.setFontSize(9)
  doc.text(`${transactions.length} transaction${transactions.length !== 1 ? 's' : ''}`, 14, 47)

  autoTable(doc, {
    startY: 52,
    head: [['Date', 'Payee', 'Amount', 'Memo']],
    body: transactions.map(t => [
      formatDate(t.txn_date),
      t.payee,
      formatCurrency(t.amount),
      t.memo || '—'
    ]),
    styles: {
      fontSize: 9,
      cellPadding: 4,
      textColor: [220, 220, 235],
      fillColor: [22, 22, 29]
    },
    headStyles: {
      fillColor: [46, 46, 62],
      textColor: [201, 169, 110],
      fontStyle: 'bold',
      fontSize: 8
    },
    alternateRowStyles: { fillColor: [28, 28, 38] },
    columnStyles: {
      0: { cellWidth: 28 },
      2: { halign: 'right', cellWidth: 32 },
      3: { cellWidth: 80 }
    },
    margin: { left: 14, right: 14 }
  })

  doc.save('contributions.pdf')
}