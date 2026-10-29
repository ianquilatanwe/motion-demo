import { ScrollCord } from "@/components/ScrollCord";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { DayScene } from "@/components/sections/DayScene";
import { FoldScene } from "@/components/sections/FoldScene";
import { Blueprint } from "@/components/sections/Blueprint";
import { Features } from "@/components/sections/Features";
import { Finishes } from "@/components/sections/Finishes";
import { Cta } from "@/components/sections/Cta";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <ScrollCord />
      <Header />
      <main id="main">
        <Hero />
        <Marquee />
        <DayScene />
        <FoldScene />
        <Features />
        <Blueprint />
        <Finishes />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
