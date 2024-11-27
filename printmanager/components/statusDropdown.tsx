import { statusColors } from "@/types/Constants";
import { useEffect, useState } from "react";


export default function StatusDropdown(props: {
  defaultValue: string,
  id: string,
  changeStatus: (status: string) => void,
  editable: boolean
}) {
  const [status, setStatus] = useState(props.defaultValue)
  useEffect(() => {
    setStatus(props.defaultValue)
  }, [props.defaultValue])
  return (<div className={`px-5 py-2 flex flex-row items-center justify-evenly w-[15%]  rounded-full h-[4vh]   ${statusColors[status.toLowerCase()] || "bg-gray-300"}`}>
    {props.editable ? <select
      value={status}
      onChange={(e) => {
        setStatus(e.target.value);
        props.changeStatus(e.target.value);
        fetch("/api/updatestatus", {
          method: "POST",
          body: JSON.stringify({
            id: props.id,
            status: e.target.value,
          }),
          headers: {
            "Content-Type": "application/json",
          }
        });
      }}
      className="bg-transparent border-none w-full  text-center"
    >
      {
        Object.keys(statusColors).map((key) => {
          return <option key={key} value={key}>{key.substring(0,1).toUpperCase() + key.substring(1)}</option>
        })
      }
    </select> : <div className="  text-center">{status}</div>
      }
  </div>)
}