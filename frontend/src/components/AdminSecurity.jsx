import { useEffect, useState } from 'react'
import {
  getMe, changePassword, twofaSetup, twofaEnable, twofaDisable, twofaRegenBackup,
} from '../lib/api'
import { useI18n } from '../lib/i18n'
import { useToast } from '../lib/toast'

function BackupCodes({ codes }) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(codes.join('\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }
  return (
    <div className="backup-panel">
      <h4>{t('admin.backupTitle')}</h4>
      <ul className="backup-list">
        {codes.map((c) => <li key={c}>{c}</li>)}
      </ul>
      <p className="an-note">{t('admin.backupSaveHint')}</p>
      <button type="button" className="btn btn--ghost" onClick={copy}>
        {copied ? t('admin.backupCopied') : t('admin.backupCopy')}
      </button>
    </div>
  )
}

export default function AdminSecurity({ onUnauthorized }) {
  const { t } = useI18n()
  const toast = useToast()

  // зміна пароля
  const [cur, setCur] = useState('')
  const [next, setNext] = useState('')
  const [pwdBusy, setPwdBusy] = useState(false)
  const [pwdMsg, setPwdMsg] = useState('')
  const [pwdErr, setPwdErr] = useState('')

  // 2FA
  const [enabled, setEnabled] = useState(false)
  const [remaining, setRemaining] = useState(0)
  const [setup, setSetup] = useState(null) // { qr_svg, secret }
  const [code, setCode] = useState('')
  const [twoBusy, setTwoBusy] = useState(false)
  const [twoMsg, setTwoMsg] = useState('')
  const [twoErr, setTwoErr] = useState('')
  const [disabling, setDisabling] = useState(false)
  const [regen, setRegen] = useState(false)
  const [freshCodes, setFreshCodes] = useState(null) // показати один раз

  const guard = (err) => { if (err.status === 401) { onUnauthorized(); return true } return false }

  const refreshMe = async () => {
    try {
      const u = await getMe()
      setEnabled(Boolean(u.totp_enabled))
      setRemaining(u.backup_codes_remaining || 0)
    } catch (e) { guard(e) }
  }

  useEffect(() => { refreshMe() /* eslint-disable-next-line */ }, [])

  const onChangePwd = async (e) => {
    e.preventDefault()
    setPwdMsg(''); setPwdErr(''); setPwdBusy(true)
    try {
      await changePassword(cur, next)
      setCur(''); setNext(''); setPwdMsg(t('admin.pwdChanged')); toast.success(t('admin.pwdChanged'))
    } catch (err) {
      if (guard(err)) return
      setPwdErr(err.message)
    } finally { setPwdBusy(false) }
  }

  const startSetup = async () => {
    setTwoMsg(''); setTwoErr(''); setFreshCodes(null); setTwoBusy(true)
    try {
      setSetup(await twofaSetup()); setCode('')
    } catch (err) {
      if (guard(err)) return
      setTwoErr(err.message)
    } finally { setTwoBusy(false) }
  }

  const confirmEnable = async (e) => {
    e.preventDefault()
    setTwoErr(''); setTwoBusy(true)
    try {
      const res = await twofaEnable(code)
      setEnabled(true); setSetup(null); setCode(''); setTwoMsg(t('admin.twofaOn')); toast.success(t('admin.twofaOn'))
      setFreshCodes(res.backup_codes || null)
      await refreshMe()
    } catch (err) {
      if (guard(err)) return
      setTwoErr(err.message)
    } finally { setTwoBusy(false) }
  }

  const confirmDisable = async (e) => {
    e.preventDefault()
    setTwoErr(''); setTwoBusy(true)
    try {
      await twofaDisable(code)
      setEnabled(false); setDisabling(false); setCode(''); setFreshCodes(null); setTwoMsg(t('admin.twofaOff')); toast.success(t('admin.twofaOff'))
      await refreshMe()
    } catch (err) {
      if (guard(err)) return
      setTwoErr(err.message)
    } finally { setTwoBusy(false) }
  }

  const confirmRegen = async (e) => {
    e.preventDefault()
    setTwoErr(''); setTwoBusy(true)
    try {
      const res = await twofaRegenBackup(code)
      setRegen(false); setCode(''); setFreshCodes(res.backup_codes || null)
      await refreshMe()
    } catch (err) {
      if (guard(err)) return
      setTwoErr(err.message)
    } finally { setTwoBusy(false) }
  }

  return (
    <>
      <div className="admin-head">
        <span className="kicker">{t('admin.panel')}</span>
        <h1 className="display">{t('admin.tabSecurity')}</h1>
      </div>

      <div className="sec-grid">
        {/* Зміна пароля */}
        <section className="sec-card">
          <h3 className="an-h">{t('admin.secPwdTitle')}</h3>
          {pwdErr && <div className="form-error-top" role="alert">{pwdErr}</div>}
          {pwdMsg && <div className="form-ok" role="status">{pwdMsg}</div>}
          <form className="form" onSubmit={onChangePwd}>
            <div className="field">
              <label htmlFor="cur-pwd">{t('admin.curPwd')}</label>
              <input id="cur-pwd" type="password" autoComplete="current-password"
                value={cur} onChange={(e) => setCur(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="new-pwd">{t('admin.newPwd')}</label>
              <input id="new-pwd" type="password" autoComplete="new-password"
                value={next} onChange={(e) => setNext(e.target.value)} />
            </div>
            <button type="submit" className="btn" disabled={pwdBusy || !cur || next.length < 6}>
              {pwdBusy ? t('admin.changing') : t('admin.changeBtn')} <span className="arrow">↗</span>
            </button>
          </form>
        </section>

        {/* 2FA */}
        <section className="sec-card">
          <h3 className="an-h">
            {t('admin.sec2faTitle')}
            <span className={`twofa-state ${enabled ? 'on' : 'off'}`}>
              {enabled ? t('admin.sec2faStateOn') : t('admin.sec2faStateOff')}
            </span>
          </h3>
          <p className="an-note">{t('admin.sec2faIntro')}</p>
          {twoErr && <div className="form-error-top" role="alert">{twoErr}</div>}
          {twoMsg && <div className="form-ok" role="status">{twoMsg}</div>}

          {/* Показ свіжих backup-кодів (один раз) */}
          {freshCodes && <BackupCodes codes={freshCodes} />}

          {!enabled && !setup && (
            <button type="button" className="btn" onClick={startSetup} disabled={twoBusy}>
              {t('admin.enable2fa')} <span className="arrow">↗</span>
            </button>
          )}

          {!enabled && setup && (
            <form className="twofa-setup form" onSubmit={confirmEnable}>
              <p className="an-note">{t('admin.scanQr')}</p>
              <div className="qr" dangerouslySetInnerHTML={{ __html: setup.qr_svg }} />
              <code className="twofa-secret">{setup.secret}</code>
              <div className="field">
                <label htmlFor="twofa-code">{t('admin.enterCode')}</label>
                <input id="twofa-code" type="text" inputMode="numeric" autoComplete="one-time-code"
                  value={code} onChange={(e) => setCode(e.target.value)} />
              </div>
              <button type="submit" className="btn" disabled={twoBusy || code.length < 6}>
                {t('admin.confirm')} <span className="arrow">↗</span>
              </button>
            </form>
          )}

          {enabled && (
            <p className="backup-remaining">{t('admin.backupRemaining', { n: remaining })}</p>
          )}

          {enabled && !disabling && !regen && (
            <div className="sec-actions">
              <button type="button" className="btn btn--ghost" onClick={() => { setRegen(true); setCode(''); setTwoMsg(''); setFreshCodes(null) }}>
                {t('admin.backupRegen')}
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => { setDisabling(true); setCode(''); setTwoMsg(''); setFreshCodes(null) }}>
                {t('admin.disable2fa')}
              </button>
            </div>
          )}

          {enabled && regen && (
            <form className="form" onSubmit={confirmRegen}>
              <p className="an-note">{t('admin.backupRegenHint')}</p>
              <div className="field">
                <label htmlFor="regen-code">{t('admin.enterCode')}</label>
                <input id="regen-code" type="text" inputMode="numeric" autoComplete="one-time-code"
                  value={code} onChange={(e) => setCode(e.target.value)} />
              </div>
              <button type="submit" className="btn" disabled={twoBusy || code.length < 6}>
                {t('admin.backupRegen')} <span className="arrow">↗</span>
              </button>
            </form>
          )}

          {enabled && disabling && (
            <form className="form" onSubmit={confirmDisable}>
              <div className="field">
                <label htmlFor="dis-code">{t('admin.enterCode')}</label>
                <input id="dis-code" type="text" inputMode="numeric" autoComplete="one-time-code"
                  value={code} onChange={(e) => setCode(e.target.value)} />
              </div>
              <button type="submit" className="btn btn--ghost" disabled={twoBusy || code.length < 6}>
                {t('admin.disable2fa')}
              </button>
            </form>
          )}
        </section>
      </div>
    </>
  )
}
