import Image from "next/image";
import localFont from "next/font/local";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  return (
    <div>
      <div>
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
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-900 via-purple-800 to-purple-900  ">
      <p className="text-purple-500 text-7xl font-bold text-center ">
         Online<br /> Engineering <br /> 3D Printing Service
        </p>
        <a href ="/login">
        <button
          className="mt-20 bg-yellow-400 text-black py-2 px-40 rounded-lg hover:bg-yellow-200 transition-colors"
        >
          Login
        </button>
        </a>
    </div>
   </div>
  );
}
