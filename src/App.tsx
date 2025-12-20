import { useState, useCallback } from 'react'
import SearchBar from './components/SearchBar'
import Filters from './components/Filters'
import ResultCard from './components/ResultCard'
import LoadingSpinner from './components/LoadingSpinner'
import { searchDocuments } from './api/searchApi'
import type { SearchResult, SearchParams } from './api/searchApi'
import { BookOpen, AlertCircle, SearchIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const [type, setType] = useState('')
  const [yearFrom, setYearFrom] = useState<number | ''>('')
  const [yearTo, setYearTo] = useState<number | ''>('')

  useState(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || '';
    const t = params.get('type') || '';
    const from = params.get('year_from');
    const to = params.get('year_to');

    if (q || t || from || to) {
      setType(t);
      if (from) setYearFrom(parseInt(from));
      if (to) setYearTo(parseInt(to));
      // Trigger search on mount if any criteria exist
      handleSearch(q);
    }
  });

  const handleSearch = useCallback(async (query: string) => {
    const hasFilters = type || yearFrom || yearTo;
    if (!query && !hasFilters) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    const params: SearchParams = {
      q: query || undefined,
      type: type || undefined,
      year_from: typeof yearFrom === 'number' ? yearFrom : undefined,
      year_to: typeof yearTo === 'number' ? yearTo : undefined,
      limit: 20
    }

    const url = new URL(window.location.href);
    if (query) url.searchParams.set('q', query); else url.searchParams.delete('q');
    if (type) url.searchParams.set('type', type); else url.searchParams.delete('type');
    if (yearFrom) url.searchParams.set('year_from', yearFrom.toString()); else url.searchParams.delete('year_from');
    if (yearTo) url.searchParams.set('year_to', yearTo.toString()); else url.searchParams.delete('year_to');
    window.history.pushState({}, '', url.toString());

    try {
      const data = await searchDocuments(params);
      setResults(data);
    } catch (err) {
      setError('Service temporary unavailable. Please verify your connection.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [type, yearFrom, yearTo]);

  return (
    <div className="container mt-8">
      <header className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-4 mb-4"
        >
          <BookOpen className="text-sapphire" size={42} />
          <h1 className="text-4xl title-gradient">GuidelineX</h1>
        </motion.div>
        <p className="text-muted">
          Access high-quality clinical and professional insights with speed and precision.
        </p>
      </header>

      <main className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          <Filters
            type={type} setType={setType}
            yearFrom={yearFrom} setYearFrom={setYearFrom}
            yearTo={yearTo} setYearTo={setYearTo}
          />
        </div>

        <section className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingSpinner key="loading" />
            ) : error ? (
              <motion.div key="error" className="text-center p-12">
                <AlertCircle className="text-red-500 mb-4" size={48} />
                <h2 className="mb-2">Search Interrupted</h2>
                <p className="text-muted">{error}</p>
              </motion.div>
            ) : results.length > 0 ? (
              <div key="results" className="results-grid">
                {results.map((r, idx) => <ResultCard key={r.id} result={r} index={idx} />)}
              </div>
            ) : hasSearched ? (
              <div key="empty" className="text-center p-12 text-muted">
                <SearchIcon size={48} className="mb-4 opacity-10" />
                <p>No results match your criteria.</p>
              </div>
            ) : (
              <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-12 glass-effect">
                <h3 className="mb-4">Begin Your Investigation</h3>
                <div className="flex justify-center gap-8 text-muted">
                  <div className="flex flex-col items-center">
                    <span className="card-tag mb-2">1</span>
                    <p className="text-xs">Define query</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="card-tag mb-2">2</span>
                    <p className="text-xs">Apply filters</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="card-tag mb-2">3</span>
                    <p className="text-xs">Explore insights</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <footer className="text-center py-8 text-muted opacity-30 text-xs">
        GUIDELINEX • SEARCH DISCOVERY PLATFORM • {new Date().getFullYear()}
      </footer>
    </div>
  )
}

export default App
