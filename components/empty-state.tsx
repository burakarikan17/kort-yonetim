export function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-md border border-dashed border-white/12 bg-ink-950/35 px-4 py-8 text-center text-sm text-slate-400">
      {text}
    </div>
  );
}
