// services/NavigationService.jsx
import { Capacitor } from '@capacitor/core';

// Function to navigate to a location using Google Maps
export function navigateToLocation(lat, lng) {
  // Ensure proper handling of floating point values
  const latitude = parseFloat(lat).toFixed(6);
  const longitude = parseFloat(lng).toFixed(6);
  
  const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
  
  try {
    if (Capacitor.isNativePlatform()) {
      // For native apps
      window.open(url, '_system');
    } else {
      // For browser
      window.open(url, '_blank');
    }
    
    // Track the navigation event
    trackNavigationEvent(latitude, longitude);
    return true;
  } catch (error) {
    console.error("Navigation error:", error);
    return false;
  }
}

// Function for analytics tracking
export function trackNavigationEvent(lat, lng) {
  console.log(`Navigation tracked to: ${lat},${lng}`);
  // In a real app, you would send this to your analytics service
  // Example: gtag('event', 'navigation', { destination: `${lat},${lng}` });
}

// Function to make a phone call
export function makePhoneCall(phoneNumber) {
  if (!phoneNumber) {
    console.error("No phone number provided");
    return false;
  }
  
  // Clean the phone number (remove spaces, dashes, etc.)
  const cleanedNumber = phoneNumber.toString().replace(/\s+/g, '').replace(/-/g, '');
  const tel = `tel:${cleanedNumber}`;
  
  try {
    if (Capacitor.isNativePlatform()) {
      window.open(tel, '_system');
    } else {
      window.open(tel);
    }
    
    // Track the call event
    console.log(`Call initiated to: ${cleanedNumber}`);
    // In a real app: gtag('event', 'phone_call', { number: phoneNumber });
    return true;
  } catch (error) {
    console.error("Phone call error:", error);
    return false;
  }
}