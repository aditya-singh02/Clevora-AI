import React from "react";
import { motion } from "framer-motion";
import {
  TbMicrophone,
  TbMicrophoneOff,
  TbSquareRoundedArrowRight,
  TbLoaderQuarter,
} from "react-icons/tb";

export default function AnswerPanel({
  isRecording,
  transcript,
  setTranscript,
  waveHeights,
  startRecording,
  stopRecording,
  onSubmit,
  isSubmitting,
}) {
  // CUSTOM WRAPPER TRIGGER
  const handleFinalSubmit = () => {
    if (!transcript.trim()) return;
    // Context variable content directly passes to InterviewSession container hook node
    onSubmit(transcript);
  };

  return (
    <div className="w-full rounded-2xl bg-slate-900/40 border border-white/[0.06] p-6 backdrop-blur-2xl shadow-xl flex flex-col justify-between h-full min-h-[360px]">
      <div className="space-y-4">
        {/* Top Operational Status Bar */}
        <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
          <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
            Voice & Text Workspace
          </span>
          <span
            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border transition-colors ${
              isRecording
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-slate-950 border-white/[0.05] text-slate-500"
            }`}
          >
            {isRecording ? "Live Stream Recording" : "Keyboard / Mic Ready"}
          </span>
        </div>

        {/* 🌊 DYNAMIC VOICE WAVEFORM PIPELINE */}
        <div className="w-full h-24 bg-slate-950/70 rounded-xl border border-white/[0.04] flex items-center justify-center gap-1.5 px-6 relative overflow-hidden shadow-inner">
          {isRecording ? (
            waveHeights.map((height, i) => (
              <motion.div
                key={i}
                animate={{ height: [10, height, 10] }}
                transition={{
                  duration: 0.4 + i * 0.02,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-1.5 bg-gradient-to-t from-indigo-500 via-indigo-400 to-purple-500 rounded-full"
              />
            ))
          ) : (
            <div className="w-2/3 h-[2px] bg-slate-800 rounded-full max-w-xs opacity-60" />
          )}
        </div>

        {/* Live Transcription View Textarea */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
            Live Answer Text (Speech Transcript / Manual Input)
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            //  Disabled flag locked manually text typing only when background evaluation engine is active
            disabled={isSubmitting}
            placeholder="Click Start Recording to speak, or directly click here to type your technical response layout manually..."
            className="w-full h-28 p-3 bg-slate-950/40 border border-white/[0.04] rounded-xl text-xs text-slate-300 font-mono focus:outline-none focus:border-indigo-500/30 transition-colors resize-none shadow-inner leading-relaxed placeholder:text-slate-700"
          />
        </div>
      </div>

      {/* Action Trigger Buttons Footer Layout */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-4 pt-4 border-t border-white/[0.04]">
        {/* Toggle Mic Button */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={isRecording ? stopRecording : startRecording}
          className={`w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all border flex items-center justify-center gap-2 ${
            isRecording
              ? "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
              : "bg-white/[0.02] border-white/[0.06] text-slate-300 hover:bg-white/[0.06]"
          }`}
        >
          {isRecording ? (
            <TbMicrophoneOff size={16} />
          ) : (
            <TbMicrophone size={16} />
          )}
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>

        {/* Submit Button */}
        <button
          type="button"
          disabled={isSubmitting || (!transcript.trim() && !isRecording)}
          onClick={handleFinalSubmit} // 🚀 FIXED ACTION BIND
          className="w-full sm:w-auto px-7 py-3 bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/20 text-xs font-black uppercase tracking-wider rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <TbLoaderQuarter size={16} className="animate-spin text-white" />
              Saving Answer...
            </>
          ) : (
            <>
              Submit Answer
              <TbSquareRoundedArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
