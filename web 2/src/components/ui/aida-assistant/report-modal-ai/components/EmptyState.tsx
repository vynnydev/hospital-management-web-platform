// Componentes auxiliares
export const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center p-4 bg-[#1e2a4a]/20 rounded-lg">
    <span className="text-4xl mb-2">🔍</span>
    <p className="text-white/60 text-center">{message}</p>
  </div>
);
