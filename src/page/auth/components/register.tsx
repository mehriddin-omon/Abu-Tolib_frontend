import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../store/store";
import { registerUser, setToken, setUser } from "../../../store/redux/authSlice";
import { registerSchema } from "../../../utils/schemas/register.schema";

export const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { handleSubmit, register, formState: { errors }, } = useForm({ resolver: zodResolver(registerSchema) });
    // Register function
    const submit = (data: object) => {
        dispatch(registerUser(data))
            .unwrap()
            .then((res) => {
                dispatch(setToken({
                    accessToken: res.accessToken,
                    refreshToken: res.refreshToken
                }))
                // Handle successful registration
                dispatch(setUser({
                    userId: res.user.id
                }));
                navigate("/app/subjects");
            })
            .catch((error) => {
                // Handle registration error
                console.error("Registration failed. ", error);
            });
    }
    return (
        <>
            <form onSubmit={handleSubmit(submit)} action="" method="POST"  >
                <div className="flex gap-[154px]">
                    <div className="flex flex-col items-center gap-[5px]">
                        <label
                            htmlFor="firstName"
                            className="font-secondary font-medium text-xl leading-[130%] text-black">
                            Ism
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            {...register("firstName")}
                            className="py-1.5 px-4 w-full font-secondary font-medium text-xl leading-[130%] bg-[rgb(217,217,217,0.2)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-[3px]"
                        />
                        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
                        <label
                            htmlFor="birthDate"
                            className="pt-5 font-secondary font-medium text-xl leading-[130%] text-black">
                            Tug'ilgan sana
                        </label>
                        <input
                            type="date"
                            {...register("birthDate")}
                            id="birthDate"
                            className="w-full py-1.5 px-4 font-secondary font-medium text-xl leading-[130%] bg-[rgb(217,217,217,0.2)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-[3px]"
                        />
                        {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate.message}</p>}

                        <label
                            htmlFor="userName"
                            className="pt-5 font-secondary font-medium text-xl leading-[130%] text-black">
                            Username
                        </label>
                        <div className="relative ">
                            <span className="font-secondary font-medium absolute left-3 top-1/2 -translate-y-1/2 text-black select-none">
                                @ |
                            </span>
                            <input
                                type="text"
                                {...register("userName")}
                                id="userName"
                                className="pl-15 py-1.5 font-secondary font-medium text-xl leading-[130%] bg-[rgb(217,217,217,0.2)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-[3px]"
                            />
                            {errors.userName && <p className="text-red-500 text-sm">{errors.userName.message}</p>}
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-[5px]">
                        <label
                            htmlFor="lastName"
                            className="font-secondary font-medium text-xl leading-[130%] text-black">
                            Familiya
                        </label>
                        <input
                            type="text"
                            {...register("lastName")}
                            id="lastName"
                            className="w-full py-1.5 px-4 font-secondary font-medium text-xl leading-[130%] bg-[rgb(217,217,217,0.2)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-[3px]"
                        />
                        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}

                        <label
                            htmlFor="phoneNumber"
                            className="pt-5 font-secondary font-medium text-xl leading-[130%] text-black">
                            Telefon raqam
                        </label>
                        <div className="relative">
                            <span className="font-secondary font-medium absolute left-3 top-1/2 -translate-y-1/2 text-black select-none">
                                +998 |
                            </span>
                            <input
                                type="text"
                                id="phoneNumber"
                                {...register("phoneNumber")}
                                className="pl-15 py-1.5 font-secondary font-medium text-xl leading-[130%] bg-[rgb(217,217,217,0.2)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-[3px]"
                            />
                        </div>
                        {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}

                        <label
                            htmlFor="password"
                            className="pt-5 font-secondary font-medium text-xl leading-[130%] text-black">
                            Parol
                        </label>
                        <input
                            type="password"
                            id="password"
                            {...register("password")}
                            className="w-full py-1.5 px-4 font-secondary font-medium text-xl leading-[130%] bg-[rgb(217,217,217,0.2)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-[3px]"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

                    </div>
                </div>

                <div className="flex flex-col items-center pt-4">
                    <label
                        htmlFor="yo'nalish"
                        className="pb-2 font-secondary font-medium text-xl leading-[130%] text-black"
                    >
                        Yo'nalishingiz
                    </label>
                    <input
                        type="text"
                        id="yo'nalish"
                        className="w-full h-20 bg-[rgb(217,217,217,0.2)] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] rounded-[3px]"
                    />
                </div>
                <div className="flex pt-10">
                    <button
                        type="submit"
                        className="mx-auto py-1 px-9 rounded-[10px] bg-[#00ced5] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] cursor-pointer"
                    >
                        <span className="font-secondary font-medium leading-[130%] text-xl text-black">
                            Ro'yxatdan o'tish
                        </span>
                    </button>
                </div>
            </form>
        </>
    )
}