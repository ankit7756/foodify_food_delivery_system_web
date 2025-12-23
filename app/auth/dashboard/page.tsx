import Link from "next/link";

export default function DashboardPage() {
    return (
        <div className="text-center space-y-8">
            <h1 className="text-4xl font-bold">Dashboard</h1>
            <p className="text-lg">Congratulations! You are now logged in.</p>
            <p className="text-muted-foreground">This is a protected dummy page.</p>
            <Link
                href="/"
                className="inline-block px-6 py-3 border border-foreground rounded-md font-medium hover:bg-foreground/5"
            >
                Back to Home
            </Link>
        </div>
    );
}