import axios from 'axios';

// Use local proxy to avoid CORS
const API_URL = '/api/v3/coins/markets';

export const fetchCryptoData = async () => {
    try {
        // CoinGecko allows 30 calls/min. We need 2 calls for 500 items (250 per page).
        const params = {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 250,
            sparkline: false
        };

        const [page1, page2] = await Promise.all([
            axios.get(API_URL, { params: { ...params, page: 1 } }),
            axios.get(API_URL, { params: { ...params, page: 2 } })
        ]);

        return [...page1.data, ...page2.data];
    } catch (error) {
        console.error("Error fetching crypto data:", error);
        throw error;
    }
};
