# Crypto Heat Map 🚀

A stunning, real-time visualization of the top 500 cryptocurrencies by market cap, inspired by "bubbling water droplets". Built with React, D3.js, and a premium Glassmorphism aesthetic.

![Status](https://img.shields.io/badge/Status-Completed-success)
![Tech](https://img.shields.io/badge/Tech-React%20%7C%20D3.js%20%7C%20Vite-blue)

## 🔗 Links

- **📂 GitHub Repository**: [https://github.com/Aman2241/Crypto-Heat-Map](https://github.com/Aman2241/Crypto-Heat-Map)
- **🚀 Live Demo**: [https://Aman2241.github.io/Crypto-Heat-Map/](https://Aman2241.github.io/Crypto-Heat-Map/)

## ✨ Features

- **Real-Time Data**: Fetches live data for the top 500 coins via CoinGecko API.
- **Dynamic Physics**: Bubbles float, bounce, and interact like water droplets using D3 Force Simulation.
- **Premium UI**:
    - **Glassmorphism**: Semi-transparent, glowing bubbles with gradients (Emerald for pumps, Rose for dumps).
    - **Clutter-Free**: Labels are hidden by default to reduce visual noise.
    - **Interactive Tooltips**: Hover over any bubble to reveal detailed metrics (Price, Market Cap, 24h Change) in a frosted-glass tooltip.
- **Responsive**: Adapts gracefully to screen resizing.
- **Dark Mode**: Deep, immersive dark theme.

## 🛠️ Technology Stack

- **Frontend**: React + Vite
- **Visualization**: D3.js (Force Simulation, Pack Layout)
- **Data**: Axios + CoinGecko API
- **Styling**: CSS Modules, CSS Variables (Inter Font)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Aman2241/Crypto-Heat-Map.git
    cd Crypto-Heat-Map
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Open `http://localhost:5173` to view the app.

## 🔧 Configuration

### API Proxy
To avoid CORS issues with the CoinGecko API during local development, this project uses a Vite proxy.
- **Local Path**: `/api/v3/...`
- **Target**: `https://api.coingecko.com/api/v3/...`
- **Config**: See `vite.config.js`

## 📂 Project Structure

```
src/
├── components/
│   └── BubbleChart.jsx  # Core D3.js visualization logic
├── hooks/
│   └── useCryptoData.js # Data fetching hook (auto-refresh 60s)
├── services/
│   └── api.js           # API service (CoinGecko)
├── App.jsx              # Main layout
└── index.css            # Global styles (Glassmorphism, Dark Mode)
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
