import Image from "next/image";
import { Kanit } from "next/font/google";

const kanit = Kanit({
    subsets: ['latin'],
    weight: "400",
  });

export default function Header() {
  return (
    <div className={kanit.className}>
        <div className="flex items-center justify-center py-4 mt-3 mb-4">
            <div className="flex items-center space-x-4">
        
                {/* Logo */}
                <Image src="/logo.png" width={100} height={106} alt="ESTudo Logo" />

                {/* Title and Subtitle */}
                <div>
                    <h1 className="text-8xl">ESTudo</h1>
                    <p className="text-xl">University Document-Sharing App</p>
                </div>
            </div>
        </div>
    </div>
  );
}
