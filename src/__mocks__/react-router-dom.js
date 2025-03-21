// src/__mocks__/react-router-dom.js
const React = require('react');

module.exports = {
  BrowserRouter: ({ children }) => React.createElement('div', { 'data-testid': 'browser-router' }, children),
  Routes: ({ children }) => React.createElement('div', { 'data-testid': 'routes' }, children),
  Route: ({ children }) => React.createElement('div', { 'data-testid': 'route' }, children),
  Link: ({ children, to }) => React.createElement('a', { href: to, 'data-testid': 'link' }, children)
};
