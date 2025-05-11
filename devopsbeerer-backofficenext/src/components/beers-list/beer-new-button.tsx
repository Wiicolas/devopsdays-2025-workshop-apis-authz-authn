"use client"

import { createNewBeer } from "@/app/actions"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
    name: z.string(),
    style: z.string(),
    abv: z.number(),
    ibu: z.number(),
    quantity: z.number().min(1),
})

type FormData = z.infer<typeof formSchema>;

interface NewBeerFormProps {
    onSubmit: (data: FormData) => void;
}

export function NewBeerForm({ onSubmit }: NewBeerFormProps) {
    const methods = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            style: "",
            abv: 0,
            ibu: 0,
            quantity: 1,
        },
    })

    return (
        <Form {...methods}>
            <form id="new-beer-form" onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={methods.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Beer name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={methods.control}
                    name="style"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Style</FormLabel>
                            <FormControl>
                                <Input placeholder="Beer style" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-3 gap-4">
                    <FormField
                        control={methods.control}
                        name="abv"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ABV</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Alcohol content"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={methods.control}
                        name="ibu"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>IBU</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Bitterness units"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={methods.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Number of beers"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </form>
        </Form>
    )
}

export function NewBeerButton() {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    async function onSubmit(values: FormData) {
        try {
            const result = await createNewBeer(values);
            if (result.success) {
                router.refresh(); // Refresh the page to show the new beer
                setOpen(false);
            } else {
                console.error('Failed to create beer:', result.error);
            }
        } catch (error) {
            console.error('Error creating beer:', error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={"outline"}>Add a beer</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>New beer</DialogTitle>
                    <DialogDescription>
                        Create a new beer for your organization.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <NewBeerForm onSubmit={onSubmit} />
                </div>
                <DialogFooter>
                    <Button type="submit" form="new-beer-form">Create a new beer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
