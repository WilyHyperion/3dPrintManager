import {  Job } from "@/types/types";
import { useEffect, useState } from "react";
import StatusDropdown from "./statusDropdown";
import Image from "next/image";
import { Filter } from "@/types/Filters";
import { literalToPrettyName } from "@/types/Constants";
interface JobChartProps {
  jobs: Job[] | null;
  setJobs: any;
  editable: boolean;
  filters?: Filter[]
}

export default function JobChart(props: JobChartProps) {
  const [sort, setSort] = useState("date");
  useEffect(() => {
    if (props.filters) {
      let newjobs = props.jobs?.filter((job) => {
        let ret = true
        for (let filter of props.filters || []) {
          if (filter.shouldRemove(job[filter.catagory])) {
            ret = false
          }
        }
        return ret
      });
      console.log(newjobs, "newjobs")
      setActual(newjobs || [])
    }
    else {
      setActual(props.jobs || [])
    }
  }, [props.filters, props.jobs]);

  const [displayJobs, setActual ] = useState(props.jobs);
  useEffect(()=> {
    setActual(props.jobs)
  }, [props.jobs])
  useEffect(() => {
    let nsort = sort
    if (sort.includes("-")) {
      nsort = sort.slice(0, sort.length - 1)
    }
    let newjobs = props.jobs?.sort((a, b) => {
      console.log(a, b)
      //because our database forces everything to string, we have to do some hardcoding here
      if (nsort.includes("cost") || nsort.includes("printTime")) {
        console.log(parseInt(a[nsort]), parseInt(b[nsort]))
        return parseInt(a[nsort]) - parseInt(b[nsort])
      }
      if (nsort.includes("date")) {
        console.log(new Date(a[nsort]).getTime(), new Date(b[nsort]).getTime())
        return new Date(a[nsort]).getTime() - new Date(b[nsort]).getTime()
      }
      console.log(a[nsort], b[nsort])
      console.log(a[nsort] === b[nsort])
      if (a[nsort] === b[nsort]) {
        return 0
      }
      if (a[nsort] < b[nsort]) {
        return -1
      }
      if (a[nsort] > b[nsort]) {
        return 1
      }
      return 0
    });
    if (sort.includes("-")) {
      newjobs = newjobs?.reverse()
    }
    console.log(newjobs, "newjobs")
    props.setJobs([...newjobs || []])
  }, [sort]);
  return (
    <div className="w-full min-h-[80vh]  flex flex-col bg-gray-50 m-2 rounded-3xl ">
      <div className="w-[80%] h-[10%]  text-black flex justify-between px-5">
        <div className="flex flex-row items-center justify-evenly w-[100%]">
          {
            Object.keys(literalToPrettyName).map((key) => {
              return <div className="w-[10%]">
                <button onClick={() => {
                  if (sort === key) {
                    setSort(key + "-")
                  }
                  else {
                    setSort(key)
                  }
                }}>{literalToPrettyName[key]}</button>
              </div>
            })
          }
        </div>
        <div className="w-[10%] absolute right-[5%]" onClick={
          () => {
            if (sort === "status") {
              setSort("status-")
            }
            else {
              setSort("status")
            }
          }
        }>
          Status
        </div>
      </div>
      <div className="w-full min-h-[90vh] ">

        {displayJobs !== null ? displayJobs.length === 0 && (
          <div className="w-full h-full flex justify-center items-center bg-transparent">
            <h2>No jobs to display</h2>
          </div>
        )
          :
          <div className="w-full h-full flex justify-center items-center">
            <h2>Loading Jobs...</h2>
          </div>
        }
        {
          displayJobs &&
          displayJobs.length > 0 && displayJobs.map((job) => {
            return (
              <div className="w-full h-[10%] p-5  text-black flex justify-between px-5 border-b-indigo-900 border-b-2" >
                <div className="flex flex-row items-center justify-evenly w-[80%]">
                  <div className = "w-[10%]"><Image width={20} height={20} alt="View" src="/export.svg" onClick={() => {
                    window.location.href = "/logged/job/" + job.id
                  }} className=""></Image> </div>
                  <h2 className="w-[10%]">{job.name}</h2>
                  <h2 className="w-[10%]">{new Date(job.date).toLocaleDateString()}</h2>
                  <h2 className="w-[10%]">${job.cost}</h2>
                  <h2 className="w-[10%]">{job.printTime} Hours</h2>
                  <h2 className="w-[10%]">{job.printer}</h2>
                  <h2 className="w-[10%]">{job.color}</h2>
                </div>
                <StatusDropdown editable={props.editable} defaultValue={job.status} id={job.id} changeStatus={
                  (status) => {
                    props.setJobs(props.jobs?.map((j) => {
                      if (j.id === job.id) {
                        j.status = status
                      }
                      return j
                    }))
                  }
                }
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
