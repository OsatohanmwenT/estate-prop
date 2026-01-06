import type { Metadata } from "next";
import { Navbar } from "~/components/landing/Navbar";
import { Hero } from "~/components/landing/Hero";
import { Features } from "~/components/landing/Features";
import { SocialProof } from "~/components/landing/SocialProof";
import { Footer } from "~/components/landing/Footer";

export const metadata: Metadata = {
  title: "EstateProject - Modern Real Estate Management",
  description:
    "The all-in-one platform for modern real estate management. Streamline leases, maintenance, accounting, and tenant relationships.",
  openGraph: {
    title: "EstateProject - Modern Real Estate Management",
    description:
      "The all-in-one platform for modern real estate management. Streamline leases, maintenance, accounting, and tenant relationships.",
    type: "website",
    url: "https://estate-prop.vercel.app", // Placeholder
  },
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <SocialProof />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
