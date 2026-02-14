export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-slate-800 border border-slate-600 rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <h2 className="font-display font-semibold text-xl text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
