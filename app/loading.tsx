export default function RootLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-10 w-64 rounded-xl bg-slate-200" />
        <div className="h-4 w-96 rounded-xl bg-slate-200" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, idx) => (
          <div key={idx} className="animate-pulse space-y-3">
            <div className="aspect-square rounded-2xl bg-slate-200" />
            <div className="h-4 w-3/4 rounded bg-slate-200" />
            <div className="h-3 w-1/2 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </main>
  );
}
