type Props = {
  serverStatus: string;
  error: string;
};

export default function StatusMessage({ serverStatus, error }: Props) {
  return (
    <>
      {serverStatus && (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {serverStatus}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}
    </>
  );
}
