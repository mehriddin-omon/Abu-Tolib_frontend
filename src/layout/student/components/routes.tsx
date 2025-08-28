import { CoursesLogo, DashboardLogo, OlympiadsLogo } from "@/assets/svg/studentDashboardLogos";
import { STUDENT_ROUTES, TEACHER_ROUTES } from "@/utils/path";

export const sidebarRoutes = [
    {
        path: STUDENT_ROUTES.dashboard,
        label: 'Bosh sahifa',
        logo: DashboardLogo
    },
    {
        path: STUDENT_ROUTES.olympiads,
        label: 'Musobaqalar',
        logo: OlympiadsLogo
    },
    {
        path: STUDENT_ROUTES.subjects,
        label: 'Fanlar',
        logo: CoursesLogo
    },
    {
        path: TEACHER_ROUTES.createTest,
        label: "Test Qo'shish",
        logo: CoursesLogo
    }
    // {
    //     path: '/student/courses',
    //     label: 'Kusrlar',
    //     logo: CoursesLogo
    // },
    // {
    //     path: '/student/blogs',
    //     label: 'Bloglar',
    //     icon: 'i-heroicons-chart-bar-20-solid',
    //     logo: CoursesLogo
    // },
    // {
    //     path: '/student/library',
    //     label: 'Kutubxona',
    //     icon: 'i-heroicons-chart-bar-20-solid',
    //     logo: CoursesLogo
    // },
    // {
    //     path: '/student/ratings',
    //     label: 'Reyting',
    //     icon: 'i-heroicons-chart-bar-20-solid',
    //     logo: RaytingsLogo
    // },
    // {
    //     path: '/student/profile',
    //     label: 'Profile',
    //     icon: 'i-heroicons-chart-bar-20-solid',
    //     logo: DashboardLogo
    // },
    // {
    //     path: '/student/parameters',
    //     label: 'Sozlamalar',
    //     icon: 'i-heroicons-chart-bar-20-solid',
    //     logo: ParametersLogo
    // },
    // {
    //     path: '/student/exits',
    //     label: 'chiqish',
    //     icon: 'i-heroicons-chart-bar-20-solid',
    //     logo: SignOutLogo
    // }
]