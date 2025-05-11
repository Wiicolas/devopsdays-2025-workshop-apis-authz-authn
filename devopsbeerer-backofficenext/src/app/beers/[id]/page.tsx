import { auth } from "@/auth";
import { ModifyBeerButton } from "@/components/beers-list/beer-modify-button";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBeer } from "@/lib/http-client/beers.api.client";
import { cn } from "@/lib/utils";
import { ArrowLeft, Beer as BeerIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getData(params: Params) {
    try {
        const { id } = await params;
        const session = await auth();
        if (!session?.accessToken) return null;

        return await getBeer(id, session.accessToken);
    } catch (e) {
        console.error('Error fetching beer:', e);
        return null;
    }
}


type Params = Promise<{ id: string }>;

export default async function BeerPage({
    params,
}: {
    params: Params;
}) {
    const beer = await getData(params);

    if (!beer) {
        notFound();
    }

    return (
        <div className="relative flex flex-col h-full w-[900px] flex-col items-center justify-center overflow-hidden p-20 bg-background mx-auto">
            <DotPattern
                width={20}
                height={20}
                cx={1}
                cy={1}
                cr={1}
                className={cn(
                    "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]",
                )}
            />
            <div className="w-full z-10">
                <Link href="/">
                    <Button variant="ghost" className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to list
                    </Button>
                </Link>
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <BeerIcon className="h-6 w-6" />
                                {beer.name}
                            </CardTitle>
                            <ModifyBeerButton />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div>
                                    <span className="font-semibold">Style:</span>
                                    <span className="ml-2">{beer.style}</span>
                                </div>
                                <div>
                                    <span className="font-semibold">ABV:</span>
                                    <span className="ml-2">{beer.abv}%</span>
                                </div>
                                <div>
                                    <span className="font-semibold">IBU:</span>
                                    <span className="ml-2">{beer.ibu}</span>
                                </div>
                                <div>
                                    <span className="font-semibold">Quantity:</span>
                                    <span className="ml-2">{beer.quantity}</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <span className="font-semibold">Created:</span>
                                    <span className="ml-2">
                                        {new Date(beer.createdDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-semibold">Last Updated:</span>
                                    <span className="ml-2">
                                        {new Date(beer.updatedDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-semibold">ID:</span>
                                    <span className="ml-2">{beer.id}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}