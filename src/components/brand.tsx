import Image from "next/image";

export function Brand({ compact = false }: { compact?: boolean }) {
  return <span className={`brand ${compact ? "brand-compact" : ""}`} role="img" aria-label="SciSpark">
    <Image className="brand-art" src="/brand/wordmark.png" alt="" width={1774} height={887} sizes={compact ? "105px" : "132px"} priority />
  </span>;
}

export function Sparky({ className = "" }: { className?: string }) {
  return <span className={`sparky ${className}`} aria-hidden="true">
    <Image className="theme-light-art" src="/brand/sparky-idle-light.svg" alt="" width={40} height={40} />
    <Image className="theme-dark-art" src="/brand/sparky-idle-dark.svg" alt="" width={40} height={40} />
  </span>;
}
