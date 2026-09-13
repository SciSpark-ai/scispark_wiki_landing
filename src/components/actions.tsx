"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRightIcon, CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { useDemo } from "./providers";
import type { Stage } from "@/lib/papers";
import { installCommand } from "@/lib/site";

export function DemoLink({ stage, children }: { stage: Stage; children: React.ReactNode }) {
  const { dispatch } = useDemo();
  return <a className="text-link" href="#product-showcase" onClick={() => { window.dispatchEvent(new Event("scispark-manual")); dispatch({ type: "stage", stage }); }}>{children}<ArrowRightIcon /></a>;
}

export function CopyCommands() {
  const t = useTranslations("Site");
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  async function copy() {
    try { await navigator.clipboard.writeText(installCommand); setState("copied"); }
    catch { setState("error"); }
  }
  return <>
    <button className="copy-button" onClick={copy}>{state === "copied" ? <CheckIcon /> : <CopyIcon />}{state === "copied" ? t("copied") : t("copy")}</button>
    <span className={state === "error" ? "copy-error" : "sr-only"} role="status">{state === "error" ? t("copyError") : state === "copied" ? t("copied") : ""}</span>
  </>;
}
