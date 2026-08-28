import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ReduxProvider from "./redux/ReduxProvider.jsx"

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<ReduxProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</ReduxProvider>
	</StrictMode>,
);
