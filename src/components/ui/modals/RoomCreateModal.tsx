'use client';

import { useState, useRef, MouseEvent } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, Variants } from "framer-motion";
import { FiX, FiHome } from "react-icons/fi";
import { ButtonLoader } from "@/components";

interface RoomCreateModalProps {
  onCreateRoom: (roomName: string) => void;
  onClose: () => void;
  creating: boolean;
}

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 40,
      when: "beforeChildren",
      staggerChildren: 0.1
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: 50,
    transition: { duration: 0.3, ease: "easeIn" }
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
};

export default function RoomCreateModal({ onCreateRoom, onClose, creating }: RoomCreateModalProps) {
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 50 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 50 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12.5deg", "-12.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12.5deg", "12.5deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!modalRef.current) return;
    const { left, top, width, height } = modalRef.current.getBoundingClientRect();
    const xPos = (e.clientX - left) / width - 0.5;
    const yPos = (e.clientY - top) / height - 0.5;
    x.set(xPos);
    y.set(yPos);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) {
      setError(true);
      setTimeout(() => setError(false), 1000);
      return;
    }
    onCreateRoom(roomName.trim());
  };

  const handleClose = () => {
    setRoomName("");
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 z-50"
        onClick={handleClose}
      >
        <motion.div
          ref={modalRef}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="bg-slate-900/70 border border-blue-500/20 rounded-3xl shadow-2xl shadow-blue-900/50 w-full max-w-md relative overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-[url(/noise.png)] opacity-20"
            style={{ transform: "translateZ(-50px)" }}
          />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-transparent to-slate-900"
            style={{ transform: "translateZ(-30px)" }}
          />
          
          <motion.button 
            onClick={handleClose} 
            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10"
            whileHover={{ scale: 1.2, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiX className="w-7 h-7" />
          </motion.button>

          <div className="p-8 relative" style={{ transform: "translateZ(50px)" }}>
            <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
              <motion.div 
                className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 shadow-inner-lg"
                whileHover={{ scale: 1.1, y: -2 }}
              >
                <FiHome className="w-8 h-8 text-blue-300" />
              </motion.div>
              <h3 className="text-3xl font-bold text-white tracking-tight">Create a New Room</h3>
            </motion.div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <motion.div variants={itemVariants}>
                <label htmlFor="roomName" className="block text-md font-medium text-slate-400 mb-3">
                  What should we call your room?
                </label>
                <motion.div 
                  className="relative"
                  animate={{ x: error ? [0, -10, 10, -5, 5, 0] : 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <input
                    id="roomName"
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="e.g., 'Weekend Getaway' or 'Apartment Bills'"
                    className={`w-full pl-4 pr-4 py-4 rounded-xl border bg-slate-800/60 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${error ? 'border-red-500/50 ring-red-500/50' : 'border-slate-700/50 focus:border-blue-500'}`}
                    autoFocus
                  />
                </motion.div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex gap-4 pt-4">
                <motion.button
                  type="button"
                  onClick={handleClose}
                  whileHover={{ scale: 1.05, y: -2, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-700 text-slate-300 font-semibold hover:bg-slate-800 hover:border-slate-600 transition-all duration-300"
                >
                  Cancel
                </motion.button>
                <motion.div
                  className="flex-1"
                  whileHover={{ scale: 1.05, y: -2, boxShadow: "0 8px 30px rgba(59, 130, 246, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ButtonLoader
                    loading={creating}
                    type="submit"
                    disabled={!roomName.trim()}
                    className="w-full px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40"
                  >
                    Create Room
                  </ButtonLoader>
                </motion.div>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
