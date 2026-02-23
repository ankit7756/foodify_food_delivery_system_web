import RegisterForm from "../_components/RegisterForm";

export default function RegisterPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
                <p className="text-sm text-muted-foreground">
                    Get started with Foodify — it's free.
                </p>
            </div>
            <RegisterForm />
        </div>
    );
}