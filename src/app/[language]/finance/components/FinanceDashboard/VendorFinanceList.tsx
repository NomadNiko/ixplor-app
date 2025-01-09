"use client";
import { VendorFinancialData } from '../../finance-types';
import { mockVendorFinancialData } from '../../finance-mock-data';
import VendorFinanceCard from './VendorFinanceCard';

interface VendorFinanceListProps {
  onVendorSelect: (vendor: VendorFinancialData) => void;
}

export default function VendorFinanceList({ onVendorSelect }: VendorFinanceListProps) {
  return (
    <>
      {mockVendorFinancialData.map((vendor) => (
        <VendorFinanceCard 
          key={vendor.id}
          data={vendor}
          onViewDetails={onVendorSelect}
        />
      ))}
    </>
  );
}