import Hero from "@/src/components/hero"
import AboutUs from "@/src/components/about-us"
import Footer from "@/src/components/footer"


export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <AboutUs />
      <Footer />
    </main>
  )
}

