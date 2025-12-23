import LoginForm from "./_components/LoginForm";

export default function LoginPage() {
    return (
        <div className="max-w-md mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Welcome back</h1>
                <p className="mt-2 text-muted-foreground">Log in to your account</p>
            </div>
            <LoginForm />
        </div>
    );
}