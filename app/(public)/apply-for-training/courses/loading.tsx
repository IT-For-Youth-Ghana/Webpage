export default function CoursesLoading() {
  return (
    <div className="bg-white">
      <section className="bg-brand-deep px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-5 w-32 rounded-full bg-white/15" />
          <div className="mt-6 h-14 max-w-3xl rounded-2xl bg-white/15" />
          <div className="mt-4 h-6 max-w-2xl rounded-2xl bg-white/15" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-[28px] bg-white/10 p-5">
                <div className="h-10 w-20 rounded-full bg-white/15" />
                <div className="mt-4 h-8 w-24 rounded-xl bg-white/15" />
                <div className="mt-3 h-16 rounded-2xl bg-white/15" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="border-y border-brand-border bg-white px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl animate-pulse gap-3 lg:grid-cols-[1.8fr_repeat(3,minmax(0,1fr))]">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-12 rounded-full bg-brand-mist" />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-[30px] border border-brand-border bg-white shadow-sm"
            >
              <div className="aspect-[4/3] animate-pulse bg-brand-mist" />
              <div className="space-y-5 p-6">
                <div className="flex gap-2">
                  <div className="h-7 w-28 rounded-full bg-brand-mist" />
                  <div className="h-7 w-20 rounded-full bg-brand-mist" />
                </div>
                <div className="space-y-3">
                  <div className="h-8 rounded-2xl bg-brand-mist" />
                  <div className="h-20 rounded-2xl bg-brand-mist" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="h-20 rounded-[22px] bg-brand-mist" />
                  <div className="h-20 rounded-[22px] bg-brand-mist" />
                </div>
                <div className="flex items-end justify-between gap-4 border-t border-brand-border pt-5">
                  <div className="space-y-3">
                    <div className="h-3 w-16 rounded-full bg-brand-mist" />
                    <div className="h-8 w-20 rounded-2xl bg-brand-mist" />
                    <div className="h-4 w-24 rounded-full bg-brand-mist" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-24 rounded-full bg-brand-mist" />
                    <div className="h-10 w-28 rounded-full bg-brand-mist" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
