"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SignIn() {
  const [error, setError] = useState('')
  const credentialsAction = async  (formData: FormData) => {
    console.log("formData", formData);
    const formDataObj: { [key: string]: string } = {};
    formData.forEach((value, key) => {
      formDataObj[key] = value.toString();
    });
    let p = await signIn("credentials", formDataObj);
    console.log("p", p);
  };
  const { data: session } = useSession()
  useEffect(() => {
    if (session) {
      window.location.href = "/logged/home";
    }
  }, [session]);
  useEffect(() => {
    setError(new URLSearchParams(window.location.search).get("code") ? "Invaild Login" : '')
  }, [])
  return (
    <>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-900 via-purple-800 to-purple-900 w-screen h-screen">
          <img
            src = './backgroundGear.svg'
            height={800}
            width={800}
            className= "absolute top-0 left-0 w-auto h-full object-contain transform -translate-y-1/2 -translate-x-1/2 max-w-md md:max-w-2xl lg:max-w-xl"
          />
          <img
            src = './backgroundGear.svg'
            height={800}
            width={800}
            className= "absolute top-0 right-0 w-auto h-full object-contain transform -translate-y-1/2 translate-x-1/2 max-w-md md:max-w-2xl lg:max-w-xl"
          />
          <form 
                action={credentialsAction} 
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm"
            >
                <h2 className="text-2xl text-black font-bold mb-6 text-center">Sign In</h2>
                <h3 className="text-red-500"> { error}</h3>
                <label htmlFor="credentials-email" className="block mb-2 text-black">
                    Email
                    <input 
                        type="email" 
                        id="credentials-email" 
                        name="email" 
                        className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" 
                        required 
                    />
                </label>

                <label htmlFor="credentials-password" className="block mb-4 text-black">
                    Password
                    <input 
                        type="password" 
                        id="credentials-password" 
                        name="password" 
                        className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400" 
                        required 
                    />
                </label>

                <input 
                    type="submit" 
                    value="Sign In" 
                    className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-400 transition-colors cursor-pointer mb-4"
                />
          </form>
           
          {/* <button 
          onClick={() => signIn("google")}
          className="mt-4 rounded-md flex items-center border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-yellow-400 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" 
          type="button"
          
          >
            <img
              src="/google.svg"
              alt="metamask"
              className="h-5 w-5 mr-2"
            />
  Continue with Google
</button> */}

          <a href="/register" className="mt-4 text-indigo-400 hover:underline">
                Create Account
          </a>
      </div>
    </>
  );
}
