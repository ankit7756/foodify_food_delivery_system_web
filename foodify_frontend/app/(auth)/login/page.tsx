import LoginForm from "../_components/LoginForm";

export default function LoginPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Log in to Foodify</h1>
                <p className="text-sm text-muted-foreground">
                    Welcome back! Enter your details below.
                </p>
            </div>
            <LoginForm />
        </div>
    );
}