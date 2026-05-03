import Link from "next/link";
import { CategoryMeta } from "@/types/orchid";
import { getServerUrl } from "@/lib/settings";

async function fetchCategories(): Promise<CategoryMeta[]> {
  try {
    const res = await fetch(`${getServerUrl()}/categories`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.categories ?? [];
  } catch {
    return [];
  }
}

export default async function OrchidsPage() {
  const categories = await fetchCategories();

  return (
    <main className="min-h-[calc(100vh-57px)] bg-[radial-gradient(circle_at_top,_#1d1135,_#09090b_55%)] px-4 py-10 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            45 loài hoa lan
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Danh sách toàn bộ các loài hoa lan trong hệ thống nhận diện.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 text-center text-white/40">
            <div>
              <div className="text-5xl">🌸</div>
              <p className="mt-3 text-base font-medium">
                Không tải được danh sách
              </p>
              <p className="mt-1 text-sm text-white/30">
                Kiểm tra server đang chạy tại{" "}
                <span className="font-mono">/categories</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {categories.map((item) => (
              <Link
                key={item.id}
                href={`/orchids/${item.id}`}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur transition hover:border-violet-400/30 hover:bg-white/8"
              >
                <div className="relative h-44 overflow-hidden bg-black/30">
                  {item.cover_image ? (
                    <img
                      src={item.cover_image}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl text-white/20">
                      🌺
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-3 text-xs font-mono text-white/50">
                    {item.id}
                  </div>
                </div>

                <div className="p-3">
                  <p className="truncate text-sm font-semibold text-white">
                    {item.name}
                  </p>
                  {item.specie_name && (
                    <p className="mt-0.5 truncate text-xs italic text-white/50">
                      {item.specie_name}
                    </p>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <p className="mt-1 text-xs text-white/35">
                      {item.count} ảnh
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
