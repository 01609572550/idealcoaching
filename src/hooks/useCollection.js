import { useEffect, useState } from 'react';
import { listenCollection } from '../services/firestoreService.js';

export function useCollection(name, options = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    const unsub = listenCollection(name, rows => {
      setData(rows);
      setLoading(false);
    }, options);
    return () => unsub();
  }, [name, JSON.stringify(options)]);

  return { data, loading, error, setError };
}
