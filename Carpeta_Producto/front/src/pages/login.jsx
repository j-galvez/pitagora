import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la autenticación real
    console.log('Login:', { email, password })
    navigate('/tickets')
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
                    src="https://libertyfield.pe/wp-content/uploads/2022/10/adrian-cogua-zTqpgdzteyc-unsplash-scaled.jpg"
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
                          src="https://www.pitagora.cl/images/logo_up_pitagora.gif"
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
                        >
                          Iniciar Sesión
                        </button>
                      </div>

                      <div className="text-center">
                        <a
                          className="small"
                          href="#!"
                          style={{
                            color: '#ED1C25',
                            textDecoration: 'none',
                          }}
                        >
                          ¿Olvidaste tu contraseña?
                        </a>
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