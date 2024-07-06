import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

import {OuterCard} from '../components/OuterCard';

import { MapContainer, TileLayer, Marker, Popup, Polygon, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import {Request, POST} from '../api/index';
import { ShowAlert } from '../utils/alerts_utils';



// Иконка для маркеров
const customIcon = new L.Icon({
    iconUrl: '/pin_icon.png',
    iconSize: [35, 35],
    iconAnchor: [18, 35],
    popupAnchor: [1, -34],
});


// Функция для генерации статичной сетки относительно центра
const generateStaticGrid = (center, rows, cols, cellSize, sectorCoords) => {
    const [centerLat, centerLon] = center;
    const latCorrection = cellSize; // Шаг по широте
    const lonCorrection = cellSize / Math.cos(centerLat * Math.PI / 180); // Коррекция шага по долготе
    const startLat = centerLat - (rows / 2) * latCorrection;
    const startLon = centerLon - (cols / 2) * lonCorrection;
    const polygons = [];

    for (let sec in Object.values(sectorCoords)) {
        const cell = [
            [Object.values(sectorCoords)[sec].x_min, Object.values(sectorCoords)[sec].y_min],
            [Object.values(sectorCoords)[sec].x_max, Object.values(sectorCoords)[sec].y_min],
            [Object.values(sectorCoords)[sec].x_max, Object.values(sectorCoords)[sec].y_max],
            [Object.values(sectorCoords)[sec].x_min, Object.values(sectorCoords)[sec].y_max]
        ];
        polygons.push(cell);
    }

    return polygons;
};

const gridCenter = [55.751244, 37.618423];  // Центр сетки
const gridRows = 5;  // Количество рядов
const gridCols = 5;  // Количество колонок
const gridSize = 0.07;  // Размер ячейки сетки

const MyPoints = ({ points, sectorCoords }) => {
    const grid = generateStaticGrid(gridCenter, gridRows, gridCols, gridSize, sectorCoords);

    return (
        <MapContainer center={gridCenter} zoom={10} style={{ height: '75vh', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {grid.map((cell, index) => {
                return (
                    <Polygon
                        key={index}
                        weight={0.5}
                        fillOpacity={0.2}
                        positions={cell}
                        color="black"
                    />
                );
            })}
            {points.map((point, index) => (
                <Marker key={index} position={[point.lat, point.lon]} icon={customIcon}>
                    <Popup>
                        Азимут: {point.azimuth}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

const BestSectors = ({ pointsSectors, handleSectorClick }) => {
    const TopSector = ({ place, points, selected, handleClick }) => {
        return (
            <div
                onClick={handleClick}
                style={{
                    backgroundColor: selected ? 'lightgreen' : 'lightgray',
                    padding: '5px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Сектор {place}: ({points.length} точек)
            </div>
        );
    };
    
    return (
        <div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {Object.keys(pointsSectors).slice(0, 15).map((sector, index) => (
                    <li
                        style={{ marginBottom: '10px' }}
                        key={index}
                    >
                        <TopSector
                            place={index + 1}
                            points={pointsSectors[sector].points}
                            selected={pointsSectors[sector].selected}
                            handleClick={() => handleSectorClick(sector)}
                        />
                    </li>
                ))}
            </ul>
            {
                Object.keys(pointsSectors).length === 0
                ? <p>Ничего не найдено</p>
                : null
            }
        </div>
    );
};


const MapPoints = ({ 
    points,
    sectorCoords,
    pointsSectors,
    selectedPoints,
    setSelectedPoints,
    selectedSectors,
    setSelectedSectors
 }) => {
    const handleSectorClick = (sector) => {
        pointsSectors[sector].selected = !pointsSectors[sector].selected;
        let _selectedSectors = {};
        let _selectedPoints = [];

        for (const [key, value] of Object.entries(pointsSectors)) {
            if (value.selected) {
                _selectedSectors[key] = value;
                _selectedPoints = _selectedPoints.concat(value.points);
            }
        }
        if (Object.keys(_selectedSectors).length === 0) {
            setSelectedPoints(points);
            setSelectedSectors(pointsSectors);
            return;
        }

        setSelectedPoints(_selectedPoints);
        setSelectedSectors(_selectedSectors);
    };

    return (
        <OuterCard>
            <Row>
                <Col md={9}>
                    <h3>Карта</h3>
                    <div style={{boxShadow: '0 0 6px gray'}}>
                        <MyPoints points={selectedPoints} sectorCoords={sectorCoords}/>
                    </div>
                </Col>
                <Col md={3}>
                    <h3>Лучшие сектора</h3>
                    <BestSectors
                        pointsSectors={pointsSectors}
                        selectedSectors={selectedSectors}
                        handleSectorClick={handleSectorClick}
                    />
                </Col>
            </Row>
        </OuterCard>
    );
};

export default MapPoints;