import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

import {OuterCard} from '../components/OuterCard';

import MapPoints from '../components/MapPoints';


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

const Filters = ({
    ageFrom,
    setAgeFrom,
    ageTo,
    setAgeTo,
    gender,
    setGender,
    income,
    setIncome,
    handleSubmitFilters,
}) => {

    return (
        <Container>
            <Row>
                <Col>
                    <h3>Целевая аудитория</h3>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form onSubmit={handleSubmitFilters}>
                        <Row>
                            <Form.Group controlId="Age">
                                <Form.Label style={{fontWeight: 'bold'}}>Возраст</Form.Label>
                                <Row>
                                    <Col>
                                        <Form.Label>От</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={ageFrom}
                                            name='ageFrom'
                                            onChange={(e) => setAgeFrom(e.target.value)}
                                            min={14}
                                            max={ageTo}
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Label>До</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={ageTo}
                                            name='ageTo'
                                            onChange={(e) => setAgeTo(e.target.value)}
                                            min={ageFrom}
                                            max={99}
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Row>
                        <hr />
                        <Row>
                            <Form.Group controlId="gender">
                                <Form.Label style={{fontWeight: 'bold'}}>Пол</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={gender}
                                    name='gender'
                                    onChange={(e) => setGender(e.target.value)}
                                >
                                    <option value="all">Любой</option>
                                    <option value="male">Мужской</option>
                                    <option value="female">Женский</option>
                                </Form.Control>
                            </Form.Group>
                        </Row>
                        <hr />
                        <Row>
                            <Form.Group controlId="income">
                                <Form.Label style={{fontWeight: 'bold'}}>Уровень дохода</Form.Label>
                                <Row>
                                    <Col>
                                        <Form.Label>Маленький</Form.Label>
                                        <Form.Check
                                            type="checkbox"
                                            checked={income.c}
                                            name='c'
                                            onChange={(e) => setIncome({...income, [e.target.name]: e.target.checked})}
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Label>Средний</Form.Label>
                                        <Form.Check
                                            type="checkbox"
                                            checked={income.b}
                                            name='b'
                                            onChange={(e) => setIncome({...income, [e.target.name]: e.target.checked})}
                                        />
                                    </Col>
                                    <Col>
                                        <Form.Label>Высокий</Form.Label>
                                        <Form.Check
                                            type="checkbox"
                                            checked={income.a}
                                            name='a'
                                            onChange={(e) => setIncome({...income, [e.target.name]: e.target.checked})}
                                        />
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Row>
                        <Button type='submit' style={{ marginTop: '10px'}}>Применить</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

const MainPage = () => {
    const [ageFrom, setAgeFrom] = useState(14);
    const [ageTo, setAgeTo] = useState(99);
    const [gender, setGender] = useState('all');
    const [income, setIncome] = useState({
        "a": true, // высокий доход
        "b": true, // средний доход
        "c": true, // маленький доход
    });
    const [points, setPoints] = useState(_points);

    const handleSubmitFilters = (e) => {
        let _income = '';
        if (income.a) {
            _income += 'a';
        }
        if (income.b) {
            _income += 'b';
        }
        if (income.c) {
            _income += 'c';
        }

        let filters = {
            "ageFrom": ageFrom,
            "ageTo": ageTo,
            "gender": gender,
            "income": income,
        };
        console.log(filters)

        e.preventDefault();
    }

    return (
        <div style={{ padding: '10px', maxHeight: '90vh', minHeight: '90vh' }}>
            <Row style={{ maxHeight: '90vh', minHeight: '85vh' }}>
                <Col md={3}>
                    <OuterCard>
                        <Filters
                            ageFrom={ageFrom}
                            setAgeFrom={setAgeFrom}
                            ageTo={ageTo}
                            setAgeTo={setAgeTo}
                            gender={gender}
                            setGender={setGender}
                            income={income}
                            setIncome={setIncome}
                            handleSubmitFilters={handleSubmitFilters}
                        />
                    </OuterCard>
                </Col>
                <Col md={9}>
                    <MapPoints points={points} />
                </Col>
            </Row>
        </div>
    );
};

export default MainPage;
