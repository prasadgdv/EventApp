// pages/HowToReach.jsx
import React from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardContent, 
  IonCardTitle, IonCardSubtitle, IonIcon, IonItem, IonButton
} from '@ionic/react';
import { 
  car, bus, train, airplane, boat, navigate, 
  callOutline, informationCircleOutline
} from 'ionicons/icons';
import { navigateToLocation } from '../services/NavigationService';

const HowToReach = () => {
  const eventLocation = { lat: 18.125, lng: 83.460 };
  
  const transportOptions = [
    {
      id: 1,
      title: 'By Car',
      icon: car,
      description: 'Take National Highway 16 (NH16) to reach the venue. Parking available at the event site.',
      contactInfo: '+91 9876543210 (Traffic Help)',
      additionalInfo: 'Expect heavy traffic between 9-11 AM. Plan accordingly.',
      action: 'Drive Now'
    },
    {
      id: 2,
      title: 'By Bus',
      icon: bus,
      description: 'City buses 101, 203, and 305 stop at the venue entrance. The Bus Stand is 5km away.',
      contactInfo: '+91 9876543211 (Bus Information)',
      additionalInfo: 'Buses run every 30 minutes from the main bus terminal.',
      action: 'View Bus Routes'
    },
    {
      id: 3,
      title: 'By Train',
      icon: train,
      description: 'The nearest railway station is 7km away. Taxis and auto-rickshaws are available outside.',
      contactInfo: '+91 9876543212 (Railway Information)',
      additionalInfo: 'Special shuttle service available on event days.',
      action: 'View Train Schedule'
    },
    {
      id: 4,
      title: 'By Air',
      icon: airplane,
      description: 'The airport is 15km from the venue. Pre-paid taxis are available at the terminal.',
      contactInfo: '+91 9876543213 (Airport Taxi)',
      additionalInfo: 'Taxi fare is approximately ₹500.',
      action: 'Book Airport Taxi'
    }
  ];
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>How to Reach</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Event Location</IonCardTitle>
            <IonCardSubtitle>Vizag Exhibition Grounds, Andhra Pradesh</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <p>The event is located at the Exhibition Grounds, easily accessible from all parts of the city.</p>
            <IonButton 
              expand="block" 
              onClick={() => navigateToLocation(eventLocation.lat, eventLocation.lng)}
            >
              <IonIcon slot="start" icon={navigate}></IonIcon>
              Navigate to Event
            </IonButton>
          </IonCardContent>
        </IonCard>

        {transportOptions.map(option => (
          <IonCard key={option.id}>
            <IonCardHeader>
              <IonIcon 
                icon={option.icon} 
                style={{ fontSize: '2rem', marginBottom: '10px' }}
              />
              <IonCardTitle>{option.title}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>{option.description}</p>
              
              <IonItem lines="none">
                <IonIcon icon={callOutline} slot="start"></IonIcon>
                <IonLabel>{option.contactInfo}</IonLabel>
              </IonItem>
              
              <IonItem lines="none">
                <IonIcon icon={informationCircleOutline} slot="start"></IonIcon>
                <IonLabel>{option.additionalInfo}</IonLabel>
              </IonItem>
              
              <IonButton expand="block">
                {option.action}
              </IonButton>
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default HowToReach;