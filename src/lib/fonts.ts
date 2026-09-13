import localFont from "next/font/local";

export const halant = localFont({
  src: "../assets/fonts/Halant-Regular.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-halant",
});
export const geist = localFont({ src: "../assets/fonts/Geist-Variable.woff2", display: "swap", variable: "--font-geist" });
export const mono = localFont({ src: "../assets/fonts/GeistMono-Variable.woff2", display: "swap", variable: "--font-geist-mono", preload: false });
