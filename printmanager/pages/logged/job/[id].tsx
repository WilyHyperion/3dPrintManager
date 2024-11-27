import StlFromID from "@/components/stlFromID"
import { Job } from "@/types/types"
import { use, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import StatusDropdown from "@/components/statusDropdown"
import Image from "next/image"
import Header from "@/components/header"



export default function JobView() {
    const [job, setJob] = useState(null as Job | null)
    const s = useSession();
    const [teacherMessage, setTeacherMessage] = useState("")
    const [file, setFile] = useState(null as File | null)
    useEffect(() => {
        //use router was not working for some reason
        let id = window.location.pathname.split("/")[3]
        fetch(`/api/getjob`, {
            method: "POST",
            body: JSON.stringify({
                id: id
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(async (res) => {
            let t = await res.json()
            console.log(t)
            setJob(t)
        })
    }, []
)
    return (
        <div className="bg-gradient-to-r h-auto from-indigo-900 via-purple-800 to-purple-900 w-full">
            <Header />
            {job ? (
                <div className="flex justify-center items-center p-10">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
                        <h1 className="text-3xl font-semibold text-purple-700">{job.name}</h1>
                        <div className="mt-6 space-y-4 text-black">
                            <div>
                                <h3 className="text-lg font-medium text-gray-700">Submission Details:</h3>
                                <div className="flex items-center flex-row gap-5   mt-2">
                                <strong className = "text-gray-500">Status</strong><StatusDropdown defaultValue={job.status} id={job.id} editable = {s?.data?.user?.role === "operator"} changeStatus = {
                                    (status: string) => {
                                        setJob({
                                            ...job,
                                            status: status
                                        })
                                    }
                                } />
                                </div>
                                <p className="text-gray-500"><strong>Printer:</strong> {job.printer}</p>
                                <p className="text-gray-500"><strong>Color:</strong> {job.color}</p>
                                <p className="text-gray-500"><strong>Infill Density:</strong> {job.inFillPercentage}%</p>
                                <p className="text-gray-500"><strong>Estimated Print Time:</strong> {job.printTime} Hours</p>
                                <p className="text-gray-500"><strong>Notes:</strong> {job.notes}</p>

                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-700">User Information:</h3>
                                <p className="text-gray-500"><strong>Name:</strong>{job.user.name}</p>
                                <p className="text-gray-500"><strong>Email:</strong> {job.user.email}</p>
                            </div>
                            {s?.data?.user?.role === "operator" && (
                            <div className="mt-6 p-4 border-2 text-black border-gray-300 rounded-lg bg-gray-50">
                                <h3 className="text-lg font-medium text-gray-700">Operator Response:</h3>
                                <p className="text-gray-500">{teacherMessage}</p>
                                <textarea
                                    placeholder="Enter operator's response here..."
                                    {...job.teacherResponse && {defaultValue: job.teacherResponse} }
                                    className="w-full h-32 mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                />
                                <button className="mt-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg" onClick  ={(e) => {
                                    fetch(`/api/teacherresponse`, {
                                        method: "POST",
                                        body: JSON.stringify({
                                            id: job.id,
                                            response: (document.querySelector("textarea") as HTMLTextAreaElement).value
                                        }),
                                        headers: {
                                            "Content-Type": "application/json"
                                        }
                                    }).then(async (res) => {
                                        if((await res.json()).message === "updated") {
                                            setTeacherMessage("Response Updated!")
                                        }
                                    })
                                }}>
                                    Submit Response
                                </button>
                            </div>
                            )}
                            {s?.data?.user?.role !== "operator" && (<div className="mt-6 p-4 border-2 text-black border-gray-300 rounded-lg bg-gray-50">
                                <h3 className="text-lg font-medium text-gray-700">Operator Response:</h3>
                                <p className="text-gray-500 w-full mt-2 p-2 borderrounded-lg whitespace-pre-wrap">{job.teacherResponse}</p>
                            </div>)}
                        </div>

                        <div className="mt-10">
                            <div className = "flex flex-row justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-700">STL Model Preview:</h3>
                            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg text-center align-middle h-full" onClick={() => {
                                if(file){
                                    let a = document.createElement("a")
                                    a.href = URL.createObjectURL(file)
                                    a.download = `job-${job.user?.name}-${job.id}.stl`
                                    a.click()
                                }
                             }}>
                                Download
                            </button>
                            </div>
                            <div className="mt-4">
                                <StlFromID id={job.id} setFile = {setFile} />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-white text-center p-10 min-h-screen">Loading...</div>
            )}
        </div>
    )
}
