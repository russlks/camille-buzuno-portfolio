"use client";

import Link from "next/link";
import { useEffect } from "react";
import { playAir, primeSound } from "../lib/sound";

/* A Link that sounds a soft "air / paper" note on hover — used for the Artist
   Statement's onward links so the page has its own delicate tonal character,
   part of the shared site sound language. */
export default function SoundLink({
  href,
  note = 0,
  className,
  children,
}: {
  href: string;
  note?: number;
  className?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    primeSound();
  }, []);

  return (
    <Link href={href} className={className} onMouseEnter={() => playAir(note)}>
      {children}
    </Link>
  );
}
