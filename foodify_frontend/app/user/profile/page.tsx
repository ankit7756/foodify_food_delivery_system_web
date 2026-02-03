import { handleWhoAmI } from "@/app/lib/actions/auth-action";
import { notFound } from "next/navigation";
import UpdateUserForm from "../_components/UpdateProfile";

export default async function Page() {
    const result = await handleWhoAmI();

    if (!result.success || !result.data) {
        notFound();
    }

    return (
        <div>
            <UpdateUserForm user={result.data} />
        </div>
    );
}