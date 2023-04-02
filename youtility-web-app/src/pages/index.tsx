import Footer from "@/components/footer";
import Info from "@/components/info";
import Navbar from "@/components/navbar";
import SearchWithResult from "@/components/search-with-result";


export default function Home() {
  return (
    <div className="bg-global w-full min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 justify-center items-center">
        <Info />
        <SearchWithResult />
      </main>
      <Footer />
    </div>
  )
}