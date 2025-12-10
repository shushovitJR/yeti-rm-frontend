import { Header } from "../Components/Header";
import { SideNav } from "../Components/SideNav";

export function Dashboard(){
    return(
        <>
            <Header />
            <div className="flex items-start">
            <SideNav />
            <h1 className="text-3xl font-bold text-gray-800">Dashboard Page contents</h1>
            </div>
        </>
    );
}