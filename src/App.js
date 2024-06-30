import React from 'react';
import { ThemeProvider } from './ThemeContext';
import Header from './Header';
import Content from './Content';
import './App.css';

function App() {
  return (
      <ThemeProvider>
        <div className="App">
          <Header />
          <Content />
        </div>
      </ThemeProvider>
  );
}

export default App;