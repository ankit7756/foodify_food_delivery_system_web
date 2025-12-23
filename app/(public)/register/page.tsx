import RegisterForm from "./_components/RegisterForm";

export default function RegisterPage() {
    return (
        <div className="max-w-md mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Create an account</h1>
                <p className="mt-2 text-muted-foreground">Get started with Foodify</p>
            </div>
            <RegisterForm />
        </div>
    );
}