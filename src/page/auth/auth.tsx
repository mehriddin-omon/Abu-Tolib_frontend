import { LoginForm } from "./components/login";

const Auth = () => {
    return (
        <>
            <div className="bg-muted flex min-h-full flex-col items-center p-6 md:p-10">
                <div className="max-w-sm md:max-w-md">
                    <LoginForm />
                </div>
            </div>
        </>
    )
}

export default Auth;