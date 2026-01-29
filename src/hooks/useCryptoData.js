import { useState, useEffect } from 'react';
import { fetchCryptoData } from '../services/api';

export const useCryptoData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const result = await fetchCryptoData();
                setData(result);
                setError(null);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();

        // Poll every 60 seconds to respect rate limits
        const interval = setInterval(loadData, 60000);

        return () => clearInterval(interval);
    }, []);

    return { data, loading, error };
};
