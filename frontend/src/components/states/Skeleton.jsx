export default function Skeleton() {
  return (
    <div className="animate-pulse space-y-6 max-w-3xl mx-auto">
      <div className="glass h-72" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass h-20" />
        ))}
      </div>

      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="glass h-32 min-w-[120px]" />
        ))}
      </div>
    </div>
  );
}
