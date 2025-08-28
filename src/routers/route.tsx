import { STUDENT_ROUTES, TEACHER_ROUTES } from "@/utils/path";

export const studentRoutes = [
    {
        path: STUDENT_ROUTES.dashboard, //   /user/
        comp: () => import("@/page/student/home/studentDashboard").then(m => ({ default: m.StudentHome })),
    },
    {
        path: STUDENT_ROUTES.olympiads, //   /user/olympiads
        comp: () => import("@/page/student/olympiads/olympiads").then(m => ({ default: m.Olympiads })),
    },
    {
        path: STUDENT_ROUTES.subjects, //   /user/subjects
        comp: () => import("@/page/student/subjects/subjects").then(m => ({ default: m.Subjects })),
    },
    {
        path: STUDENT_ROUTES.subjectId, //   /user/subjects/:id
        comp: () => import("@/page/student/subjects/subjectDetail").then(m => ({ default: m.SubjectDetail })),
    },
    {
        path: TEACHER_ROUTES.createTest,
        comp: () => import('@/page/teacher/createTest/createTest').then(m => ({ default: m.CreateTest }))
    },
    {
        path: STUDENT_ROUTES.testId,
        comp: () => import('@/page/student/tests/tests').then(m => ({ default: m.Tests })),
    }
]