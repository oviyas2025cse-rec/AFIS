import React from 'react';
import { Task } from '../../types';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  task,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-rose-500/40 bg-[#160a2c] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <div className="p-6 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-base font-bold text-white">Delete Academic Task?</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-white">"{task.title}"</strong> ({task.subjectCode})? This action cannot be undone and will remove it from MySQL records.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#0e051c] border border-purple-950/60 text-[11px] text-slate-400 font-mono">
            <span>SQL: DELETE FROM tasks WHERE id = '{task.id}' AND user_id = ?;</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Confirm Deletion</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
