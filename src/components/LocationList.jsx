// components/LocationList.jsx
import React from 'react';
import { 
  IonList, IonItem, IonLabel, IonIcon, IonNote, IonBadge, 
  IonItemSliding, IonItemOptions, IonItemOption
} from '@ionic/react';
import { call, fastFood, water, car, bed, navigate } from 'ionicons/icons';
import { navigateToLocation, makePhoneCall } from '../services/NavigationService';

const LocationList = ({ locations, onItemClick, category }) => {
  // Call volunteer or contact directly
  const callContact = (phone, event) => {
    event.stopPropagation(); // Prevent triggering the item click
    makePhoneCall(phone);
  };
  
  // Get appropriate icon for category
  const getCategoryIcon = () => {
    switch(category) {
      case 'food': return fastFood;
      case 'water': return water;
      case 'parking': return car;
      case 'stay': return bed;
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
      case 'stay': 
        return location.pricingType === 'free' 
          ? 'Free Accommodation' 
          : `${location.priceDetails?.perRoom || 'Paid'} per room`;
      default: 
        return '';
    }
  };

  // Get tertiary text based on category
  const getTertiaryText = (location) => {
    if (location.distance && (location.type === 'stay' || category === 'stay')) {
      return location.distance;
    }
    return null;
  };

  // Get contact phone based on location type
  const getContactPhone = (location) => {
    if (location.volunteers && location.volunteers[0]) {
      return location.volunteers[0].phone;
    }
    if (location.contactInfo && location.contactInfo.phone) {
      return location.contactInfo.phone;
    }
    return null;
  };
  
  return (
    <IonList>
      {locations.map(location => (
        <IonItemSliding key={location.id}>
          <IonItem button onClick={() => onItemClick(location)}>
            <IonIcon icon={getCategoryIcon()} slot="start" />
            <IonLabel>
              <h2>{location.name}</h2>
              <p>{getSecondaryText(location)}</p>
              {getTertiaryText(location) && <p>{getTertiaryText(location)}</p>}
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
            
            {/* Show FREE badge for free stays */}
            {location.pricingType === 'free' && location.type === 'stay' && (
              <IonBadge color="success" slot="end">FREE</IonBadge>
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
                color="success"
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