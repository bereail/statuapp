import { ArrowRight } from 'lucide-react'

export default function Page() {
return (
<main className="mx-auto max-w-5xl px-6 py-16">

{/* Hero */}
<section className="text-center space-y-6">
<h1 className="text-4xl md:text-6xl font-bold">StatuApp</h1>
<p className="text-lg md:text-xl text-neutral-300">
Catálogo digital de estatuas y monumentos de Rosario con
<strong>QR</strong> + <strong>mapa</strong> + fichas.
</p>
<div className="flex items-center justify-center gap-3">
<a href="#capturas" className="inline-flex items-center gap-2 
rounded-xl px-5 py-3 bg-white text-black font-medium">
Ver capturas <ArrowRight size={18} />
</a>
<a href="https://github.com/bereail/statuapp" className="inlineflex items-center gap-2 rounded-xl px-5 py-3 border border-neutral-700">
Ver código
</a>
</div>
</section>
{/* Qué resuelve */}
<section className="mt-16 grid md:grid-cols-3 gap-6" id="que-resuelve">
{[{
t:'Información curada', d:'Fichas con autor, año, material, barrio y fuentes verificadas.'
},{
t:'Acceso universal', d:'Escaneá un QR y abrí la ficha en segundos (mobile-first).'
},{
t:'Aprendizaje', d:'Pensado para escuelas, guías y turismo local.'
}].map((c,i)=> (
<div key={i} className="rounded-2xl border border-neutral-800 p-6">
<h3 className="text-xl font-semibold mb-2">{c.t}</h3>
<p className="text-neutral-400">{c.d}</p>
</div>
))}
</section>
{/* Cómo funciona */}
<section className="mt-16">
<h2 className="text-2xl font-semibold mb-4">Cómo funciona</h2>
<ol className="list-decimal pl-6 space-y-2 text-neutral-300">
<li>Escaneás un QR ubicado junto a la obra.</li>
<li>Se abre la ficha con galería, historia y ubicación exacta.</li>
<li>Podés explorar en el mapa por barrios, autores y materiales.</
li>
</ol>
</section>
{/* Capturas */}
<section id="capturas" className="mt-16">
<h2 className="text-2xl font-semibold mb-4">Capturas</h2>
5
<div className="grid md:grid-cols-3 gap-4">
{[1,2,3].map(i => (
<div key={i} className="aspect-[4/3] rounded-2xl bg-neutral-900 
border border-neutral-800 flex items-center justify-center">
<span className="text-neutral-500">Imagen {i}</span>
</div>
))}
</div>
</section>
{/* CTA */}
<section className="mt-16 text-center">
<a href="#"
className="inline-flex items-center gap-2 rounded-xl px-6 py-3 bg-white textblack font-medium">
Probar demo <ArrowRight size={18} />
</a>
</section>
<footer className="mt-20 text-center text-neutral-500 text-sm">
Hecho por Berenice Solohaga — {new Date().getFullYear()}
</footer>
</main>)
}