// import { sidebarRoutes } from "./routes";
import Logo from '@/assets/img/siteLogo.png';
// export const HomeSidebar = () => {
//     return (
//         <>
//             <div className="w-[20%] flex flex-col items-center sticky top-0 h-screen">
//                 <a href="/student">
//                     <figure className="max-w-[212px] mt-[84px]">
//                         <img src={Logo} alt="Site logotipi" />
//                     </figure>
//                 </a>
//                 <div>
//                     {sidebarRoutes.map((route, index) => {
//                         const isActive = location.pathname === route.path;
//                         return (
//                             <a
//                                 key={index}
//                                 href={route.path}
//                                 className={
//                                     "flex justify-baseline items-center p-2 rounded-lg " +
//                                     (isActive
//                                         ? "bg-gradient-to-r from-[#1e5adb] to-[#5aa6ed] text-red font-bold"
//                                         : "hover:bg-gray-400")
//                                 }
//                             >
//                                 <i className={route.icon + " mr-3"}>
//                                     <route.logo />
//                                 </i>
//                                 <span className={
//                                     "font-normal text-lg text-center " +
//                                     (isActive
//                                         ? ""
//                                         : "text-black")
//                                 }>
//                                     {route.label}
//                                 </span>
//                             </a>
//                         );
//                     })}
//                 </div>
//             </div>
//         </>
//     )
// }

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components"
import { Link } from "react-router-dom"
import { sidebarRoutes } from "./routes"


export function UserSidebar() {
    return (
        <Sidebar className='pt-10 flex flex-col items-center justify-center'>
            <SidebarHeader>
                <img src={Logo} alt="Logo" className="w-32 h-auto mx-auto" />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className='pt-4 flex flex-col items-center'>
                            <div>
                                {sidebarRoutes.map((item) => (
                                    <SidebarMenuItem key={item.label}>
                                        <SidebarMenuButton asChild size={'lg'}>
                                            <Link to={item.path}>
                                                <item.logo />
                                                <span className='fs1 text-[var(--light-gray)] hover:text-[var(--light-gray70)]'>
                                                    {item.label}
                                                </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </div>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}