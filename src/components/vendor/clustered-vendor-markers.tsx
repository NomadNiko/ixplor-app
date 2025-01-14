// src/components/vendor/clustered-vendor-markers.tsx
import { useMemo, useState } from 'react';
import { Marker } from 'react-map-gl';
import useSupercluster from 'use-supercluster';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { Binoculars, GraduationCap, Timer, Ticket, Users } from 'lucide-react';
import { Vendor } from '@/app/[language]/types/vendor';
import { BBox } from 'geojson';
import { ClusterFeature, PointFeature } from 'supercluster';

interface ClusterState {
  vendors: Vendor[];
  position: { longitude: number; latitude: number };
}

export interface ClusteredVendorMarkersProps {
  vendors: Vendor[];
  onClick: (vendor: Vendor) => void;
  bounds?: BBox;
  zoom: number;
}

const getVendorIcon = (type: string) => {
  switch (type) {
    case 'tours':
      return <Binoculars size={14} />;
    case 'lessons':
      return <GraduationCap size={14} />;
    case 'rentals':
      return <Timer size={14} />;
    case 'tickets':
      return <Ticket size={14} />;
    default:
      return <Binoculars size={14} />;
  }
};

export const ClusteredVendorMarkers = ({ 
  vendors,
  onClick,
  bounds,
  zoom
}: ClusteredVendorMarkersProps) => {
  const [selectedCluster, setSelectedCluster] = useState<ClusterState | null>(null);
  console.log(selectedCluster);
  const points: PointFeature<Vendor>[] = useMemo(() => 
    vendors
      .filter(vendor => vendor.longitude && vendor.latitude)
      .map(vendor => ({
        type: 'Feature',
        properties: vendor,
        geometry: {
          type: 'Point',
          coordinates: [
            vendor.longitude || 0,
            vendor.latitude || 0
          ]
        }
      })), [vendors]);

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
    <ClickAwayListener onClickAway={() => setSelectedCluster(null)}>
      <div>
        {clusters.map(cluster => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          
          const isCluster = (cluster as ClusterFeature<Vendor>).properties.cluster;
          
          if (isCluster) {
            const { cluster_id, point_count } = (cluster as ClusterFeature<Vendor>).properties;
            
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
                    const expansion = supercluster?.getLeaves(
                      cluster_id, 
                      Infinity
                    );
                    
                    if (expansion) {
                      setSelectedCluster({
                        vendors: expansion.map(point => point.properties),
                        position: { longitude, latitude }
                      });
                    }
                  }}
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '& .MuiChip-icon': {
                      color: 'inherit'
                    }
                  }}
                />
              </Marker>
            );
          }

          // Non-clustered point
          const vendor = (cluster as PointFeature<Vendor>).properties;
          
          return (
            <Marker
              key={vendor._id}
              longitude={longitude}
              latitude={latitude}
              anchor="bottom"
            >
              <Chip
                icon={getVendorIcon(vendor.vendorType)}
                label={vendor.businessName}
                onClick={() => onClick(vendor)}
                className="bg-background-glass backdrop-blur-md hover:bg-background-glassHover cursor-pointer"
                size="small"
              />
            </Marker>
          );
        })}
      </div>
    </ClickAwayListener>
  );
};

export default ClusteredVendorMarkers;