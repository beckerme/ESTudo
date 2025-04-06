"use client";
import ListaDocumentos from "@/components/ListaDocumentos";
import Header from "../../components/HeaderInicio";
import Input from "../../components/Input";

function Page() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">ESTudo</h1>
          <p className="text-lg text-gray-700 mt-2">University Document-Sharing App</p>
        </div>
        <div className="mt-6">
          <Input type="search" className="px-4 py-2 border rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default Page;
