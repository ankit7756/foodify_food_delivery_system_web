import Link from "next/link";
import { handleGetAllUsers } from "@/lib/actions/admin/user-action";
import UserTable from "./_components/UserTable";

export default async function Page({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const page = params.page as string || '1';
    const size = params.size as string || '10';
    const search = params.search as string || '';

    const response = await handleGetAllUsers(page, size, search);

    if (!response.success) {
        throw new Error(response.message || 'Failed to load users');
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Users Management</h1>
                <Link
                    href="/admin/users/create"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                    + Create User
                </Link>
            </div>

            <UserTable
                users={response.data || []}
                pagination={response.pagination}
                search={search}
            />
        </div>
    );
}