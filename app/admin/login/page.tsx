import LoginForm from "@/components/admin/LoginForm";

export const metadata = { title: "Ingresar — Admin StatuApp" };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const next = params.next && params.next.startsWith("/admin") ? params.next : "/admin";

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-muted/30">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border bg-card p-8 shadow-sm">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold">Panel admin</h1>
          <p className="text-sm text-muted-foreground">StatuApp — Rosario en Estatuas</p>
        </div>
        <LoginForm next={next} />
      </div>
    </main>
  );
}
