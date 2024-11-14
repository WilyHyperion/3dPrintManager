import { Job } from "@/types/types";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import JobChart from "@/components/jobChart";
import Image from "next/image";
import { equalFilters, Filter, FilterTypes, getInputElement } from "@/types/Filters";
import { literalToPrettyName } from "@/types/Constants";
export default function BrowseJobs() {
  const [jobs, setJobs] = useState([] as Job[]);
  const [filter, setFilter] = useState([] as Filter[]);
  const [open, setOpen] = useState(false);
  const [filterMaking, setFilterMaking] = useState(null as Filter | null);
  const [selectedCollumn, setSelectedCollumn] = useState("Date");
  const [inputs, setInputs] = useState([] as any[]);
  useEffect(() => {
    fetch("/api/getjobs").then(async (res) => {
      let t = await res.json();
      setJobs(t);
      console.log(t);
    });
  }, []);
  return (
    <div className="flex flex-col ">
      <div className="w-full h-full  bg-gradient-to-r  from-indigo-900 via-purple-800 to-purple-900 ">
        <Image
          className=" absolute left-5 top-5 cursor-pointer    "
          alt="Back"
          width={25}
          height={25}
          src="/backarrow.svg"
          onClick={() => {
            window.location.href = "/logged/home";
          }}
        ></Image>
        <div className=" bg-white w-full h-15 text-black text-3sxl p-3 flex justify-center items-center ">
          <text>Order Submissions</text>
        </div>
        <div className="w-full h-15 flex justify-center items-center bg-white">
          <button
            className=" p-2 my-2 bg-gray-500"
            onClick={() => {
              setOpen(!open);
            }}
          >
            Add Filter
          </button>{" "}
          {open && (
            <div className={`absolute top-[5%] p-[3%] border-gray-300 border-2 bg-gray-50 w-1/4 rounded-xl flex flex-col cursor-move `}  >
              <Image
                src={"/close.svg"}
                alt="X"
                width={20}
                height={20}
                className="  absolute right-2 top-2 text-black"
                onClick={() => {
                  setOpen(false);
                }}
              ></Image>
              <strong>Filter Column</strong>
              <select
                className="text-black p-2"
                onChange={(e) => {
                  setSelectedCollumn(e.target.value);
                }}
              >
                <option selected disabled>--Choose A Collumn--</option>
                {Object.keys(literalToPrettyName).map((key) => {
                  return (
                    <option value={key} className="bg-gray-500">
                      {literalToPrettyName[key]}
                    </option>
                  );
                })}
              </select>

              <strong>Filter Type</strong>
              <select
                className=" p-2 text-black"
                onChange={(e) => {
                  let FilterType = FilterTypes.find(
                    (FilterType) => FilterType.name == e.target.value
                  );
                  if (FilterType) {
                    console.log(FilterType);
                    setFilterMaking(new FilterType([] as any[], ""));
                    let inputs = [] as any[];
                    for (let i = 0; i < new FilterType([], "").inputTypes.length; i++) {
                      inputs.push("")
                    }
                    setInputs(inputs);
                  }
                }}
              >
                <option selected disabled>--Choose A Filter Type--</option>
                {FilterTypes.map((FilterType) => {
                  if (
                    (new FilterType([] as any[], "").vaildCatagoies?.includes(
                      selectedCollumn
                    ) || (new FilterType([] as any[], "").vaildCatagoies?.includes(
                      "*")
                      ))
                  ) {
                    return (
                      <option value={FilterType.name} className="p-2 bg-[#e5e7eb] text-black">
                        {FilterType.name.replace(/([A-Z])/g, " $1")}
                      </option>
                    );
                  }
                })}
              </select>
              {filterMaking &&
                filterMaking.inputTypes.map((inputType, i) => {
                  let type = inputType.name;
                  return <div className="flex flex-row justify-between items-center">
                    <strong className="w-[20%]">{filterMaking.inputLabels[i]}</strong>
                    {getInputElement(type, (e) => {
                      let newInputs = inputs;
                      newInputs[i] = e.target.value;
                      setInputs(newInputs);
                    })
                    }</div>;
                })}
              <button className="bg-[#e5e7eb] mt-5 p-2 text-black" onClick={() => {
                if (filterMaking) {
                  if (filterMaking.inputs.includes("")) {
                    return
                  }
                  filterMaking.inputs = inputs
                  filterMaking.catagory = selectedCollumn

                  setFilter([...filter, filterMaking])
                }
              }}>Add Filter</button>
            </div>
          )}
        </div>
        <div className="w-full h-15 flex justify-center items-center bg-white">
          {filter.map((obj) => {
            return (
              <div>

                {obj.catagory + " "}
                {obj.name + " "}
                {obj.inputs.map((input) => {
                  return input;
                })}
                <Image
                  alt="x"
                  width={20}
                  height={20}
                  src="/close.svg"
                  className=""
                  onClick={(e) => {
                    console.log(filter, "old")
                    for (let f of filter) {
                      if (equalFilters(f, obj)) {
                        let newFilter = filter
                        newFilter.splice(filter.indexOf(f), 1)
                        console.log(newFilter, "new")
                        setFilter(newFilter)
                        break
                      }
                    }
                  }}
                >
                </Image>
              </div>
            );
          })}
        </div>
        <div className="h-full">
          <JobChart jobs={jobs} setJobs={setJobs} editable filters={filter} />
        </div>
      </div>
    </div>
  );
}
