import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  TrendingUp,
  Clock,
  Layers,
  CheckCircle,
} from 'lucide-react';
import { ProjectTemplate, VoiceProfile, AudioSettings } from '../types/models';
import {
  BUILT_IN_TEMPLATES,
  loadCustomTemplates,
  saveCustomTemplate,
  BUILT_IN_NEURAL_VOICES,
} from '../utils/storage';

interface TemplatesLibraryProps {
  onLoadTemplate: (template: ProjectTemplate) => void;
  onEnqueueTemplate: (template: ProjectTemplate) => void;
}

export const TemplatesLibrary: React.FC<TemplatesLibraryProps> = ({
  onLoadTemplate,
  onEnqueueTemplate,
}) => {
  const [customTemplates, setCustomTemplates] = useState<ProjectTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Template form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ProjectTemplate['category']>('TikTok Hook');
  const [newScript, setNewScript] = useState('');
  const [newVoiceId, setNewVoiceId] = useState('gemini-kore');

  useEffect(() => {
    setCustomTemplates(loadCustomTemplates());
  }, []);

  const allTemplates = [...customTemplates, ...BUILT_IN_TEMPLATES];

  const categories = [
    'all',
    'TikTok Hook',
    'Storytime',
    'Misterio & Curiosidades',
    'Marketing & Ventas',
    'Educativo / Tutorial',
  ];

  const filtered = selectedCategory === 'all'
    ? allTemplates
    : allTemplates.filter((t) => t.category === selectedCategory);

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newScript.trim()) return;

    const tpl: ProjectTemplate = {
      id: `custom-tpl-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      description: 'Plantilla personalizada recurrente creada por el usuario.',
      defaultScript: newScript.trim(),
      suggestedVoiceId: newVoiceId,
      suggestedSettings: { speed: 1.1, emphasis: 'hype', bitrate: 320 },
      viralScore: 90,
      targetDurationSeconds: Math.ceil(newScript.trim().split(/\s+/).length / 2.5),
    };

    saveCustomTemplate(tpl);
    setCustomTemplates(loadCustomTemplates());
    setIsModalOpen(false);
    setNewTitle('');
    setNewScript('');
    setToastMsg('¡Plantilla personalizada guardada con éxito!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900/80 rounded-3xl border border-slate-800/80 p-4 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/20 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-white flex flex-wrap items-center gap-2">
                <span>Biblioteca de Plantillas Virales</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                  TikTok & Reels
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Guiones probados con estructuras de alta retención de audiencia listos para locutar
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:opacity-95 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 transition cursor-pointer w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Plantilla</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/50'
              }`}
            >
              {cat === 'all' ? 'Todas las Categorías' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-slate-900/90 rounded-2xl border border-slate-800/90 p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-sky-400 border border-slate-700">
                  {tpl.category}
                </span>

                <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <TrendingUp className="w-3 h-3" />
                  <span>{tpl.viralScore}% Retención</span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-white mb-1.5 line-clamp-1">
                {tpl.title}
              </h3>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                {tpl.description}
              </p>

              <div className="bg-[#0d1322] p-3 rounded-xl border border-slate-800/80 mb-4">
                <p className="text-xs text-slate-300 italic line-clamp-3 leading-relaxed">
                  &quot;{tpl.defaultScript}&quot;
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-800/60">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  ~{tpl.targetDurationSeconds}s duración
                </span>
                <span className="text-slate-300 font-medium">
                  Voz sugerida: {tpl.suggestedVoiceId.replace('gemini-', '')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onLoadTemplate(tpl)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs border border-cyan-500/30 transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cargar en Estudio</span>
                </button>

                <button
                  onClick={() => onEnqueueTemplate(tpl)}
                  title="Encolar directamente en la cola masiva"
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition shrink-0"
                >
                  <Layers className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to Create Custom Template */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white mb-1">
              Guardar Nueva Plantilla de Proyecto
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Crea una plantilla recurrente para reutilizarla en tus series de videos.
            </p>

            <form onSubmit={handleSaveCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Título de la Plantilla
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: POV: Trabajando en Servicio al Cliente"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#0d1322] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Categoría
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ProjectTemplate['category'])}
                  className="w-full bg-[#0d1322] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="TikTok Hook">TikTok Hook</option>
                  <option value="Storytime">Storytime</option>
                  <option value="Misterio & Curiosidades">Misterio & Curiosidades</option>
                  <option value="Marketing & Ventas">Marketing & Ventas</option>
                  <option value="Educativo / Tutorial">Educativo / Tutorial</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Guión Base
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Escribe el texto de la plantilla..."
                  value={newScript}
                  onChange={(e) => setNewScript(e.target.value)}
                  className="w-full bg-[#0d1322] border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold hover:bg-cyan-400 transition"
                >
                  Guardar Plantilla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
