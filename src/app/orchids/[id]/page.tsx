import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { CategoryDetail } from "@/types/orchid";
import { getServerUrl } from "@/lib/settings";

async function fetchDetail(id: string): Promise<CategoryDetail | null> {
  try {
    const res = await fetch(`${getServerUrl()}/categories/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function OrchidDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await fetchDetail(id);

  if (!detail) {
    return (
      <main className="min-h-[calc(100vh-57px)] bg-[radial-gradient(circle_at_top,_#1d1135,_#09090b_55%)] px-4 py-10 md:px-8">
        <div className="mx-auto max-w-4xl">
          <Link href="/orchids" className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
            ← Quay lại danh sách
          </Link>
          <div className="mt-8 flex min-h-[300px] items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 text-center">
            <div>
              <div className="text-5xl">❌</div>
              <p className="mt-3 text-base font-medium text-white">Không tìm thấy thông tin class {id}</p>
              <p className="mt-1 text-sm text-white/50">Server có thể chưa chạy hoặc class không tồn tại</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const name = detail.meta?.name || id;
  const specieName = detail.meta?.specie_name;
  const chineseName = detail.meta?.cultivar_chinese_name;
  const specieChineseName = detail.meta?.specie_chinese_name;

  return (
    <main className="min-h-[calc(100vh-57px)] bg-[radial-gradient(circle_at_top,_#1d1135,_#09090b_55%)] px-4 py-10 md:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Back */}
        <Link href="/orchids" className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white">
          ← Quay lại danh sách
        </Link>

        {/* Header */}
        <div className="mb-6 mt-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div className="mb-1 font-mono text-xs text-white/50">{id}</div>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            {name}
          </h1>
          {specieName && (
            <p className="mt-1.5 text-base italic text-white/75">{specieName}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            {chineseName && (
              <span className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-sm text-white/80">
                {chineseName}
              </span>
            )}
            {specieChineseName && (
              <span className="rounded-full border border-white/15 bg-white/8 px-3 py-1 text-sm text-white/80">
                {specieChineseName}
              </span>
            )}
            {detail.total_images > 0 && (
              <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-sm font-medium text-emerald-300">
                {detail.total_images} ảnh
              </span>
            )}
          </div>
        </div>

        {/* Image gallery — hiển thị tối đa 24 ảnh */}
        {detail.images.length > 0 && (
          <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur md:p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Ảnh minh họa
              <span className="ml-2 text-sm font-normal text-white/50">
                ({Math.min(detail.images.length, 24)}/{detail.total_images})
              </span>
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {detail.images.slice(0, 24).map((img, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-black/20"
                >
                  <img
                    src={img}
                    alt={`${id}-${i + 1}`}
                    className="h-32 w-full object-cover transition duration-300 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Markdown */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur md:p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Thông tin chi tiết</h2>
          {detail.markdown?.trim() ? (
            <div className="prose prose-sm prose-invert max-w-none
              [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-white
              [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-white
              [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-white/90
              [&_p]:leading-7 [&_p]:text-white/85
              [&_li]:text-white/85
              [&_strong]:text-white [&_strong]:font-semibold
              [&_em]:text-white/75
              [&_table]:w-full [&_table]:border-collapse
              [&_td]:border [&_td]:border-white/15 [&_td]:px-3 [&_td]:py-2 [&_td]:text-white/85
              [&_th]:border [&_th]:border-white/15 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-white [&_th]:font-semibold
              [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-white/90
              [&_blockquote]:border-l-2 [&_blockquote]:border-violet-400/50 [&_blockquote]:pl-4 [&_blockquote]:text-white/70
            ">
              <ReactMarkdown>{detail.markdown}</ReactMarkdown>
            </div>
          ) : (
            <p className="italic text-white/50">Chưa có thông tin mô tả.</p>
          )}
        </div>

      </div>
    </main>
  );
}
