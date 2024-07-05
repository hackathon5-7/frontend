import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import PageTemplate from '../pages/index';

export const AuthenticationRoutePath = '/authentication';


const AppRouter = () => {
	return (
		<Router>
			<Routes>
				<Route path="*" element={
					<PageTemplate >
                        <div></div>
					</PageTemplate>
				} />
			</Routes>
		</Router>
	);
};

export default AppRouter;