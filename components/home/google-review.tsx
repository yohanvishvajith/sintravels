import React, { useEffect, useState } from "react";

export function GoogleReview() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isWidgetMounted, setIsWidgetMounted] = useState(false);

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window === "undefined") return;

    // Check if script already exists
    const existingScript = document.querySelector(
      'script[src*="elfsight.com"]'
    );

    if (existingScript) {
      setIsScriptLoaded(true);
      return;
    }

    // Load script only once
    const script = document.createElement("script");
    script.src = "https://apps.elfsight.com/p/platform.js";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setIsScriptLoaded(true);
    };

    script.onerror = () => {
      console.error("Failed to load Elfsight script");
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      const scriptToRemove = document.querySelector(
        'script[src*="elfsight.com"]'
      );
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, []);

  useEffect(() => {
    // Prevent multiple widget instances
    if (isScriptLoaded && !isWidgetMounted) {
      const existingWidget = document.querySelector(
        ".elfsight-app-593aeb78-8a47-488c-b6ca-4762c0bf12e1"
      );
      if (!existingWidget || existingWidget.children.length === 0) {
        setIsWidgetMounted(true);
      }
    }
  }, [isScriptLoaded, isWidgetMounted]);

  // Only render if script is loaded and widget hasn't been mounted yet
  if (!isScriptLoaded || isWidgetMounted) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <div
        className="elfsight-app-593aeb78-8a47-488c-b6ca-4762c0bf12e1"
        data-elfsight-app-lazy
      />
    </section>
  );
}
