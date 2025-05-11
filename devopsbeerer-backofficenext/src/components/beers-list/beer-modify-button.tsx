import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export function ModifyBeerButton() {
    return (
        <Button variant="ghost" disabled={true} size="icon" className="h-8 w-8">
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit beer</span>
        </Button>
    )
}
