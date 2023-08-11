import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapBoxKey } from '../../contracts/ref';
import styled from 'styled-components';

const MapContainer = styled.div`
width: 100%;
  height: 250px;
  max-height: 300px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;

  .mapboxgl-map {
    width: 100%;
    height: 100%;
  }
`;

mapboxgl.accessToken = MapBoxKey;

function MapBox() {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-v9', // Use satellite view
      center: [-76.47764, 38.197963],
      zoom: 13
    });

    // Disable map controls
    map.scrollZoom.disable(); // Disable zooming with scroll
    map.boxZoom.disable(); // Disable box zoom
    map.dragRotate.disable(); // Disable map rotation
    map.dragPan.disable(); // Disable map panning
    map.keyboard.disable(); // Disable keyboard shortcuts
    map.doubleClickZoom.disable(); // Disable zooming with double click
    map.touchZoomRotate.disable(); // Disable zooming and rotating with touch

    return () => map.remove();
  }, []);

  return <MapContainer ref={mapContainerRef} />;
}

export default MapBox;
