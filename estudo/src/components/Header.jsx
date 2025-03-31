// Imports Next
import Image from "next/image";

// Import Fonte
import { Kanit } from "next/font/google";

// Fonte
const kanit = Kanit({
    subsets: ['latin'],
    weight: "400",
  });

export default function Header() {
  return (
    <div className={kanit.className}>
        <div className="flex items-center justify-center xl:py-2 py-4 mt-3">
            <div className="flex items-center space-x-4">
        
                {/* Logo */}
                <Image src="/logo.png" width={80} height={80} alt="ESTudo Logo" />

                {/* Title and Subtitle */}
                <div>
                    <h1 className="lg:text-7xl text-5xl">ESTudo</h1>
                    <p className="lg:text-md">University Document-Sharing App</p>
                </div>
            </div>
        </div>
    </div>
  );
}
