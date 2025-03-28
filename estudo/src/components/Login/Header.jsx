import Image from "next/image";
import { Kanit } from "next/font/google";

const kanit = Kanit({
    subsets: ['latin'],
    weight: "400",
  });

export default function Header() {
  return (
    <div className={kanit.className}>
        <div className="flex items-center justify-center py-4 mt-3">
            <div className="flex items-center space-x-4">
        
                {/* Logo */}
                <Image src="/logo.png" width={100} height={106} alt="ESTudo Logo" />

                {/* Title and Subtitle */}
                <div>
                    <h1 className="lg:text-8xl text-6xl">ESTudo</h1>
                    <p className="lg:text-xl">University Document-Sharing App</p>
                </div>
            </div>
        </div>
    </div>
  );
}
