import Image from "next/image";
import {Input} from "../components/Input";
import "../app/globals.css";
import { Kanit } from "next/font/google";

const kanit = Kanit({
  subsets: ['latin'],
  weight: "400",
});

export default function Home() {
  return (
    <div className="bg-slate-50 h-screen">
      <div className={`${kanit.className}`}>
        <h1 className="text-black">Registo</h1>
      </div>
    </div>
  );
}
