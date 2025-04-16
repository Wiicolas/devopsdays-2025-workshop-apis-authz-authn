import { auth, signOut } from "@/auth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Beer } from "lucide-react";

export async function TopBar({ ...props }: any) {
    const session = await auth()

    return (
        <div className="flex w-full h-[48px] border-b-gray-100 border-b items-center p-8 justify-between">
            <strong className="flex gap-[8px] p-[8px] rounded-sm bg-black text-white">
                <Beer />
                DevOps Beerer
            </strong>
            <DropdownMenu>
                <DropdownMenuTrigger>Hi, {session?.user?.name}</DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <form
                            action={async () => {
                                "use server"
                                await signOut()
                            }}
                        >
                            <button type="submit">Sign Out</button>
                        </form>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </div>);
}
