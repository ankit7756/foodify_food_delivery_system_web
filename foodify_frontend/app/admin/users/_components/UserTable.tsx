"use client";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { handleDeleteUser } from "@/lib/actions/admin/user-action";
import DeleteModal from "@/app/_components/DeleteModal";
import { Search, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

export default function UserTable({
    users,
    pagination,
    search
}: {
    users: any[];
    pagination: any;
    search?: string;
}) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState(search || '');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [pending, startTransition] = useTransition();

    const handleSearchChange = () => {
        router.push(`/admin/users?page=1&size=${pagination.size}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`);
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        startTransition(async () => {
            try {
                const result = await handleDeleteUser(deleteId);
                if (result.success) {
                    toast.success("User deleted successfully");
                    router.refresh();
                } else {
                    toast.error(result.message || "Failed to delete user");
                }
            } catch (err: any) {
                toast.error(err.message || "Failed to delete user");
            } finally {
                setDeleteId(null);
            }
        });
    };

    const makePaginationLinks = () => {
        const pages = [];
        const currentPage = pagination.page;
        const totalPages = pagination.totalPages;
        const delta = 2;

        let startPage = Math.max(1, currentPage - delta);
        let endPage = Math.min(totalPages, currentPage + delta);

        // Previous button
        pages.push(
            <Link
                key="prev"
                href={currentPage === 1 ? '#' : `/admin/users?page=${currentPage - 1}&size=${pagination.size}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`}
                className={`px-3 py-2 border rounded-lg flex items-center gap-2 transition-colors ${currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                        : 'bg-white hover:bg-blue-50 text-blue-600'
                    }`}
            >
                <ChevronLeft className="h-4 w-4" />
                Previous
            </Link>
        );

        // First page
        if (startPage > 1) {
            pages.push(
                <Link
                    key={1}
                    href={`/admin/users?page=1&size=${pagination.size}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`}
                    className="px-4 py-2 border rounded-lg bg-white hover:bg-blue-50 text-blue-600 transition-colors"
                >
                    1
                </Link>
            );
            if (startPage > 2) {
                pages.push(<span key="dots1" className="px-2 text-gray-400">...</span>);
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Link
                    key={i}
                    href={`/admin/users?page=${i}&size=${pagination.size}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`}
                    className={`px-4 py-2 border rounded-lg transition-colors ${i === currentPage
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white hover:bg-blue-50 text-blue-600'
                        }`}
                >
                    {i}
                </Link>
            );
        }

        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(<span key="dots2" className="px-2 text-gray-400">...</span>);
            }
            pages.push(
                <Link
                    key={totalPages}
                    href={`/admin/users?page=${totalPages}&size=${pagination.size}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`}
                    className="px-4 py-2 border rounded-lg bg-white hover:bg-blue-50 text-blue-600 transition-colors"
                >
                    {totalPages}
                </Link>
            );
        }

        // Next button
        pages.push(
            <Link
                key="next"
                href={currentPage === totalPages ? '#' : `/admin/users?page=${currentPage + 1}&size=${pagination.size}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`}
                className={`px-3 py-2 border rounded-lg flex items-center gap-2 transition-colors ${currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                        : 'bg-white hover:bg-blue-50 text-blue-600'
                    }`}
            >
                Next
                <ChevronRight className="h-4 w-4" />
            </Link>
        );

        return pages;
    };

    return (
        <div className="space-y-4">
            <DeleteModal
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete User"
                description="Are you sure you want to delete this user? This action cannot be undone."
            />

            {/* Search Bar */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearchChange();
                            }}
                            placeholder="Search by name, email, or username..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={handleSearchChange}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Image
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map((user: any) => (
                                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                                    <td className="px-6 py-4">
                                        {user.profileImage ? (
                                            <img
                                                src={user.profileImage}
                                                alt={user.fullName}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                                                {user.fullName?.charAt(0) || user.username?.charAt(0)}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-medium">{user.fullName}</div>
                                            <div className="text-sm text-gray-500">@{user.username}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin'
                                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Link
                                                href={`/admin/users/${user._id}`}
                                                className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span className="text-sm font-medium">View</span>
                                            </Link>
                                            <Link
                                                href={`/admin/users/${user._id}/edit`}
                                                className="text-green-600 hover:text-green-700 transition-colors flex items-center gap-1"
                                            >
                                                <Edit className="h-4 w-4" />
                                                <span className="text-sm font-medium">Edit</span>
                                            </Link>
                                            <button
                                                onClick={() => setDeleteId(user._id)}
                                                className="text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="text-sm font-medium">Delete</span>
                                            </button>
                                        </div>
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

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t flex items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Showing page {pagination.page} of {pagination.totalPages} ({pagination.totalItems} total users)
                        </div>
                        <div className="flex items-center gap-2">
                            {makePaginationLinks()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}