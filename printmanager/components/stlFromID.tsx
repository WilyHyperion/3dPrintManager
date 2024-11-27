import { useEffect, useState } from "react";
import STLRender from "./stlRender";

export default function StlFromID(props: { id: string, setFile: any }) {

  const [file, setFile] = useState(null as File | null);
  useEffect(() => {
    fetch(`/api/getstl`, {
      method: "POST",
      body: JSON.stringify({
        id: (props.id + '.stl'),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
        let blob = await res.blob();
        let file = new File([blob], "stl");
        setFile(file);
        props.setFile(file);
    });
  }, []);
  return <div>{file ? <STLRender stlFile={file} /> : <div>Loading...</div>}</div>;
}
