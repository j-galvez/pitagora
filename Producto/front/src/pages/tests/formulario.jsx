import { useState, useEffect } from 'react';

export default function Formulario() {
  const [activeTab, setActiveTab] = useState('usuarios');
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // Estados para Usuario
  const [usuario, setUsuario] = useState({
    nombre: '',
    correo: '',
    password: '',
    telefono: '',
    rol: 'cliente',
    estado: 'Activo'
  });

  // Estados para Cliente
  const [cliente, setCliente] = useState({
    nombreEmpresa: '',
    rut: '',
    correoContacto: '',
    telefono: '',
    direccion: '',
    estado: 'Activo'
  });

  // Estados para Obra
  const [obra, setObra] = useState({
    idCliente: '',
    nombreObra: '',
    descripcionObra: '',
    direccion: '',
    planosPresupuestos: '',
    fechaEntrega: '',
    garantiaExpira: '',
    estadoObra: 'Activa'
  });

  // Estados para Ticket
  const [ticket, setTicket] = useState({
    idObra: '',
    idUsuario_creador: '',
    estadoGeneral: 'abierto'
  });

  // Estados para Categoría
  const [categoria, setCategoria] = useState({
    nombreCategoria: '',
    subcategoria: '',
    descripcion: ''
  });

  // Estados para Observación
  const [observacion, setObservacion] = useState({
    idTicket: '',
    idCategoria: '',
    falla: '',
    ubicacionExacta: '',
    descripcionProblema: '',
    urgencia: 'media'
  });

  // Estados para listas
  const [usuarios, setUsuarios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [obras, setObras] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [observaciones, setObservaciones] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:8080/api';

  // Cargar datos cuando se cambia al tab de listado
  useEffect(() => {
    if (activeTab === 'listado') {
      cargarDatos();
    }
  }, [activeTab]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [usuariosRes, clientesRes, obrasRes, ticketsRes, categoriasRes, observacionesRes] = await Promise.all([
        fetch(`${API_URL}/usuarios`),
        fetch(`${API_URL}/clientes`),
        fetch(`${API_URL}/obras`),
        fetch(`${API_URL}/tickets`),
        fetch(`${API_URL}/categorias`),
        fetch(`${API_URL}/observaciones`)
      ]);

      if (usuariosRes.ok) setUsuarios(await usuariosRes.json());
      if (clientesRes.ok) setClientes(await clientesRes.json());
      if (obrasRes.ok) setObras(await obrasRes.json());
      if (ticketsRes.ok) setTickets(await ticketsRes.json());
      if (categoriasRes.ok) setCategorias(await categoriasRes.json());
      if (observacionesRes.ok) setObservaciones(await observacionesRes.json());
    } catch (error) {
      setMensaje({ tipo: 'danger', texto: 'Error al cargar datos' });
    } finally {
      setLoading(false);
    }
  };

  // Handlers para Usuario
  const handleUsuarioChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleUsuarioSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
      });
      
      if (response.ok) {
        const data = await response.json();
        setMensaje({ tipo: 'success', texto: `Usuario creado exitosamente. ID: ${data.idUsuario}` });
        setUsuario({ nombre: '', correo: '', password: '', telefono: '', rol: 'cliente', estado: 'Activo' });
      } else {
        const error = await response.text();
        setMensaje({ tipo: 'danger', texto: error });
      }
    } catch (error) {
      setMensaje({ tipo: 'danger', texto: 'Error al conectar con el servidor' });
    }
  };

  // Handlers para Cliente
  const handleClienteChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleClienteSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente)
      });
      
      if (response.ok) {
        const data = await response.json();
        setMensaje({ tipo: 'success', texto: `Cliente creado exitosamente. ID: ${data.idCliente}` });
        setCliente({ nombreEmpresa: '', rut: '', correoContacto: '', telefono: '', direccion: '', estado: 'Activo' });
      } else {
        const error = await response.text();
        setMensaje({ tipo: 'danger', texto: error });
      }
    } catch (error) {
      setMensaje({ tipo: 'danger', texto: 'Error al conectar con el servidor' });
    }
  };

  // Handlers para Obra
  const handleObraChange = (e) => {
    setObra({ ...obra, [e.target.name]: e.target.value });
  };

  const handleObraSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/obras`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obra)
      });
      
      if (response.ok) {
        const data = await response.json();
        setMensaje({ tipo: 'success', texto: `Obra creada exitosamente. ID: ${data.idObra}` });
        setObra({
          idCliente: '',
          nombreObra: '',
          descripcionObra: '',
          direccion: '',
          planosPresupuestos: '',
          fechaEntrega: '',
          garantiaExpira: '',
          estadoObra: 'Activa'
        });
      } else {
        const error = await response.text();
        setMensaje({ tipo: 'danger', texto: error });
      }
    } catch (error) {
      setMensaje({ tipo: 'danger', texto: 'Error al conectar con el servidor' });
    }
  };

  // Handlers para Ticket
  const handleTicketChange = (e) => {
    setTicket({ ...ticket, [e.target.name]: e.target.value });
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idObra: parseInt(ticket.idObra),
          idUsuario_creador: parseInt(ticket.idUsuario_creador),
          estadoGeneral: ticket.estadoGeneral
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setMensaje({ tipo: 'success', texto: `Ticket creado exitosamente. ID: ${data.idTicket}` });
        setTicket({ idObra: '', idUsuario_creador: '', estadoGeneral: 'abierto' });
      } else {
        const error = await response.text();
        setMensaje({ tipo: 'danger', texto: error });
      }
    } catch (error) {
      setMensaje({ tipo: 'danger', texto: 'Error al conectar con el servidor' });
    }
  };

  // Handlers para Categoría
  const handleCategoriaChange = (e) => {
    setCategoria({ ...categoria, [e.target.name]: e.target.value });
  };

  const handleCategoriaSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/categorias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoria)
      });
      
      if (response.ok) {
        const data = await response.json();
        setMensaje({ tipo: 'success', texto: `Categoría creada exitosamente. ID: ${data.idCategoria}` });
        setCategoria({ nombreCategoria: '', subcategoria: '', descripcion: '' });
      } else {
        const error = await response.text();
        setMensaje({ tipo: 'danger', texto: error });
      }
    } catch (error) {
      setMensaje({ tipo: 'danger', texto: 'Error al conectar con el servidor' });
    }
  };

  // Handlers para Observación
  const handleObservacionChange = (e) => {
    setObservacion({ ...observacion, [e.target.name]: e.target.value });
  };

  const handleObservacionSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/observaciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idTicket: parseInt(observacion.idTicket),
          idCategoria: parseInt(observacion.idCategoria),
          falla: observacion.falla,
          ubicacionExacta: observacion.ubicacionExacta,
          descripcionProblema: observacion.descripcionProblema,
          urgencia: observacion.urgencia
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setMensaje({ tipo: 'success', texto: `Observación creada exitosamente. ID: ${data.idObservacion}` });
        setObservacion({
          idTicket: '',
          idCategoria: '',
          falla: '',
          ubicacionExacta: '',
          descripcionProblema: '',
          urgencia: 'media'
        });
      } else {
        const error = await response.text();
        setMensaje({ tipo: 'danger', texto: error });
      }
    } catch (error) {
      setMensaje({ tipo: 'danger', texto: 'Error al conectar con el servidor' });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <h1 className="text-center mb-4">Formularios de Prueba - Sistema Pitágora</h1>

          {/* Mensaje de respuesta */}
          {mensaje.texto && (
            <div className={`alert alert-${mensaje.tipo} alert-dismissible fade show`} role="alert">
              {mensaje.texto}
              <button type="button" className="btn-close" onClick={() => setMensaje({ tipo: '', texto: '' })}></button>
            </div>
          )}

          {/* Tabs */}
          <ul className="nav nav-tabs mb-4" role="tablist">
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'usuarios' ? 'active' : ''}`} onClick={() => setActiveTab('usuarios')}>
                👤 Usuarios
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'clientes' ? 'active' : ''}`} onClick={() => setActiveTab('clientes')}>
                🏢 Clientes
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'obras' ? 'active' : ''}`} onClick={() => setActiveTab('obras')}>
                🏗️ Obras
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'tickets' ? 'active' : ''}`} onClick={() => setActiveTab('tickets')}>
                🎫 Tickets
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'categorias' ? 'active' : ''}`} onClick={() => setActiveTab('categorias')}>
                📁 Categorías
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'observaciones' ? 'active' : ''}`} onClick={() => setActiveTab('observaciones')}>
                📝 Observaciones
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === 'listado' ? 'active' : ''}`} onClick={() => setActiveTab('listado')}>
                📋 Listado
              </button>
            </li>
          </ul>

          {/* Contenido de Tabs */}
          <div className="tab-content">
            {/* Formulario Clientes */}
            {activeTab === 'clientes' && (
              <div className="card">
                <div className="card-header bg-info text-white">
                  <h5 className="mb-0">🏢 Crear Cliente</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleClienteSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Nombre Empresa *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="nombreEmpresa"
                          value={cliente.nombreEmpresa}
                          onChange={handleClienteChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">RUT *</label>
                        <input
                          type="text"
                          className="form-control"
                          name="rut"
                          value={cliente.rut}
                          onChange={handleClienteChange}
                          placeholder="12345678-9"
                          required
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Correo Contacto *</label>
                        <input
                          type="email"
                          className="form-control"
                          name="correoContacto"
                          value={cliente.correoContacto}
                          onChange={handleClienteChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Teléfono</label>
                        <input
                          type="text"
                          className="form-control"
                          name="telefono"
                          value={cliente.telefono}
                          onChange={handleClienteChange}
                          placeholder="+56912345678"
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Dirección</label>
                      <input
                        type="text"
                        className="form-control"
                        name="direccion"
                        value={cliente.direccion}
                        onChange={handleClienteChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Estado</label>
                      <select
                        className="form-select"
                        name="estado"
                        value={cliente.estado}
                        onChange={handleClienteChange}
                      >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-info">
                      💾 Guardar Cliente
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Formulario Usuario */}
            {activeTab === 'usuarios' && (
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Crear Usuario</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleUsuarioSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Nombre *</label>
                      <input type="text" className="form-control" name="nombre" value={usuario.nombre} onChange={handleUsuarioChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Correo *</label>
                      <input type="email" className="form-control" name="correo" value={usuario.correo} onChange={handleUsuarioChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Contraseña *</label>
                      <input type="password" className="form-control" name="password" value={usuario.password} onChange={handleUsuarioChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Teléfono</label>
                      <input type="tel" className="form-control" name="telefono" value={usuario.telefono} onChange={handleUsuarioChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Rol *</label>
                      <select className="form-select" name="rol" value={usuario.rol} onChange={handleUsuarioChange} required>
                        <option value="admin">Admin</option>
                        <option value="jefe_obra">Jefe de Obra</option>
                        <option value="cliente">Cliente</option>
                        <option value="tecnico">Técnico</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Estado *</label>
                      <select className="form-select" name="estado" value={usuario.estado} onChange={handleUsuarioChange} required>
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Crear Usuario</button>
                  </form>
                </div>
              </div>
            )}

            {/* Formulario Obra */}
            {activeTab === 'obras' && (
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Crear Obra</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleObraSubmit}>
                    <div className="mb-3">
                      <label className="form-label">ID Cliente *</label>
                      <input type="number" className="form-control" name="idCliente" value={obra.idCliente} onChange={handleObraChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Nombre de la Obra *</label>
                      <input type="text" className="form-control" name="nombreObra" value={obra.nombreObra} onChange={handleObraChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Descripción</label>
                      <textarea className="form-control" name="descripcionObra" value={obra.descripcionObra} onChange={handleObraChange} rows="3" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Dirección</label>
                      <input type="text" className="form-control" name="direccion" value={obra.direccion} onChange={handleObraChange} />
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Fecha de Entrega</label>
                        <input type="date" className="form-control" name="fechaEntrega" value={obra.fechaEntrega} onChange={handleObraChange} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Garantía Expira</label>
                        <input type="date" className="form-control" name="garantiaExpira" value={obra.garantiaExpira} onChange={handleObraChange} />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-success w-100">Crear Obra</button>
                  </form>
                </div>
              </div>
            )}

            {/* Formulario Ticket */}
            {activeTab === 'tickets' && (
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Crear Ticket</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleTicketSubmit}>
                    <div className="mb-3">
                      <label className="form-label">ID Obra *</label>
                      <input type="number" className="form-control" name="idObra" value={ticket.idObra} onChange={handleTicketChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">ID Usuario Creador *</label>
                      <input type="number" className="form-control" name="idUsuario_creador" value={ticket.idUsuario_creador} onChange={handleTicketChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Estado General *</label>
                      <select className="form-select" name="estadoGeneral" value={ticket.estadoGeneral} onChange={handleTicketChange} required>
                        <option value="abierto">Abierto</option>
                        <option value="en proceso">En Proceso</option>
                        <option value="terminado">Terminado</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-warning w-100">Crear Ticket</button>
                  </form>
                </div>
              </div>
            )}

            {/* Formulario Categoría */}
            {activeTab === 'categorias' && (
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Crear Categoría</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleCategoriaSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Nombre Categoría *</label>
                      <input type="text" className="form-control" name="nombreCategoria" value={categoria.nombreCategoria} onChange={handleCategoriaChange} placeholder="Ej: Instalaciones Sanitarias" required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Subcategoría</label>
                      <input type="text" className="form-control" name="subcategoria" value={categoria.subcategoria} onChange={handleCategoriaChange} placeholder="Ej: Tuberías" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Descripción</label>
                      <textarea className="form-control" name="descripcion" value={categoria.descripcion} onChange={handleCategoriaChange} rows="3" />
                    </div>
                    <button type="submit" className="btn btn-info w-100">Crear Categoría</button>
                  </form>
                </div>
              </div>
            )}

            {/* Formulario Observación */}
            {activeTab === 'observaciones' && (
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Crear Observación</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleObservacionSubmit}>
                    <div className="mb-3">
                      <label className="form-label">ID Ticket *</label>
                      <input type="number" className="form-control" name="idTicket" value={observacion.idTicket} onChange={handleObservacionChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">ID Categoría *</label>
                      <input type="number" className="form-control" name="idCategoria" value={observacion.idCategoria} onChange={handleObservacionChange} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Falla *</label>
                      <input type="text" className="form-control" name="falla" value={observacion.falla} onChange={handleObservacionChange} placeholder="Ej: Grieta en muro" required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Ubicación Exacta *</label>
                      <input type="text" className="form-control" name="ubicacionExacta" value={observacion.ubicacionExacta} onChange={handleObservacionChange} placeholder="Ej: Baño N°4" required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Descripción del Problema *</label>
                      <textarea className="form-control" name="descripcionProblema" value={observacion.descripcionProblema} onChange={handleObservacionChange} rows="3" required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Urgencia *</label>
                      <select className="form-select" name="urgencia" value={observacion.urgencia} onChange={handleObservacionChange} required>
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-danger w-100">Crear Observación</button>
                  </form>
                </div>
              </div>
            )}

            {/* Tab Listado */}
            {activeTab === 'listado' && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>Datos Registrados</h5>
                  <button className="btn btn-primary btn-sm" onClick={cargarDatos}>🔄 Actualizar</button>
                </div>

                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Tabla Usuarios */}
                    <div className="card mb-4">
                      <div className="card-header">
                        <h6 className="mb-0">👤 Usuarios ({usuarios.length})</h6>
                      </div>
                      <div className="card-body">
                        {usuarios.length === 0 ? (
                          <p className="text-muted">No hay usuarios registrados</p>
                        ) : (
                          <div className="table-responsive">
                            <table className="table table-striped table-hover table-sm">
                              <thead>
                                <tr>
                                  <th>ID</th>
                                  <th>Nombre</th>
                                  <th>Correo</th>
                                  <th>Rol</th>
                                  <th>Estado</th>
                                </tr>
                              </thead>
                              <tbody>
                                {usuarios.map((u) => (
                                  <tr key={u.idUsuario}>
                                    <td>{u.idUsuario}</td>
                                    <td>{u.nombre}</td>
                                    <td>{u.correo}</td>
                                    <td><span className="badge bg-info">{u.rol}</span></td>
                                    <td><span className={`badge ${u.estado === 'Activo' ? 'bg-success' : 'bg-secondary'}`}>{u.estado}</span></td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tabla Clientes */}
                    <div className="card mb-4">
                      <div className="card-header">
                        <h6 className="mb-0">🏢 Clientes ({clientes.length})</h6>
                      </div>
                      <div className="card-body">
                        {clientes.length === 0 ? (
                          <p className="text-muted">No hay clientes registrados</p>
                        ) : (
                          <div className="table-responsive">
                            <table className="table table-striped table-hover table-sm">
                              <thead>
                                <tr>
                                  <th>ID</th>
                                  <th>Empresa</th>
                                  <th>RUT</th>
                                  <th>Correo</th>
                                  <th>Teléfono</th>
                                  <th>Estado</th>
                                </tr>
                              </thead>
                              <tbody>
                                {clientes.map((c) => (
                                  <tr key={c.idCliente}>
                                    <td>{c.idCliente}</td>
                                    <td>{c.nombreEmpresa}</td>
                                    <td>{c.rut}</td>
                                    <td>{c.correoContacto}</td>
                                    <td>{c.telefono || '-'}</td>
                                    <td><span className={`badge ${c.estado === 'activo' ? 'bg-success' : 'bg-secondary'}`}>{c.estado}</span></td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tabla Obras */}
                    <div className="card mb-4">
                      <div className="card-header">
                        <h6 className="mb-0">🏗️ Obras ({obras.length})</h6>
                      </div>
                      <div className="card-body">
                        {obras.length === 0 ? (
                          <p className="text-muted">No hay obras registradas</p>
                        ) : (
                          <div className="table-responsive">
                            <table className="table table-striped table-hover table-sm">
                              <thead>
                                <tr>
                                  <th>ID</th>
                                  <th>Nombre</th>
                                  <th>Cliente ID</th>
                                  <th>Estado</th>
                                </tr>
                              </thead>
                              <tbody>
                                {obras.map((o) => (
                                  <tr key={o.idObra}>
                                    <td>{o.idObra}</td>
                                    <td>{o.nombreObra}</td>
                                    <td>{o.idCliente}</td>
                                    <td>
                                      <span className={`badge ${o.estadoObra === 'Activa' ? 'bg-success' : o.estadoObra === 'Garantía Vencida' ? 'bg-warning' : 'bg-secondary'}`}>
                                        {o.estadoObra}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tabla Tickets */}
                    <div className="card mb-4">
                      <div className="card-header">
                        <h6 className="mb-0">🎫 Tickets ({tickets.length})</h6>
                      </div>
                      <div className="card-body">
                        {tickets.length === 0 ? (
                          <p className="text-muted">No hay tickets registrados</p>
                        ) : (
                          <div className="table-responsive">
                            <table className="table table-striped table-hover table-sm">
                              <thead>
                                <tr>
                                  <th>ID</th>
                                  <th>Obra ID</th>
                                  <th>Usuario</th>
                                  <th>Estado</th>
                                </tr>
                              </thead>
                              <tbody>
                                {tickets.map((t) => (
                                  <tr key={t.idTicket}>
                                    <td>{t.idTicket}</td>
                                    <td>{t.idObra}</td>
                                    <td>{t.idUsuario_creador}</td>
                                    <td>
                                      <span className={`badge ${t.estadoGeneral === 'abierto' ? 'bg-primary' : t.estadoGeneral === 'en proceso' ? 'bg-warning' : 'bg-success'}`}>
                                        {t.estadoGeneral}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tabla Categorías */}
                    <div className="card mb-4">
                      <div className="card-header">
                        <h6 className="mb-0">📁 Categorías ({categorias.length})</h6>
                      </div>
                      <div className="card-body">
                        {categorias.length === 0 ? (
                          <p className="text-muted">No hay categorías registradas</p>
                        ) : (
                          <div className="table-responsive">
                            <table className="table table-striped table-hover table-sm">
                              <thead>
                                <tr>
                                  <th>ID</th>
                                  <th>Nombre</th>
                                  <th>Subcategoría</th>
                                  <th>Descripción</th>
                                </tr>
                              </thead>
                              <tbody>
                                {categorias.map((c) => (
                                  <tr key={c.idCategoria}>
                                    <td>{c.idCategoria}</td>
                                    <td>{c.nombreCategoria}</td>
                                    <td>{c.subcategoria || '-'}</td>
                                    <td>{c.descripcion || '-'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tabla Observaciones */}
                    <div className="card mb-4">
                      <div className="card-header">
                        <h6 className="mb-0">📝 Observaciones ({observaciones.length})</h6>
                      </div>
                      <div className="card-body">
                        {observaciones.length === 0 ? (
                          <p className="text-muted">No hay observaciones registradas</p>
                        ) : (
                          <div className="table-responsive">
                            <table className="table table-striped table-hover table-sm">
                              <thead>
                                <tr>
                                  <th>ID</th>
                                  <th>Ticket</th>
                                  <th>Falla</th>
                                  <th>Ubicación</th>
                                  <th>Urgencia</th>
                                  <th>Estado</th>
                                </tr>
                              </thead>
                              <tbody>
                                {observaciones.map((obs) => (
                                  <tr key={obs.idObservacion}>
                                    <td>{obs.idObservacion}</td>
                                    <td>{obs.idTicket}</td>
                                    <td>{obs.falla}</td>
                                    <td>{obs.ubicacionExacta}</td>
                                    <td>
                                      <span className={`badge ${obs.urgencia === 'alta' ? 'bg-danger' : obs.urgencia === 'media' ? 'bg-warning' : 'bg-secondary'}`}>
                                        {obs.urgencia}
                                      </span>
                                    </td>
                                    <td>
                                      <span className="badge bg-info">{obs.estadoObservacion}</span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
