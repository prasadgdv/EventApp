// services/NavigationService.jsx
import { Capacitor } from '@capacitor/core';

// Function to navigate to a location using Google Maps
export function navigateToLocation(lat, lng) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  
  if (Capacitor.isNativePlatform()) {
    // For native apps
    window.open(url, '_system');
  } else {
    // For browser
    window.open(url, '_blank');
  }
  
  // Track the navigation event
  trackNavigationEvent(lat, lng);
}

// Function for analytics tracking
export function trackNavigationEvent(lat, lng) {
  console.log(`Navigation tracked to: ${lat},${lng}`);
  // In a real app, you would send this to your analytics service
  // Example: gtag('event', 'navigation', { destination: `${lat},${lng}` });
}

// Function to make a phone call
export function makePhoneCall(phoneNumber) {
  const tel = `tel:${phoneNumber}`;
  
  if (Capacitor.isNativePlatform()) {
    window.open(tel, '_system');
  } else {
    window.open(tel);
  }
  
  // Track the call event
  console.log(`Call initiated to: ${phoneNumber}`);
  // In a real app: gtag('event', 'phone_call', { number: phoneNumber });
}