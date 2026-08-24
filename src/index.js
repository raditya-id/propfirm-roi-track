import React from 'react';
import ReactDOM from 'react-dom/client';
import { DataProvider } from './data';
import { TrackerApp } from './TrackerApp';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    React.createElement(React.StrictMode, null,
      React.createElement(DataProvider, null,
        React.createElement(TrackerApp, null)
      )
    )
  );
}
