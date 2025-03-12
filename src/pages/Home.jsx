// pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { 
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
  IonSplitPane, IonMenu, IonButtons, IonMenuButton,
  IonSegment, IonSegmentButton, IonLabel, IonModal,
  IonButton, IonIcon, IonFooter, IonToast, IonLoading
} from '@ionic/react';
import MapComponent from '../components/MapComponent';
import LocationList from '../components/LocationList';
import DetailedLocationView from '../components/DetailedLocationView';
import { downloadAndStoreTiles, getTileCacheStats } from '../services/MapTileService';
import { fetchLocations } from '../services/DataService';
import { close, download, refresh, informationCircle } from 'ionicons/icons';

const Home = () => {
  // Chitrada Village coordinates
  const chitradaCoordinates = { lat: 17.117, lng: 82.253 };
  
  // State for different location types
  const [foodCounters, setFoodCounters] = useState([]);
  const [waterStations, setWaterStations] = useState([]);
  const [parkingLocations, setParkingLocations] = useState([]);
  const [medicalLocations, setMedicalLocations] = useState([]);
  
  // UI state
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [activeCategory, setActiveCategory] = useState('food');
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Status state
  const [isDownloading, setIsDownloading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('success');
  const [showChitradaInfo, setShowChitradaInfo] = useState(false);
  
  // Update the mock data for Chitrada village region
  useEffect(() => {
    // Adjust the locations to be near Chitrada Village
    const updateWithChitradaLocations = (data) => {
      return data.map(item => ({
        ...item,
        lat: chitradaCoordinates.lat + (Math.random() - 0.5) * 0.02,
        lng: chitradaCoordinates.lng + (Math.random() - 0.5) * 0.02
      }));
    };
    
    // Load data from service
    const loadData = async () => {
      try {
        const foodData = await fetchLocations('foodCounters');
        setFoodCounters(updateWithChitradaLocations(foodData));
        
        const waterData = await fetchLocations('waterStations');
        setWaterStations(updateWithChitradaLocations(waterData));
        
        const parkingData = await fetchLocations('parkingLocations');
        setParkingLocations(updateWithChitradaLocations(parkingData));
        
        const medicalData = await fetchLocations('medicalLocations');
        setMedicalLocations(updateWithChitradaLocations(medicalData));
      } catch (error) {
        console.error("Error loading data:", error);
        showToastMessage("Error loading location data. Please try again.", "danger");
      }
    };
    
    loadData();
    
    // Check for existing offline maps
    checkOfflineMaps();
    
    // Show Chitrada info toast
    setTimeout(() => {
      showToastMessage("Map focused on Chitrada Village, near Pithapuram", "primary");
    }, 1000);
  }, []);
  
  // Check if offline maps are already downloaded
  const checkOfflineMaps = async () => {
    try {
      const stats = await getTileCacheStats();
      if (stats.tileCount > 0) {
        showToastMessage(`Offline map ready: ${stats.tileCount} tiles cached`, "success");
      }
    } catch (error) {
      console.error("Error checking offline maps:", error);
    }
  };
  
  // Helper to show toast messages
  const showToastMessage = (message, color = "success") => {
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
  };
  
  // Handle offline map download for Chitrada area
  const handleDownloadMaps = async () => {
    setIsDownloading(true);
    try {
      const result = await downloadAndStoreTiles(chitradaCoordinates.lat, chitradaCoordinates.lng, 20);
      if (result) {
        showToastMessage("Offline maps successfully downloaded for Chitrada Village area", "success");
      } else {
        showToastMessage("Failed to download offline maps", "danger");
      }
    } catch (error) {
      console.error("Error downloading tiles:", error);
      showToastMessage("Error downloading offline maps: " + error.message, "danger");
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleItemClick = (item) => {
    setSelectedPoint(item);
    setShowDetailModal(true);
  };
  
  // Get active points based on selected category
  const getActivePoints = () => {
    switch(activeCategory) {
      case 'food': return foodCounters;
      case 'water': return waterStations;
      case 'medical': return medicalLocations;
      case 'parking': return parkingLocations;
      default: return foodCounters;
    }
  };
  
  // Get title based on active category
  const getCategoryTitle = () => {
    switch(activeCategory) {
      case 'food': return 'Free Food Distribution';
      case 'water': return 'Free Water Stations';
      case 'medical': return 'Medical Services';
      case 'parking': return 'Parking Areas';
      default: return 'Locations';
    }
  };
  
  return (
    <IonPage>
      <IonSplitPane contentId="main">
        <IonMenu contentId="main">
          <IonHeader>
            <IonToolbar>
              <IonTitle>Janasena Formation Day Event Guide</IonTitle>
            </IonToolbar>
          </IonHeader>
          
          <IonContent>
            {/* Village info card has been removed as requested */}
            
            <IonSegment value={activeCategory} onIonChange={e => setActiveCategory(e.detail.value)}>
              <IonSegmentButton value="food">
                <IonLabel>Food</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="water">
                <IonLabel>Water</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="medical">
                <IonLabel>Medical</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="parking">
                <IonLabel>Parking</IonLabel>
              </IonSegmentButton>
            </IonSegment>
            
            <LocationList 
              locations={getActivePoints()}
              onItemClick={handleItemClick}
              category={activeCategory}
            />
            
            {/* Download offline maps button */}
            <div className="ion-padding">
              <IonButton 
                expand="block"
                onClick={handleDownloadMaps}
                disabled={isDownloading}
              >
                <IonIcon slot="start" icon={download} />
                Download Offline Maps
              </IonButton>
              
              <IonButton 
                expand="block"
                onClick={() => window.location.reload()}
                fill="outline"
                className="ion-margin-top"
              >
                <IonIcon slot="start" icon={refresh} />
                Reload App
              </IonButton>
            </div>
          </IonContent>
        </IonMenu>
        
        <IonPage id="main">
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonMenuButton />
              </IonButtons>
              <IonTitle>Chitrada: {getCategoryTitle()}</IonTitle>
              {/* Info button */}
              <IonButtons slot="end">
                <IonButton onClick={() => setShowChitradaInfo(true)}>
                  <IonIcon icon={informationCircle} />
                </IonButton>
              </IonButtons>
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
          
          <IonFooter>
            <IonToolbar style={{fontSize: '12px', padding: '4px 12px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span>Chitrada Village, Pithapuram</span>
                <IonButton size="small" fill="clear" onClick={handleDownloadMaps}>
                  <IonIcon slot="icon-only" icon={download} size="small" />
                </IonButton>
              </div>
            </IonToolbar>
          </IonFooter>
        </IonPage>
      </IonSplitPane>
      
      {/* Location Detail Modal */}
      <IonModal 
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
      
      {/* Chitrada Info Modal - With Top Contributors */}
      <IonModal isOpen={showChitradaInfo} onDidDismiss={() => setShowChitradaInfo(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>About Chitrada Village</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowChitradaInfo(false)}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <h2>Chitrada Village</h2>
          <p>Located in Pithapuram Mandal, East Godavari District of Andhra Pradesh.</p>
          
          <h4>Location Details:</h4>
          <ul>
            <li>6 km from Pithapuram</li>
            <li>16 km North from Kakinada (District HQ)</li>
            <li>Pin code: 533450</li>
            <li>Area: 379 hectares (3.79 km²)</li>
          </ul>

          {/* Top Contributors section with styling similar to the image */}
          <div style={{
            background: '#fff8e1',
            borderRadius: '12px',
            padding: '16px',
            marginTop: '20px'
          }}>
            <h3 style={{
              margin: '0 0 16px 0',
              display: 'flex',
              alignItems: 'center',
              color: '#e65100'
            }}>
              <span style={{
                color: '#e65100',
                marginRight: '10px',
                fontSize: '24px'
              }}>🏆</span>
              Top Contributors
            </h3>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#FFD700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                <span>1</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Booth No. 14</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    height: '8px', 
                    backgroundColor: '#4CAF50', 
                    width: '93%',
                    borderRadius: '4px',
                    flex: 1
                  }}></div>
                  <div>93%</div>
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#C0C0C0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                <span>2</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Durgada Village</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    height: '8px', 
                    backgroundColor: '#2196F3', 
                    width: '78%',
                    borderRadius: '4px',
                    flex: 1
                  }}></div>
                  <div>78%</div>
                </div>
              </div>
            </div>
          </div>
          
          <IonButton 
            expand="block" 
            onClick={() => setShowChitradaInfo(false)}
            className="ion-margin-top"
          >
            Close
          </IonButton>
        </IonContent>
      </IonModal>
      
      {/* Toast for notifications */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={5000}
        color={toastColor}
        buttons={[
          {
            text: 'Close',
            role: 'cancel',
          }
        ]}
      />
      
      {/* Loading indicator for map download */}
      <IonLoading
        isOpen={isDownloading}
        message={'Downloading offline maps for Chitrada Village...'}
      />
    </IonPage>
  );
};

export default Home;