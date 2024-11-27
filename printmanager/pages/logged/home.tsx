import Header from "@/components/header";
import JobChart from "@/components/jobChart";
import { Job } from "@/types/types";
import { signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react";

export default function Home() {
    const [loading, setLoading] = useState(true)
    const [jobs, setJobs] = useState(null as Job[] | null)
    useEffect(() => {
        fetch("/api/getselfjobs").then(async (res) => {
            setLoading(false)
            let t = await res.json()
            setJobs(t)
        })
    }, [])
    return (
        <div className=" bg-gradient-to-r h-full from-indigo-900 via-purple-800 to-purple-900">
           <Header  />

            {loading ? (
                <div className="flex justify-center items-center min-h-[calc(90vh-5rem)] text-black text-xl">
                    Loading your jobs...
                </div>
            ) : (
                <div className="flex justify-center text-black py-10">
                    <JobChart jobs={jobs} setJobs={setJobs} editable={false} />
                </div>
            )}
        </div>
    );
};