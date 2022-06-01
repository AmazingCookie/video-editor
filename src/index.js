/**
 * @description xxxxxx
 * @author amacookie
 * @since 15/05/22
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import AppRouter from './routers/AppRouter'
import { store } from './store';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'


// import './index.css';
// import reportWebVitals from './reportWebVitals';
import 'normalize.css/normalize.css'
import './styles/styles.scss'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <DndProvider backend={HTML5Backend}>
      <AppRouter />
    </DndProvider>
  </Provider>
  // </React.StrictMode>
);



// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
