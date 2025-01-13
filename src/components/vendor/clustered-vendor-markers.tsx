import { useMemo } from 'react';
import { Marker } from 'react-map-gl';
import useSupercluster from 'use-supercluster';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { VendorLocation, VendorType } from '@/components/mock-data/vendor-location';
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

// interface ClusterFeatureProperties {
//   cluster: true;
//   cluster_id: number;
//   point_count: number;
//   point_count_abbreviated: number;
// }

type PointFeature = GeoJSON.Feature<GeoJSON.Point, PointProperties>;
//type ClusterFeature = GeoJSON.Feature<GeoJSON.Point, ClusterFeatureProperties>;

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
  const points = useMemo(() => {
    return vendors.map(vendor => ({
      type: 'Feature',
      properties: {
        cluster: false,
        vendorId: vendor.properties.businessName,
        ...vendor.properties
      },
      geometry: {
        type: 'Point',
        coordinates: [
          vendor.geometry.coordinates[0],
          vendor.geometry.coordinates[1]
        ]
      }
    })) as PointFeature[];
  }, [vendors]);

  const { clusters } = useSupercluster({
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
          const { point_count } = cluster.properties;
          return (
            <Marker
              key={`cluster-${cluster.properties.cluster_id}`}
              longitude={longitude}
              latitude={latitude}
            >
              <Box 
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

        // Individual markers
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
    </>
  );
};

export default ClusteredVendorMarkers;