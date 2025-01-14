import { useMemo, useState } from 'react';
import { Marker } from 'react-map-gl';
import useSupercluster from 'use-supercluster';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { VendorLocation, VendorType } from '@/components/mock-data/vendor-location';
import { VendorListView } from './vendor-list';
import { Binoculars, GraduationCap, Timer, Ticket } from 'lucide-react';

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
  const [selectedCluster, setSelectedCluster] = useState<{
    vendors: VendorLocation[];
    position: { longitude: number; latitude: number };
  } | null>(null);

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

  return (
    <>
      {clusters.map((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        
        if (cluster.properties.cluster) {
          const { cluster_id, point_count } = cluster.properties;
          
          // Find vendors in this cluster
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
              <Box 
                onClick={() => setSelectedCluster({
                  vendors: clusterVendors,
                  position: { longitude, latitude }
                })}
                className="bg-primary-main text-white rounded-full p-3 flex items-center justify-center cursor-pointer hover:bg-primary-dark transition-colors"
                sx={{
                  minWidth: '2rem',
                  minHeight: '2rem',
                  transform: `scale(${1 + (point_count / points.length) * 0.5})`,
                }}
              >
                {point_count}
              </Box>
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

      {selectedCluster && (
        <VendorListView
          vendors={selectedCluster.vendors}
          onVendorClick={(vendor) => {
            onClick(vendor);
            setSelectedCluster(null);
          }}
          onClose={() => setSelectedCluster(null)}
          position={selectedCluster.position}
        />
      )}
    </>
  );
};

export default ClusteredVendorMarkers;