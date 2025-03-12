// components/DetailedLocationView.jsx
import React, { useState } from 'react';
import { 
  IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle,
  IonList, IonItem, IonLabel, IonBadge, IonIcon, IonButton,
  IonAccordion, IonAccordionGroup, IonChip, IonText, IonGrid, IonRow, IonCol,
  IonImg, IonAlert, IonRippleEffect, IonToggle, IonNote
} from '@ionic/react';
import { 
  call, navigateCircle, people, restaurant, water, car, bed,
  cash, walletOutline, informationCircleOutline, wifi, time, 
  locationOutline, starOutline, timeOutline, calendarOutline, 
  medkit, alertCircleOutline, shareOutline
} from 'ionicons/icons';
import { navigateToLocation, makePhoneCall } from '../services/NavigationService';
import './DetailedLocationView.css'; // You'll need to create this CSS file

const DetailedLocationView = ({ location }) => {
  const [expanded, setExpanded] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
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
      'Parking': car,
      'Room Service': 'restaurant-outline',
      'Security': 'shield-checkmark-outline',
      'Basic Bedding': bed,
      'Common Bathrooms': 'water-outline',
      'Hot Water': 'thermometer-outline',
      '24x7 Reception': timeOutline,
      'Swimming Pool': 'water-outline',
      'Gym': 'barbell-outline',
      'Spa': 'flower-outline'
    };
    
    return amenityIcons[amenity] || 'checkmark-circle-outline';
  };

  // Function to share location
  const shareLocation = () => {
    if (navigator.share) {
      navigator.share({
        title: location.name,
        text: `Check out ${location.name} at the event!`,
        url: `https://maps.google.com/?q=${location.lat},${location.lng}`
      })
      .catch(error => {
        setAlertMessage('Could not share location. Please try again.');
        setShowAlert(true);
      });
    } else {
      setAlertMessage('Sharing is not available on this device/browser.');
      setShowAlert(true);
    }
  };

  // If it's a stay location, render the stay details view
  if (location.type === 'stay') {
    return (
      <div className="detailed-view-container">
        <IonCard className="stay-detail-card">
          <IonCardHeader className="stay-detail-header">
            <IonCardTitle className="location-title">{location.name}</IonCardTitle>
            <IonCardSubtitle>
              <IonIcon icon={locationOutline} color="primary" size="small" />&nbsp;
              {location.distance}
            </IonCardSubtitle>
            
            <div className="status-chips-container">
              <IonChip 
                color={getAvailabilityColor(location.availability)}
                className="status-chip"
              >
                <IonIcon icon={bed} />
                <IonLabel>Availability: {location.availability}</IonLabel>
              </IonChip>
              
              <IonChip 
                color={location.pricingType === 'free' ? 'success' : 'primary'}
                className="status-chip"
              >
                <IonIcon icon={location.pricingType === 'free' ? walletOutline : cash} />
                <IonLabel>{location.pricingType === 'free' ? 'FREE' : 'PAID'}</IonLabel>
              </IonChip>
            </div>

            {/* Quick action buttons */}
            <div className="quick-actions">
              <IonButton 
                expand="block" 
                color="primary"
                onClick={() => navigateToLocation(location.lat, location.lng)}
              >
                <IonIcon slot="start" icon={navigateCircle} />
                Navigate to Location
              </IonButton>
            </div>
          </IonCardHeader>
          
          <IonCardContent>
            {/* Pricing Section */}
            <IonCard className="detail-section-card">
              <IonCardHeader className="section-header">
                <IonCardTitle className="section-title">
                  <IonIcon 
                    icon={location.pricingType === 'free' ? walletOutline : cash} 
                    color={location.pricingType === 'free' ? 'success' : 'primary'}
                  />
                  <span>{location.pricingType === 'free' ? 'Free Accommodation' : 'Pricing'}</span>
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent className="section-content">
                {location.pricingType === 'free' ? (
                  <IonText className="free-stay-info">
                    <p>{location.priceDetails?.info || 'Free lodging available for event attendees.'}</p>
                    {location.priceDetails?.requirement && (
                      <p className="requirement-note">
                        <strong>Note:</strong> {location.priceDetails.requirement}
                      </p>
                    )}
                  </IonText>
                ) : (
                  <IonGrid className="pricing-grid">
                    <IonRow className="pricing-row header">
                      <IonCol size="6" className="pricing-label">Rate Type</IonCol>
                      <IonCol size="6" className="pricing-value">Price</IonCol>
                    </IonRow>
                    <IonRow className="pricing-row">
                      <IonCol size="6" className="pricing-label">Per Room:</IonCol>
                      <IonCol size="6" className="pricing-value">
                        <strong>{location.priceDetails?.perRoom || 'N/A'}</strong>
                      </IonCol>
                    </IonRow>
                    <IonRow className="pricing-row">
                      <IonCol size="6" className="pricing-label">Per Person:</IonCol>
                      <IonCol size="6" className="pricing-value">
                        <strong>{location.priceDetails?.perPerson || 'N/A'}</strong>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                )}
              </IonCardContent>
            </IonCard>
            
            {/* Amenities Section */}
            {location.amenities && location.amenities.length > 0 && (
              <IonCard className="detail-section-card">
                <IonCardHeader className="section-header">
                  <IonCardTitle className="section-title">
                    <IonIcon icon={informationCircleOutline} color="tertiary" />
                    <span>Amenities</span>
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent className="section-content">
                  <div className="amenities-container">
                    {location.amenities.map((amenity, index) => (
                      <IonChip key={index} outline color="tertiary" className="amenity-chip">
                        <IonIcon icon={getAmenityIcon(amenity)} />
                        <IonLabel>{amenity}</IonLabel>
                      </IonChip>
                    ))}
                  </div>
                </IonCardContent>
              </IonCard>
            )}
            
            {/* Hours of Operation (if available) */}
            {location.hours && (
              <IonCard className="detail-section-card">
                <IonCardHeader className="section-header">
                  <IonCardTitle className="section-title">
                    <IonIcon icon={timeOutline} color="warning" />
                    <span>Hours</span>
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent className="section-content">
                  <IonList lines="none">
                    <IonItem>
                      <IonLabel>Check-in Time:</IonLabel>
                      <IonNote slot="end" className="time-note">{location.hours.checkIn || '12:00 PM'}</IonNote>
                    </IonItem>
                    <IonItem>
                      <IonLabel>Check-out Time:</IonLabel>
                      <IonNote slot="end" className="time-note">{location.hours.checkOut || '11:00 AM'}</IonNote>
                    </IonItem>
                    {location.hours.reception && (
                      <IonItem>
                        <IonLabel>Reception Hours:</IonLabel>
                        <IonNote slot="end" className="time-note">{location.hours.reception}</IonNote>
                      </IonItem>
                    )}
                  </IonList>
                </IonCardContent>
              </IonCard>
            )}
            
            {/* Contact Information */}
            <IonCard className="detail-section-card">
              <IonCardHeader className="section-header">
                <IonCardTitle className="section-title">
                  <IonIcon icon={call} color="success" />
                  <span>Contact Information</span>
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent className="section-content">
                <IonText className="contact-info">
                  <p><strong>{location.contactInfo?.name || 'Reception'}</strong></p>
                  {location.contactInfo?.email && <p>Email: {location.contactInfo.email}</p>}
                </IonText>
                
                <IonButton 
                  expand="block" 
                  color="success" 
                  onClick={() => makePhoneCall(location.contactInfo?.phone)}
                  className="contact-button"
                >
                  <IonIcon slot="start" icon={call} />
                  Call {location.contactInfo?.phone}
                </IonButton>
                
                <div className="action-buttons-container">
                  <IonButton 
                    expand="block" 
                    fill="outline"
                    color="tertiary"
                    onClick={shareLocation}
                    className="action-button"
                  >
                    <IonIcon slot="start" icon={shareOutline} />
                    Share Location
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCardContent>
        </IonCard>
        
        {/* Alert for sharing */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Notice"
          message={alertMessage}
          buttons={['OK']}
        />
      </div>
    );
  }

  // For other location types (food, water, parking)
  
  // Food Menu Section
  const renderFoodMenu = () => {
    if (!location.menu) return null;
    
    return (
      <IonAccordion value="menu" className="location-accordion">
        <IonItem slot="header" className="accordion-header">
          <IonIcon icon={restaurant} slot="start" color="danger" />
          <IonLabel>Food Menu</IonLabel>
          <IonNote slot="end" className="availability-note">
            {location.menu.filter(item => item.available).length} of {location.menu.length} available
          </IonNote>
        </IonItem>
        <div slot="content" className="accordion-content">
          <div className="accordion-subtitle">
            <IonText color="medium" className="free-distribution-note">
              <p><strong>All items are freely distributed</strong></p>
            </IonText>
          </div>
          <IonList className="item-list">
            {location.menu.map((item, index) => (
              <IonItem key={index} className="menu-item" lines="full">
                <IonLabel>{item.name}</IonLabel>
                <IonBadge 
                  color={item.available ? 'success' : 'danger'} 
                  slot="end"
                  className="availability-badge"
                >
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
      <IonAccordion value="waterTypes" className="location-accordion">
        <IonItem slot="header" className="accordion-header">
          <IonIcon icon={water} slot="start" color="primary" />
          <IonLabel>Water Types</IonLabel>
          <IonNote slot="end" className="availability-note">
            {location.waterTypes.filter(item => item.available).length} of {location.waterTypes.length} available
          </IonNote>
        </IonItem>
        <div slot="content" className="accordion-content">
          <div className="accordion-subtitle">
            <IonText color="medium" className="free-distribution-note">
              <p><strong>Free distribution for all attendees</strong></p>
            </IonText>
          </div>
          <IonList className="item-list">
            {location.waterTypes.map((item, index) => (
              <IonItem key={index} className="water-item" lines="full">
                <IonLabel>{item.type}</IonLabel>
                <IonBadge 
                  color={item.available ? 'success' : 'danger'} 
                  slot="end"
                  className="availability-badge"
                >
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
      <IonAccordion value="parkingDetails" className="location-accordion">
        <IonItem slot="header" className="accordion-header">
          <IonIcon icon={car} slot="start" color="success" />
          <IonLabel>Parking Details</IonLabel>
        </IonItem>
        <div slot="content" className="accordion-content parking-details">
          <IonGrid className="parking-grid">
            <IonRow>
              <IonCol size="6" className="detail-label">Capacity:</IonCol>
              <IonCol size="6" className="detail-value">{location.capacity}</IonCol>
            </IonRow>
            
            {location.restrictions && (
              <IonRow>
                <IonCol size="6" className="detail-label">Restrictions:</IonCol>
                <IonCol size="6" className="detail-value">{location.restrictions}</IonCol>
              </IonRow>
            )}
            
            {location.fees && (
              <IonRow>
                <IonCol size="6" className="detail-label">Fees:</IonCol>
                <IonCol size="6" className="detail-value">{location.fees}</IonCol>
              </IonRow>
            )}
            
            {location.hours && (
              <IonRow>
                <IonCol size="6" className="detail-label">Hours:</IonCol>
                <IonCol size="6" className="detail-value">{location.hours}</IonCol>
              </IonRow>
            )}
            
            {location.securityPresent !== undefined && (
              <IonRow>
                <IonCol size="6" className="detail-label">Security:</IonCol>
                <IonCol size="6" className="detail-value">
                  {location.securityPresent ? 'Available' : 'Not Available'}
                </IonCol>
              </IonRow>
            )}
          </IonGrid>
        </div>
      </IonAccordion>
    );
  };
  
  // Operating Hours Section
  const renderOperatingHours = () => {
    if (!location.operatingHours) return null;
    
    return (
      <IonAccordion value="operatingHours" className="location-accordion">
        <IonItem slot="header" className="accordion-header">
          <IonIcon icon={timeOutline} slot="start" color="warning" />
          <IonLabel>Operating Hours</IonLabel>
        </IonItem>
        <div slot="content" className="accordion-content">
          <IonList className="hours-list">
            {Object.entries(location.operatingHours).map(([day, hours]) => (
              <IonItem key={day} lines="full" className="hours-item">
                <IonLabel>{day}</IonLabel>
                <IonNote slot="end" className="hours-note">{hours}</IonNote>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonAccordion>
    );
  };
  
  // Volunteers Section
  const renderVolunteers = () => {
    if (!location.volunteers || location.volunteers.length === 0) return null;
    
    return (
      <IonAccordion value="volunteers" className="location-accordion">
        <IonItem slot="header" className="accordion-header">
          <IonIcon icon={people} slot="start" color="tertiary" />
          <IonLabel>Volunteers</IonLabel>
          <IonNote slot="end" className="volunteer-count">{location.volunteers.length} available</IonNote>
        </IonItem>
        <div slot="content" className="accordion-content">
          {location.volunteers.map((volunteer, index) => (
            <IonCard key={index} className="volunteer-card">
              <IonCardHeader className="volunteer-header">
                <IonCardTitle className="volunteer-name">{volunteer.name}</IonCardTitle>
                <IonCardSubtitle className="volunteer-role">{volunteer.role}</IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent className="volunteer-content">
                <IonButton 
                  expand="block" 
                  color="success" 
                  onClick={() => makePhoneCall(volunteer.phone)}
                  className="volunteer-call-button"
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
  
  // First Aid/Medical Section
  const renderMedicalInfo = () => {
    if (!location.medicalServices) return null;
    
    return (
      <IonAccordion value="medicalServices" className="location-accordion">
        <IonItem slot="header" className="accordion-header">
          <IonIcon icon={medkit} slot="start" color="danger" />
          <IonLabel>Medical Services</IonLabel>
        </IonItem>
        <div slot="content" className="accordion-content">
          <IonText className="medical-info">
            <p>{location.medicalServices.description}</p>
            {location.medicalServices.availableServices && (
              <ul className="medical-services-list">
                {location.medicalServices.availableServices.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            )}
          </IonText>
          
          {location.medicalServices.emergencyContact && (
            <IonButton 
              expand="block" 
              color="danger" 
              onClick={() => makePhoneCall(location.medicalServices.emergencyContact)}
              className="emergency-call-button"
            >
              <IonIcon slot="start" icon={call}></IonIcon>
              Emergency: {location.medicalServices.emergencyContact}
            </IonButton>
          )}
        </div>
      </IonAccordion>
    );
  };
  
  // Main render for non-stay locations
  return (
    <div className="detailed-view-container">
      <IonCard className="location-detail-card">
        <IonCardHeader className="location-header">
          <IonCardTitle className="location-title">{location.name}</IonCardTitle>
          <div className="location-subtitle">
            <IonIcon icon={locationOutline} color="primary" />
            <IonText color="medium">{location.address || 'Event Venue'}</IonText>
          </div>
          
          {location.availability && (
            <div className="availability-container">
              <IonChip 
                color={getAvailabilityColor(location.availability)}
                className="availability-chip"
              >
                <IonIcon icon={
                  location.type === 'food' ? restaurant :
                  location.type === 'water' ? water :
                  location.type === 'parking' ? car : informationCircleOutline
                } />
                <IonLabel>Availability: {location.availability}</IonLabel>
              </IonChip>
            </div>
          )}
          
          {/* Quick action buttons */}
          <div className="action-buttons">
            <IonButton 
              expand="block" 
              color="primary"
              onClick={() => navigateToLocation(location.lat, location.lng)}
              className="navigate-button"
            >
              <IonIcon slot="start" icon={navigateCircle} />
              Navigate to Location
            </IonButton>
            
            {location.volunteers && location.volunteers[0] && (
              <IonButton 
                expand="block" 
                color="success" 
                onClick={() => makePhoneCall(location.volunteers[0].phone)}
                className="call-button"
              >
                <IonIcon slot="start" icon={call} />
                Call {location.volunteers[0].name}
              </IonButton>
            )}
          </div>
        </IonCardHeader>
        
        <IonCardContent className="location-content">
          <IonAccordionGroup value={expanded} onIonChange={e => setExpanded(e.detail.value)}>
            {location.type === 'food' && renderFoodMenu()}
            {location.type === 'water' && renderWaterTypes()}
            {renderParkingDetails()}
            {renderOperatingHours()}
            {renderVolunteers()}
            {renderMedicalInfo()}
          </IonAccordionGroup>
          
          <div className="share-container">
            <IonButton 
              expand="block" 
              fill="outline"
              color="tertiary"
              onClick={shareLocation}
              className="share-button"
            >
              <IonIcon slot="start" icon={shareOutline} />
              Share Location
            </IonButton>
          </div>
        </IonCardContent>
      </IonCard>
      
      {/* Alert for sharing */}
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header="Notice"
        message={alertMessage}
        buttons={['OK']}
      />
    </div>
  );
};

export default DetailedLocationView;