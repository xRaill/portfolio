import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

const root = document.createElement('root');
document.body.prepend(root);

const render = () => ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	root
); render();

// Enables HMR for css
if (module.hot) module.hot.accept('./components/App', render);

// Correct viewport height for mobile devices
// const setVH = () => document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
// window.addEventListener('resize', setVH);
// setVH();
