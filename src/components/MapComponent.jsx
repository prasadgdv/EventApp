// components/MapComponent.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { navigateToLocation, makePhoneCall } from "../services/NavigationService";
import { IonButton, IonIcon, IonBadge, IonSpinner } from '@ionic/react';
import { call, navigateCircle } from 'ionicons/icons';

// Fix icon issues
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// Create custom icons for different categories
const foodIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const waterIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const parkingIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const medicalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const ambulanceIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to recenter map
function MapRecenter({ selectedPoint }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedPoint) {
      map.setView([selectedPoint.lat, selectedPoint.lng], 14);
    }
  }, [selectedPoint, map]);
  
  return null;
}

// Helper component to set a marker for Chitrada Village
function ChitradaMarker() {
  const map = useMap();
  
  useEffect(() => {
    // Add a special marker for Chitrada Village
    const chitradaMarker = L.marker([17.117, 82.253], {
      icon: new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
        shadowUrl: iconShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41]
      })
    }).addTo(map);
    
    chitradaMarker.bindPopup("<b>Chitrada Village</b><br>Pithapuram Mandal, East Godavari").openPopup();
    
    return () => {
      map.removeLayer(chitradaMarker);
    };
  }, [map]);
  
  return null;
}

const MapComponent = ({ points = [], selectedPoint, onMarkerClick = () => {}, category = 'food' }) => {
  // Chitrada Village coordinates (near Pithapuram, East Godavari)
  const chitradaPosition = [17.117, 82.253];
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [mapLoadTimeout, setMapLoadTimeout] = useState(false);
  const [tileSource, setTileSource] = useState({
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "© OpenStreetMap contributors"
  });
  
  // Handle map load timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setMapLoadTimeout(true);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [isLoading]);
  
  // Adding check for Azure hosting - this will help detect if running on Azure
  useEffect(() => {
    const isAzureHosted = window.location.hostname.includes('azurewebsites.net');
    if (isAzureHosted) {
      console.log("Running on Azure App Service - using alternative tile source to avoid CORS issues");
      setTileSource({
        url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        attribution: "Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap"
      });
    }
    
    // Test storage access
    const testStorage = async () => {
      try {
        // Test if localStorage is available
        localStorage.setItem('map_test', 'test');
        localStorage.removeItem('map_test');
      } catch (storageError) {
        console.error("Storage access error:", storageError);
        setMapError("Storage access is restricted. Some features may not work properly.");
      }
    };
    
    testStorage();
  }, []);
  
  // Get appropriate icon based on location type and subtype
  const getMarkerIcon = (point) => {
    const type = point.type || category;
    
    switch(type) {
      case 'food': return foodIcon;
      case 'water': return waterIcon;
      case 'parking': return parkingIcon;
      case 'medical': 
        return point.subType === 'ambulance' ? ambulanceIcon : medicalIcon;
      default: return DefaultIcon;
    }
  };
  
  // Helper to get availability color
  const getAvailabilityColor = (availability) => {
    switch(availability) {
      case 'High': return 'success';
      case 'Medium': return 'warning';
      case 'Low': return 'danger';
      default: return 'medium';
    }
  };
  
  // Get contact info based on location type
  const getContactInfo = (point) => {
    if (point.contactInfo) {
      return {
        phone: point.contactInfo.phone,
        name: point.contactInfo.name
      };
    }
    
    if (point.doctors && point.doctors[0]) {
      return {
        phone: point.doctors[0].phone,
        name: point.doctors[0].name
      };
    }
    
    if (point.volunteers && point.volunteers[0]) {
      return {
        phone: point.volunteers[0].phone,
        name: point.volunteers[0].name
      };
    }
    
    return null;
  };
  
  // Handle tile error by switching to another provider with improved error handling
  const handleTileError = () => {
    console.log("Tile loading error detected, trying alternative tile source");
    
    // Try multiple tile sources in order of preference
    if (tileSource.url.includes('openstreetmap.org')) {
      console.log("Switching to OpenTopoMap tiles");
      setTileSource({
        url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        attribution: "Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap"
      });
    } else if (tileSource.url.includes('opentopomap.org')) {
      console.log("Switching to Stamen tiles");
      setTileSource({
        url: "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png",
        attribution: "Map tiles by Stamen Design, CC BY 3.0 — Map data © OpenStreetMap"
      });
    } else {
      // If all alternatives have been exhausted, show error
      setMapError("Unable to load map tiles from any source. Please check your internet connection.");
    }
  };
  
  // If there's an error loading the map, show error message with retry option
  if (mapError) {
    return (
      <div style={{ 
        height: "400px", 
        width: "100%", 
        display: "flex", 
        flexDirection: "column",
        justifyContent: "center", 
        alignItems: "center", 
        textAlign: "center",
        padding: "20px",
        background: "#f4f4f4"
      }}>
        <h3>Map Loading Error</h3>
        <p>{mapError}</p>
        <IonButton 
          onClick={() => {
            setMapError(null);
            setIsLoading(true);
            setTileSource({
              url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
              attribution: "© OpenStreetMap contributors"
            });
            window.location.reload();
          }}
        >
          Retry Loading Map
        </IonButton>
      </div>
    );
  }

  return (
    <div style={{ height: "400px", width: "100%", position: "relative" }}>
      {isLoading && (
        <div style={{ 
          position: "absolute", 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: "rgba(255,255,255,0.7)", 
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <IonSpinner name="circles" />
          <p style={{ marginTop: "10px" }}>Loading map...</p>
          {mapLoadTimeout && (
            <IonButton 
              onClick={() => {
                setTileSource({
                  url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
                  attribution: "Map data: © OpenStreetMap contributors, SRTM | Map style: © OpenTopoMap"
                });
              }}
              style={{ marginTop: "10px" }}
            >
              Try Alternative Map Source
            </IonButton>
          )}
        </div>
      )}
      
      <MapContainer 
        center={selectedPoint ? [selectedPoint.lat, selectedPoint.lng] : chitradaPosition} 
        zoom={14} 
        style={{ height: "100%", width: "100%" }}
        whenReady={() => setIsLoading(false)}
        whenCreated={(mapInstance) => {
          mapInstance.on('error', () => {
            setMapError("There was an error loading the map.");
          });
        }}
      >
        <TileLayer
          url={tileSource.url}
          attribution={tileSource.attribution}
          eventHandlers={{
            tileerror: handleTileError
          }}
        />
        
        {/* Add the Chitrada Village marker */}
        <ChitradaMarker />
        
        <MapRecenter selectedPoint={selectedPoint} />
        
        {points && points.map(point => (
          <Marker 
            key={point.id || Math.random()} 
            position={[point.lat, point.lng]}
            icon={getMarkerIcon(point)}
            eventHandlers={{
              click: () => onMarkerClick(point)
            }}
          >
            <Popup>
              <div style={{ textAlign: 'center', minWidth: '200px' }}>
                <h3 style={{ margin: '5px 0' }}>{point.name}</h3>
                
                {/* Medical specific content */}
                {point.type === 'medical' && (
                  <>
                    {/* Ambulance specific content */}
                    {point.subType === 'ambulance' && (
                      <>
                        <div style={{ margin: '10px 0' }}>
                          <IonBadge color="danger">AMBULANCE SERVICE</IonBadge>
                        </div>
                        
                        {point.response && (
                          <p>Response Time: <strong>{point.response}</strong></p>
                        )}
                        
                        {/* Removed operatingHours for ambulance as requested */}
                        
                        {point.availability && (
                          <div style={{ margin: '5px 0' }}>
                            <IonBadge color={getAvailabilityColor(point.availability)}>
                              {point.availability} Availability
                            </IonBadge>
                          </div>
                        )}
                      </>
                    )}
                    
                    {/* Medical Camp specific content */}
                    {point.subType === 'camp' && (
                      <>
                        <div style={{ margin: '10px 0' }}>
                          <IonBadge color="tertiary">MEDICAL CAMP</IonBadge>
                        </div>
                        
                        {/* Removed operatingHours and operatingDays for medical camps as requested */}
                        
                        {point.availability && (
                          <div style={{ margin: '5px 0' }}>
                            <IonBadge color={getAvailabilityColor(point.availability)}>
                              {point.availability} Availability
                            </IonBadge>
                          </div>
                        )}
                      </>
                    )}
                    
                    {/* First Aid specific content */}
                    {point.subType === 'firstaid' && (
                      <>
                        <div style={{ margin: '10px 0' }}>
                          <IonBadge color="warning">FIRST AID STATION</IonBadge>
                        </div>
                        
                        {/* Removed operatingHours for consistency */}
                        
                        {point.availability && (
                          <div style={{ margin: '5px 0' }}>
                            <IonBadge color={getAvailabilityColor(point.availability)}>
                              {point.availability} Availability
                            </IonBadge>
                          </div>
                        )}
                      </>
                    )}
                    
                    {/* Show service count */}
                    {point.services && (
                      <p>{point.services.filter(item => item.available).length} of {point.services.length} services available</p>
                    )}
                  </>
                )}
                
                {/* Food specifics */}
                {point.type === 'food' && (
                  <>
                    <div style={{ margin: '10px 0' }}>
                      <IonBadge color="success">FREE DISTRIBUTION</IonBadge>
                    </div>
                    
                    {point.availability && (
                      <div style={{ margin: '5px 0' }}>
                        <IonBadge color={getAvailabilityColor(point.availability)}>
                          {point.availability} Availability
                        </IonBadge>
                      </div>
                    )}
                    
                    {point.menu && (
                      <p>{point.menu.filter(item => item.available).length} of {point.menu.length} items available</p>
                    )}
                  </>
                )}
                
                {/* Water specifics */}
                {point.type === 'water' && (
                  <>
                    <div style={{ margin: '10px 0' }}>
                      <IonBadge color="success">FREE DISTRIBUTION</IonBadge>
                    </div>
                    
                    {point.availability && (
                      <div style={{ margin: '5px 0' }}>
                        <IonBadge color={getAvailabilityColor(point.availability)}>
                          {point.availability} Availability
                        </IonBadge>
                      </div>
                    )}
                    
                    {point.waterTypes && (
                      <p>{point.waterTypes.filter(item => item.available).length} of {point.waterTypes.length} types available</p>
                    )}
                  </>
                )}
                
                {/* Parking details */}
                {point.type === 'parking' && (
                  <>
                    {point.capacity && (
                      <div style={{ margin: '10px 0' }}>
                        <IonBadge color="primary">{point.capacity}</IonBadge>
                      </div>
                    )}
                  </>
                )}
                
                {/* Contact button if available */}
                {getContactInfo(point) && (
                  <div style={{ margin: '10px 0' }}>
                    <IonButton 
                      expand="block" 
                      color={point.type === 'medical' && point.subType === 'ambulance' ? 'danger' : 'success'} 
                      size="small"
                      onClick={() => makePhoneCall(getContactInfo(point).phone)}
                    >
                      <IonIcon slot="start" icon={call}></IonIcon>
                      {point.type === 'medical' && point.subType === 'ambulance' 
                        ? 'Call Ambulance' 
                        : `Call ${getContactInfo(point).name}`}
                    </IonButton>
                  </div>
                )}
                
                {/* Navigation button */}
                <IonButton 
                  expand="block" 
                  color="primary"
                  size="small"
                  onClick={() => navigateToLocation(point.lat, point.lng)}
                >
                  <IonIcon slot="start" icon={navigateCircle}></IonIcon>
                  Navigate
                </IonButton>
                
                {/* View details button */}
                <IonButton 
                  expand="block" 
                  fill="outline"
                  size="small"
                  onClick={() => onMarkerClick(point)}
                >
                  View Details
                </IonButton>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;