import { useEffect, useRef, useState } from 'react';
import { useSnackbar } from '@/hooks/use-snackbar';

export interface PlaceResult {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  businessName?: string;
  phoneNumber?: string;
  website?: string;
  placeTypes?: string[];
}

export const useGooglePlaces = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const placesInstance = useRef<google.maps.places.PlacesService | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const initPlaces = async () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&v=3`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          const dummyDiv = document.createElement('div');
          placesInstance.current = new google.maps.places.PlacesService(dummyDiv);
          setIsLoaded(true);
        };

        document.head.appendChild(script);
      } else {
        const dummyDiv = document.createElement('div');
        placesInstance.current = new google.maps.places.PlacesService(dummyDiv);
        setIsLoaded(true);
      }
    };

    initPlaces();
  }, []);

  const searchPlaces = async (query: string): Promise<google.maps.places.AutocompletePrediction[]> => {
    if (!window.google || !placesInstance.current) {
      return [];
    }

    try {
      return new Promise((resolve, reject) => {
        const sessionToken = new google.maps.places.AutocompleteSessionToken();
        const autocompleteService = new google.maps.places.AutocompleteService();
        
        autocompleteService.getPlacePredictions(
          {
            input: query,
            sessionToken,
            types: ['establishment', 'geocode', 'address'],
          },
          (predictions, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
              resolve(predictions);
            } else {
              reject(new Error(`Places search failed with status: ${status}`));
            }
          }
        );
      });
    } catch (error) {
      console.error('Error searching places:', error);
      enqueueSnackbar('Error searching for places', { variant: 'error' });
      return [];
    }
  };

  const getPlaceDetails = async (placeId: string): Promise<PlaceResult | null> => {
    if (!window.google || !placesInstance.current) {
      return null;
    }

    try {
      return new Promise((resolve, reject) => {
        placesInstance.current!.getDetails(
          {
            placeId,
            fields: [
              'name',
              'formatted_address',
              'address_components',
              'geometry',
              'formatted_phone_number',
              'website',
              'types',
              'business_status',
              'opening_hours',
              'rating',
              'user_ratings_total'
            ]
          },
          (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && place) {
              const result: PlaceResult = {
                address: place.formatted_address || '',
                city: '',
                state: '',
                postalCode: '',
                latitude: place.geometry?.location?.lat() || 0,
                longitude: place.geometry?.location?.lng() || 0,
                businessName: place.name,
                phoneNumber: place.formatted_phone_number,
                website: place.website,
                placeTypes: place.types
              };

              // Process address components
              place.address_components?.forEach(component => {
                const type = component.types[0];
                if (type === 'locality') result.city = component.long_name;
                if (type === 'administrative_area_level_1') result.state = component.short_name;
                if (type === 'postal_code') result.postalCode = component.long_name;
              });

              resolve(result);
            } else {
              reject(new Error(`Place details failed with status: ${status}`));
            }
          }
        );
      });
    } catch (error) {
      console.error('Error fetching place details:', error);
      enqueueSnackbar('Error fetching place details', { variant: 'error' });
      return null;
    }
  };

  return {
    isLoaded,
    searchPlaces,
    getPlaceDetails
  };
};