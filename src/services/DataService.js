// services/DataService.js
const mockLocations = {
    foodCounters: [
      { 
        id: '1', 
        name: 'Food Counter 1', 
        lat: 18.123, 
        lng: 83.456, 
        type: 'food',
        availability: 'High',
        menu: [
          { name: 'Veg Biryani', available: true },
          { name: 'Chicken Biryani', available: true },
          { name: 'Paneer Tikka', available: false }
        ],
        volunteers: [
          { name: 'Rahul Sharma', role: 'Counter Manager', phone: '9876543210' },
          { name: 'Priya Singh', role: 'Service Staff', phone: '9876543211' }
        ]
      },
      { 
        id: '2', 
        name: 'Food Counter 2', 
        lat: 18.128, 
        lng: 83.461, 
        type: 'food',
        availability: 'Medium',
        menu: [
          { name: 'Pav Bhaji', available: true },
          { name: 'Chole Bhature', available: true },
          { name: 'Dosa', available: true }
        ],
        volunteers: [
          { name: 'Amit Kumar', role: 'Counter Manager', phone: '9876543212' },
          { name: 'Neha Patel', role: 'Service Staff', phone: '9876543213' }
        ]
      },
      { 
        id: '3', 
        name: 'Food Counter 3', 
        lat: 18.130, 
        lng: 83.465, 
        type: 'food',
        availability: 'Low',
        menu: [
          { name: 'Pizza', available: false },
          { name: 'Burger', available: true },
          { name: 'French Fries', available: true }
        ],
        volunteers: [
          { name: 'Sanjay Verma', role: 'Counter Manager', phone: '9876543214' },
          { name: 'Divya Reddy', role: 'Service Staff', phone: '9876543215' }
        ]
      }
    ],
    waterStations: [
      { 
        id: '1', 
        name: 'Water Station 1', 
        lat: 18.126, 
        lng: 83.459, 
        type: 'water',
        availability: 'High',
        waterTypes: [
          { type: 'Drinking Water', available: true },
          { type: 'Cold Water', available: true }
        ],
        volunteers: [
          { name: 'Rajesh Kumar', role: 'Station Manager', phone: '9876543216' },
          { name: 'Ananya Mishra', role: 'Volunteer', phone: '9876543217' }
        ]
      },
      { 
        id: '2', 
        name: 'Water Station 2', 
        lat: 18.129, 
        lng: 83.463, 
        type: 'water',
        availability: 'Low',
        waterTypes: [
          { type: 'Drinking Water', available: true },
          { type: 'Cold Water', available: false }
        ],
        volunteers: [
          { name: 'Vivek Singh', role: 'Station Manager', phone: '9876543218' },
          { name: 'Meera Desai', role: 'Volunteer', phone: '9876543219' }
        ]
      }
    ],
    parkingLocations: [
      { 
        id: '1', 
        name: 'Main Parking', 
        lat: 18.120, 
        lng: 83.455, 
        capacity: '200 cars', 
        type: 'parking' 
      },
      { 
        id: '2', 
        name: 'VIP Parking', 
        lat: 18.126, 
        lng: 83.458, 
        capacity: '50 cars', 
        type: 'parking' 
      }
    ],
 // services/DataService.js
// Update the stayLocations section with more detailed information
stayLocations: [
    { 
      id: '1', 
      name: 'Hotel Grandeur', 
      lat: 18.135, 
      lng: 83.470, 
      type: 'stay',
      availability: 'High',
      pricingType: 'paid',
      priceDetails: {
        perRoom: '₹3500/night',
        perPerson: '₹1200/night'
      },
      amenities: ['Wi-Fi', 'AC', 'Restaurant', 'Parking'],
      distance: '2.5 km from venue',
      contactInfo: {
        phone: '9876543220',
        name: 'Reservation Desk',
        email: 'reservations@hotelgrandeur.com'
      }
    },
    { 
      id: '2', 
      name: 'Comfort Inn', 
      lat: 18.118, 
      lng: 83.453, 
      type: 'stay',
      availability: 'Medium',
      pricingType: 'paid',
      priceDetails: {
        perRoom: '₹2000/night',
        perPerson: '₹800/night'
      },
      amenities: ['Wi-Fi', 'AC', 'Room Service'],
      distance: '1.2 km from venue',
      contactInfo: {
        phone: '9876543221',
        name: 'Front Desk',
        email: 'booking@comfortinn.com'
      }
    },
    { 
      id: '3', 
      name: 'Event Dormitory', 
      lat: 18.126, 
      lng: 83.462, 
      type: 'stay',
      availability: 'Low',
      pricingType: 'free',
      priceDetails: {
        info: 'Free for event participants',
        requirement: 'Registration ID required'
      },
      amenities: ['Basic Bedding', 'Common Bathrooms', 'Security'],
      distance: '0.3 km from venue',
      contactInfo: {
        phone: '9876543222',
        name: 'Event Housing Coordinator',
        email: 'housing@eventname.com'
      }
    }
  ]
  };
  
  export async function fetchLocations(locationType) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockLocations[locationType] || [];
  }
  
  export function syncOfflineData() {
    console.log("Mock sync completed");
    return Promise.resolve();
  }