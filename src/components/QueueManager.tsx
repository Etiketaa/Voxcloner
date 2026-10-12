import React, { useState } from 'react';
import {
  Layers,
  Play,
  Pause,
  Download,
  Trash2,
  RefreshCw,
  Archive,
  CheckCircle,
  AlertCircle,
  Clock,
  Music2,
  Sparkles,
} from 'lucide-react';
import { QueueTask } from '../types/models';

interface QueueManagerProps {
  tasks: QueueTask[];
  isProcessing: boolean;
  onRemoveTask: (id: string) => void;
  onClearCompleted: () => void;
  onRetryTask: (id: string) => void;
  onDownloadSingle: (task: QueueTask) => void;
  onDownloadAllAsZip: () => void;
  onGoToStudio: () => void;
}

export const QueueManager: React.FC<QueueManagerProps> = ({
  tasks,
  isProcessing,
  onRemoveTask,
  onClearCompleted,
  onRetryTask,
  onDownloadSingle,
  onDownloadAllAsZip,
  onGoToStudio,
}) => {
  const [playingTaskId, setPlayingTaskId] = useState<string | null>(null);
  const [audioElements, setAudioElements] = useState<Record<string, HTMLAudioElement>>({});

  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const processingTasks = tasks.filter((t) => t.status === 'processing');
  const failedTasks = tasks.filter((t) => t.status === 'failed');

  const totalProgress = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const handlePlayToggle = (task: QueueTask) => {
    if (!task.audioBlobUrl) return;

    if (playingTaskId === task.id) {
      audioElements[task.id]?.pause();
      setPlayingTaskId(null);
    } else {
      // Pause previous
      if (playingTaskId && audioElements[playingTaskId]) {
        audioElements[playingTaskId].pause();
      }

      let audio = audioElements[task.id];
      if (!audio) {
        audio = new Audio(task.audioBlobUrl);
        audio.onended = () => setPlayingTaskId(null);
        setAudioElements((prev) => ({ ...prev, [task.id]: audio }));
      }

      audio.play().then(() => setPlayingTaskId(task.id)).catch(() => {});
    }
  };

  return (
    <div className="space-y-6">
      {/* Queue Header & Status Overview */}
      <div className="bg-slate-900/80 rounded-3xl border border-slate-800/80 p-4 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="min-w-0">
            <div className="flex items-start sm:items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/20 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-white flex flex-wrap items-center gap-2">
                  <span>Cola de Exportación Masiva</span>
                  {isProcessing && (
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Procesando
                    </span>
                  )}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Renderizado asíncrono y descarga en MP3 a 320kbps de alta fidelidad
                </p>
              </div>
            </div>
          </div>

          {/* Mass Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {completedTasks.length > 0 && (
              <button
                onClick={onDownloadAllAsZip}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition"
              >
                <Archive className="w-4 h-4" />
                <span>Descargar Todo en ZIP ({completedTasks.length})</span>
              </button>
            )}

            {completedTasks.length > 0 && (
              <button
                onClick={onClearCompleted}
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs border border-slate-700 transition"
              >
                Limpiar Completados
              </button>
            )}
          </div>
        </div>

        {/* Global Progress Bar */}
        {tasks.length > 0 && (
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-300">
                Progreso General ({completedTasks.length} de {tasks.length} completados)
              </span>
              <span className="text-cyan-400 font-mono font-bold">{totalProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 via-sky-400 to-rose-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="bg-[#0d1322] p-3 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>En Espera</span>
            </div>
            <p className="text-lg font-bold text-white">{pendingTasks.length}</p>
          </div>

          <div className="bg-[#0d1322] p-3 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>Renderizando</span>
            </div>
            <p className="text-lg font-bold text-cyan-400">{processingTasks.length}</p>
          </div>

          <div className="bg-[#0d1322] p-3 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Completados</span>
            </div>
            <p className="text-lg font-bold text-emerald-400">{completedTasks.length}</p>
          </div>

          <div className="bg-[#0d1322] p-3 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Con Error</span>
            </div>
            <p className="text-lg font-bold text-rose-400">{failedTasks.length}</p>
          </div>
        </div>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="bg-slate-900/60 rounded-3xl border border-slate-800/80 p-8 sm:p-12 text-center">
          <Music2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No hay locuciones en la cola</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-6">
            Escribe un guión en el Estudio o selecciona una plantilla viral y pulsa &quot;Añadir a la Cola Masiva&quot; para procesar múltiples audios en paralelo.
          </p>
          <button
            onClick={onGoToStudio}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-cyan-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ir al Estudio de Locución</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => {
            const isPlaying = playingTaskId === task.id;

            return (
              <div
                key={task.id}
                className="bg-slate-900/90 rounded-2xl border border-slate-800/80 p-4 transition shadow-md hover:border-slate-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Left: Info & Script preview */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                      {task.title}
                    </span>

                    {/* Status Badge */}
                    {task.status === 'completed' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle className="w-3 h-3" /> Listo
                      </span>
                    )}

                    {task.status === 'processing' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 animate-pulse">
                        <RefreshCw className="w-3 h-3 animate-spin" /> {task.progress}%
                      </span>
                    )}

                    {task.status === 'pending' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        <Clock className="w-3 h-3" /> En cola
                      </span>
                    )}

                    {task.status === 'failed' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                        <AlertCircle className="w-3 h-3" /> Error
                      </span>
                    )}

                    {/* Voice badge */}
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-medium text-slate-300 border border-slate-700">
                      {task.voiceName}
                    </span>

                    {/* Bitrate badge */}
                    <span className="px-2 py-0.5 rounded-md bg-cyan-950/60 text-[10px] font-mono text-cyan-400 border border-cyan-800/40">
                      {task.settings.format.toUpperCase()} {task.settings.bitrate}kbps
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    &quot;{task.script}&quot;
                  </p>

                  {/* Task progress bar if processing */}
                  {task.status === 'processing' && (
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mt-1.5">
                      <div
                        className="bg-cyan-400 h-1.5 rounded-full transition-all duration-200"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  )}

                  {task.error && (
                    <p className="text-[11px] text-rose-400 font-medium">
                      {task.error}
                    </p>
                  )}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  {task.status === 'completed' && task.audioBlobUrl && (
                    <>
                      {/* Play Button */}
                      <button
                        onClick={() => handlePlayToggle(task)}
                        title={isPlaying ? 'Pausar' : 'Reproducir'}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition border cursor-pointer ${
                          isPlaying
                            ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                            : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-cyan-400'
                        }`}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5 fill-slate-950" />}
                      </button>

                      {/* Download Button */}
                      <button
                        onClick={() => onDownloadSingle(task)}
                        title="Descargar archivo MP3 individual"
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-slate-700 transition cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar MP3</span>
                      </button>
                    </>
                  )}

                  {task.status === 'failed' && (
                    <button
                      onClick={() => onRetryTask(task.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 hover:bg-amber-500/30 transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reintentar</span>
                    </button>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveTask(task.id)}
                    title="Eliminar de la cola"
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
