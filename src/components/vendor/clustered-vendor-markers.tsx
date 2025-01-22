import { useMemo } from 'react';
import { Marker } from 'react-map-gl';
import useSupercluster from 'use-supercluster';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { Binoculars, GraduationCap, Timer, Ticket, Users } from 'lucide-react';
import { Vendor, VendorTypes } from '@/app/[language]/types/vendor';
import { BBox, Feature, Point } from 'geojson';

interface ClusteredVendorMarkersProps {
  vendors: Vendor[];
  onClick: (vendor: Vendor) => void;
  bounds: BBox | undefined;
  zoom: number;
}

// Define base properties that both cluster and point features will have
interface BaseProperties {
  vendors: Vendor[];
}

// Specific properties for cluster points
interface ClusterProperties extends BaseProperties {
  cluster: true;
  cluster_id: number;
  point_count: number;
}

// Specific properties for single points
interface PointProperties extends BaseProperties {
  cluster: false;
}

type FeatureProperties = ClusterProperties | PointProperties;

const getVendorIcon = (types: VendorTypes[] | undefined) => {
  if (!types || !Array.isArray(types)) return <Users size={14} />;
  if (types.includes('tours')) return <Binoculars size={14} />;
  if (types.includes('lessons')) return <GraduationCap size={14} />;
  if (types.includes('rentals')) return <Timer size={14} />;
  if (types.includes('tickets')) return <Ticket size={14} />;
  return <Users size={14} />;
};

const SingleVendorChip: React.FC<{
  vendor: Vendor;
  onClick: (vendor: Vendor) => void;
}> = ({ vendor, onClick }) => {
  if (!vendor?._id || !vendor?.businessName) return null;

  return (
    <Chip
      icon={getVendorIcon(vendor.vendorTypes)}
      label={vendor.businessName}
      onClick={() => onClick(vendor)}
      className="bg-background-glass backdrop-blur-md hover:bg-background-glassHover cursor-pointer"
      size="small"
    />
  );
};

export const ClusteredVendorMarkers: React.FC<ClusteredVendorMarkersProps> = ({
  vendors,
  onClick,
  bounds,
  zoom
}) => {
  const points = useMemo(() => {
    return vendors
      .filter(vendor => 
        vendor?._id &&
        vendor?.location?.coordinates &&
        Array.isArray(vendor.location.coordinates) &&
        vendor.location.coordinates.length === 2
      )
      .map((vendor): Feature<Point, FeatureProperties> => ({
        type: 'Feature',
        properties: {
          cluster: false,
          vendors: [vendor]
        },
        geometry: {
          type: 'Point',
          coordinates: [
            vendor.location.coordinates[0],
            vendor.location.coordinates[1]
          ]
        }
      }));
  }, [vendors]);

  const { clusters } = useSupercluster({
    points,
    bounds: bounds || [-180, -85, 180, 85],
    zoom,
    options: {
      radius: 75,
      maxZoom: 20,
      map: (props) => ({
        vendors: props.vendors
      }),
      reduce: (accumulated, props) => {
        accumulated.vendors = [
          ...(accumulated.vendors || []),
          ...(props.vendors || [])
        ];
      }
    }
  });

  return (
    <>
      {clusters.map(cluster => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const properties = cluster.properties as FeatureProperties;
        
        // Handle clustered points
        if (properties.cluster) {
          const clusterVendors = properties.vendors;
          
          // Small clusters (≤ 3)
          if (clusterVendors.length <= 3) {
            return (
              <Marker
                key={`cluster-${properties.cluster_id}`}
                longitude={longitude}
                latitude={latitude}
                anchor="bottom"
              >
                <Box sx={{
                  position: 'absolute',
                  transform: 'translate(-50%, -100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                  alignItems: 'center'
                }}>
                  {clusterVendors.map((vendor) => (
                    <SingleVendorChip
                      key={vendor._id}
                      vendor={vendor}
                      onClick={onClick}
                    />
                  ))}
                </Box>
              </Marker>
            );
          }

          // Large clusters
          return (
            <Marker
              key={`cluster-${properties.cluster_id}`}
              longitude={longitude}
              latitude={latitude}
              anchor="bottom"
            >
              <Chip
                icon={<Users size={14} />}
                label={`${properties.point_count} Vendors`}
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText'
                }}
              />
            </Marker>
          );
        }

        // Single vendor point
        const vendor = properties.vendors[0];
        if (!vendor?._id) return null;

        return (
          <Marker
            key={`vendor-${vendor._id}`}
            longitude={longitude}
            latitude={latitude}
            anchor="bottom"
          >
            <SingleVendorChip
              vendor={vendor}
              onClick={onClick}
            />
          </Marker>
        );
      })}
    </>
  );
};

export default ClusteredVendorMarkers;