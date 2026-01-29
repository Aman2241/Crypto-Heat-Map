import React from 'react';
import BubbleChart from './components/BubbleChart';
import { useCryptoData } from './hooks/useCryptoData';

function App() {
  const { data, loading, error } = useCryptoData();

  if (loading && data.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#111827', color: 'white' }}>
        Loading Crypto Data...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#111827', color: '#EF4444' }}>
        Error loading data: {error.message}
      </div>
    );
  }

  return (
    <div style={{ background: '#111827', minHeight: '100vh' }}>
      <header style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, color: 'white', pointerEvents: 'none' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Crypto Market Map</h1>
        <p style={{ margin: 0, opacity: 0.7 }}>Top 500 Coins by Market Cap</p>
      </header>
      <BubbleChart data={data} />
    </div>
  );
}

export default App;
