import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material';
import { LabService } from '../../../../application/services/LabService';
import { LicenseService } from '../../../../application/services/LicenseService';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('lab');
  const [labInfo, setLabInfo] = useState<any>(null);
  const [licenseInfo, setLicenseInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const labService = new LabService();
  const licenseService = new LicenseService();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const lab = await labService.getLabInfo('default-lab-id');
      const license = await licenseService.getLicenseInfo('default-lab-id');
      setLabInfo(lab);
      setLicenseInfo(license);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetDatabase = async () => {
    setResetLoading(true);
    try {
      const result = await (window as any).electronAPI?.db?.reset?.();
      if (result?.success) {
        setResetMessage({ type: 'success', text: 'Database reset successfully. Please refresh the application.' });
        // Reload the app after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setResetMessage({ type: 'error', text: result?.error || 'Failed to reset database' });
      }
    } catch (error) {
      setResetMessage({ type: 'error', text: 'Error resetting database: ' + (error instanceof Error ? error.message : String(error)) });
    } finally {
      setResetLoading(false);
      setResetDialogOpen(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem' }}>Cargando configuración...</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>Configuración del Sistema</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #dee2e6' }}>
        <button
          onClick={() => setActiveTab('lab')}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeTab === 'lab' ? '#3498db' : 'transparent',
            color: activeTab === 'lab' ? 'white' : '#7f8c8d',
            border: 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'lab' ? 'bold' : 'normal'
          }}
        >
          Lab
        </button>
        <button
          onClick={() => setActiveTab('license')}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeTab === 'license' ? '#3498db' : 'transparent',
            color: activeTab === 'license' ? 'white' : '#7f8c8d',
            border: 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'license' ? 'bold' : 'normal'
          }}
        >
          Licencia
        </button>
        <button
          onClick={() => setActiveTab('backup')}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeTab === 'backup' ? '#3498db' : 'transparent',
            color: activeTab === 'backup' ? 'white' : '#7f8c8d',
            border: 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'backup' ? 'bold' : 'normal'
          }}
        >
          Respaldo
        </button>
        <button
          onClick={() => setActiveTab('development')}
          style={{
            padding: '0.75rem 1.5rem',
            background: activeTab === 'development' ? '#3498db' : 'transparent',
            color: activeTab === 'development' ? 'white' : '#7f8c8d',
            border: 'none',
            cursor: 'pointer',
            fontWeight: activeTab === 'development' ? 'bold' : 'normal'
          }}
        >
          Desarrollo
        </button>
      </div>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        {activeTab === 'lab' && (
          <div>
            <h3>Información del Laboratorio</h3>
            <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Nombre</label>
                <input
                  type="text"
                  value={labInfo?.name || ''}
                  disabled
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', background: '#f8f9fa' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Email</label>
                <input
                  type="email"
                  value={labInfo?.email || ''}
                  disabled
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', background: '#f8f9fa' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Teléfono</label>
                <input
                  type="tel"
                  value={labInfo?.phone || ''}
                  disabled
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', background: '#f8f9fa' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Dirección</label>
                <input
                  type="text"
                  value={labInfo?.address || ''}
                  disabled
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', background: '#f8f9fa' }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'license' && (
          <div>
            <h3>Información de Licencia</h3>
            <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Clave de Licencia</label>
                <input
                  type="password"
                  value="••••••••••••••••"
                  disabled
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', background: '#f8f9fa' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Estado</label>
                <div style={{ padding: '0.5rem', background: '#d4edda', color: '#155724', borderRadius: '4px', textAlign: 'center' }}>Activo</div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Fecha de Activación</label>
                <input
                  type="text"
                  value={licenseInfo?.activationDate ? new Date(licenseInfo.activationDate).toLocaleDateString('es-CO') : ''}
                  disabled
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', background: '#f8f9fa' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Fecha de Expiración</label>
                <input
                  type="text"
                  value={licenseInfo?.expirationDate ? new Date(licenseInfo.expirationDate).toLocaleDateString('es-CO') : ''}
                  disabled
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', background: '#f8f9fa' }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'backup' && (
          <div>
            <h3>Respaldo y Mantenimiento</h3>
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ background: '#cfe2ff', border: '1px solid #084298', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
                <p style={{ color: '#084298', margin: '0.5rem 0' }}>
                  <strong>Último Respaldo:</strong> No hay respaldos registrados
                </p>
              </div>

              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <h4 style={{ marginBottom: '0.5rem' }}>Crear Respaldo Manual</h4>
                  <button style={{ padding: '0.75rem 1.5rem', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Crear Respaldo Ahora
                  </button>
                </div>
                <div>
                  <h4 style={{ marginBottom: '0.5rem' }}>Descargar Base de Datos</h4>
                  <button style={{ padding: '0.75rem 1.5rem', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Descargar BD
                  </button>
                </div>
                <div>
                  <h4 style={{ marginBottom: '0.5rem' }}>Optimización</h4>
                  <button style={{ padding: '0.75rem 1.5rem', background: '#9b59b6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Optimizar Ahora
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'development' && (
          <div>
            <h3>Herramientas de Desarrollo</h3>
            {resetMessage && (
              <Alert severity={resetMessage.type} sx={{ marginBottom: '1.5rem' }}>
                {resetMessage.text}
              </Alert>
            )}
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ background: '#fff3cd', border: '1px solid #ffb84d', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem' }}>
                <p style={{ color: '#664d03', margin: '0.5rem 0' }}>
                  <strong>⚠️ Advertencia:</strong> Las herramientas de desarrollo solo están disponibles en modo de desarrollo. El reinicio de la base de datos eliminará todos los datos y los reemplazará con datos de prueba.
                </p>
              </div>

              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <h4 style={{ marginBottom: '0.5rem' }}>Reiniciar Base de Datos</h4>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>Limpia todos los datos y carga datos de prueba incluidos en la aplicación.</p>
                  <button 
                    onClick={() => setResetDialogOpen(true)}
                    style={{ padding: '0.75rem 1.5rem', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Reiniciar BD
                  </button>
                </div>
              </div>
            </div>

            <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)}>
              <DialogTitle>Reiniciar Base de Datos</DialogTitle>
              <DialogContent>
                <p style={{ marginTop: '1rem' }}>
                  ¿Está seguro de que desea reiniciar la base de datos? Esta acción eliminará todos los datos y los reemplazará con datos de prueba.
                </p>
                <p style={{ color: '#e74c3c', fontWeight: 'bold' }}>
                  Esta acción no se puede deshacer.
                </p>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setResetDialogOpen(false)} disabled={resetLoading}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleResetDatabase} 
                  variant="contained" 
                  color="error"
                  disabled={resetLoading}
                >
                  {resetLoading ? 'Reiniciando...' : 'Reiniciar'}
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
