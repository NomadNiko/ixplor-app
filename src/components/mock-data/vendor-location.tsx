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
      },
      {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [-157.824874, 21.275486]
        },
        'properties': {
          'businessName': 'Waikiki Beach Rentals',
          'description': 'Beach Equipment Rentals',
          'vendorType': 'rentals',
          'website': 'https://waikikibeachrentals.com/',
          'address': '2410 Koa Ave',
          'city': 'Honolulu',
          'state': 'HI',
          'postalCode': '96815',
          'country': 'United States',
          'logoUrl': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpQz9q26qAammLYqh6jygw7-vjz-EO2B9hGg&s'
        }
      },
      {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [-157.816987, 21.286197]
        },
        'properties': {
          'businessName': 'Honolulu Zoo',
          'description': 'Zoo',
          'vendorType': 'tickets',
          'website': 'https://honoluluzoo.org/',
          'address': '151 Kapahulu Ave',
          'city': 'Honolulu',
          'state': 'HI',
          'postalCode': '96815',
          'country': 'United States',
          'logoUrl': 'https://www.citypass.com/sites/default/files/styles/city_120x120/public/2022-04/honolulu-zoo-logo-120x120.png'
        }
      },
      {
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': [-157.853781, 21.274392]
            },
            'properties': {
              'businessName': 'Iolani Palace',
              'description': 'Historical Landmark',
              'vendorType': 'tickets',
              'website': 'https://www.iolanipalace.org/',
              'address': '364 S King St',
              'city': 'Honolulu',
              'state': 'HI',
              'postalCode': '96813',
              'country': 'United States',
              'logoUrl': 'https://drupal8-prod.visittheusa.com/sites/default/files/styles/hero_l_x2/public/images/hero_media_image/2017-01/IolaniPalace_Honolulu_Hawaii_02_web720.jpg'
            }
          },{
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': [-157.843447, 21.286597]
            },
            'properties': {
              'businessName': 'Waikiki Surf School',
              'description': 'Learn to surf with experienced instructors',
              'vendorType': 'lessons',
              'website': 'https://waikikisurfschool.com/',
              'address': '2420 Koa Ave',
              'city': 'Honolulu',
              'state': 'HI',
              'postalCode': '96815',
              'country': 'United States',
              'logoUrl': 'https://www.waikikisurfschool.com/wp-content/uploads/2019/03/cropped-favicon-1-192x192.png'
            }
          },
          {
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': [-157.837447, 21.289597]
            },
            'properties': {
              'businessName': 'Hula Lessons with Aloha',
              'description': 'Immerse yourself in the Hawaiian Culture',
              'vendorType': 'lessons',
              'website': 'https://www.hulahula.com/',
              'address': '134 Kapahulu Ave',
              'city': 'Honolulu',
              'state': 'HI',
              'postalCode': '96815',
              'country': 'United States',
              'logoUrl': 'https://www.hulahula.com/wp-content/uploads/2019/03/cropped-favicon-1-192x192.png'
            }
          },
          {
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': [-157.8241926, 21.2848128]
            },
            'properties': {
              'businessName': 'Waikiki Segway Tours',
              'description': 'Guided Segway Tours',
              'vendorType': 'tours',
              'website': 'https://www.hawaiiadventours.com/',
              'address': '2446 Koa Ave',
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
              'coordinates': [-157.839213, 21.274345]
            },
            'properties': {
              'businessName': 'Blue Hawaii Surf',
              'description': 'Surfboard, Paddleboard, Kayak & Boogie Board Rentals',
              'vendorType': 'rentals',
              'website': 'https://www.bluehawaiisurf.com/',
              'address': '2410 Koa Ave',
              'city': 'Honolulu',
              'state': 'HI',
              'postalCode': '96815',
              'country': 'United States',
              'logoUrl': 'https://www.bluehawaiisurf.com/cdn/shop/files/bluehawaiisurf_180x.png?v=1673362653'
            }
          },
          {
            'type': 'Feature',
            'geometry': {
              'type': 'Point',
              'coordinates': [-157.837447, 21.284597]
            },
            'properties': {
              'businessName': 'Island Water Sports Hawaii',
              'description': 'Jet Ski, Kayak, SUP & Snorkel Rentals',
              'vendorType': 'rentals',
              'website': 'https://www.islandwatersportshawaii.com/',
              'address': '134 Kapahulu Ave',
              'city': 'Honolulu',
              'state': 'HI',
              'postalCode': '96815',
              'country': 'United States',
              'logoUrl': 'https://www.islandwatersportshawaii.com/wp-content/uploads/2019/03/cropped-favicon-1-192x192.png'
            }
          }
        ]
      } as const;
  
  export type VendorLocation = typeof vendorLocations.features[number];
  export type VendorProperties = VendorLocation['properties'];
  export type VendorType = VendorProperties['vendorType'];
  
  export default vendorLocations;






  
      