import Image from "next/image";
import Header from "@/components/Header";

import BotPage from "@/botComponent/BotPage";


export default function Home() {
  return (
    <div className="h-full w-full ">
      <div className="">
        <Header />
        
        <div>
          <BotPage />
        </div>
        
  
       
      </div>
    </div>
  );
}
