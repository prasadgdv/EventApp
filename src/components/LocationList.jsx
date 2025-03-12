// components/LocationList.jsx
import React from 'react';
import { 
  IonList, IonItem, IonLabel, IonIcon, IonNote, IonBadge, 
  IonItemSliding, IonItemOptions, IonItemOption
} from '@ionic/react';
import { call, fastFood, water, car, medkit, navigate, time } from 'ionicons/icons';
import { navigateToLocation, makePhoneCall } from '../services/NavigationService';

const LocationList = ({ locations, onItemClick, category }) => {
  // Call volunteer or contact directly
  const callContact = (phone, event) => {
    event.stopPropagation(); // Prevent triggering the item click
    makePhoneCall(phone);
  };
  
  // Get appropriate icon for category
  const getCategoryIcon = (point) => {
    const type = point.type || category;
    
    switch(type) {
      case 'food': return fastFood;
      case 'water': return water;
      case 'parking': return car;
      case 'medical': return medkit;
      default: return navigate;
    }
  };
  
  // Get availability badge color
  const getAvailabilityColor = (availability) => {
    switch(availability) {
      case 'High': return 'success';
      case 'Medium': return 'warning';
      case 'Low': return 'danger';
      default: return 'medium';
    }
  };

  // Get secondary text based on category
  const getSecondaryText = (location) => {
    switch(location.type || category) {
      case 'food': 
        return 'Free Distribution';
      case 'water': 
        return 'Free Distribution';
      case 'parking': 
        return location.capacity;
      case 'medical':
        if (location.subType === 'ambulance') {
          return `Ambulance Service - ${location.response || 'Emergency'}`;
        } else if (location.subType === 'camp') {
          return `Medical Camp - ${location.operatingHours || ''}`;
        } else if (location.subType === 'firstaid') {
          return 'First Aid Station';
        }
        return 'Medical Services';
      default: 
        return '';
    }
  };

  // Get tertiary text based on category
  const getTertiaryText = (location) => {
    if (location.type === 'medical') {
      return location.operatingHours;
    }
    return null;
  };

  // Get contact phone based on location type
  const getContactPhone = (location) => {
    if (location.contactInfo && location.contactInfo.phone) {
      return location.contactInfo.phone;
    }
    
    if (location.doctors && location.doctors[0]) {
      return location.doctors[0].phone;
    }
    
    if (location.volunteers && location.volunteers[0]) {
      return location.volunteers[0].phone;
    }
    
    return null;
  };
  
  return (
    <IonList>
      {locations.map(location => (
        <IonItemSliding key={location.id}>
          <IonItem button onClick={() => onItemClick(location)}>
            <IonIcon icon={getCategoryIcon(location)} slot="start" />
            <IonLabel>
              <h2>{location.name}</h2>
              <p>{getSecondaryText(location)}</p>
              {getTertiaryText(location) && <p>{getTertiaryText(location)}</p>}
              
              {/* For medical locations, show response time or operating hours */}
              {location.type === 'medical' && location.subType === 'ambulance' && location.response && (
                <p>
                  Response: {location.response}
                </p>
              )}
              
              {location.availability && (
                <p>
                  Availability: 
                  <IonBadge 
                    color={getAvailabilityColor(location.availability)}
                    style={{marginLeft: '8px'}}
                  >
                    {location.availability}
                  </IonBadge>
                </p>
              )}
            </IonLabel>
            
            {/* Show menu count for food */}
            {location.menu && (
              <IonNote slot="end">
                {location.menu.filter(item => item.available).length} of {location.menu.length} items
              </IonNote>
            )}
            
            {/* Show water types count */}
            {location.waterTypes && (
              <IonNote slot="end">
                {location.waterTypes.filter(item => item.available).length} of {location.waterTypes.length} types
              </IonNote>
            )}
            
            {/* Show medical services count */}
            {location.services && (
              <IonNote slot="end">
                {location.services.filter(item => item.available).length} of {location.services.length} services
              </IonNote>
            )}
            
            {/* Show special badges for medical locations */}
            {location.type === 'medical' && location.subType === 'ambulance' && (
              <IonBadge color="danger" slot="end">AMBULANCE</IonBadge>
            )}
            
            {location.type === 'medical' && location.subType === 'firstaid' && (
              <IonBadge color="warning" slot="end">FIRST AID</IonBadge>
            )}
          </IonItem>
          
          <IonItemOptions side="end">
            {/* Navigate option */}
            <IonItemOption 
              color="tertiary"
              onClick={(e) => {
                e.stopPropagation();
                navigateToLocation(location.lat, location.lng);
              }}
            >
              <IonIcon slot="icon-only" icon={navigate}></IonIcon>
            </IonItemOption>
            
            {/* Call option - only if contact exists */}
            {getContactPhone(location) && (
              <IonItemOption 
                color={location.type === 'medical' && location.subType === 'ambulance' ? 'danger' : 'success'}
                onClick={(e) => callContact(getContactPhone(location), e)}
              >
                <IonIcon slot="icon-only" icon={call}></IonIcon>
              </IonItemOption>
            )}
          </IonItemOptions>
        </IonItemSliding>
      ))}
    </IonList>
  );
};

export default LocationList;