import { useEffect, useState } from 'react'
import { getMe, changePassword, twofaSetup, twofaEnable, twofaDisable } from '../lib/api'
import { useI18n } from '../lib/i18n'

export default function AdminSecurity({ onUnauthorized }) {
  const { t } = useI18n()

  // зміна пароля
  const [cur, setCur] = useState('')
  const [next, setNext] = useState('')
  const [pwdBusy, setPwdBusy] = useState(false)
  const [pwdMsg, setPwdMsg] = useState('')
  const [pwdErr, setPwdErr] = useState('')

  // 2FA
  const [enabled, setEnabled] = useState(false)
  const [setup, setSetup] = useState(null) // { qr_svg, secret, otpauth_uri }
  const [code, setCode] = useState('')
  const [twoBusy, setTwoBusy] = useState(false)
  const [twoMsg, setTwoMsg] = useState('')
  const [twoErr, setTwoErr] = useState('')
  const [disabling, setDisabling] = useState(false)

  const guard = (err) => { if (err.status === 401) { onUnauthorized(); return true } return false }

  useEffect(() => {
    getMe().then((u) => setEnabled(Boolean(u.totp_enabled))).catch((e) => guard(e))
    // eslint-disable-next-line
  }, [])

  const onChangePwd = async (e) => {
    e.preventDefault()
    setPwdMsg(''); setPwdErr(''); setPwdBusy(true)
    try {
      await changePassword(cur, next)
      setCur(''); setNext(''); setPwdMsg(t('admin.pwdChanged'))
    } catch (err) {
      if (guard(err)) return
      setPwdErr(err.message)
    } finally { setPwdBusy(false) }
  }

  const startSetup = async () => {
    setTwoMsg(''); setTwoErr(''); setTwoBusy(true)
    try {
      setSetup(await twofaSetup())
      setCode('')
    } catch (err) {
      if (guard(err)) return
      setTwoErr(err.message)
    } finally { setTwoBusy(false) }
  }

  const confirmEnable = async (e) => {
    e.preventDefault()
    setTwoErr(''); setTwoBusy(true)
    try {
      await twofaEnable(code)
      setEnabled(true); setSetup(null); setCode(''); setTwoMsg(t('admin.twofaOn'))
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
      setEnabled(false); setDisabling(false); setCode(''); setTwoMsg(t('admin.twofaOff'))
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

          {enabled && !disabling && (
            <button type="button" className="btn btn--ghost" onClick={() => { setDisabling(true); setTwoMsg(''); setCode('') }}>
              {t('admin.disable2fa')}
            </button>
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
