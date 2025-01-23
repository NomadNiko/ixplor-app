import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import { VendorHeader } from "./vendor-header";
import { VendorInfoGrid } from "./vendor-info-grid";
import { VendorActionSection } from "./vendor-action-section";
import VendorEditCard from "../cards/edit-cards/VendorEditCard";
import { Vendor, VendorStatusEnum } from "@/app/[language]/types/vendor";

interface VendorManagementCardProps {
  vendor: Vendor;
  onAction: (id: string, action: VendorStatusEnum, notes: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: () => Promise<void>;
}

export const VendorManagementCard: React.FC<VendorManagementCardProps> = ({
  vendor,
  onAction,
  onDelete,
  onUpdate,
}) => {
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleAction = async (id: string, action: VendorStatusEnum, notes: string) => {
    setIsSubmitting(true);
    await onAction(id, action, notes);
    setIsSubmitting(false);
    setNotes("");
  };

  const handleDelete = async (id: string) => {
    setIsSubmitting(true);
    await onDelete(id);
    setIsSubmitting(false);
  };

  if (isEditing) {
    return (
      <VendorEditCard
        vendor={vendor}
        onSave={async () => {
          setIsEditing(false);
          await onUpdate();
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <Card>
      <CardContent sx={{ position: "relative" }}>
        <VendorHeader
          logoUrl={vendor.logoUrl}
          businessName={vendor.businessName}
          description={vendor.description}
        />
        <VendorInfoGrid
          email={vendor.email}
          phone={vendor.phone}
          address={vendor.address}
          city={vendor.city}
          state={vendor.state}
          postalCode={vendor.postalCode}
          adminNotes={vendor.adminNotes}
          vendorStatus={vendor.vendorStatus}
        />
        <Divider sx={{ my: 2 }} />
        <VendorActionSection
          onAction={handleAction}
          onDelete={handleDelete}
          onEdit={() => setIsEditing(true)}
          vendorId={vendor._id}
          notes={notes}
          setNotes={setNotes}
          isSubmitting={isSubmitting}
        />
      </CardContent>
    </Card>
  );
};