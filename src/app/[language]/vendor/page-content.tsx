"use client";

import { useState } from "react";
import VendorList from "./components/vender-list";
import VendorView from "./components/vender-view";
import VendorEdit from "./components/vender-edit";

type ViewMode = "list" | "view" | "edit";

interface ViewState {
  mode: ViewMode;
  selectedVendorId?: string;
}

export default function VendorContent() {
  const [viewState, setViewState] = useState<ViewState>({
    mode: "list",
  });

  const handleVendorSelect = (vendorId: string) => {
    setViewState({
      mode: "view",
      selectedVendorId: vendorId,
    });
  };

  const handleBackToList = () => {
    setViewState({
      mode: "list",
    });
  };

  const handleEditClick = () => {
    if (!viewState.selectedVendorId) return;

    setViewState({
      mode: "edit",
      selectedVendorId: viewState.selectedVendorId,
    });
  };

  // Render the appropriate component based on the current view mode
  return (
    <>
      {viewState.mode === "list" && (
        <VendorList onVendorSelect={handleVendorSelect} />
      )}

{viewState.mode === "view" && viewState.selectedVendorId && (
  <VendorView
    vendorId={viewState.selectedVendorId}
    onBackClick={handleBackToList}
    onEditClick={handleEditClick}
  />
)}

      {viewState.mode === "edit" && viewState.selectedVendorId && (
        <VendorEdit
          vendorId={viewState.selectedVendorId}
          onBackClick={() =>
            setViewState({
              mode: "view",
              selectedVendorId: viewState.selectedVendorId,
            })
          }
        />
      )}
    </>
  );
}
