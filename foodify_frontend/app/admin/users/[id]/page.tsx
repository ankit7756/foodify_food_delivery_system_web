import { handleGetUserById } from "@/lib/actions/admin/user-action";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function Page({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const result = await handleGetUserById(id);

    if (!result.success || !result.data) {
        notFound();
    }

    const user = result.data;

    return (
        <div className="max-w-2xl space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">User Details</h1>
                <Link
                    href={`/admin/users/${id}/edit`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Edit User
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 space-y-4">
                {user.profileImage && (
                    <div>
                        <img
                            src={user.profileImage}
                            alt={user.fullName}
                            className="w-24 h-24 rounded-full object-cover"
                        />
                    </div>
                )}

                <div>
                    <label className="text-sm text-gray-500">Full Name</label>
                    <p className="text-lg font-medium">{user.fullName || user.username}</p>
                </div>

                <div>
                    <label className="text-sm text-gray-500">Username</label>
                    <p className="text-lg font-medium">{user.username}</p>
                </div>

                <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="text-lg font-medium">{user.email}</p>
                </div>

                <div>
                    <label className="text-sm text-gray-500">Phone</label>
                    <p className="text-lg font-medium">{user.phone || 'N/A'}</p>
                </div>

                <div>
                    <label className="text-sm text-gray-500">Role</label>
                    <p className="text-lg font-medium capitalize">{user.role}</p>
                </div>
            </div>
        </div>
    );
}