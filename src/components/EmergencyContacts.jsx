// components/EmergencyContacts.jsx
import React from 'react';
import { IonList, IonItem, IonLabel, IonIcon } from '@ionic/react';
import { call } from 'ionicons/icons';

const EmergencyContacts = ({ contacts }) => {
  const callNumber = (number) => {
    window.open(`tel:${number}`);
  };
  
  return (
    <IonList>
      {contacts.map(contact => (
        <IonItem key={contact.id}>
          <IonLabel>{contact.name}</IonLabel>
          <IonIcon 
            icon={call} 
            slot="end" 
            onClick={() => callNumber(contact.number)}
          />
        </IonItem>
      ))}
    </IonList>
  );
};

export default EmergencyContacts; // Add this line