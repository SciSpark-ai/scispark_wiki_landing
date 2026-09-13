"use client";

import { Component, type ReactNode } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { site } from "@/lib/site";

class PreviewBoundary extends Component<{ children: ReactNode; message: string; retry: string; cta: string; alt: string }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return <section id="product-showcase" className="shell preview-fallback">
      <p role="alert">{this.props.message}</p>
      <div className="note-actions"><button className="button button-secondary" onClick={() => this.setState({ failed: false })}>{this.props.retry}</button><a className="button button-primary" href={site.signup}>{this.props.cta}</a></div>
      <Image className="theme-light-art" src="/product/feed-light.png" alt={this.props.alt} width={1920} height={1080} sizes="90vw" />
      <Image className="theme-dark-art" src="/product/feed-dark.png" alt={this.props.alt} width={1920} height={1080} sizes="90vw" />
    </section>;
  }
}

export function DemoBoundary({ children }: { children: ReactNode }) {
  const t = useTranslations("Site");
  return <PreviewBoundary message={t("fallback")} retry={t("retry")} cta={t("try")} alt={t("discoverAlt")}>{children}</PreviewBoundary>;
}
