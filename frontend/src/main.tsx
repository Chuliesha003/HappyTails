import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import './index.css'

try {
	console.log('Mounting React app...');
	createRoot(document.getElementById("root")!).render(
		<ErrorBoundary>
			<App />
		</ErrorBoundary>
	);
} catch (err) {
	// Fallback: render error to document so it's visible in the browser
	console.error('Render error:', err);
	const root = document.getElementById('root');
	if (root) {
		root.innerHTML = `<pre style="color: #b91c1c; padding:20px;">${String(err)}</pre>`;
	}
}
