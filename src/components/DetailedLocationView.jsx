// components/DetailedLocationView.jsx
import React, { useState } from 'react';
import { 
  IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle,
  IonList, IonItem, IonLabel, IonBadge, IonIcon, IonButton,
  IonAccordion, IonAccordionGroup, IonChip, IonText, IonGrid, IonRow, IonCol
} from '@ionic/react';
import { 
  call, navigateCircle, people, restaurant, water, car, bed,
  cash, walletOutline, informationCircleOutline, wifi
} from 'ionicons/icons';
import { navigateToLocation, makePhoneCall } from '../services/NavigationService';

const DetailedLocationView = ({ location }) => {
  const [expanded, setExpanded] = useState(null);
  
  // Helper to get availability color
  const getAvailabilityColor = (availability) => {
    switch(availability) {
      case 'High': return 'success';
      case 'Medium': return 'warning';
      case 'Low': return 'danger';
      default: return 'medium';
    }
  };

  // If it's a stay location, render the stay details view
  if (location.type === 'stay') {
    // Helper to get amenity icon
    const getAmenityIcon = (amenity) => {
      const amenityIcons = {
        'Wi-Fi': wifi,
        'AC': 'snow-outline',
        'Restaurant': restaurant,
        'Parking': car,
        'Room Service': 'restaurant-outline',
        'Security': 'shield-checkmark-outline',
        'Basic Bedding': bed
      };
      
      return amenityIcons[amenity] || 'checkmark-circle-outline';
    };
    
    return (
      <IonCard className="stay-detail-card">
        <IonCardHeader>
          <IonCardTitle>{location.name}</IonCardTitle>
          <IonCardSubtitle>{location.distance}</IonCardSubtitle>
          
          <div className="ion-padding-top">
            <IonChip color={getAvailabilityColor(location.availability)}>
              <IonLabel>Availability: {location.availability}</IonLabel>
            </IonChip>
            
            <IonChip color={location.pricingType === 'free' ? 'success' : 'primary'}>
              <IonIcon icon={location.pricingType === 'free' ? walletOutline : cash} />
              <IonLabel>{location.pricingType === 'free' ? 'FREE' : 'PAID'}</IonLabel>
            </IonChip>
          </div>
        </IonCardHeader>
        
        <IonCardContent>
          {/* Pricing Section */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={location.pricingType === 'free' ? walletOutline : cash} 
                        style={{marginRight: '8px'}} />
                {location.pricingType === 'free' ? 'Free Accommodation' : 'Pricing'}
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {location.pricingType === 'free' ? (
                <IonText>
                  <p>{location.priceDetails.info}</p>
                  <p><strong>Note:</strong> {location.priceDetails.requirement}</p>
                </IonText>
              ) : (
                <IonGrid>
                  <IonRow>
                    <IonCol size="6">Per Room:</IonCol>
                    <IonCol size="6"><strong>{location.priceDetails.perRoom}</strong></IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol size="6">Per Person:</IonCol>
                    <IonCol size="6"><strong>{location.priceDetails.perPerson}</strong></IonCol>
                  </IonRow>
                </IonGrid>
              )}
            </IonCardContent>
          </IonCard>
          
          {/* Amenities Section */}
          {location.amenities && (
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  <IonIcon icon={informationCircleOutline} style={{marginRight: '8px'}} />
                  Amenities
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="amenities-container" style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                  {location.amenities.map((amenity, index) => (
                    <IonChip key={index} outline>
                      <IonIcon icon={getAmenityIcon(amenity)} />
                      <IonLabel>{amenity}</IonLabel>
                    </IonChip>
                  ))}
                </div>
              </IonCardContent>
            </IonCard>
          )}
          
          {/* Contact & Navigation */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={call} style={{marginRight: '8px'}} />
                Contact Information
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <p><strong>{location.contactInfo.name}</strong></p>
                {location.contactInfo.email && <p>Email: {location.contactInfo.email}</p>}
              </IonText>
              
              <IonButton 
                expand="block" 
                color="success" 
                onClick={() => makePhoneCall(location.contactInfo.phone)}
                className="ion-margin-top"
              >
                <IonIcon slot="start" icon={call} />
                Call {location.contactInfo.phone}
              </IonButton>
              
              <IonButton 
                expand="block" 
                color="primary"
                onClick={() => navigateToLocation(location.lat, location.lng)}
                className="ion-margin-top"
              >
                <IonIcon slot="start" icon={navigateCircle} />
                Navigate to Location
              </IonButton>
            </IonCardContent>
          </IonCard>
        </IonCardContent>
      </IonCard>
    );
  }

  // Food Menu Section
  const renderFoodMenu = () => {
    if (!location.menu) return null;
    
    return (
      <IonAccordion value="menu">
        <IonItem slot="header">
          <IonIcon icon={restaurant} slot="start" />
          <IonLabel>Free Food Menu</IonLabel>
        </IonItem>
        <div slot="content">
          <div className="ion-padding-start ion-padding-end ion-padding-bottom">
            <IonText color="medium">
              <p><strong>All items are freely distributed</strong></p>
            </IonText>
          </div>
          <IonList>
            {location.menu.map((item, index) => (
              <IonItem key={index}>
                <IonLabel>{item.name}</IonLabel>
                <IonBadge color={item.available ? 'success' : 'danger'} slot="end">
                  {item.available ? 'Available' : 'Out of Stock'}
                </IonBadge>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonAccordion>
    );
  };
  
  // Water Types Section
  const renderWaterTypes = () => {
    if (!location.waterTypes) return null;
    
    return (
      <IonAccordion value="waterTypes">
        <IonItem slot="header">
          <IonIcon icon={water} slot="start" />
          <IonLabel>Free Water</IonLabel>
        </IonItem>
        <div slot="content">
          <div className="ion-padding-start ion-padding-end ion-padding-bottom">
            <IonText color="medium">
              <p><strong>Free distribution</strong></p>
            </IonText>
          </div>
          <IonList>
            {location.waterTypes.map((item, index) => (
              <IonItem key={index}>
                <IonLabel>{item.type}</IonLabel>
                <IonBadge color={item.available ? 'success' : 'danger'} slot="end">
                  {item.available ? 'Available' : 'Out of Stock'}
                </IonBadge>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonAccordion>
    );
  };

  // Parking Details Section
  const renderParkingDetails = () => {
    if (location.type !== 'parking') return null;
    
    return (
      <IonAccordion value="parkingDetails">
        <IonItem slot="header">
          <IonIcon icon={car} slot="start" />
          <IonLabel>Parking Details</IonLabel>
        </IonItem>
        <div slot="content" className="ion-padding">
          <IonText>
            <p><strong>Capacity:</strong> {location.capacity}</p>
            {location.restrictions && <p><strong>Restrictions:</strong> {location.restrictions}</p>}
            {location.fees && <p><strong>Fees:</strong> {location.fees}</p>}
          </IonText>
        </div>
      </IonAccordion>
    );
  };
  
  // Volunteers Section
  const renderVolunteers = () => {
    if (!location.volunteers) return null;
    
    return (
      <IonAccordion value="volunteers">
        <IonItem slot="header">
          <IonIcon icon={people} slot="start" />
          <IonLabel>Volunteers</IonLabel>
        </IonItem>
        <div slot="content" className="ion-padding">
          {location.volunteers.map((volunteer, index) => (
            <IonCard key={index}>
              <IonCardHeader>
                <IonCardTitle>{volunteer.name}</IonCardTitle>
                <IonCardSubtitle>{volunteer.role}</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <IonButton 
                  expand="block" 
                  color="success" 
                  onClick={() => makePhoneCall(volunteer.phone)}
                >
                  <IonIcon slot="start" icon={call}></IonIcon>
                  Call {volunteer.phone}
                </IonButton>
              </IonCardContent>
            </IonCard>
          ))}
        </div>
      </IonAccordion>
    );
  };
  
  return (
    <IonCard className="location-detail-card">
      <IonCardHeader>
        <IonCardTitle>{location.name}</IonCardTitle>
        {location.availability && (
          <div className="ion-padding-top">
            <IonChip color={getAvailabilityColor(location.availability)}>
              <IonLabel>Availability: {location.availability}</IonLabel>
            </IonChip>
          </div>
        )}
      </IonCardHeader>
      
      <IonCardContent>
        <IonButton 
          expand="block" 
          className="ion-margin-bottom"
          onClick={() => navigateToLocation(location.lat, location.lng)}
        >
          <IonIcon slot="start" icon={navigateCircle} />
          Navigate to Location
        </IonButton>
        
        <IonAccordionGroup value={expanded} onIonChange={e => setExpanded(e.detail.value)}>
          {location.type === 'food' && renderFoodMenu()}
          {location.type === 'water' && renderWaterTypes()}
          {renderParkingDetails()}
          {renderVolunteers()}
        </IonAccordionGroup>
      </IonCardContent>
    </IonCard>
  );
};

export default DetailedLocationView;