import { env } from "process"
import Beer from "../models/beer"
import BeerCreate from "../models/beer-create"

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

export const createBeer = async (beer: BeerCreate, accessToken: string): Promise<ListBeer | null> => {
    const response = await fetch(`${env.API_URL}/beers`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(beer)
    })
    const data = await response.json()

    return data;
}


export const deleteBeer = async (id: string, accessToken: string): Promise<boolean> => {
    const response = await fetch(`${env.API_URL}/beers/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })

    return response.status === 204;
}

export const getBeer = async (id: string, accessToken: string): Promise<Beer | null> => {
    const response = await fetch(`${env.API_URL}/beers/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })
    if (!response.ok) return null;
    return await response.json();
}
