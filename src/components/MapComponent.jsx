// components/MapComponent.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { navigateToLocation, makePhoneCall } from "../services/NavigationService";
import { IonButton, IonIcon, IonBadge, IonLabel } from '@ionic/react';
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

const stayIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = ({ points = [], selectedPoint, onMarkerClick = () => {}, category = 'food' }) => {
  const defaultPosition = [18.125, 83.460]; // Default to Vizag coordinates
  
  // Get appropriate icon based on location type
  const getMarkerIcon = (type) => {
    switch(type) {
      case 'food': return foodIcon;
      case 'water': return waterIcon;
      case 'parking': return parkingIcon;
      case 'stay': return stayIcon;
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
  
  // Get contact phone based on location type
  const getContactInfo = (point) => {
    if (point.volunteers && point.volunteers[0]) {
      return {
        phone: point.volunteers[0].phone,
        name: point.volunteers[0].name
      };
    }
    if (point.contactInfo) {
      return {
        phone: point.contactInfo.phone,
        name: point.contactInfo.name
      };
    }
    return null;
  };

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <MapContainer 
        center={selectedPoint ? [selectedPoint.lat, selectedPoint.lng] : defaultPosition} 
        zoom={13} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        
        {points && points.map(point => (
          <Marker 
            key={point.id || Math.random()} 
            position={[point.lat, point.lng]}
            icon={getMarkerIcon(point.type || category)}
            eventHandlers={{
              click: () => onMarkerClick(point)
            }}
          >
            <Popup>
              <div style={{ textAlign: 'center', minWidth: '200px' }}>
                <h3 style={{ margin: '5px 0' }}>{point.name}</h3>
                
                {/* Show stay-specific details */}
                {point.type === 'stay' && (
                  <>
                    {point.distance && <p>{point.distance}</p>}
                    <div style={{ margin: '10px 0' }}>
                      <IonBadge color={point.pricingType === 'free' ? 'success' : 'primary'}>
                        {point.pricingType === 'free' ? 'FREE' : point.priceDetails?.perRoom}
                      </IonBadge>
                      
                      {point.availability && (
                        <IonBadge 
                          color={getAvailabilityColor(point.availability)} 
                          style={{marginLeft: '5px'}}
                        >
                          {point.availability} Availability
                        </IonBadge>
                      )}
                    </div>
                  </>
                )}
                
                {/* Show food specifics */}
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
                
                {/* Show water specifics */}
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
                
                {/* Show parking details */}
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
                      color="success" 
                      size="small"
                      onClick={() => makePhoneCall(getContactInfo(point).phone)}
                    >
                      <IonIcon slot="start" icon={call}></IonIcon>
                      Call {getContactInfo(point).name}
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