import React from 'react';
import './assets/css/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as serviceWorkerRegistration from './service-worker/serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import App from "./view/app/App";

import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
    <App/>
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
