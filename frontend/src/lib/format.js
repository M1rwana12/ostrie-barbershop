// Форматування чисел/грошей з локаллю (розділювач тисяч тощо).
const localeOf = (lang) => (lang === 'en' ? 'en-GB' : 'uk-UA')

export const fmtNum = (n, lang) =>
  new Intl.NumberFormat(localeOf(lang)).format(Number(n) || 0)

export const fmtMoney = (n, lang, currency) =>
  `${fmtNum(Math.round(Number(n) || 0), lang)} ${currency}`

// Відносний час: "щойно", "5 хв тому", "2 год тому", інакше дата.
export const fmtRelative = (iso, lang) => {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const sec = Math.floor((Date.now() - d.getTime()) / 1000)
  const uk = lang !== 'en'
  if (sec < 60) return uk ? 'щойно' : 'just now'
  const min = Math.floor(sec / 60)
  if (min < 60) return uk ? `${min} хв тому` : `${min} min ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return uk ? `${hr} год тому` : `${hr} h ago`
  return d.toLocaleDateString(localeOf(lang), { day: '2-digit', month: '2-digit', year: 'numeric' })
}
