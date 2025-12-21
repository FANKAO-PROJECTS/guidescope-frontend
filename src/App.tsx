import { useState, useCallback, useEffect, useMemo } from 'react'
import SearchBar from './components/SearchBar'
import Filters from './components/Filters'
import ResultCard from './components/ResultCard'
import LoadingSpinner from './components/LoadingSpinner'
import LanguageSwitcher from './components/LanguageSwitcher'
import { searchDocuments, getCapabilities } from './api/searchApi'
import type { SearchResult, SearchParams, SearchCapabilities } from './api/searchApi'
import { BookOpen, AlertCircle, SearchIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SearchMeta from './components/SearchMeta'
import { useTranslation } from 'react-i18next'

function App() {
  const { t } = useTranslation()
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  // Filter States
  const [type, setType] = useState('')
  const [region, setRegion] = useState('')
  const [field, setField] = useState('')
  const [yearFrom, setYearFrom] = useState<number | ''>('')
  const [yearTo, setYearTo] = useState<number | ''>('')

  // Keyword Search States
  const [query, setQuery] = useState('') // Local input state
  const [submittedQuery, setSubmittedQuery] = useState('') // What we actually searched for

  const [totalResults, setTotalResults] = useState(0)
  const [offset, setOffset] = useState(0)
  const [capabilities, setCapabilities] = useState<SearchCapabilities | null>(null)
  const PAGE_SIZE = 20

  // Rule: UI must never treat stale results as fresh.
  const isStale = useMemo(() => {
    // Stale if keyword in input doesn't match last submitted search
    if (query !== submittedQuery) return true;
    return false;
  }, [query, submittedQuery]);

  const handleSearch = useCallback(async (keyword: string, currentOffset: number = 0, exact: boolean = false) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setSubmittedQuery(keyword);

    if (currentOffset === 0) {
      setResults([]);
    }

    const params: SearchParams = {
      q: keyword || undefined,
      type: type || undefined,
      region: region || undefined,
      field: field || undefined,
      year_from: typeof yearFrom === 'number' ? yearFrom : undefined,
      year_to: typeof yearTo === 'number' ? yearTo : undefined,
      limit: PAGE_SIZE,
      offset: currentOffset,
      exact: exact
    }

    // URL Sync
    const url = new URL(window.location.href);
    if (keyword) url.searchParams.set('q', keyword); else url.searchParams.delete('q');
    if (type) url.searchParams.set('type', type); else url.searchParams.delete('type');
    if (region) url.searchParams.set('region', region); else url.searchParams.delete('region');
    if (field) url.searchParams.set('field', field); else url.searchParams.delete('field');
    if (yearFrom) url.searchParams.set('year_from', yearFrom.toString()); else url.searchParams.delete('year_from');
    if (yearTo) url.searchParams.set('year_to', yearTo.toString()); else url.searchParams.delete('year_to');
    window.history.pushState({}, '', url.toString());

    // If no query and no filters, reset to initial state
    if (!keyword && !type && !region && !field && !yearFrom && !yearTo) {
      setHasSearched(false);
      setResults([]);
      setIsLoading(false);
      return;
    }

    try {
      const data = await searchDocuments(params);
      if (currentOffset === 0) {
        setResults(data.results);
      } else {
        setResults(prev => [...prev, ...data.results]);
      }
      setTotalResults(data.total);
    } catch (err) {
      setError(t('results.error'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [type, region, field, yearFrom, yearTo, t]);

  const loadMore = () => {
    const nextOffset = offset + PAGE_SIZE;
    setOffset(nextOffset);
    handleSearch(submittedQuery, nextOffset);
  };

  // INITIAL LOAD
  useEffect(() => {
    const initialize = async () => {
      try {
        const caps = await getCapabilities();
        setCapabilities(caps);
      } catch (err) {
        console.error('Failed to fetch capabilities:', err);
      }

      const params = new URLSearchParams(window.location.search);
      const q = params.get('q') || '';
      const tParam = params.get('type') || '';
      const r = params.get('region') || '';
      const f = params.get('field') || '';
      const from = params.get('year_from');
      const to = params.get('year_to');

      if (q || tParam || r || f || from || to) {
        setQuery(q);
        setSubmittedQuery(q);
        setType(tParam);
        setRegion(r);
        setField(f);
        if (from) setYearFrom(parseInt(from));
        if (to) setYearTo(parseInt(to));

        // Use timeout to ensure state is flushed or use internal vars
        const searchParams: SearchParams = {
          q: q || undefined,
          type: tParam || undefined,
          region: r || undefined,
          field: f || undefined,
          year_from: from ? parseInt(from) : undefined,
          year_to: to ? parseInt(to) : undefined,
          limit: PAGE_SIZE,
          offset: 0
        };

        setIsLoading(true);
        try {
          const data = await searchDocuments(searchParams);
          setResults(data.results);
          setTotalResults(data.total);
          setHasSearched(true);
        } catch (err) {
          setError(t('results.error'));
        } finally {
          setIsLoading(false);
        }
      }
    };

    initialize();
  }, [t]);

  // Filter Rule — Rule B: One or more filters have values -> execute search
  useEffect(() => {
    const hasFilters = !!(type || region || field || yearFrom || yearTo);
    if (hasFilters || hasSearched) {
      setOffset(0);
      handleSearch(submittedQuery, 0); // Filters trigger search using last submitted keyword
    }
  }, [type, region, field, yearFrom, yearTo]);

  return (
    <div className="container mt-8">
      <header className="flex flex-col items-center mb-8 relative">
        <div className="absolute right-0 top-0">
          <LanguageSwitcher />
        </div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-4 mb-4"
        >
          <BookOpen className="text-medical" size={42} />
          <h1 className="text-4xl title-gradient">{t('app.title')}</h1>
        </motion.div>
        <p className="text-muted text-center max-w-lg">
          {t('app.subtitle')}
        </p>
      </header>

      <main className="flex flex-col gap-8">
        <div className="flex flex-col gap-6">
          <SearchBar
            query={query}
            setQuery={setQuery}
            onSearch={(q, exact) => {
              setOffset(0);
              handleSearch(q, 0, exact);
            }}
            isLoading={isLoading}
          />
          <Filters
            capabilities={capabilities}
            type={type} setType={setType}
            region={region} setRegion={setRegion}
            field={field} setField={setField}
            yearFrom={yearFrom} setYearFrom={setYearFrom}
            yearTo={yearTo} setYearTo={setYearTo}
          />
          <SearchMeta
            total={totalResults}
            count={results.length}
            hasSearched={hasSearched}
            isStale={isStale}
          />
        </div>

        <section className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {isLoading && results.length === 0 ? (
              <LoadingSpinner key="loading" />
            ) : error ? (
              <motion.div key="error" className="text-center p-12">
                <AlertCircle className="text-red-500 mb-4" size={48} />
                <h2 className="mb-2">{t('results.title')} - Error</h2>
                <p className="text-muted">{error}</p>
                <p className="text-sm mt-1">{t('results.retry')}</p>
              </motion.div>
            ) : results.length > 0 ? (
              <div key="results">
                <div className="flex items-center justify-between mb-4 px-2">
                  <h2 className="text-xl font-bold text-primary">{t('results.title')}</h2>
                </div>
                <div className="results-grid">
                  {results.map((r, idx) => <ResultCard key={`${r.id}-${idx}`} result={r} index={idx} />)}
                </div>
                {results.length < totalResults && (
                  <div className="flex justify-center py-12">
                    <button
                      onClick={loadMore}
                      disabled={isLoading}
                      className="btn-secondary w-full sm:w-auto"
                    >
                      {isLoading ? t('results.loading_more') : t('results.load_more')}
                    </button>
                  </div>
                )}
              </div>
            ) : hasSearched ? (
              <div key="empty" className="text-center p-12 text-muted">
                <SearchIcon size={48} className="mb-4 opacity-10" />
                <p>{t('results.empty')}</p>
                <p className="text-sm mt-2">{t('results.empty_hint')}</p>
                <button
                  onClick={() => {
                    setQuery('');
                    setSubmittedQuery('');
                    setType('');
                    setRegion('');
                    setField('');
                    setYearFrom('');
                    setYearTo('');
                    setResults([]);
                    setHasSearched(false);
                    // Clear URL parameters
                    window.history.pushState({}, '', window.location.pathname);
                  }}
                  className="mt-6 btn-tertiary"
                >
                  {t('results.clear_all')}
                </button>
              </div>
            ) : (
              <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-12 glass-effect">
                <h3 className="mb-4">{t('welcome.title')}</h3>
                <p className="text-sm text-muted mb-8 italic">{t('welcome.subtitle')}</p>
                <div className="flex justify-center gap-8 text-muted">
                  <div className="flex flex-col items-center">
                    <span className="card-tag mb-2">1</span>
                    <p className="text-xs">{t('welcome.step1')}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="card-tag mb-2">2</span>
                    <p className="text-xs">{t('welcome.step2')}</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="card-tag mb-2">3</span>
                    <p className="text-xs">{t('welcome.step3')}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <footer className="text-center py-8 text-muted opacity-30 text-xs">
        {t('footer.text')} • {new Date().getFullYear()}
      </footer>
    </div>
  )
}

export default App
