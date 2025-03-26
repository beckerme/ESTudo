export default function Registo() {
  return (
    
    <div className="flex flex-col items-center">
      <h1 className="text-4xl">Registo</h1>
      <form className="flex flex-col items-center">
        <input
          className="border-2 border-gray-300 rounded-md p-1 m-1"
          type="text"
          placeholder="Nome"
        />
        <input
          className="border-2 border-gray-300 rounded-md p-1 m-1"
          type="text"
          placeholder="Email"
        />
        <input
          className="border-2 border-gray-300 rounded-md p-1 m-1"
          type="password"
          placeholder="Password"
        />
        <input
          className="border-2 border-gray-300 rounded-md p-1 m-1"
          type="password"
          placeholder="Confirmar Password"
        />
        <button
          className="border-2 border-gray-300 rounded-md p-1 m-1"
          type="submit"
        >
          Registar
        </button>
      </form>
    </div>
  );
}
