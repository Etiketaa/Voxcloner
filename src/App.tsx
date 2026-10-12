/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { VoiceStudio } from './components/VoiceStudio';
import { QueueManager } from './components/QueueManager';
import { TemplatesLibrary } from './components/TemplatesLibrary';
import { VoiceCloner } from './components/VoiceClonerModal';
import { VoiceCatalogTab } from './components/VoiceCatalogTab';
import { AudioTuningTab } from './components/AudioTuningTab';
import { MobileBottomNav, AppTab } from './components/MobileBottomNav';
import { CloudSyncModal } from './components/CloudSyncModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useQueueManager } from './hooks/useQueueManager';
import {
  BUILT_IN_NEURAL_VOICES,
  loadSavedAudioSettings,
  saveAudioSettings,
} from './utils/storage';
import { VoiceProfile, AudioSettings, ProjectTemplate } from './types/models';

export default function App() {
  const isOnline = useOnlineStatus();
  const [activeTab, setActiveTab] = useState<AppTab>('studio');
  const [engineMode, setEngineMode] = useState<'neural' | 'local'>('neural');
  const [currentVoice, setCurrentVoice] = useState<VoiceProfile>(BUILT_IN_NEURAL_VOICES[0]);
  const [settings, setSettings] = useState<AudioSettings>(loadSavedAudioSettings());
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Queue Manager
  const {
    tasks,
    isProcessing,
    addTask,
    addBatchTasks,
    removeTask,
    clearCompleted,
    retryTask,
    downloadSingleTask,
    downloadAllAsZip,
  } = useQueueManager(isOnline);

  const pendingCount = tasks.filter((t) => t.status === 'pending' || t.status === 'processing').length;

  // Handle template loading into studio
  const handleLoadTemplate = (tpl: ProjectTemplate) => {
    // Find matching voice or keep default
    const matchingVoice = BUILT_IN_NEURAL_VOICES.find((v) => v.id === tpl.suggestedVoiceId) || currentVoice;
    setCurrentVoice(matchingVoice);
    if (tpl.suggestedSettings) {
      setSettings((prev) => {
        const updated = { ...prev, ...tpl.suggestedSettings };
        saveAudioSettings(updated);
        return updated;
      });
    }
    setActiveTab('studio');
  };

  const handleEnqueueTemplate = (tpl: ProjectTemplate) => {
    const matchingVoice = BUILT_IN_NEURAL_VOICES.find((v) => v.id === tpl.suggestedVoiceId) || currentVoice;
    addTask(tpl.defaultScript, matchingVoice, {
      ...settings,
      ...tpl.suggestedSettings,
    }, tpl.title);
    setActiveTab('queue');
  };

  const handleClonedVoiceCreated = (newVoice: VoiceProfile) => {
    setCurrentVoice(newVoice);
    setActiveTab('studio');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-300">
      {/* PWA Offline indicator */}
      <OfflineIndicator />

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingTasksCount={pendingCount}
        openSyncModal={() => setIsSyncModalOpen(true)}
        isOnline={isOnline}
        engineMode={engineMode}
        setEngineMode={setEngineMode}
      />

      {/* Main Content Area (with bottom padding for mobile navigation) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-7 pb-24 md:pb-12">
        {activeTab === 'studio' && (
          <VoiceStudio
            currentVoice={currentVoice}
            setCurrentVoice={setCurrentVoice}
            settings={settings}
            setSettings={setSettings}
            onAddToQueue={(script, voice, setts, title) => {
              addTask(script, voice, setts, title);
            }}
            onAddBatchToQueue={(items, voice, setts) => {
              addBatchTasks(items, voice, setts);
              setActiveTab('queue');
            }}
            isOnline={isOnline}
            engineMode={engineMode}
            onOpenCloner={() => setActiveTab('cloner')}
            onNavigateToVoices={() => setActiveTab('voices')}
            onNavigateToTuning={() => setActiveTab('tuning')}
          />
        )}

        {activeTab === 'cloner' && (
          <VoiceCloner
            onClonedVoiceCreated={handleClonedVoiceCreated}
            isOnline={isOnline}
            onNavigateToStudio={() => setActiveTab('studio')}
          />
        )}

        {activeTab === 'voices' && (
          <VoiceCatalogTab
            currentVoice={currentVoice}
            setCurrentVoice={setCurrentVoice}
            engineMode={engineMode}
            onOpenCloner={() => setActiveTab('cloner')}
            onNavigateToStudio={() => setActiveTab('studio')}
          />
        )}

        {activeTab === 'tuning' && (
          <AudioTuningTab
            settings={settings}
            setSettings={setSettings}
            currentVoice={currentVoice}
            onNavigateToStudio={() => setActiveTab('studio')}
          />
        )}

        {activeTab === 'queue' && (
          <QueueManager
            tasks={tasks}
            isProcessing={isProcessing}
            onRemoveTask={removeTask}
            onClearCompleted={clearCompleted}
            onRetryTask={retryTask}
            onDownloadSingle={downloadSingleTask}
            onDownloadAllAsZip={downloadAllAsZip}
            onGoToStudio={() => setActiveTab('studio')}
          />
        )}

        {activeTab === 'templates' && (
          <TemplatesLibrary
            onLoadTemplate={handleLoadTemplate}
            onEnqueueTemplate={handleEnqueueTemplate}
          />
        )}
      </main>

      {/* Cloud Sync & E2E Security Modal */}
      <CloudSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
      />

      {/* Mobile-First Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingTasksCount={pendingCount}
      />

      {/* Footer */}
      <footer className="hidden md:block border-t border-slate-800/80 bg-[#070a12] py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>VoxCloner Studio • Locución Neuronal & MP3 320kbps para TikTok, Reels y Shorts</span>
          </p>
          <p className="text-[11px] text-slate-500">
            Soporte PWA Offline • Cifrado de Extremo a Extremo AES-GCM • Mobile-First
          </p>
        </div>
      </footer>
    </div>
  );
}
