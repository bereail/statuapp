export const metadata = {
title: 'StatuApp — Rosario',
description:
'Catálogo digital de estatuas y monumentos de Rosario con QR + mapa.',
openGraph: { title: 'StatuApp', description: 'Catálogo con QR + mapa',
url: 'https://statuapp.vercel.app', type: 'website' }
};
export default function RootLayout({ children }: { children:
React.ReactNode }) {
return (
<html lang="es">
<body className="min-h-screen bg-neutral-950 text-neutral-100 
antialiased">{children}</body>
</html>
);
}