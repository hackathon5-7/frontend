import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

import {OuterCard} from '../components/OuterCard';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


// Иконка для маркеров
const customIcon = new L.Icon({
    iconUrl: '/pin_icon.png',// 'https://png.klev.club/uploads/posts/2024-04/png-klev-club-cvwb-p-ikonka-reklami-png-23.png',
    iconSize: [35, 35],
    iconAnchor: [18, 35],
    popupAnchor: [1, -34],
});

let _points = [
    {"lat": "55.573691", "lon": "37.631423", "azimuth": 273},
    {"lat": "55.584765", "lon": "37.712454", "azimuth": 232},
    {"lat": "55.808425457052", "lon": "37.388807961811", "azimuth": 188},
    {"lat": "55.674378", "lon": "37.422364", "azimuth": 333},
    {"lat": "55.608396", "lon": "37.766383", "azimuth": 54},
    {"lat": "55.908622", "lon": "37.553523", "azimuth": 260},
    {"lat": "55.71", "lon": "37.3875", "azimuth": 162},
    {"lat": "55.626667", "lon": "37.472993", "azimuth": 327},
    {"lat": "55.82762", "lon": "37.832285", "azimuth": 140},
    {"lat": "55.864929", "lon": "37.402182", "азимут": 31},
];
_points = _points.map(point => ({...point, selected: false}));

const MyPoints = ({ points }) => {
    return (
        <MapContainer center={[55.751244, 37.618423]} zoom={10} style={{ height: '75vh', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
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

const BestPoints = ({ points, selectedPoints, handlePointClick, handleResetClick }) => {
    const TopPoint = ({ place, lat, lon }) => {
        const [selected, setSelected] = useState(false);

        useEffect(() => {
            setSelected(selectedPoints.some(point => point.lat === lat && point.lon === lon && point.selected === true));
        }, [selectedPoints]);
    
        return (
            <div
                onClick={() => setSelected(!selected)}
                style={{
                    backgroundColor: selected ? 'lightgreen' : 'lightgray',
                    padding: '5px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Точка {place}: ({parseFloat(lat).toFixed(3)}, {parseFloat(lon).toFixed(3)})
            </div>
        );
    };

    return (
        <div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {points.slice(0, 10).map((point, index) => (
                    <li style={{ marginBottom: '10px' }} key={index} onClick={() => handlePointClick(index)}>
                        <TopPoint place={index + 1} lat={point.lat} lon={point.lon} />
                    </li>
                ))}
            </ul>
            {
                selectedPoints.length === 0
                ? <p>Ничего не найдено</p>
                : <Button onClick={handleResetClick}>Сбросить</Button>
            }
        </div>
    );
};


const MapPoints = ({ points }) => {
    const [selectedPoints, setSelectedPoints] = useState(points);

    const handlePointClick = (index) => {
        points[index].selected = !points[index].selected;
        let _selectedPoints = points.filter(point => point.selected)

        if (_selectedPoints.length === 0) {
            setSelectedPoints(points);
            return;
        }

        setSelectedPoints(points.filter(point => point.selected));
    };

    const handleResetClick = () => {
        points.map(point => point.selected = false);
        setSelectedPoints(points);
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
                    <h3>Лучшие точки</h3>
                    <BestPoints
                        points={points}
                        selectedPoints={selectedPoints}
                        handlePointClick={handlePointClick}
                        handleResetClick={handleResetClick}
                    />
                </Col>
            </Row>
        </OuterCard>
    );
};

export default MapPoints;