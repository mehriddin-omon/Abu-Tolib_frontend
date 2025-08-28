import { STUDENT_ROUTES } from "@/utils/path";
import { Link } from "react-router-dom";

export const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-full text-center bg-white dark:bg-gray-900 p-6">
    <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
    <p className="text-xl text-gray-700 dark:text-gray-300 mb-2">Kechirasiz, sahifa topilmadi.</p>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Siz izlagan sahifa o‘chirilgan yoki manzili noto‘g‘ri yozilgan bo‘lishi mumkin.</p>
    <Link to={STUDENT_ROUTES.dashboard} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
      Bosh sahifaga qaytish
    </Link >
  </div>
);