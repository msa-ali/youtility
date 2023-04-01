import Footer from "@/components/footer";
import Info from "@/components/info";
import Navbar from "@/components/navbar";
import Search from "@/components/search";
import YoutubeVideoList from "@/components/youtube-video-list";
import { SearchProvider } from "@/context/search";

export default function Home() {
  return (
    <div className="bg-global w-full min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Info />
        <SearchProvider initialValue="">
          <Search />
          <YoutubeVideoList />
        </SearchProvider>
      </main>
      <Footer />
    </div>
  )
}