# Janasena Formation Day Event App

A comprehensive mobile-first web application built with Ionic React to help attendees navigate the Janasena Formation Day event at Chitrada Village, Pithapuram Mandal, East Godavari District.

## 🌟 Features

### 📍 Interactive Map
- Real-time location mapping centered on Chitrada Village
- Custom markers for different service categories
- Offline map support for areas with poor connectivity
- Click-to-navigate integration with Google Maps

### 🍽️ Food Distribution
- Free food counter locations with live availability
- Menu items and stock status
- Volunteer contact information
- Distribution schedules

### 💧 Water Stations
- Free water distribution points
- Different water types (drinking, cold water)
- Real-time availability status
- Station manager contacts

### 🚗 Parking Information
- Multiple parking areas with capacity details
- VIP and general parking locations
- Real-time space availability
- Navigation assistance

### 🏥 Medical Services
- Medical camps with specialist doctors
- First aid stations
- Emergency contact numbers
- Service availability and timings

### 📱 Mobile-First Design
- Responsive design optimized for mobile devices
- Offline functionality with cached maps
- Touch-friendly interface
- Fast loading and smooth navigation

## 🚀 Technology Stack

- **Frontend**: React 18 with Ionic Framework
- **Maps**: Leaflet with React-Leaflet
- **Offline Storage**: LocalForage for map tiles and data
- **Build Tool**: Vite
- **Styling**: Ionic CSS Components
- **Mobile**: Capacitor for native app capabilities

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/janasena-event-app.git
cd janasena-event-app

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── MapComponent.jsx        # Interactive map with markers
│   ├── LocationList.jsx        # Service location listings
│   ├── DetailedLocationView.jsx # Detailed location information
│   └── ...
├── pages/              # Main application pages
│   ├── Home.jsx               # Main map and navigation page
│   └── HowToReach.jsx         # Transportation information
├── services/           # Business logic and data services
│   ├── DataService.js         # Location data management
│   ├── MapTileService.jsx     # Offline map functionality
│   └── NavigationService.jsx  # Navigation and calling utilities
└── App.jsx            # Main application component
```

## 🗺️ Key Locations

### Event Venue
- **Location**: Chitrada Village, Pithapuram Mandal
- **Coordinates**: 17.117°N, 82.253°E
- **Distance**: 6km from Pithapuram, 16km from Kakinada

### Transportation
- **By Car**: NH16 to Pithapuram, then local roads
- **By Bus**: RTC buses from Kakinada to Pithapuram
- **By Train**: Pithapuram Railway Station (6km away)
- **By Air**: Rajahmundry Airport (75km away)

## 📱 Features in Detail

### Offline Functionality
- Download map tiles for offline use
- Cached location data for poor connectivity areas
- Works without internet after initial setup

### Real-time Information
- Live availability status for all services
- Contact information for volunteers and staff
- Emergency contact integration

### Navigation Integration
- One-click navigation to any location
- Google Maps integration
- Phone dialing for emergency contacts

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_APP_NAME=Janasena Event App
VITE_EVENT_LOCATION_LAT=17.117
VITE_EVENT_LOCATION_LNG=82.253
```

### Map Configuration
The app uses OpenStreetMap tiles by default. For production, consider:
- Setting up your own tile server
- Using commercial map providers
- Implementing proper attribution

## 🚀 Deployment

### Web Deployment
```bash
# Build the project
npm run build

# Deploy to your hosting service
# The built files will be in the 'dist' directory
```

### Mobile App (Capacitor)
```bash
# Add mobile platforms
npx cap add ios
npx cap add android

# Build and sync
npm run build
npx cap sync

# Open in native IDEs
npx cap open ios
npx cap open android
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Janasena Party for organizing the Formation Day event
- Chitrada Village community for hosting
- OpenStreetMap contributors for map data
- Ionic Framework team for the excellent mobile framework

## 📞 Support

For technical support or questions about the app:
- Create an issue on GitHub
- Contact the development team

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
  - Interactive map with service locations
  - Offline map support
  - Real-time availability tracking
  - Mobile-optimized interface

---

**Made with ❤️ for the Janasena Formation Day Event**