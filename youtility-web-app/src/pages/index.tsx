import Footer from "@/components/footer";
import Info from "@/components/info";
import Navbar from "@/components/navbar";
import Search from "@/components/search";

export default function Home() {
  return (
    <div className="bg-global w-full min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Info />
        <Search />
      </main>
      <Footer />
    </div>
  )
}