import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TbCloudUpload,
  TbFileText,
  TbLoaderQuarter,
  TbX,
  TbCheck,
} from "react-icons/tb";
import { HiSparkles } from "react-icons/hi";

export default function ResumeUploader({
  file,
  isAnalyzing,
  onFileChange,
  onAnalyze,
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isAnalyzing) return;

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      onFileChange(droppedFile);
    } else {
      alert("⚠️ Only PDF files are allowed!");
    }
  };

  const triggerFileBrowser = () => {
    if (!isAnalyzing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === "application/pdf") {
        onFileChange(selectedFile);
      } else {
        alert("⚠️ Only PDF files are allowed!");
      }
    }
    e.target.value = null;
  };

  const removeFile = (e) => {
    e.stopPropagation();
    onFileChange(null);
  };

  return (
    <div className="w-full space-y-4">
      {/* ═══════ UPLOAD AREA ═══════ */}
      <motion.div
        onClick={triggerFileBrowser}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{
          scale: isDragging ? 1.02 : 1,
          borderColor: isDragging ? "rgba(99, 102, 241, 0.5)" : undefined,
        }}
        className={`
          group relative w-full min-h-[240px] rounded-2xl border-2 border-dashed
          flex flex-col items-center justify-center p-8
          transition-all duration-300 overflow-hidden
          ${isAnalyzing ? "cursor-wait" : "cursor-pointer"}
          ${
            file
              ? "border-indigo-500/40 bg-gradient-to-br from-indigo-500/[0.03] to-purple-500/[0.02]"
              : "border-white/[0.08] bg-white/[0.01] hover:border-indigo-500/30 hover:bg-white/[0.03]"
          }
          ${isDragging ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20" : ""}
        `}
      >
        {/* ═══ Background Pattern ═══ */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        {/* ═══ Analyzing Scanner Effect ═══ */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ top: "-2px", opacity: 0 }}
              animate={{
                top: ["0%", "100%"],
                opacity: [0, 1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_20px_#6366f1] z-10"
            />
          )}
        </AnimatePresence>

        {/* ═══ Content States ═══ */}
        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            // ═══ ANALYZING STATE ═══
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-4 text-center relative z-10"
            >
              <div className="relative">
                <TbLoaderQuarter
                  size={48}
                  className="text-indigo-400 animate-spin"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl"
                />
              </div>
              <div className="space-y-2">
                <p className="text-base font-bold text-slate-200 tracking-wide flex items-center gap-2">
                  <HiSparkles className="text-indigo-400" />
                  AI Analyzing Resume
                </p>
                <p className="text-xs text-slate-500">
                  Extracting skills, experience, and qualifications...
                </p>
              </div>
            </motion.div>
          ) : file ? (
            // ═══ FILE UPLOADED STATE ═══
            <motion.div
              key="uploaded"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-4 text-center relative z-10 w-full max-w-sm"
            >
              {/* File Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.1,
                }}
                className="relative"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10">
                  <TbFileText size={32} />
                </div>
                {/* Success Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-slate-900"
                >
                  <TbCheck size={14} className="text-white" />
                </motion.div>
              </motion.div>

              {/* File Info */}
              <div className="space-y-2 w-full">
                <p className="text-sm font-bold text-slate-200 truncate max-w-full px-4">
                  {file.name}
                </p>
                <div className="flex items-center justify-center gap-2 text-xs">
                  <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 font-semibold uppercase tracking-wider">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                  <span className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400 font-semibold uppercase tracking-wider">
                    PDF
                  </span>
                </div>
              </div>

              {/* Remove Button */}
              <motion.button
                onClick={removeFile}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 rounded-xl text-xs font-medium text-red-400 transition-all flex items-center gap-2"
              >
                <TbX size={14} />
                Remove File
              </motion.button>
            </motion.div>
          ) : (
            // ═══ EMPTY STATE ═══
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-4 text-center relative z-10"
            >
              {/* Upload Icon with Animation */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-slate-400 group-hover:border-indigo-500/30 group-hover:text-indigo-400 transition-all">
                  <TbCloudUpload size={32} />
                </div>
                {/* Glow Effect */}
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0, 0.3, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl"
                />
              </motion.div>

              {/* Text */}
              <div className="space-y-2">
                <p className="text-base font-bold text-slate-300 group-hover:text-slate-200 transition-colors">
                  Drop your resume here
                </p>
                <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                  or{" "}
                  <span className="text-indigo-400 font-semibold">
                    click to browse
                  </span>{" "}
                  • PDF only
                </p>
              </div>

              {/* Format Badge */}
              <div className="mt-2 px-3 py-1.5 bg-white/[0.02] border border-white/[0.06] rounded-lg text-[10px] text-slate-600 uppercase tracking-widest font-bold">
                Max 10MB • PDF Format
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleInputChange}
          accept="application/pdf"
          className="hidden"
        />
      </motion.div>

      {/* ═══════ ANALYZE BUTTON ═══════ */}
      <AnimatePresence>
        {file && !isAnalyzing && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAnalyze();
            }}
            className="group relative w-full py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:via-indigo-400 hover:to-purple-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40 border border-indigo-400/20 uppercase tracking-wider overflow-hidden"
          >
            {/* Button Shine Effect */}
            <motion.div
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />

            <span className="relative flex items-center justify-center gap-2">
              <HiSparkles className="text-yellow-300" />
              Parse & Sync Profile
              <HiSparkles className="text-yellow-300" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
