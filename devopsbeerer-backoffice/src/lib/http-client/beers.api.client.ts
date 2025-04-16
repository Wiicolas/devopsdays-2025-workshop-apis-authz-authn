import { env } from "process"
import Beer from "../models/beer"

export interface ListBeer {
    data: Beer[]
    total: number
}

export const listBeers = async (accessToken: string): Promise<ListBeer | null> => {
    const response = await fetch(`${env.API_URL}/beers`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })
    const data = await response.json()

    return data;
}
