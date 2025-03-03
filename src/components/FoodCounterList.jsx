// components/FoodCounterList.jsx
import React from 'react';
import { IonList, IonItem, IonLabel } from '@ionic/react';

const FoodCounterList = ({ foodCounters, onItemClick }) => {
  return (
    <IonList>
      {foodCounters.map(counter => (
        <IonItem 
          key={counter.id} 
          button 
          onClick={() => onItemClick(counter)}
        >
          <IonLabel>{counter.name}</IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
};

export default FoodCounterList; // Add this line