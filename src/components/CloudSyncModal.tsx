import React, { useState, useEffect } from 'react';
import {
  Lock,
  Globe2,
  ShieldCheck,
  Server,
  Download,
  Upload,
  RefreshCw,
  CheckCircle,
  X,
  KeyRound,
  FileCheck2,
} from 'lucide-react';
import { CloudSyncConfig } from '../types/models';
import { loadCloudSyncConfig, saveCloudSyncConfig } from '../utils/storage';
import { encryptData, decryptData } from '../utils/crypto';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncComplete?: () => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  onSyncComplete,
}) => {
  const [config, setConfig] = useState<CloudSyncConfig>(loadCloudSyncConfig());
  const [passphrase, setPassphrase] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(loadCloudSyncConfig());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveCloudSyncConfig(config);
    setStatusMessage('¡Configuración de almacenamiento y país guardada!');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleSyncNow = async () => {
    setIsSyncing(true);
    setStatusMessage(null);

    try {
      // Gather local data
      const payloadObj = {
        settings: localStorage.getItem('voxcloner_audio_settings'),
        templates: localStorage.getItem('voxcloner_custom_templates'),
        clonedVoices: localStorage.getItem('voxcloner_cloned_voices'),
        history: localStorage.getItem('voxcloner_queue_history'),
        timestamp: Date.now(),
      };

      const plainText = JSON.stringify(payloadObj);
      const secret = passphrase.trim() || 'voxcloner-local-secure-key-2026';

      // Encrypt with Web Crypto AES-GCM
      const cipherText = await encryptData(plainText, secret);

      // Send to server cloud sync
      const res = await fetch('/api/cloud-sync/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vaultId: `vault_${config.countryCode.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`,
          payload: cipherText,
          countryCode: config.countryCode,
        }),
      });

      if (res.ok) {
        const updatedConfig: CloudSyncConfig = {
          ...config,
          lastSyncTimestamp: Date.now(),
        };
        setConfig(updatedConfig);
        saveCloudSyncConfig(updatedConfig);
        setStatusMessage('¡Bóveda cifrada sincronizada exitosamente con el servidor de tu país!');
        if (onSyncComplete) onSyncComplete();
      } else {
        throw new Error('Error al sincronizar con el servidor.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error en la sincronización.';
      setStatusMessage(`Error: ${msg}`);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleExportVaultFile = async () => {
    const payloadObj = {
      settings: localStorage.getItem('voxcloner_audio_settings'),
      templates: localStorage.getItem('voxcloner_custom_templates'),
      clonedVoices: localStorage.getItem('voxcloner_cloned_voices'),
      history: localStorage.getItem('voxcloner_queue_history'),
      timestamp: Date.now(),
      countryCode: config.countryCode,
    };

    const secret = passphrase.trim() || 'voxcloner-local-secure-key-2026';
    const cipherText = await encryptData(JSON.stringify(payloadObj), secret);

    const blob = new Blob([cipherText], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voxcloner_e2e_vault_${config.countryCode}_${Date.now()}.voxvault`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImportVaultFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const cipherText = evt.target?.result as string;
        const secret = passphrase.trim() || 'voxcloner-local-secure-key-2026';
        const plainText = await decryptData(cipherText, secret);
        const obj = JSON.parse(plainText);

        if (obj.templates) localStorage.setItem('voxcloner_custom_templates', obj.templates);
        if (obj.clonedVoices) localStorage.setItem('voxcloner_cloned_voices', obj.clonedVoices);
        if (obj.settings) localStorage.setItem('voxcloner_audio_settings', obj.settings);

        setStatusMessage('¡Bóveda descifrada y restaurada con éxito!');
        setTimeout(() => setStatusMessage(null), 3500);
      } catch {
        alert('Contraseña incorrecta o archivo de bóveda inválido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4">
      <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-700/80 p-4 sm:p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-white truncate">
                Seguridad & Sincronización
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                Cifrado AES-GCM 256-bit y residencia de datos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className="mt-4 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        <form onSubmit={handleSaveConfig} className="space-y-4 mt-5">
          {/* Country / Compliance Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
              País / Jurisdicción del Servidor y Base de Datos
            </label>
            <select
              value={config.countryCode}
              onChange={(e) => setConfig((c) => ({ ...c, countryCode: e.target.value }))}
              className="w-full bg-[#0d1322] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="ES-UE">España / Unión Europea (Reglamento RGPD/GDPR)</option>
              <option value="MX">México (Normativa LFPDPPP)</option>
              <option value="CO">Colombia (Ley de Datos 1581)</option>
              <option value="AR">Argentina (Ley Protección Datos Personales 25.326)</option>
              <option value="CL">Chile (Normativa de Privacidad Local)</option>
              <option value="US">Estados Unidos (Región Primaria Cloud Run)</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Garantiza que la base de datos almacene los registros cumpliendo con la ley de protección de datos de tu región.
            </p>
          </div>

          {/* Master Encryption Passphrase */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              Clave Maestra de Cifrado E2E (Privada)
            </label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña para cifrar tus guiones antes de subirlos"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="w-full bg-[#0d1322] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Tus guiones y voces se cifran en tu navegador con AES-GCM antes de enviarse. El servidor nunca ve el texto en claro.
            </p>
          </div>

          {/* Auto-Sync Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-[#0d1322] rounded-xl border border-slate-800">
            <div>
              <span className="text-xs font-semibold text-white block">Sincronización Automática</span>
              <span className="text-[11px] text-slate-400">Sincronizar cuando se complete una cola masiva</span>
            </div>
            <input
              type="checkbox"
              checked={config.autoSyncOnQueueComplete}
              onChange={(e) => setConfig((c) => ({ ...c, autoSyncOnQueueComplete: e.target.checked }))}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
          </div>

          {/* Direct Cloud Sync Action */}
          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <Server className="w-4 h-4 text-cyan-400" />
                Base de Datos Cloud
              </p>
              <p className="text-[11px] text-slate-400">
                {config.lastSyncTimestamp
                  ? `Última sincronización: ${new Date(config.lastSyncTimestamp).toLocaleString()}`
                  : 'Aún no sincronizado'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Cifrando & Sincronizando...' : 'Sincronizar Ahora'}</span>
            </button>
          </div>

          {/* Backup / Export Vault file */}
          <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              onClick={handleExportVaultFile}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Descargar Bóveda Cifrada (.voxvault)</span>
            </button>

            <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer transition">
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Restaurar Archivo .voxvault</span>
              <input
                type="file"
                accept=".voxvault,.txt"
                onChange={handleImportVaultFile}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
            >
              Cerrar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition"
            >
              Guardar Preferencias
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
