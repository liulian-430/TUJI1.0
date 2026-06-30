import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin, Navigation, Layers, Search as SearchIcon, X, Plus } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import { mockPOIs, POI } from '../data/mock';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const defaultIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="background: linear-gradient(135deg, #6366f1, #ec4899); width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);"></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13);
  }, [center, map]);
  return null;
}

export default function Map() {
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [showList, setShowList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<POI[]>([]);
  const [addedPOIs, setAddedPOIs] = useState<POI[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  const allPois = [...mockPOIs, ...addedPOIs];

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = mockPOIs.filter(
        (poi) =>
          poi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          poi.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleAddToMap = (poi: POI) => {
    if (!addedPOIs.find((p) => p.id === poi.id)) {
      setAddedPOIs([...addedPOIs, poi]);
    }
    setSelectedPOI(poi);
    setShowSearch(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen pb-24 md:pb-0 pt-20 md:pt-0 relative">
      <MapContainer
        center={[39.9042, 116.4074]}
        zoom={12}
        className="h-[calc(100vh-5rem)] md:h-screen w-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {allPois.map((poi) => (
          <Marker
            key={poi.id}
            position={[poi.latitude, poi.longitude]}
            icon={defaultIcon}
            eventHandlers={{
              click: () => setSelectedPOI(poi),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <img
                  src={poi.images[0]}
                  alt={poi.name}
                  className="w-full h-24 object-cover rounded-lg mb-2"
                />
                <h3 className="font-medium text-gray-800">{poi.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <span>评分 {poi.rating}</span>
                  <span>|</span>
                  <span>¥{poi.price}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        {selectedPOI && (
          <MapController center={[selectedPOI.latitude, selectedPOI.longitude]} />
        )}
      </MapContainer>

      {/* Floating Search Button */}
      <button
        onClick={() => setShowSearch(!showSearch)}
        className="absolute top-24 left-4 glass-card p-3 hover:bg-white/20 transition-colors z-[1000]"
      >
        <SearchIcon size={20} className="text-gray-700" />
      </button>

      {/* Search Panel */}
      {showSearch && (
        <div className="absolute top-24 left-4 right-4 md:left-auto md:right-4 md:w-96 glass-card p-4 z-[1001]">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 relative">
              <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索景点..."
                className="w-full bg-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-mid/50"
              />
            </div>
            <button
              onClick={() => setShowSearch(false)}
              className="p-2 hover:bg-white/10 rounded-lg"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {searchResults.map((poi) => (
                <button
                  key={poi.id}
                  onClick={() => handleAddToMap(poi)}
                  className="w-full p-3 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-3 text-left"
                >
                  <img
                    src={poi.images[0]}
                    alt={poi.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{poi.name}</p>
                    <p className="text-xs text-gray-500">{poi.city}</p>
                  </div>
                  <Plus size={18} className="text-primary-mid" />
                </button>
              ))}
            </div>
          ) : searchQuery ? (
            <p className="text-sm text-gray-500 text-center py-4">未找到结果</p>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 mb-2">推荐景点</p>
              {mockPOIs.slice(0, 4).map((poi) => (
                <button
                  key={poi.id}
                  onClick={() => handleAddToMap(poi)}
                  className="w-full p-3 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-3 text-left"
                >
                  <img
                    src={poi.images[0]}
                    alt={poi.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{poi.name}</p>
                    <p className="text-xs text-gray-500">{poi.city}</p>
                  </div>
                  <Plus size={18} className="text-primary-mid" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Floating Controls */}
      <div className="absolute top-24 right-4 flex flex-col gap-2 z-[1000]">
        <button className="glass-card p-3 hover:bg-white/20 transition-colors">
          <Layers size={20} className="text-gray-700" />
        </button>
        <button className="glass-card p-3 hover:bg-white/20 transition-colors">
          <Navigation size={20} className="text-gray-700" />
        </button>
      </div>

      {/* Bottom POI Card */}
      {selectedPOI && (
        <div className="absolute bottom-24 md:bottom-8 left-4 right-4 md:left-auto md:right-8 md:w-96 z-[1000]">
          <GlassCard className="p-4 cursor-pointer" onClick={() => setShowList(!showList)}>
            <div className="flex items-start gap-4">
              <img
                src={selectedPOI.images[0]}
                alt={selectedPOI.name}
                className="w-24 h-24 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 truncate">{selectedPOI.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <MapPin size={12} />
                  <span className="truncate">{selectedPOI.address}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-yellow-500 text-sm">
                    {'★'.repeat(Math.floor(selectedPOI.rating))}
                  </span>
                  <span className="text-sm font-medium">{selectedPOI.rating}</span>
                </div>
                {selectedPOI.price > 0 && (
                  <span className="text-primary-mid font-bold mt-1 block">
                    ¥{selectedPOI.price}
                  </span>
                )}
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* POI List Overlay */}
      {showList && (
        <div className="absolute top-20 left-0 bottom-24 md:bottom-8 w-full md:w-96 bg-white/95 backdrop-blur-xl z-[999] overflow-y-auto">
          <div className="p-4">
            <h2 className="font-bold text-gray-800 mb-4">地图上的景点</h2>
            <div className="space-y-3">
              {allPois.map((poi) => (
                <GlassCard
                  key={poi.id}
                  className={`p-3 ${selectedPOI?.id === poi.id ? 'ring-2 ring-primary-mid' : ''}`}
                  onClick={() => {
                    setSelectedPOI(poi);
                    setShowList(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={poi.images[0]}
                      alt={poi.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 truncate">{poi.name}</h4>
                      <p className="text-xs text-gray-500 truncate">{poi.city}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-yellow-500">★ {poi.rating}</span>
                        {poi.price > 0 && (
                          <span className="text-sm text-primary-mid">¥{poi.price}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
