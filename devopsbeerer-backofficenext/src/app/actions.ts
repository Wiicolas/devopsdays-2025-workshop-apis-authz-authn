'use server'

import { auth } from "@/auth"
import { createBeer, deleteBeer } from "@/lib/http-client/beers.api.client"
import BeerCreate from "@/lib/models/beer-create"

export async function deleteBeers(beerIds: string[]) {
    const session = await auth()
    if (!session?.accessToken) {
        throw new Error('Not authenticated')
    }

    try {
        let success: boolean = true;
        for (const beerId of beerIds) {
            if (!await deleteBeer(beerId, session.accessToken)) {
                success = false;
            }
        }

        return { success }
    } catch (error) {
        console.error('Error deleting beers:', error)
        return { success: false, error: 'Failed to delete beers' }
    }
}

export async function createNewBeer(beer: BeerCreate) {
    const session = await auth()
    if (!session?.accessToken) {
        throw new Error('Not authenticated')
    }

    try {
        const result = await createBeer(beer, session.accessToken)
        return { success: true, data: result }
    } catch (error) {
        console.error('Error creating beer:', error)
        return { success: false, error: 'Failed to create beer' }
    }
}