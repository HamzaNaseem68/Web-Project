import React from 'react';
import './App.css';
import ProductManagement from './components/ProductManagement';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>Product Management Admin Panel</h1>
      </header>
      <main className="app-main">
        <ProductManagement />
      </main>
    </div>
  );
}

export default App;


