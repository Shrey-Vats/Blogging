import { Button } from "@/components/ui/button"
import axios from "axios";
import React, { useEffect } from "react"

interface BlogType {
    title: string,
    slug: string,
}
function Home() {
    const [data, setData] = React.useState([]);
    useEffect(() => {
        async function callData() {
            try {
                const Response = await axios.get("http://localhost:3000/api/blog/")
            
            if(Response.data.success){
                setData(Response.data.data);
                console.log(Response.data.data);


            }
            else{
                console.log("not able to fetch data");
                
            }
            } catch (error) {
             console.error(error);
             // Handle the error appropriately, e.g., show a notification to the user
             // For example, if using react-router-dom, you might redirect to a login page
             // navigate('/login');   
            }
        }

        callData();
    }, [])
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="w-full h-full">
            <div className="h-1/12 font-bold flex justify-between">
                <h1>Blogging</h1>
                <Button variant="ghost">Add Blog</Button>
            </div>
            <div className="mt-10 h-11/12 border-t-2 border-gray-300">
            {
                data.map((item: BlogType) => (
                    <div title={item.title} onClick={() => {}}/>
                ))
            }
            </div>
        </div>
    </div>
  )
}

export default Home