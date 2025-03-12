// pages/HowToReach.jsx
import React from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardContent, 
  IonCardTitle, IonCardSubtitle, IonIcon, IonItem, IonButton, IonLabel
} from '@ionic/react';
import { 
  car, bus, train, airplane, navigate, 
  callOutline, informationCircleOutline
} from 'ionicons/icons';
import { navigateToLocation, makePhoneCall } from '../services/NavigationService';

const HowToReach = () => {
  // Correct coordinates for Chitrada Village
  const chitradaLocation = { lat: 17.117, lng: 82.253 };
  
  const transportOptions = [
    {
      id: 1,
      title: 'By Car',
      icon: car,
      description: 'Take National Highway 16 (NH16) to Pithapuram, then local roads to Chitrada Village. Main parking available at the event site.',
      contactInfo: '+91 9876543210 (Traffic Help)',
      additionalInfo: 'Expect heavy traffic between 9-11 AM. Plan accordingly.',
      action: 'Drive Now',
      onActionClick: () => navigateToLocation(chitradaLocation.lat, chitradaLocation.lng)
    },
    {
      id: 2,
      title: 'By Bus',
      icon: bus,
      description: 'RTC buses from Kakinada to Pithapuram, then local auto to Chitrada Village. Mini buses also available on event day.',
      contactInfo: '+91 9876543211 (Bus Information)',
      additionalInfo: 'Buses run every 30 minutes from Kakinada bus terminal.',
      action: 'Call Bus Info',
      onActionClick: () => makePhoneCall('9876543211')
    },
    {
      id: 3,
      title: 'By Train',
      icon: train,
      description: 'Nearest railway station is Pithapuram, 6km away. Taxis and auto-rickshaws are available outside the station.',
      contactInfo: '+91 9876543212 (Station Info)',
      additionalInfo: 'Special shuttle service available on event days from Pithapuram station.',
      action: 'Call Station Info',
      onActionClick: () => makePhoneCall('9876543212')
    },
    {
      id: 4,
      title: 'By Air',
      icon: airplane,
      description: 'Nearest airport is Rajahmundry (RJA), approximately 75km away. Pre-paid taxis available to Chitrada.',
      contactInfo: '+91 9876543213 (Airport Taxi)',
      additionalInfo: 'Taxi fare is approximately ₹1500.',
      action: 'Book Airport Taxi',
      onActionClick: () => makePhoneCall('9876543213')
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
            <IonCardTitle>Chitrada Village</IonCardTitle>
            <IonCardSubtitle>Pithapuram Mandal, East Godavari</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <p>The event is located at Chitrada Village, easily accessible from major towns in East Godavari.</p>
            <IonButton 
              expand="block" 
              onClick={() => navigateToLocation(chitradaLocation.lat, chitradaLocation.lng)}
            >
              <IonIcon slot="start" icon={navigate}></IonIcon>
              Navigate to Chitrada
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
              
              <IonButton expand="block" onClick={option.onActionClick}>
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