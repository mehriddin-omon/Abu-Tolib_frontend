import { Outlet } from "react-router-dom"
import { HomeHeader } from "./components/homeHeader"

export const HomeLayout = () => {
    return (
        <div className="w-full flex flex-col justify-center items-center">
            <HomeHeader />
            <div className="container w-full mx-auto">
                <Outlet />
            </div>
        </div>
    )
}