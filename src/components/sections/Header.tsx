import { brand, nav } from "@/lib/content";

/** Sticky top bar. Links hide on phones, where the one button is the call to action. */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-edge/70 bg-night/85 backdrop-blur">
      <div className="section-wrap flex h-16 items-center justify-between gap-4">
        <a href="#top" className="inline-flex min-h-11 items-center font-display text-xl font-bold tracking-tight text-cream sm:text-2xl">
          {brand}
        </a>
        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <a key={item.href} href={item.href} className="py-2.5 font-medium text-mist transition hover:text-cream">
              {item.label}
            </a>
          ))}
        </nav>
        <a href="#reserve" className="btn-primary min-h-11 px-5 text-sm sm:text-base">
          Reserve
        </a>
      </div>
    </header>
  );
}
