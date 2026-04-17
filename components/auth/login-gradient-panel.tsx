"use client";

import { useEffect, useRef } from "react";

export function LoginGradientPanel() {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;

    if (!panel) {
      return;
    }

    const element: HTMLDivElement = panel;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = 0;
    let currentX = 50;
    let currentY = 50;
    let targetX = 50;
    let targetY = 50;

    function updatePointerVars() {
      const shiftX = ((currentX - 50) / 50) * 18;
      const shiftY = ((currentY - 50) / 50) * 12;

      element.style.setProperty("--login-pointer-x", `${currentX}%`);
      element.style.setProperty("--login-pointer-y", `${currentY}%`);
      element.style.setProperty("--login-shift-x", `${shiftX}px`);
      element.style.setProperty("--login-shift-y", `${shiftY}px`);
    }

    function animate() {
      currentX += (targetX - currentX) * 0.075;
      currentY += (targetY - currentY) * 0.075;
      updatePointerVars();

      if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
        frameId = window.requestAnimationFrame(animate);
      } else {
        frameId = 0;
      }
    }

    function queueAnimation() {
      if (!frameId) {
        frameId = window.requestAnimationFrame(animate);
      }
    }

    function handlePointerMove(event: PointerEvent) {
      if (reducedMotionQuery.matches) {
        return;
      }

      const bounds = element.getBoundingClientRect();
      targetX = ((event.clientX - bounds.left) / bounds.width) * 100;
      targetY = ((event.clientY - bounds.top) / bounds.height) * 100;
      queueAnimation();
    }

    function handlePointerLeave() {
      targetX = 50;
      targetY = 50;
      queueAnimation();
    }

    updatePointerVars();

    element.addEventListener("pointermove", handlePointerMove);
    element.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerleave", handlePointerLeave);

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <section
      ref={panelRef}
      className="relative overflow-hidden rounded-[32px] border border-white/20 p-8 text-white shadow-[0_36px_90px_rgba(15,23,43,0.24)] sm:p-10 lg:min-h-[720px] lg:p-12"
      style={{
        background: `
          radial-gradient(38rem 34rem at var(--login-pointer-x) var(--login-pointer-y), rgba(255,255,255,0.7) 0%, rgba(255,188,215,0.55) 8%, rgba(164,96,255,0.34) 22%, rgba(74,35,185,0.18) 40%, transparent 62%),
          linear-gradient(115deg, #04030a 0%, #0b0818 28%, #171131 46%, #24145e 66%, #3d2ae3 100%)
        `,
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:repeating-linear-gradient(180deg,rgba(255,255,255,0.11)_0px,rgba(255,255,255,0.11)_1px,transparent_1px,transparent_44px)]" />

      <div
        className="pointer-events-none absolute left-[-18%] right-[-12%] top-[8%] h-[24%] opacity-95 blur-2xl"
        style={{
          transform: "translate3d(calc(var(--login-shift-x) * 1.3), calc(var(--login-shift-y) * -0.35), 0)",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(214,92,255,0.06) 12%, rgba(255,255,255,0.86) 28%, rgba(255,183,207,0.82) 40%, rgba(142,91,255,0.52) 56%, transparent 72%)",
        }}
      />

      <div
        className="pointer-events-none absolute left-[8%] right-[-10%] top-[28%] h-[16%] opacity-80 blur-[34px]"
        style={{
          transform: "translate3d(calc(var(--login-shift-x) * -0.7), calc(var(--login-shift-y) * 0.18), 0)",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,180,223,0.12) 16%, rgba(247,220,255,0.78) 34%, rgba(189,116,255,0.44) 56%, transparent 78%)",
        }}
      />

      <div
        className="pointer-events-none absolute left-[-14%] right-[-6%] bottom-[10%] h-[22%] opacity-90 blur-2xl"
        style={{
          transform: "translate3d(calc(var(--login-shift-x) * 1.05), calc(var(--login-shift-y) * 0.25), 0)",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(160,99,255,0.2) 18%, rgba(255,224,241,0.88) 34%, rgba(240,160,255,0.74) 48%, rgba(106,84,255,0.64) 64%, transparent 82%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-y-[10%] left-[34%] w-[26%] opacity-85 blur-[46px]"
        style={{
          transform: "translate3d(calc(var(--login-shift-x) * 0.45), calc(var(--login-shift-y) * 0.15), 0)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(255,198,218,0.68) 22%, rgba(213,115,255,0.5) 48%, rgba(255,255,255,0) 88%)",
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_24%,rgba(255,255,255,0.08)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(129,95,255,0.24),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-[1px] rounded-[31px] border border-white/12" />

      <div className="relative flex h-full min-h-[520px] flex-col justify-center gap-10 py-8 sm:py-10 lg:min-h-[640px] lg:py-12">
        <div className="space-y-6">
          <p className="text-[var(--font-size-label-s)] leading-[var(--line-height-body)] font-semibold uppercase tracking-[0.18em] text-white/72">
            Internal workspace
          </p>
          <div className="space-y-5">
            <h1 className="max-w-[10ch] text-[2.75rem] leading-[0.98] font-semibold tracking-[-0.04em] text-balance text-white drop-shadow-[0_8px_24px_rgba(3,2,9,0.35)] sm:text-[3.75rem] lg:text-[4.5rem]">
              skill-share
            </h1>
            <p className="max-w-xl text-[var(--font-size-body-l)] leading-[1.55] text-white/82">
              One place to browse, review, and publish internal AI skills.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
