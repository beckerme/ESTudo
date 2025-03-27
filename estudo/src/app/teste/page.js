export default function ResponsiveBlocks() {
    return (
      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen gap-4 p-4">
        <div className="w-full md:w-1/2 h-64 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
          Block 1
        </div>
        <div className="w-full md:w-1/2 h-64 bg-green-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
          Block 2
        </div>
      </div>
    );
  }