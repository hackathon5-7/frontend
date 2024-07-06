import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import PageTemplate from '../pages/index';
import MainPage from '../pages/Main';

export const AuthenticationRoutePath = '/authentication';
export const MainPageRoutePath = '/main';


const AppRouter = () => {
	return (
		<Router>
			<Routes>
				<Route path="*" element={
					<PageTemplate show_navbar={false}>
                        <MainPage />
					</PageTemplate>
				} />
			</Routes>
		</Router>
	);
};

export default AppRouter;