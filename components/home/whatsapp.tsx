import React from "react";
import Image from "next/image";

const WhatsappButton: React.FC = () => (
  <>
    {/* Custom CSS for responsive behavior on very small screens */}
    <style jsx>{`
      .whatsapp-button {
        position: fixed;
        bottom: 16px;
        right: 16px;
        z-index: 1000;
        transition: all 0.3s ease;
      }

      @media (max-width: 640px) {
        .whatsapp-button {
          bottom: 10px;
          right: 60px;
        }
      }
    `}</style>

    <a
      href="https://wa.me/+94761418949"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button inline-block rounded-full shadow-lg hover:shadow-xl bg-white p-1"
    >
      <Image
        src="/images/img_whatsapp.jpeg"
        alt="WhatsApp"
        width={48}
        height={48}
        className="rounded-full w-10 h-10 sm:w-12 sm:h-12"
        style={{
          borderRadius: "50%",
          display: "block",
        }}
        priority
      />
    </a>
  </>
);

export default WhatsappButton;
