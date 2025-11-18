// app/page.tsx
import StatueIntro from "./StatueIntro";

const Introduction = () => {
  return (
    <main className="relative isolate">
      {/* Fondo suave con blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 -top-40 aspect-square w-[36rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-10 -bottom-24 aspect-square w-[28rem] rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <section
        aria-labelledby="hero-title"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 space-y-12"
      >
        {/* Hero */}
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Texto */}
          <div className="space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-base-200 px-3 py-1 text-[11px] sm:text-xs font-medium text-base-content/80 ring-1 ring-base-300/60">
              <span>📍 Rosario</span>
              <span className="text-base-content/40">•</span>
              <span>Patrimonio en tu celular</span>
            </span>
<p>Mapas, historias y datos en un solo lugar.</p>


            <p className="text-base sm:text-lg text-base-content/80 max-w-prose mx-auto lg:mx-0">
            Descubrí las <b>historias ocultas</b> detrás de las esculturas que habitan Rosario. Mapas, autores y anécdotas en tu celular
            </p>
          </div>

          {/* Tarjeta intro (contenido visual / stats / CTA que tengas) */}
          <div className="w-full">
            <div className="card border border-base-200 bg-base-100/80 backdrop-blur supports-[backdrop-filter]:bg-base-100/70 shadow-xl">
              <div className="card-body p-4 sm:p-6 lg:p-8">
                <StatueIntro />
              </div>
            </div>
          </div>
        </div>

     
      </section>
    </main>
  );
};

export default Introduction;
