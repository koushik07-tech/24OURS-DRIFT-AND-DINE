import type { Metadata } from "next";
import HomePageClient from "@/components/home/HomePageClient";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Go-karting, RC racing, a 360° sky restaurant, banquet halls and an automotive showcase — all in one destination.",
};

export default function HomePage() {
  return <HomePageClient />;
}
