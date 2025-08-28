import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { useLogin } from "../services/mutation/loginUser"
import { setToken, setUser } from "@/store/redux/authSlice"
import { STUDENT_ROUTES } from "@/utils/path"
import { useForm } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"

type LoginFormValues = {
    userName: string;
    password: string;
};

type LoginResponse = {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        role: string;
        userName: string;
    };
}

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const loginMutation = useLogin();

    const { register, handleSubmit, formState: { errors }, } = useForm<LoginFormValues>();

    const handleLogin = (values: LoginFormValues) => {
        loginMutation.mutate(values, {
            onSuccess: (data: LoginResponse) => {
                dispatch(setToken({
                    accessToken: data?.accessToken,
                    refreshToken: data?.refreshToken
                }))
                dispatch(setUser({ id: data?.user.id, role: data?.user.role }));
                navigate(STUDENT_ROUTES.dashboard);
            },
            onError: (error) => {
                console.error("Login failed:", error);
            },
        });
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    {/* <SiteLogo /> */}
                    <CardTitle >Login to your account</CardTitle>
                    <CardDescription>
                        Username va Parolingizni kiritib kirish tugmasini bosing
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit(handleLogin)}
                        method="POST"
                    >
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="userName">Username</Label>
                                <Input
                                    id="userName"
                                    type="text"
                                    placeholder="Username"
                                    {...register(
                                        "userName",
                                        { required: "Username kiriting" }
                                    )}
                                />
                                {errors.userName && (
                                    <p className="text-red-500 text-sm">{errors.userName.message}</p>
                                )}
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="/"
                                        className="ml-auto inline-block text-xs underline-offset-4 hover:underline"
                                    >
                                        Parolingiz esdan chiqdimi
                                    </a>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : "password"}
                                        placeholder="Password"
                                        {...register("password", { required: "Parol kiriting" })}
                                    />
                                    <Button
                                        type="button"
                                        variant={"secondary"}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 bg-muted"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </Button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    className="w-full"
                                >
                                    Kirish
                                </Button>
                                <Button variant="outline" className="w-full">
                                    Google orqali kirish
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <a href="/register" className="underline underline-offset-4">
                                Ro'yxatdan o'tish
                            </a>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
