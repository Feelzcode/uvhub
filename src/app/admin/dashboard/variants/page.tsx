import React from 'react';
import { Metadata } from 'next';
import VariantsOverview from '@/components/VariantsOverview';

export const metadata: Metadata = {
  title: "Variants Management",
  description: "Manage product variants, pricing, and inventory across all products.",
};

export default function VariantsPage() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <VariantsOverview />
      </div>
    </div>
  );
}
