export default function WishlistsLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-20">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded-xl bg-slate-200" />
        <div className="h-4 w-72 rounded-xl bg-slate-200" />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="h-44 rounded-3xl bg-slate-200 animate-pulse" />
        <div className="h-44 rounded-3xl bg-slate-200 animate-pulse" />
        <div className="h-44 rounded-3xl bg-slate-200 animate-pulse" />
      </div>

      <div className="mt-12 space-y-4">
        <div className="h-7 w-56 rounded-xl bg-slate-200 animate-pulse" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="aspect-[1.03] rounded-3xl bg-slate-200 animate-pulse" />
          <div className="aspect-[1.03] rounded-3xl bg-slate-200 animate-pulse" />
          <div className="aspect-[1.03] rounded-3xl bg-slate-200 animate-pulse" />
          <div className="aspect-[1.03] rounded-3xl bg-slate-200 animate-pulse" />
        </div>
      </div>
    </main>
  );
}
