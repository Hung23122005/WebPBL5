export function ClassifyResultSkeleton() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur md:p-6 animate-pulse">
      <div className="mb-4">
        <div className="h-6 w-48 rounded-xl bg-white/10" />
        <div className="mt-2 h-4 w-64 rounded-xl bg-white/5" />
      </div>
      <div className="rounded-2xl border border-white/10 bg-black/20 p-5 space-y-4">
        <div className="h-4 w-24 rounded-lg bg-white/10" />
        <div className="h-10 w-40 rounded-xl bg-white/10" />
        <div className="h-3 w-full rounded-full bg-white/10" />
      </div>
      <div className="mt-4 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-white/8 bg-white/[0.04] p-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-full bg-white/10" />
              <div className="h-4 w-32 rounded-lg bg-white/10" />
            </div>
            <div className="h-2 w-full rounded-full bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DetectResultSkeleton() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 animate-pulse">
      <div className="mb-3 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-5 w-36 rounded-xl bg-white/10" />
          <div className="h-4 w-48 rounded-lg bg-white/5" />
        </div>
        <div className="h-6 w-24 rounded-full bg-white/10" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-[240px] rounded-2xl bg-white/5" />
        <div className="rounded-2xl bg-white/5 p-4 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 rounded-lg bg-white/10" />
          ))}
        </div>
      </div>
    </div>
  );
}
