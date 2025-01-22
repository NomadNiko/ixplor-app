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

interface BaseProperties {
  cluster?: boolean;
  vendors: Vendor[];
}

interface ClusterProperties extends BaseProperties {
  cluster: true;
  cluster_id: number;
  point_count: number;
}

interface PointProperties extends BaseProperties {
  cluster: false;
}

type FeatureProperties = ClusterProperties | PointProperties;

const getVendorIcon = (types: VendorTypes[]) => {
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

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(vendor);
  };
  
  return (
    <div onClick={handleClick} role="button" style={{ cursor: 'pointer' }}>
      <Chip
        icon={getVendorIcon(vendor.vendorTypes)}
        label={vendor.businessName}
        className="bg-background-glass backdrop-blur-md hover:bg-background-glassHover"
        size="small"
      />
    </div>
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
          coordinates: vendor.location.coordinates
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
        
        if (properties.cluster) {
          const clusterVendors = properties.vendors;
          
          if (clusterVendors.length <= 3) {
            return (
              <Marker
                key={`cluster-${properties.cluster_id}`}
                longitude={longitude}
                latitude={latitude}
                anchor="bottom"
              >
                <Box 
                  sx={{
                    position: 'absolute',
                    transform: 'translate(-50%, -100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    alignItems: 'center',
                    zIndex: 1
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
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

          const handleClusterClick = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            // Handle cluster click if needed
          };

          return (
            <Marker
              key={`cluster-${properties.cluster_id}`}
              longitude={longitude}
              latitude={latitude}
              anchor="bottom"
            >
              <div onClick={handleClusterClick}>
                <Chip
                  icon={<Users size={14} />}
                  label={`${properties.point_count} Vendors`}
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    zIndex: 1
                  }}
                />
              </div>
            </Marker>
          );
        }

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