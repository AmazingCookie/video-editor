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
import { TouchBackend } from 'react-dnd-touch-backend'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'


// import './index.css';
// import reportWebVitals from './reportWebVitals';
import 'normalize.css/normalize.css'
import './styles/styles.scss'


// https://react-dnd.github.io/react-dnd/docs/backends/touch
const hasNative =
  document && (document.elementsFromPoint || document.msElementsFromPoint)

function getDropTargetElementsAtPoint(x, y, dropTargets) {
  return dropTargets.filter((t) => {
    const rect = t.getBoundingClientRect()
    return (
      x >= rect.left && x <= rect.right && y <= rect.bottom && y >= rect.top
    )
  })
}

// use custom function only if elementsFromPoint is not supported
const backendOptions = {
  enableMouseEvents: true,
  getDropTargetElementsAtPoint: !hasNative && getDropTargetElementsAtPoint
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <DndProvider backend={TouchBackend} options={backendOptions}>
      <AppRouter />
    </DndProvider>
  </Provider>
  // </React.StrictMode>
);



// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
