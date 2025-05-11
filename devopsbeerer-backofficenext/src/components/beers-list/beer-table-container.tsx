'use client';

import { useState } from 'react';
import { BeerActions } from './beer-actions';
import { DataTable } from './data-table';
import { columns } from './columns';
import type Beer from '@/lib/models/beer';
import { useRouter } from 'next/navigation';

interface BeerTableContainerProps {
  initialData: Beer[];
}

export function BeerTableContainer({ initialData }: BeerTableContainerProps) {
  const [selectedBeers, setSelectedBeers] = useState<string[]>([]);
  const [resetSelection, setResetSelection] = useState(false);

  const router = useRouter();

  const handleBeersDeleted = () => {
    setSelectedBeers([]);
    setResetSelection(true);
    setTimeout(() => setResetSelection(false), 100);
    router.refresh();
  };
  return (
    <>
      <BeerActions selectedBeers={selectedBeers} onBeersDeleted={handleBeersDeleted} />
      <DataTable 
        columns={columns} 
        data={initialData} 
        onSelectionChange={setSelectedBeers}
        resetSelection={resetSelection}
      />
    </>
  );
}