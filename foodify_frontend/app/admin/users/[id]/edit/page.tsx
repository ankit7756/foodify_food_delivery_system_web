import { handleGetUserById } from "@/app/lib/actions/admin/user-action";
import { notFound } from "next/navigation";
import EditUserForm from "../../_components/EditUserForm";

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
        <div>
            <EditUserForm user={user} />
        </div>
    );
}