import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const s = useSession();
  return (
    <header className="sticky top-0 bg-gradient-to-r from-purple-300 via-white to-yellow-100 shadow-md p-2 flex justify-between items-center w-screen z-10 ">
      <a href = "/logged/home" className="text-black text-2xl font-semibold">Home</a>
      <div className="flex space-x-4">
      {s?.data?.user?.role === "operator" && (
          <a
            href="/logged/users"
            className="px-4 py-2 bg-purple-700 rounded-xl text-white hover:bg-purple-600 transition"
          >
            Users
          </a>
        )}
        {s?.data?.user?.role === "operator" && (
          <a
            href="/logged/browse"
            className="px-4 py-2 bg-purple-700 rounded-xl text-white hover:bg-purple-600 transition"
          >
            Check Submitted Jobs
          </a>
        )}
        <a href="/logged/submitjob">
          <button className="px-4 py-2 bg-purple-700 rounded-xl text-white hover:bg-purple-600 transition">
            Submit Job
          </button>
        </a>
        <button className="px-4 py-2 bg-purple-700 rounded-xl text-white hover:bg-purple-600 transition">
          Account Settings
        </button>
        <button
          onClick={() => {
            signOut();
          }}
          className="px-4 py-2 bg-yellow-400 rounded-xl text-black hover:bg-yellow-300 transition"
        >
          Logout
        </button>
        
      </div>
    </header>
  );
}
