import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

import {OuterCard} from '../components/OuterCard';

import { MapContainer, TileLayer, Marker, Popup, Polygon, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


let _sectorsCoords =  [
    {
        "x_min": "55.55",
        "x_max": "55.68333333333333",
        "y_min": "37.3",
        "y_max": "37.5"
    },
    {
        "x_min": "55.55",
        "x_max": "55.68333333333333",
        "y_min": "37.5",
        "y_max": "37.699999999999996"
    },
    {
        "x_min": "55.55",
        "x_max": "55.68333333333333",
        "y_min": "37.699999999999996",
        "y_max": "37.9"
    },
    {
        "x_min": "55.68333333333333",
        "x_max": "55.81666666666667",
        "y_min": "37.3",
        "y_max": "37.5"
    },
    {
        "x_min": "55.68333333333333",
        "x_max": "55.81666666666667",
        "y_min": "37.5",
        "y_max": "37.699999999999996"
    },
    {
        "x_min": "55.68333333333333",
        "x_max": "55.81666666666667",
        "y_min": "37.699999999999996",
        "y_max": "37.9"
    },
    {
        "x_min": "55.81666666666667",
        "x_max": "55.95",
        "y_min": "37.3",
        "y_max": "37.5"
    },
    {
        "x_min": "55.81666666666667",
        "x_max": "55.95",
        "y_min": "37.5",
        "y_max": "37.699999999999996"
    },
    {
        "x_min": "55.81666666666667",
        "x_max": "55.95",
        "y_min": "37.699999999999996",
        "y_max": "37.9"
    },
]



// Иконка для маркеров
const customIcon = new L.Icon({
    iconUrl: '/pin_icon.png',
    iconSize: [35, 35],
    iconAnchor: [18, 35],
    popupAnchor: [1, -34],
});


// Функция для генерации статичной сетки относительно центра
const generateStaticGrid = (center, rows, cols, cellSize) => {
    const [centerLat, centerLon] = center;
    const latCorrection = cellSize; // Шаг по широте
    const lonCorrection = cellSize / Math.cos(centerLat * Math.PI / 180); // Коррекция шага по долготе
    const startLat = centerLat - (rows / 2) * latCorrection;
    const startLon = centerLon - (cols / 2) * lonCorrection;
    const polygons = [];

    // for (let i = 0; i < rows; i++) {
    //     for (let j = 0; j < cols; j++) {
    //         const cell = [
    //             [startLat + i * latCorrection, startLon + j * lonCorrection],
    //             [startLat + (i + 1) * latCorrection, startLon + j * lonCorrection],
    //             [startLat + (i + 1) * latCorrection, startLon + (j + 1) * lonCorrection],
    //             [startLat + i * latCorrection, startLon + (j + 1) * lonCorrection]
    //         ];
    //         polygons.push(cell);
    //     }
    // }

    for (let sec in Object.values(_sectorsCoords)) {
        const cell = [
            [Object.values(_sectorsCoords)[sec].x_min, Object.values(_sectorsCoords)[sec].y_min],
            [Object.values(_sectorsCoords)[sec].x_max, Object.values(_sectorsCoords)[sec].y_min],
            [Object.values(_sectorsCoords)[sec].x_max, Object.values(_sectorsCoords)[sec].y_max],
            [Object.values(_sectorsCoords)[sec].x_min, Object.values(_sectorsCoords)[sec].y_max]
        ];
        polygons.push(cell);
    }

    return polygons;
};

const gridCenter = [55.751244, 37.618423];  // Центр сетки
const gridRows = 5;  // Количество рядов
const gridCols = 5;  // Количество колонок
const gridSize = 0.07;  // Размер ячейки сетки

const MyPoints = ({ points }) => {
    const grid = generateStaticGrid(gridCenter, gridRows, gridCols, gridSize);

    // const isPointInSquare = (point, vertex1, vertex2) => {
    //     const minLat = Math.min(vertex1[0], vertex2[0]);
    //     const maxLat = Math.max(vertex1[0], vertex2[0]);
    //     const minLon = Math.min(vertex1[1], vertex2[1]);
    //     const maxLon = Math.max(vertex1[1], vertex2[1]);
    
    //     const lat = parseFloat(point.lat);
    //     const lon = parseFloat(point.lon);
    
    //     return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;
    // };

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
                {Object.keys(pointsSectors).map((sector, index) => (
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
                        <MyPoints points={selectedPoints}/>
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