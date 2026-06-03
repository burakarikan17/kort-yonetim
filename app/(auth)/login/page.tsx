import { LockKeyhole } from "lucide-react";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  const params = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-white/10 bg-ink-850/92 p-6 shadow-panel">
        <div className="mb-7">
          <span className="mb-4 grid size-12 place-items-center rounded-md bg-emerald-500 text-ink-950">
            <LockKeyhole size={22} />
          </span>
          <h1 className="text-2xl font-semibold text-white">Kort Panel Girişi</h1>
          <p className="mt-2 text-sm text-slate-400">
            Rezervasyon yönetimine erişmek için admin hesabınızla giriş yapın.
          </p>
        </div>

        {params.error ? (
          <div className="mb-4 rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {params.error}
          </div>
        ) : null}

        <form action={signIn} className="grid gap-4">
          <label className="grid gap-2">
            <span className="label">Email</span>
            <input className="field" name="email" type="email" required autoComplete="email" />
          </label>
          <label className="grid gap-2">
            <span className="label">Şifre</span>
            <input
              className="field"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </label>
          <button className="mt-2 h-11 rounded-md bg-emerald-500 text-sm font-semibold text-ink-950 transition hover:bg-emerald-400">
            Giriş Yap
          </button>
        </form>
      </section>
    </main>
  );
}
