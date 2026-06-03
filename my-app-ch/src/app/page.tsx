import Header from "./components/Header";
import HeroBanner from "./components/HeroBanner";

export default function HomePage() {
  return (
    <>
      <Header />
      <main style={{ fontFamily: 'Vazirmatn, sans-serif' }}>
        <HeroBanner />
      </main>
    </>
  );
}
