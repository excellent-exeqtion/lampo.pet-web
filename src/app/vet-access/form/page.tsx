// components/ValidadorProfesional.js
"use client";
import { ProfessionalData } from '@/types/index';
import { useState } from 'react';

export default function ValidadorProfesional() {
  const [matricula, setMatricula] = useState('');
  const [profesional, setProfesional] = useState<ProfessionalData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleValidation = async (e: any) => {
    e.preventDefault();
    if (!matricula) return;

    setIsLoading(true);
    setError(null);
    setProfesional(null);

    try {
      const response = await fetch('/api/vet/validar-matricula', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matricula }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en la validación.');
      }

      setProfesional(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h2>Validación de Matrícula Profesional COMVEZCOL</h2>
      <form onSubmit={handleValidation}>
        <input
          type="text"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
          placeholder="Ingrese el número de matrícula"
          style={{ padding: '10px', width: '70%', marginRight: '10px' }}
        />
        <button type="submit" disabled={isLoading} style={{ padding: '10px' }}>
          {isLoading ? 'Validando...' : 'Validar'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '20px' }}>Error: {error}</p>}

      {profesional && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h3>Resultados de la Búsqueda</h3>
          <img src={profesional.foto} alt="Foto del profesional" style={{ width: '150px', borderRadius: '50%', float: 'right' }} />
          <p><strong>Nombres:</strong> {profesional.nombres}</p>
          <p><strong>Apellidos:</strong> {profesional.apellidos}</p>
          <p><strong>Matrícula No.:</strong> {profesional.numeroMatricula}</p>
          <p><strong>Título Obtenido:</strong> {profesional.tituloObtenido}</p>
          <p><strong>Universidad:</strong> {profesional.universidad}</p>
          <p><strong>Acta de Grado:</strong> {profesional.actaGrado}</p>
          <p><strong>Estado:</strong> <span style={{ color: 'green', fontWeight: 'bold' }}>{profesional.estado}</span></p>
        </div>
      )}
    </div>
  );
}