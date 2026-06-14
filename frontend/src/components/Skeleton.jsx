// Скелетон-плейсхолдери на час завантаження.
export function SkelLine({ w = '100%', h = 14 }) {
  return <span className="skel" style={{ width: w, height: h, display: 'block' }} />
}

export function SkelTable({ rows = 6, cols = 5 }) {
  return (
    <div className="admin-table-wrap skel-table">
      <table className="admin-table">
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }).map((__, c) => (
                <td key={c}><span className="skel" style={{ height: 14, width: c === 0 ? '40%' : '70%' }} /></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function SkelCards({ count = 4 }) {
  return (
    <div className="kpi-row">
      {Array.from({ length: count }).map((_, i) => (
        <div className="kpi" key={i}>
          <span className="skel" style={{ height: 12, width: '50%' }} />
          <span className="skel" style={{ height: 28, width: '70%', marginTop: 12 }} />
        </div>
      ))}
    </div>
  )
}
