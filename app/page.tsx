import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Introduction from "@/components/Introduction";
import BooksCollection from "@/components/BooksCollection";
import Subscription from "@/components/Subscription";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Hero />
        <Introduction />
        <BooksCollection />
        <Subscription />
        <Footer />
      </main>
    </>
  );
}
