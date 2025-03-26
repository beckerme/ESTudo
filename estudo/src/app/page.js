import "../app/globals.css";

export default function Home() {
  return (
    <div>
      <div className={`${kanit.className}`}>
        <Image 
          src="/logo_ESTudo.png"
          width={100.329}
          height={106}
          alt="ESTudo Logo" 
        />
        <h1 className="text-8xl">ESTudo</h1>
        <p className="text-xl">University Document-Sharing App</p>
        <Input/>
      </div>
    </div>
  );
}