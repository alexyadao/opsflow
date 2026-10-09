'use client';

import React, { useState, useEffect } from 'react';
import { HardDrive, Server, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onComplete?: () => void;
  minDurationMs?: number;
}

export default function SplashScreen({
  onComplete,
  minDurationMs = 2300,
}: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(15);
  const [statusMessage, setStatusMessage] = useState('Connecting to datacenter mesh...');

  useEffect(() => {
    // Stepped progression simulation
    const p1 = setTimeout(() => {
      setProgress(55);
      setStatusMessage('Ingesting node telemetry & SLA monitors...');
    }, 700);

    const p2 = setTimeout(() => {
      setProgress(90);
      setStatusMessage('Verifying ticket queue & identity credentials...');
    }, 1400);

    const p3 = setTimeout(() => {
      setProgress(100);
      setStatusMessage('OpsFlow workspace online.');
    }, 1900);

    // Fade-out transition
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, minDurationMs);

    // Complete unmount
    const unmountTimer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, minDurationMs + 650);

    return () => {
      clearTimeout(p1);
      clearTimeout(p2);
      clearTimeout(p3);
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, [minDurationMs, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      aria-label="Loading OpsFlow System"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B1120] text-white transition-opacity duration-700 ease-out select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient lighting */}
      <div className="absolute w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Center Container */}
      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center space-y-5">
        {/* Animated Brand Emblem */}
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-slate-900 p-0.5 shadow-2xl shadow-blue-900/40">
            <div className="w-full h-full bg-[#0B1120] rounded-[14px] flex items-center justify-center">
              <HardDrive className="w-8 h-8 text-blue-400 animate-pulse" />
            </div>
          </div>
          {/* Subtle spinning accent ring */}
          <div className="absolute -inset-2 rounded-2xl border border-blue-500/20 border-dashed animate-[spin_10s_linear_infinite] pointer-events-none" />
        </div>

        {/* Title and Subtitle */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">OpsFlow</h1>
            <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60 font-semibold">
              ITSM
            </span>
          </div>
          <p className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
            INITIALIZING INFRASTRUCTURE...
          </p>
        </div>

        {/* Horizontal Loading Bar */}
        <div className="w-64 space-y-2 pt-2">
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 rounded-full transition-all duration-500 ease-out shadow-sm shadow-blue-500/50"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Stepped Status Ticker */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span className="truncate max-w-[190px] text-left text-slate-400">
              {statusMessage}
            </span>
            <span className="tabular-nums text-blue-400 font-semibold">{progress}%</span>
          </div>
        </div>

        {/* Security / Verification Marker */}
        <div className="pt-4 flex items-center gap-1.5 text-[10px] font-mono text-slate-600">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
          <span>v2.4 Core Services Nominal</span>
        </div>
      </div>
    </div>
  );
}
