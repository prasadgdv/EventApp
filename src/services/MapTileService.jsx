// services/MapTileService.jsx
import localforage from 'localforage';

// Configure the storage
const tileStore = localforage.createInstance({
  name: 'eventapp-tiles'
});

// Helper function to calculate bounds from center point and radius
function calculateBoundsFromRadius(lat, lng, radiusKm) {
  // Earth's radius in km
  const R = 6371;
  
  // Convert radius from km to radians
  const radDist = radiusKm / R;
  
  // Convert lat/lng to radians
  const radLat = lat * Math.PI / 180;
  const radLng = lng * Math.PI / 180;
  
  // Calculate max/min lat/lng
  const minLat = radLat - radDist;
  const maxLat = radLat + radDist;
  
  // Calculate max/min lng (width varies based on latitude)
  const maxLng = radLng + radDist / Math.cos(radLat);
  const minLng = radLng - radDist / Math.cos(radLat);
  
  // Convert back to degrees
  return {
    south: minLat * 180 / Math.PI,
    north: maxLat * 180 / Math.PI,
    west: minLng * 180 / Math.PI,
    east: maxLng * 180 / Math.PI
  };
}

// Calculate tile coordinates from lat/lng and zoom level
function latLngToTile(lat, lng, zoom) {
  const n = Math.pow(2, zoom);
  const xtile = Math.floor((lng + 180) / 360 * n);
  const ytile = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * n);
  return { x: xtile, y: ytile, z: zoom };
}

// Get all tiles within bounds at a specific zoom level
function getTilesInBounds(bounds, zoom) {
  const tiles = [];
  
  // Calculate tile coordinates for the bounds
  const nwTile = latLngToTile(bounds.north, bounds.west, zoom);
  const seTile = latLngToTile(bounds.south, bounds.east, zoom);
  
  // Loop through all tiles within the bounds
  for (let x = nwTile.x; x <= seTile.x; x++) {
    for (let y = nwTile.y; y <= seTile.y; y++) {
      tiles.push({ x, y, z: zoom });
    }
  }
  
  return tiles;
}

// Download and cache a single tile
async function cacheTile(x, y, z) {
  try {
    const url = `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
    const tileKey = `${z}_${x}_${y}`;
    
    // Check if tile already exists
    const existingTile = await tileStore.getItem(tileKey);
    if (existingTile) {
      return true; // Tile already cached
    }
    
    // Fetch the tile
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch tile ${tileKey}: ${response.status}`);
      return false;
    }
    
    // Convert to blob and store
    const blob = await response.blob();
    await tileStore.setItem(tileKey, blob);
    
    return true;
  } catch (error) {
    console.error(`Error caching tile (${z}/${x}/${y}):`, error);
    return false;
  }
}

// Check if a tile exists in local storage
export async function tileExistsLocally(z, x, y) {
  try {
    const tileKey = `${z}_${x}_${y}`;
    const tile = await tileStore.getItem(tileKey);
    return !!tile;
  } catch (error) {
    console.error(`Error checking for local tile (${z}/${x}/${y}):`, error);
    return false;
  }
}

// Download and store tiles within a specific radius around Chitrada Village
export async function downloadAndStoreTiles(lat = 17.117, lng = 82.253, radiusKm = 20) {
  try {
    console.log(`Starting to download tiles around Chitrada Village (${lat},${lng}) with radius ${radiusKm}km`);
    
    // Calculate bounds from radius
    const bounds = calculateBoundsFromRadius(lat, lng, radiusKm);
    
    // Define zoom levels to cache (10-15 is good for regional maps)
    const minZoom = 10;
    const maxZoom = 15;
    
    let totalTiles = 0;
    let downloadedTiles = 0;
    
    // For each zoom level
    for (let z = minZoom; z <= maxZoom; z++) {
      // Get tiles within bounds
      const tiles = getTilesInBounds(bounds, z);
      totalTiles += tiles.length;
      
      // Create batches to avoid overloading the browser
      const batchSize = 10;
      for (let i = 0; i < tiles.length; i += batchSize) {
        const batch = tiles.slice(i, i + batchSize);
        
        // Process batch in parallel
        const results = await Promise.all(
          batch.map(tile => cacheTile(tile.x, tile.y, tile.z))
        );
        
        // Count successes
        downloadedTiles += results.filter(result => result).length;
        
        // Small delay to prevent overwhelming the network
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log(`Tile download complete: ${downloadedTiles}/${totalTiles} tiles downloaded`);
    return true;
  } catch (error) {
    console.error("Error downloading map tiles:", error);
    return false;
  }
}

// Get a tile URL, checking local storage first
export function getTileUrl(z, x, y) {
  // This is a simplified version - for a complete implementation,
  // you'd need to check if the tile exists in IndexedDB and return a blob URL
  return `https://{s}.tile.openstreetmap.org/${z}/${x}/${y}.png`;
}

// Clear all cached tiles
export async function clearTileCache() {
  try {
    await tileStore.clear();
    console.log("Tile cache cleared");
    return true;
  } catch (error) {
    console.error("Error clearing tile cache:", error);
    return false;
  }
}

// Get tile cache stats
export async function getTileCacheStats() {
  try {
    let keys = await tileStore.keys();
    
    const stats = {
      tileCount: keys.length,
      zoomLevels: new Set()
    };
    
    keys.forEach(key => {
      const [z] = key.split('_');
      stats.zoomLevels.add(parseInt(z));
    });
    
    stats.zoomLevels = Array.from(stats.zoomLevels).sort();
    
    return stats;
  } catch (error) {
    console.error("Error getting tile cache stats:", error);
    return { tileCount: 0, zoomLevels: [] };
  }
}