import { useEffect, useState } from 'react';

/**
 * Escucha el evento global 'ui:search' emitido por la app para sincronizar filtros locales.
 */
const useGlobalSearch = (initialQuery = '') => {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const handleSearch = (event) => {
      setQuery((event?.detail?.q || '').trim());
    };

    window.addEventListener('ui:search', handleSearch);
    return () => window.removeEventListener('ui:search', handleSearch);
  }, []);

  return [query, setQuery];
};

export default useGlobalSearch;
