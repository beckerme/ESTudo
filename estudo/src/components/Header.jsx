"use client";
// Imports Next
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Import Fonte
import { Kanit } from "next/font/google";

// Fonte
const kanit = Kanit({
  subsets: ['latin'],
  weight: "400",
});

export default function Header() {
  const [currentLang, setCurrentLang] = useState("pt");
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const toggleLang = (lang) => {
    setCurrentLang(lang);
    setIsLangDropdownOpen(false);
    // Aqui você pode adicionar lógica para trocar o idioma global do site
  };

  return (
    <div className={kanit.className}>
      <div className="flex items-center justify-center xl:py-2 py-4 mt-3">
        <div className="flex items-center space-x-4">
          
          {/* Logo com Link para página inicial */}
          <Link href="/">
            <Image
              src="/logo.png"
              width={80}
              height={80}
              alt="ESTudo Logo"
              className="cursor-pointer"
            />
          </Link>

          {/* Title and Subtitle */}
          <div>
            <h1 className="lg:text-7xl text-5xl">ESTudo</h1>
            <p className="lg:text-md">University Document-Sharing App</p>
          </div>
          {/* Seletor de Idioma */}
          <div className="relative ml-4">
            <div
              className="flex w-8 h-12 items-center rounded-md overflow-hidden cursor-pointer"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
            >
              {currentLang === "pt" ? (
                <Image src="/bandeira_portugal.png" width={100} height={100} alt="Bandeira de Portugal" />
              ) : (
                <Image src="/bandeira_inglaterra.png" width={100} height={100} alt="Bandeira da Inglaterra" />
              )}
            </div>
            {isLangDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-20">
                <ul>
                  {currentLang !== "pt" && (
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                      onClick={() => toggleLang("pt")}
                    >
                      <Image src="/bandeira_portugal.png" width={20} height={20} alt="Bandeira de Portugal" />
                      Português
                    </li>
                  )}
                  {currentLang !== "en" && (
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                      onClick={() => toggleLang("en")}
                    >
                      <Image src="/bandeira_inglaterra.png" width={20} height={20} alt="Bandeira da Inglaterra" />
                      English
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
