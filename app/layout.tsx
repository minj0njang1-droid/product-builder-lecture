import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "티켓팅 도장 (Ticketing Dojo) | 아이돌 공연 티켓팅 연습",
  description: "실전 같은 티켓팅 시뮬레이터로 광클 연습하고 티켓팅의 신이 되어보세요! 난이도별 연습과 실시간 랭킹 시스템 제공.",
  keywords: ["티켓팅연습", "아이돌콘서트", "티켓팅시뮬레이터", "인터파크연습", "티켓팅도장"],
  metadataBase: new URL("https://product-builder-lecture-4p4.pages.dev"),
  openGraph: {
    title: "티켓팅 도장 (Ticketing Dojo)",
    description: "아이돌 공연 티켓팅, 이제 도장에서 연습하세요!",
    url: "https://product-builder-lecture-4p4.pages.dev",
    siteName: "티켓팅 도장",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
