import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';

const MapComponent = ({ itinerary }) => {
  const startIcon = L.icon({
    iconUrl: 'https://www.parcoabruzzo.it/grafix/map-start.png',
    iconSize: [25, 25],
  });

  const endIcon = L.icon({
    iconUrl: 'https://www.parcoabruzzo.it/grafix/map-arrivo.png',
    iconSize: [25, 25],
  });

  const polylinePoints = itinerary.features.find(f => f.geometry.type === "LineString").geometry.coordinates.map(coord => [coord[1], coord[0]]);
  const startPoint = itinerary.features.find(f => f.properties.name === "Partenza");
  const endPoint = itinerary.features.find(f => f.properties.name === "Arrivo");

  return (
    <MapContainer center={polylinePoints[0]} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={[startPoint.geometry.coordinates[1], startPoint.geometry.coordinates[0]]} icon={startIcon}>
        <Popup>{startPoint.properties.description}</Popup>
      </Marker>
      <Marker position={[endPoint.geometry.coordinates[1], endPoint.geometry.coordinates[0]]} icon={endIcon}>
        <Popup>{endPoint.properties.description}</Popup>
      </Marker>
      <Polyline positions={polylinePoints} color="blue" />
    </MapContainer>
  );
};
