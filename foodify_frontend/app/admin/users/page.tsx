import Link from "next/link";
import { handleGetAllUsers } from "@/app/lib/actions/admin/user-action";
import { notFound } from "next/navigation";

export default async function Page() {
    const result = await handleGetAllUsers();

    if (!result.success) {
        throw new Error(result.message || "Failed to fetch users");
    }

    const users = result.data || [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Users Management</h1>
                <Link
                    href="/admin/users/create"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Create User
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {users.map((user: any) => (
                            <tr key={user._id || user.id}>
                                <td className="px-6 py-4">
                                    {user.profileImage ? (
                                        <img
                                            src={user.profileImage}
                                            alt={user.fullName}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-600 text-sm">
                                                {user.fullName?.charAt(0) || user.username?.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {user.fullName || user.username}
                                </td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin'
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 space-x-2">
                                    <Link
                                        href={`/admin/users/${user._id || user.id}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        View
                                    </Link>
                                    <Link
                                        href={`/admin/users/${user._id || user.id}/edit`}
                                        className="text-green-600 hover:underline"
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {users.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No users found
                    </div>
                )}
            </div>
        </div>
    );
}