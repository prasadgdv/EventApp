// components/StayDetailView.jsx
import React from 'react';
import { 
  IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle,
  IonList, IonItem, IonLabel, IonBadge, IonIcon, IonButton,
  IonChip, IonText, IonGrid, IonRow, IonCol
} from '@ionic/react';
import { 
  call, navigateCircle, wifi, restaurant, bed, 
  cash, walletOutline, informationCircleOutline
} from 'ionicons/icons';
import { navigateToLocation, makePhoneCall } from '../services/NavigationService';

const StayDetailView = ({ stay }) => {
  // Helper to get availability color
  const getAvailabilityColor = (availability) => {
    switch(availability) {
      case 'High': return 'success';
      case 'Medium': return 'warning';
      case 'Low': return 'danger';
      default: return 'medium';
    }
  };
  
  // Helper to get amenity icon
  const getAmenityIcon = (amenity) => {
    const amenityIcons = {
      'Wi-Fi': wifi,
      'AC': 'snow-outline',
      'Restaurant': restaurant,
      'Parking': 'car-outline',
      'Room Service': 'restaurant-outline',
      'Security': 'shield-checkmark-outline',
      'Basic Bedding': bed
    };
    
    return amenityIcons[amenity] || 'checkmark-circle-outline';
  };
  
  return (
    <IonCard className="stay-detail-card">
      <IonCardHeader>
        <IonCardTitle>{stay.name}</IonCardTitle>
        <IonCardSubtitle>{stay.distance}</IonCardSubtitle>
        
        <div className="ion-padding-top">
          <IonChip color={getAvailabilityColor(stay.availability)}>
            <IonLabel>Availability: {stay.availability}</IonLabel>
          </IonChip>
          
          <IonChip color={stay.pricingType === 'free' ? 'success' : 'primary'}>
            <IonIcon icon={stay.pricingType === 'free' ? walletOutline : cash} />
            <IonLabel>{stay.pricingType === 'free' ? 'FREE' : 'PAID'}</IonLabel>
          </IonChip>
        </div>
      </IonCardHeader>
      
      <IonCardContent>
        {/* Pricing Section */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={stay.pricingType === 'free' ? walletOutline : cash} 
                       style={{marginRight: '8px'}} />
              {stay.pricingType === 'free' ? 'Free Accommodation' : 'Pricing'}
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {stay.pricingType === 'free' ? (
              <IonText>
                <p>{stay.priceDetails.info}</p>
                <p><strong>Note:</strong> {stay.priceDetails.requirement}</p>
              </IonText>
            ) : (
              <IonGrid>
                <IonRow>
                  <IonCol size="6">Per Room:</IonCol>
                  <IonCol size="6"><strong>{stay.priceDetails.perRoom}</strong></IonCol>
                </IonRow>
                <IonRow>
                  <IonCol size="6">Per Person:</IonCol>
                  <IonCol size="6"><strong>{stay.priceDetails.perPerson}</strong></IonCol>
                </IonRow>
              </IonGrid>
            )}
          </IonCardContent>
        </IonCard>
        
        {/* Amenities Section */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={informationCircleOutline} style={{marginRight: '8px'}} />
              Amenities
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="amenities-container" style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
              {stay.amenities.map((amenity, index) => (
                <IonChip key={index} outline>
                  <IonIcon icon={getAmenityIcon(amenity)} />
                  <IonLabel>{amenity}</IonLabel>
                </IonChip>
              ))}
            </div>
          </IonCardContent>
        </IonCard>
        
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
              <p><strong>{stay.contactInfo.name}</strong></p>
              {stay.contactInfo.email && <p>Email: {stay.contactInfo.email}</p>}
            </IonText>
            
            <IonButton 
              expand="block" 
              color="success" 
              onClick={() => makePhoneCall(stay.contactInfo.phone)}
              className="ion-margin-top"
            >
              <IonIcon slot="start" icon={call} />
              Call {stay.contactInfo.phone}
            </IonButton>
            
            <IonButton 
              expand="block" 
              color="primary"
              onClick={() => navigateToLocation(stay.lat, stay.lng)}
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
};

export default StayDetailView;