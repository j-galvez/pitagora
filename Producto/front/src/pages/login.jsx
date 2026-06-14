import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotMessage, setForgotMessage] = useState('')
  const [forgotError, setForgotError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const resetSuccessMessage = sessionStorage.getItem('resetSuccessMessage')
    if (resetSuccessMessage) {
      setInfo(resetSuccessMessage)
      sessionStorage.removeItem('resetSuccessMessage')
    }
  }, [])

  const handleForgotPasswordClick = () => {
    setShowForgotModal(true)
    setError('')
    setInfo('')
    setForgotMessage('')
    setForgotError('')
  }

  const handleForgotSubmit = async () => {
    setForgotError('')
    setForgotMessage('')
    
    if (!forgotEmail.trim()) {
      setForgotError('Por favor ingresa tu correo electrónico')
      return
    }
    
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8080/api/usuarios/recuperar-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo: forgotEmail }),
      })

      const text = await response.text()
      if (!response.ok) {
        throw new Error(text || 'Error al enviar instrucciones de recuperación')
      }

      setForgotMessage('Si el correo está registrado y activo, se han enviado instrucciones al correo.')
      setForgotEmail('')
    } catch (err) {
      setForgotError(err.message || 'Error al enviar instrucciones de recuperación')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const parseResponse = async (response) => {
      const text = await response.text()
      try {
        return JSON.parse(text)
      } catch {
        return text
      }
    }

    try {
      const response = await fetch('http://localhost:8080/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: email,
          password: password,
        }),
      })

      const data = await parseResponse(response)

      if (!response.ok) {
        const message =
          typeof data === 'string'
            ? data
            : data?.message || data?.error || 'Error al iniciar sesión'

        const inactiveMessage = 'La cuenta está inactiva. No puedes acceder al sistema.'

        if (typeof message === 'string' && message.toLowerCase().includes('inactivo')) {
          setError(inactiveMessage)
        } else {
          setError(message)
        }

        setLoading(false)
        return
      }

      localStorage.setItem('usuario', JSON.stringify(data))

      if (data.resetPasswordRequired) {
        navigate('/reset-password')
        return
      }

      if (data.rol === 'admin') {
        navigate('/admin-dashboard')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.message || 'Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      className="vh-100"
      style={{ background: 'linear-gradient(135deg, #003860 0%, #91ABC6 100%)' }}
    >
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div
              className="card"
              style={{
                borderRadius: '1rem',
                boxShadow: '0 8px 32px rgba(0, 56, 96, 0.3)',
              }}
            >
              <div className="row g-0">
                <div
                  className="col-md-6 col-lg-5 d-none d-md-block"
                  style={{ backgroundColor: '#003860' }}
                >
                  <img
                    src="https://storage.googleapis.com/pitagora-evidencias-bucket/adrian-cogua-zTqpgdzteyc-unsplash-scaled.jpg"
                    alt="PITAGORA Constructora"
                    className="img-fluid"
                    style={{
                      borderRadius: '1rem 0 0 1rem',
                      objectFit: 'cover',
                      height: '100%',
                    }}
                  />
                </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5">
                    <form onSubmit={handleSubmit}>
                      <div className="d-flex align-items-center mb-4 pb-3 justify-content-center">
                        <img
                          src="https://storage.googleapis.com/pitagora-evidencias-bucket/logo.gif"
                          alt="PITAGORA Logo"
                          style={{ maxHeight: '60px' }}
                        />
                      </div>

                      <h5
                        className="fw-normal mb-3 pb-3 text-center"
                        style={{
                          letterSpacing: '1px',
                          color: '#003860',
                        }}
                      >
                        Ingresa a tu cuenta
                      </h5>

                      {/* Mostrar mensajes de información o error si existen */}
                      {info && (
                        <div className="alert alert-success" role="alert">
                          {info}
                        </div>
                      )}
                      {error && (
                        <div className="alert alert-danger" role="alert">
                          {error}
                        </div>
                      )}

                      <div className="form-outline mb-4">
                        <input
                          type="email"
                          id="form2Example17"
                          className="form-control form-control-lg"
                          style={{
                            borderColor: '#003860',
                            color: '#003860',
                          }}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <label
                          className="form-label"
                          htmlFor="form2Example17"
                          style={{ color: '#003860' }}
                        >
                          Correo electrónico
                        </label>
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          id="form2Example27"
                          className="form-control form-control-lg"
                          style={{
                            borderColor: '#003860',
                            color: '#003860',
                          }}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <label
                          className="form-label"
                          htmlFor="form2Example27"
                          style={{ color: '#003860' }}
                        >
                          Contraseña
                        </label>
                      </div>

                      <div className="pt-1 mb-4">
                        <button
                          className="btn btn-lg btn-block w-100"
                          type="submit"
                          style={{
                            backgroundColor: '#003860',
                            borderColor: '#003860',
                            color: 'white',
                          }}
                          disabled={loading}
                        >
                          {loading ? 'Cargando...' : 'Iniciar Sesión'}
                        </button>
                      </div>

                      <div className="text-center mb-3">
                        <button
                          type="button"
                          className="btn btn-link small"
                          style={{ color: '#ED1C25', textDecoration: 'none' }}
                          onClick={handleForgotPasswordClick}
                        >
                          ¿Olvidaste tu contraseña?
                        </button>
                      </div>

                      <div
                        className="text-center"
                        style={{
                          borderTop: '1px solid #91ABC6',
                          paddingTop: '1rem',
                        }}
                      >
                        <a
                          href="#!"
                          className="small"
                          style={{
                            color: '#91ABC6',
                            textDecoration: 'none',
                            marginRight: '1rem',
                          }}
                        >
                          Términos de uso
                        </a>
                        <a
                          href="#!"
                          className="small"
                          style={{
                            color: '#91ABC6',
                            textDecoration: 'none',
                          }}
                        >
                          Política de privacidad
                        </a>
                      </div>
                    </form>

                    {showForgotModal && (
                      <div
                        className="modal fade show"
                        style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                        tabIndex="-1"
                        role="dialog"
                        onClick={() => setShowForgotModal(false)}
                      >
                        <div
                          className="modal-dialog modal-dialog-centered"
                          role="document"
                          style={{ maxWidth: '420px' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
                            <div className="card">
                              <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                  <h5 className="card-title mb-0" style={{ color: '#003860' }}>
                                    Recuperar contraseña
                                  </h5>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Cerrar"
                                    onClick={() => setShowForgotModal(false)}
                                  ></button>
                                </div>

                                {forgotError && (
                                  <div className="alert alert-danger" role="alert">
                                    {forgotError}
                                  </div>
                                )}
                                {forgotMessage && (
                                  <div className="alert alert-success" role="alert">
                                    {forgotMessage}
                                  </div>
                                )}

                                <p className="text-muted mb-4" style={{ fontSize: '0.95rem' }}>
                                  Ingresa el correo asociado a tu cuenta y recibirás un código para restablecer tu contraseña.
                                </p>

                                <div className="mb-3">
                                  <label htmlFor="forgotEmail" className="form-label" style={{ color: '#003860' }}>
                                    Correo registrado
                                  </label>
                                  <input
                                    id="forgotEmail"
                                    type="email"
                                    className="form-control form-control-lg"
                                    style={{ borderColor: '#003860' }}
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    placeholder="ejemplo@correo.com"
                                    required
                                  />
                                </div>
                                <button
                                  type="button"
                                  className="btn btn-lg btn-block w-100"
                                  style={{ backgroundColor: '#003860', borderColor: '#003860', color: 'white' }}
                                  disabled={loading}
                                  onClick={handleForgotSubmit}
                                >
                                  {loading ? 'Enviando...' : 'Enviar instrucciones'}
                                </button>

                                <div className="text-center mt-3">
                                  <button
                                    type="button"
                                    className="btn btn-link small"
                                    style={{ color: '#91ABC6', textDecoration: 'none' }}
                                    onClick={() => setShowForgotModal(false)}
                                  >
                                    Volver al login
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}