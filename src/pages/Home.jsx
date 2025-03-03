// pages/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonSplitPane, IonMenu, IonButtons, IonMenuButton,
  IonSegment, IonSegmentButton, IonLabel, IonModal,
  IonButton, IonIcon, IonFooter
} from '@ionic/react';
import MapComponent from '../components/MapComponent';
import LocationList from '../components/LocationList';
import DetailedLocationView from '../components/DetailedLocationView';
import { downloadAndStoreTiles } from '../services/MapTileService';
import { fetchLocations } from '../services/DataService';
import { close } from 'ionicons/icons';

const Home = () => {
  // State for different location types
  const [foodCounters, setFoodCounters] = useState([]);
  const [waterStations, setWaterStations] = useState([]);
  const [parkingLocations, setParkingLocations] = useState([]);
  const [stayLocations, setStayLocations] = useState([]);
  
  // UI state
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [activeCategory, setActiveCategory] = useState('food');
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Modal reference
  const modalRef = useRef(null);
  
  useEffect(() => {
    // Load data from service
    const loadData = async () => {
      try {
        const foodData = await fetchLocations('foodCounters');
        setFoodCounters(foodData);
        
        const waterData = await fetchLocations('waterStations');
        setWaterStations(waterData);
        
        const parkingData = await fetchLocations('parkingLocations');
        setParkingLocations(parkingData);
        
        const stayData = await fetchLocations('stayLocations');
        setStayLocations(stayData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    
    loadData();
    
    // Download map tiles for offline use
    try {
      downloadAndStoreTiles(18.125, 83.460, 20);
    } catch (error) {
      console.error("Error downloading tiles:", error);
    }
  }, []);
  
  const handleItemClick = (item) => {
    setSelectedPoint(item);
    setShowDetailModal(true);
  };
  
  // Get active points based on selected category
  const getActivePoints = () => {
    switch(activeCategory) {
      case 'food': return foodCounters;
      case 'water': return waterStations;
      case 'parking': return parkingLocations;
      case 'stay': return stayLocations;
      default: return foodCounters;
    }
  };
  
  // Get title based on active category
  const getCategoryTitle = () => {
    switch(activeCategory) {
      case 'food': return 'Free Food Distribution';
      case 'water': return 'Free Water Stations';
      case 'parking': return 'Parking Areas';
      case 'stay': return 'Accommodations';
      default: return 'Locations';
    }
  };
  
  return (
    <IonPage>
      <IonSplitPane contentId="main">
        <IonMenu contentId="main">
          <IonHeader>
            <IonToolbar>
              <IonTitle>Event Guide</IonTitle>
            </IonToolbar>
          </IonHeader>
          
          <IonContent>
            <IonSegment value={activeCategory} onIonChange={e => setActiveCategory(e.detail.value)}>
              <IonSegmentButton value="food">
                <IonLabel>Food</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="water">
                <IonLabel>Water</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="parking">
                <IonLabel>Parking</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="stay">
                <IonLabel>Stays</IonLabel>
              </IonSegmentButton>
            </IonSegment>
            
            <LocationList 
              locations={getActivePoints()}
              onItemClick={handleItemClick}
              category={activeCategory}
            />
          </IonContent>
        </IonMenu>
        
        <IonPage id="main">
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonMenuButton />
              </IonButtons>
              <IonTitle>{getCategoryTitle()}</IonTitle>
            </IonToolbar>
          </IonHeader>
          
          <IonContent>
            <MapComponent 
              points={getActivePoints()}
              selectedPoint={selectedPoint}
              onMarkerClick={handleItemClick}
              category={activeCategory}
            />
          </IonContent>
        </IonPage>
      </IonSplitPane>
      
      {/* Location Detail Modal */}
      <IonModal 
        ref={modalRef}
        isOpen={showDetailModal} 
        onDidDismiss={() => setShowDetailModal(false)}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>{selectedPoint?.name || 'Location Details'}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowDetailModal(false)}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {selectedPoint && (
            <DetailedLocationView location={selectedPoint} />
          )}
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default Home;