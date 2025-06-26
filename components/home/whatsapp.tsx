import React from "react";
import Image from "next/image";

const WhatsappButton: React.FC = () => (
  <a
    href="https://wa.me/+94761418949"
    target="_blank"
    rel="noopener noreferrer"
    className="whatsapp-button"
    style={{
      position: "fixed",
      bottom: "24px",
      right: "24px",
      zIndex: 1000,
      display: "inline-block",
      borderRadius: "50%",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      overflow: "hidden",
      background: "#fff",
    }}
  >
    <Image
      src="/images/img_whatsapp.jpeg" // Ensure this path matches your public directory structure
      alt="WhatsApp"
      width={60}
      height={60}
      style={{ borderRadius: "50%" }}
      priority
    />
  </a>
);

export default WhatsappButton;
