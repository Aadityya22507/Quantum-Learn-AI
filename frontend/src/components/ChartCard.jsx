export default function ChartCard({ title, children, className = "" }) {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl p-5 ${className}`}>
      <h3 className="text-slate-300 text-sm font-medium mb-3">{title}</h3>
      {children}
    </div>
  );
}
