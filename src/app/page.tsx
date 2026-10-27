import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { DayScene } from "@/components/sections/DayScene";
import { Features } from "@/components/sections/Features";
import { Finishes } from "@/components/sections/Finishes";
import { Cta } from "@/components/sections/Cta";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <DayScene />
        <Features />
        <Finishes />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
