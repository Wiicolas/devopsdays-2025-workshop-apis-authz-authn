'use client';

import { deleteBeers } from "@/app/actions";
import { DeleteBeerButton } from "./beer-delete-button";
import { NewBeerButton } from "./beer-new-button";

interface BeerTableContainerProps {
  selectedBeers: string[];
  onBeersDeleted?: () => void;
}

export function BeerActions({ selectedBeers, onBeersDeleted }: BeerTableContainerProps) {

  const handleDelete = async () => {
    try {
      const result = await deleteBeers(selectedBeers);
      if (result.success) {
        if (onBeersDeleted) {
          onBeersDeleted();
        }
      } else {
        console.error('Failed to delete beers:', result.error);
      }
    } catch (error) {
      console.error('Error deleting beers:', error);
    }
  };
  return (
    <div className="relative z-10 py-8 flex justify-center gap-2">
      <NewBeerButton />
      <DeleteBeerButton selectedBeers={selectedBeers} handleDelete={handleDelete} />
    </div>
  );
}