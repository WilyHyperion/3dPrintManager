import Header from "@/components/header";
import Image from "next/image";
import { useEffect, useState } from "react";



export default function Users() {
    const [users, setUsers] = useState([] as any[]);
    useEffect(() => {
        fetch("/api/getusers").then(async (res) => { 

            const data = await res.json();
            console.log(data);
            setUsers(data);
        })
    }, [])
    const [search, setSearch] = useState("");
    return (
    <div>
        <Header />
       
        <div className="flex flex-col w-full h-full  bg-gradient-to-r  from-indigo-900 via-purple-800 to-purple-900  min-h-screen    ">
            <h1 className="text-5xl font-bold pt-5 text-center">Users</h1>
            <div className="flex flex-row w-full h-full justify-center bg-gradient-to-r  from-indigo-900 via-purple-800 to-purple-900 py-5  " >
            <input className = "w-[80%] py-2 text-black" type = "text" onChange = {(e) => {
                setSearch(e.target.value)
            }}></input> <Image src={"/search.svg"} alt={"Search"} width = {50} height = {50} className = "absolute right-[10%] h-[5%] "></Image>
        </div>
            <div className="flex flex-col w-full">
                <div className="flex flex-row w-full justify-evenly items-center">
                    <p className = "w-[10%]"></p>
                    <p className = "w-[10%]">Name</p>
                    <p className = "w-[10%]">Email</p>
                    <p className = "w-[10%]">Role</p>
                </div>
                {users.filter((e) => {
                    if(search === ""){
                        return true
                    }
                    if(e.name?.toLowerCase().includes(search.toLowerCase())){
                        return true
                    }
                    if(e.email?.toLowerCase().includes(search.toLowerCase())){
                        return true
                    }
                    
                    if(e.role?.toLowerCase().includes(search.toLowerCase())){
                        return true
                    }
                    return false
                }).map((user) => {
                    return <div key={user._id} className="flex flex-col pb-[2%]">
                        <div className="flex flex-row w-full justify-evenly items-center">
                            <Image src="/exportwhite.svg" width={25} height={25} alt = "Goto page" className = "w-[3%] aspect-square cursor-pointer" onClick = {
                                () => {
                                    window.location.href = `/logged/user/${user._id}`
                                }
                            } />
                            <p className = "w-[10%]">{user.name || "No Name"}</p>
                            <p className = "w-[10%]">{user.email || "No Email"}</p>
                            <p className = "w-[10%]">{user.role || "No Role"}</p>
                        </div>
                        <hr className="w-full border-2 border-white" />
                    </div>
                })}
            </div>
    </div>
    </div>
    )
}