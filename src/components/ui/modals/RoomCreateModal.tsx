'use client';

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { FiX, FiHome, FiUsers, FiMap, FiBriefcase, FiCoffee, FiHeart } from "react-icons/fi";
import { ButtonLoader } from "@/components";

interface RoomCreateModalProps {
  onCreateRoom: (roomName: string) => void;
  onClose: () => void;
  creating: boolean;
}

const modalVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.4,
      ease: [0.23, 1, 0.32, 1],
      when: "beforeChildren",
      staggerChildren: 0.08
    } 
  },
  exit: { 
    opacity: 0, 
    y: 20,
    scale: 0.95,
    transition: { duration: 0.3, ease: [0.76, 0, 0.24, 1] }
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] } },
};

const suggestions = [
  { name: "Home & Bills", icon: FiHome, color: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
  { name: "Trip", icon: FiMap, color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" },
  { name: "Work Team", icon: FiBriefcase, color: "bg-purple-500/10 border-purple-500/20 text-purple-400" },
  { name: "Friends", icon: FiUsers, color: "bg-orange-500/10 border-orange-500/20 text-orange-400" },
  { name: "Date Night", icon: FiHeart, color: "bg-pink-500/10 border-pink-500/20 text-pink-400" },
  { name: "Coffee Run", icon: FiCoffee, color: "bg-amber-500/10 border-amber-500/20 text-amber-400" },
];

export default function RoomCreateModal({ onCreateRoom, onClose, creating }: RoomCreateModalProps) {
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) {
      setError(true);
      setTimeout(() => setError(false), 800);
      return;
    }
    onCreateRoom(roomName.trim());
  };

  const handleClose = () => {
    setRoomName("");
    setError(false);
    onClose();
  };

  const handleSuggestionClick = (name: string) => {
    setRoomName(name);
    setError(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
        onClick={handleClose}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden"
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/30 dark:to-transparent pointer-events-none" />
          
          {/* Close button */}
          <motion.button 
            onClick={handleClose} 
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiX className="w-6 h-6" />
          </motion.button>

          <div className="p-8 sm:p-10 relative">
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl border border-blue-200 dark:border-blue-800/50 mb-4">
                <FiHome className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Create Your Room
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                Start tracking shared expenses with friends, family, or colleagues in your own dedicated space.
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Room name input */}
              <motion.div variants={itemVariants}>
                <label htmlFor="roomName" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Room Name
                </label>
                <motion.div 
                  className="relative"
                  animate={{ x: error ? [0, -4, 4, -2, 2, 0] : 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <input
                    id="roomName"
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="e.g., 'Weekend in Paris'"
                    className={`w-full px-4 py-3.5 rounded-xl border bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                      error 
                        ? 'border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500/20' 
                        : 'border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20'
                    }`}
                    autoFocus
                  />
                </motion.div>
              </motion.div>

              {/* Quick suggestions */}
              <motion.div variants={itemVariants}>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Quick Start
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {suggestions.map((suggestion) => {
                    const IconComponent = suggestion.icon;
                    return (
                      <motion.button
                        key={suggestion.name}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion.name)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-medium transition-all duration-200 hover:scale-105 ${suggestion.color} hover:bg-opacity-80`}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <IconComponent className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{suggestion.name}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Action buttons */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full sm:w-auto flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <ButtonLoader
                  loading={creating}
                  type="submit"
                  disabled={!roomName.trim()}
                  className="w-full sm:w-auto flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-lg shadow-blue-500/25"
                >
                  Create Room
                </ButtonLoader>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
