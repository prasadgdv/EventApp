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
  // New section: Medical Locations (ambulances and medical camps)
  medicalLocations: [
    // { 
    //   id: '1', 
    //   name: '108 Ambulance Service', 
    //   lat: 17.119, 
    //   lng: 82.252, 
    //   type: 'medical',
    //   subType: 'ambulance',
    //   availability: 'High',
    //   response: 'Under 10 mins',
    //   services: [
    //     { name: 'Emergency Transport', available: true },
    //     { name: 'Basic Life Support', available: true },
    //     { name: 'Advanced Life Support', available: true }
    //   ],
    //   contactInfo: {
    //     phone: '108',
    //     name: 'Emergency Dispatch',
    //     alternatePhone: '9876543230'
    //   },
    //   operatingHours: '24/7'
    // },
    // { 
    //   id: '2', 
    //   name: 'Health On Wheels', 
    //   lat: 17.114, 
    //   lng: 82.255, 
    //   type: 'medical',
    //   subType: 'ambulance',
    //   availability: 'Medium',
    //   response: '15-20 mins',
    //   services: [
    //     { name: 'Emergency Transport', available: true },
    //     { name: 'Basic Life Support', available: true },
    //     { name: 'Advanced Life Support', available: false }
    //   ],
    //   contactInfo: {
    //     phone: '9876543231',
    //     name: 'Ambulance Coordinator',
    //     alternatePhone: '9876543232'
    //   },
    //   operatingHours: '6:00 AM - 10:00 PM'
    // },
    { 
      id: '3', 
      name: 'General Medical Camp', 
      lat: 17.116, 
      lng: 82.251, 
      type: 'medical',
      subType: 'camp',
      services: [
        { name: 'General Checkup', available: true },
        { name: 'Blood Pressure Monitoring', available: true },
        { name: 'Blood Sugar Testing', available: true },
        { name: 'Basic Medications', available: true }
      ],
      doctors: [
        { name: 'Dr. Ramesh Kumar', specialization: 'General Medicine', phone: '9876543233' },
        { name: 'Dr. Priya Sharma', specialization: 'Pediatrics', phone: '9876543234' }
      ],
      operatingHours: '8:00 AM - 6:00 PM',
      operatingDays: 'All days during event'
    },
    { 
      id: '4', 
      name: 'Specialty Medical Camp', 
      lat: 17.118, 
      lng: 82.257, 
      type: 'medical',
      subType: 'camp',
      services: [
        { name: 'Cardiology Consultation', available: true },
        { name: 'Ophthalmology Checkup', available: true },
        { name: 'Dental Services', available: false },
        { name: 'Orthopedic Consultation', available: true }
      ],
      doctors: [
        { name: 'Dr. Suresh Rao', specialization: 'Cardiology', phone: '9876543235' },
        { name: 'Dr. Meena Patel', specialization: 'Ophthalmology', phone: '9876543236' },
        { name: 'Dr. Rajiv Singh', specialization: 'Orthopedics', phone: '9876543237' }
      ],
      operatingHours: '9:00 AM - 5:00 PM',
      operatingDays: 'Tuesday, Thursday, Saturday'
    },
    { 
      id: '5', 
      name: 'First Aid Station', 
      lat: 17.115, 
      lng: 82.254, 
      type: 'medical',
      services: [
        { name: 'Wound Dressing', available: true },
        { name: 'Minor Burns Treatment', available: true },
        { name: 'Basic Medications', available: true },
        { name: 'ORS Distribution', available: true }
      ],
      volunteers: [
        { name: 'Sanjeev Kumar', role: 'Paramedic', phone: '9876543238' },
        { name: 'Leela Reddy', role: 'Nurse', phone: '9876543239' }
      ],
      operatingHours: '24/7 during event'
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