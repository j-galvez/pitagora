import React from 'react';

export default function Footer() {
  return (
    <footer className="footer mt-auto py-3 bg-light text-center shadow-sm">
      <div className="container">
        <span className="text-muted small">
          © {new Date().getFullYear()} Constructora Pitágora - Sistema de Postventa V2
        </span>
      </div>
    </footer>
  );
}