import Header from "@/components/header";
import JobChart from "@/components/jobChart";
import { Job } from "@/types/types";
import { useEffect, useState } from "react";

export default function UserView() {
  const [user, setUser] = useState(null as any | null);
  const [id, setId] = useState("");
  const [jobs, setJobs] = useState([] as Job[]);
  useEffect(() => {
    let id = window.location.pathname.split("/")[3];
    setId(id);
    fetch("/api/getuser", {
      method: "POST",
      body: JSON.stringify({
        id: id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      let t = await res.json();
      console.log(t);
      setUser(t.user);
      setJobs(t.jobs);
    });
  }, []);
  return (
    <div>
      <Header />
      <div className="flex flex-col w-full h-full  bg-gradient-to-r  from-indigo-900 via-purple-800 to-purple-900  min-h-screen items-center justify-around    ">
        <div className="bg-white p-6 text-black rounded-lg shadow-lg w-full max-w-[90%] my-[5%] min-h-[50vh] flex flex-col gap-2">
          {user ? (
            <>
              <h1 className="text-3xl font-semibold text-purple-700 py-5">{user.name}</h1>
               <p className = "text-gray-500"><strong>Email:</strong>{user.email}</p>
               <p className = "text-gray-500"><strong>Role: </strong>{user.role}</p>
               <p className = "text-gray-500"><strong>Number of Jobs:</strong>{jobs.length}</p>
               <p className = "text-gray-500"><strong>Internal ID:</strong>{user._id}</p>
               <JobChart jobs = {jobs} setJobs = {setJobs} editable = {false} />
            </>
          ) : (
            <div>Loading user info...</div>
          )}
        </div>
      </div>
    </div>
  );
}
