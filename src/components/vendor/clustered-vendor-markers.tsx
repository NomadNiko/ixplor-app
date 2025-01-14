import { useMemo, useState } from 'react';
import { Marker } from 'react-map-gl';
import useSupercluster from 'use-supercluster';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { VendorLocation, VendorType } from '@/components/mock-data/vendor-location';
import { VendorListView } from './vendor-list';
import { VendorShortView } from './vendor-short';
import { Binoculars, GraduationCap, Ticket, Timer, Users } from 'lucide-react';

interface PointProperties {
  cluster: false;
  vendorId: string;
  businessName: string;
  vendorType: VendorType;
  description: string;
  website: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  logoUrl: string;
}

type PointFeature = GeoJSON.Feature<GeoJSON.Point, PointProperties>;

type ClusterState = {
  vendors: VendorLocation[];
  position: { longitude: number; latitude: number };
} | null;

const getVendorIcon = (type: VendorType) => {
  switch (type) {
    case 'tours':
      return <Binoculars size={14} />;
    case 'lessons':
      return <GraduationCap size={14} />;
    case 'rentals':
      return <Timer size={14} />;
    case 'tickets':
      return <Ticket size={14} />;
  }
};

export type ClusteredVendorMarkersProps = {
  vendors: VendorLocation[];
  onClick: (vendor: VendorLocation) => void;
  bounds?: [number, number, number, number];
  zoom: number;
}

export const ClusteredVendorMarkers = ({ 
  vendors,
  onClick,
  bounds,
  zoom
}: ClusteredVendorMarkersProps) => {
  // State for managing selected cluster and vendor
  const [selectedCluster, setSelectedCluster] = useState<ClusterState>(null);
  const [selectedVendor, setSelectedVendor] = useState<VendorLocation | null>(null);

  const points = useMemo(() => {
    return vendors.map(vendor => ({
      type: 'Feature',
      properties: {
        cluster: false,
        vendorId: vendor.properties.businessName,
        ...vendor.properties,
        country: 'United States',
      } as PointProperties,
      geometry: {
        type: 'Point',
        coordinates: [
          vendor.geometry.coordinates[0],
          vendor.geometry.coordinates[1]
        ]
      }
    })) as PointFeature[];
  }, [vendors]);

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: {
      radius: 75,
      maxZoom: 20
    }
  });

  // Handler for when a vendor is selected from the list
  const handleVendorSelect = (vendor: VendorLocation) => {
    setSelectedCluster(null);
    setSelectedVendor(vendor);
  };

  // Handler for closing the vendor list view
  const handleCloseList = () => {
    setSelectedCluster(null);
  };

  // Handler for closing the vendor short view
  const handleCloseVendor = () => {
    setSelectedVendor(null);
  };

  return (
    <ClickAwayListener onClickAway={handleCloseList}>
      <div style={{ position: 'relative' }}>
        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          
          if (cluster.properties.cluster) {
            const { cluster_id, point_count } = cluster.properties;
            
            const clusterPoints = supercluster?.getChildren(cluster_id);
            const clusterVendors = clusterPoints ? vendors.filter(vendor => 
              clusterPoints.some(point => 
                point.properties?.vendorId === vendor.properties.businessName
              )
            ) : [];

            return (
              <Marker
                key={`cluster-${cluster_id}`}
                longitude={longitude}
                latitude={latitude}
              >
                <Chip
                  icon={<Users size={14} />}
                  label={`${point_count} Vendors`}
                  onClick={() => {
                    setSelectedVendor(null); // Clear any selected vendor
                    setSelectedCluster({
                      vendors: clusterVendors,
                      position: { longitude, latitude }
                    });
                  }}
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '& .MuiChip-icon': {
                      color: 'inherit'
                    },
                    transform: `scale(${1 + (point_count / points.length) * 0.5})`,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    }
                  }}
                />
              </Marker>
            );
          }

          const vendor = vendors.find(v => 
            v.properties.businessName === (cluster.properties as PointProperties).vendorId
          );
          if (!vendor) return null;

          return (
            <Marker
              key={vendor.properties.businessName}
              longitude={longitude}
              latitude={latitude}
              anchor="bottom"
            >
              <Chip
                icon={getVendorIcon(vendor.properties.vendorType)}
                label={vendor.properties.businessName}
                onClick={() => onClick(vendor)}
                className="bg-background-glass backdrop-blur-md hover:bg-background-glassHover cursor-pointer"
                size="small"
              />
            </Marker>
          );
        })}

        {/* Render VendorListView when a cluster is selected */}
        {selectedCluster && (
          <VendorListView
            vendors={selectedCluster.vendors}
            onVendorClick={handleVendorSelect}
            onClose={handleCloseList}
            position={selectedCluster.position}
          />
        )}

        {/* Render VendorShortView when a vendor is selected */}
        {selectedVendor && (
          <VendorShortView
            vendor={selectedVendor}
            onViewMore={() => onClick(selectedVendor)}
            onClose={handleCloseVendor}
          />
        )}
      </div>
    </ClickAwayListener>
  );
};

export default ClusteredVendorMarkers;