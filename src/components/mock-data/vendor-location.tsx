const vendorLocations = {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [-157.8241926, 21.2758128] // Note: [longitude, latitude] for Mapbox
        },
        'properties': {
          'businessName': 'Moku Hawaii',
          'description': 'Surfing Lessons - Provides surfboard, bodyboard & stand-up paddleboard rentals, plus lessons & gear.',
          'vendorType': 'lessons',
          'website': 'https://www.mokuhawaii.surf/',
          'address': '2446 Koa Ave',
          'city': 'Honolulu',
          'state': 'HI',
          'postalCode': '96815',
          'country': 'United States',
          'logoUrl': 'https://bf421f42b27d62f55bfd.cdn6.editmysite.com/uploads/b/bf421f42b27d62f55bfd1dca712b7c5ae02660ec3e27cfd380a049008576b989/MOKU_1645564224.png'
        }
      },
      {
        'type': 'Feature', 
        'geometry': {
          'type': 'Point',
          'coordinates': [-157.822877, 21.2723464]
        },
        'properties': {
          'businessName': 'Beach Candy Waikiki',
          'description': 'Find everything from surfing rentals, stand-up paddle board rentals, or just the beach day basics like chairs and beach umbrellas right next to the best spot in Waikiki!',
          'vendorType': 'rentals',
          'website': 'https://www.jobschoolofsurf.com/waikiki-beach-rentals/',
          'address': '2570 Kalākaua Ave #112',
          'city': 'Honolulu',
          'state': 'HI',
          'postalCode': '96815',
          'country': 'United States',
          'logoUrl': 'https://www.jobschoolofsurf.com/wp-content/uploads/2023/11/BEACHCANDYWAIKIKI_Vert-300x300.png.webp'
        }
      },
      {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [-157.824874, 21.275486]
        },
        'properties': {
          'businessName': 'Hawaii Adventours',
          'description': 'Spend the day climbing stunning cliffs with panoramic ocean views on Oahu. Includes hotel pick-up, gear (helmets, harnesses, ropes, and shoes), and guided toprope climbing.',
          'vendorType': 'tours',
          'website': 'https://www.hawaiiadventours.com/',
          'address': '100 Uluniu Ave',
          'city': 'Honolulu',
          'state': 'HI',
          'postalCode': '96815',
          'country': 'United States',
          'logoUrl': 'https://www.hawaiiadventours.com/logo2.png'
        }
      },
      {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [-157.8300915, 21.2807764]
        },
        'properties': {
          'businessName': 'Hawaii Tickets For Less',
          'description': 'Tickets for Tours and Adventures all over the Hawaiian Islands',
          'vendorType': 'tickets',
          'website': 'https://alohasunshinetours.com/',
          'address': '2166 Kalākaua Ave',
          'city': 'Honolulu',
          'state': 'HI',
          'postalCode': '96815',
          'country': 'United States',
          'logoUrl': 'https://alohasunshinetours.com/wp-content/uploads/sites/1826/2018/10/AST-LOGO-WITH-SHADOW.png?h=120&zoom=2'
        }
      }
    ]
  } as const;
  
  export type VendorLocation = typeof vendorLocations.features[number];
  export type VendorProperties = VendorLocation['properties'];
  export type VendorType = VendorProperties['vendorType'];
  
  export default vendorLocations;