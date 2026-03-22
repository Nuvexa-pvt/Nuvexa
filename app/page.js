import Navbar from "@/components/Navbar";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Products from "@/components/home/Products";
import Categories from "@/components/home/Categories";
import VisionMission from "@/components/home/VisionMission";
import Qualities from "@/components/home/Qualities";
import SupplierStories from "@/components/home/SupplierStories";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <Products />
      <Categories />
      <VisionMission />
      <Qualities />
      {/* <SupplierStories /> */}
      <Footer />
    </main>
  );
}
