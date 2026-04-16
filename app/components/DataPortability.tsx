'use client';
import { exportUserData, importUserData, validateUserData } from '@/lib/exportImport';
import { useRef, useState } from 'react';
import { FaDownload, FaUpload, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function DataPortability() {
  const [importStatus, setImportStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [includeApiKey, setIncludeApiKey] = useState(true);

  const handleExport = () => {
    try {
      const userData = exportUserData();
      const jsonData = JSON.stringify(userData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const date = new Date().toISOString().split('T')[0];
      link.download = `vernavitality-export-${date}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data. Please try again.');
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const jsonData = e.target?.result as string;
        const data = JSON.parse(jsonData);
        const validation = validateUserData(data);

        if (validation.valid) {
          importUserData(data, { includeApiKey });
          setImportStatus({
            success: true,
            message: 'Data synchronized successfully. Reloading view...',
          });
          setTimeout(() => window.location.reload(), 1500);
        } else {
          setImportStatus({
            success: false,
            message: validation.message || 'Invalid data package format',
          });
        }
      } catch (error) {
        console.error('Error importing data:', error);
        setImportStatus({
          success: false,
          message: 'Decryption failed. Please provide a valid JSON package.',
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5 space-y-4">
        <p className="text-zinc-500 text-xs leading-relaxed">
          VernaVitality uses local-first storage. Use these tools to migrate your records between devices or maintain off-device backups.
        </p>

        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
          <button
            onClick={handleExport}
            className="flex justify-center items-center gap-2 bg-white/5 hover:bg-white/10 p-4 border border-white/10 rounded-2xl text-white font-bold transition-all group"
          >
            <FaDownload className="group-hover:translate-y-0.5 text-blue-400 transition-transform" />
            Export Vault
          </button>

          <button
            onClick={handleImportClick}
            className="flex justify-center items-center gap-2 bg-white/5 hover:bg-white/10 p-4 border border-white/10 rounded-2xl text-white font-bold transition-all group"
          >
            <FaUpload className="group-hover:-translate-y-0.5 text-emerald-400 transition-transform" />
            Import Vault
          </button>
        </div>

        <div className="bg-black/20 p-4 rounded-xl border border-white/5">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeApiKey}
                onChange={e => setIncludeApiKey(e.target.checked)}
                className="sr-only peer"
              />
              <div className="peer-focus:outline-none bg-zinc-800 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 rounded-full w-9 h-5"></div>
            </div>
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Restore API Credentials</span>
          </label>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          className="hidden"
        />
      </div>

      {importStatus && (
        <div
          className={`flex items-center gap-3 p-4 rounded-2xl border animate-in slide-in-from-top-2 ${importStatus.success ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}
        >
          {importStatus.success ? <FaCheckCircle /> : <FaExclamationCircle />}
          <span className="text-sm font-medium">{importStatus.message}</span>
        </div>
      )}
    </div>
  );
}
