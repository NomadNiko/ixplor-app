"use client";
import { VendorShortView, VendorFullView } from "@/components/vendor/vendor-display";
import { Vendor } from "@/app/[language]/types/vendor";

interface VendorViewsProps {
  selectedVendor: Vendor | null;
  showFullView: boolean;
  onViewMore: () => void;
  onClose: () => void;
}

export const VendorViews = ({
  selectedVendor,
  showFullView,
  onViewMore,
  onClose,
}: VendorViewsProps) => {
  if (!selectedVendor) return null;

  return (
    <>
      {!showFullView && (
        <VendorShortView
          vendor={selectedVendor}
          onViewMore={onViewMore}
          onClose={onClose}
        />
      )}
      {showFullView && (
        <VendorFullView
          vendor={selectedVendor}
          onClose={onClose}
        />
      )}
    </>
  );
};