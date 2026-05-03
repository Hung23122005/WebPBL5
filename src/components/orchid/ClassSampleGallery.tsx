type Props = {
  classKey: string;
  sampleImages: string[];
};

export default function ClassSampleGallery({ classKey, sampleImages }: Props) {
  if (!sampleImages.length) return null;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur md:p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold md:text-2xl">
          Ảnh mẫu trong class
        </h2>
        <p className="mt-1 text-sm text-white/60">
          Một vài ảnh tham chiếu của class{" "}
          <span className="font-medium text-white">{classKey}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {sampleImages.map((img, index) => (
          <div
            key={`${classKey}-${index}`}
            className="overflow-hidden rounded-2xl border border-white/10 bg-black/20"
          >
            <img
              src={img}
              alt={`${classKey}-${index + 1}`}
              className="h-[160px] w-full object-cover transition duration-300 hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
