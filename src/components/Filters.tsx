import React from 'react';
import { Filter } from 'lucide-react';

interface FiltersProps {
    type: string;
    setType: (type: string) => void;
    yearFrom: number | '';
    setYearFrom: (val: number | '') => void;
    yearTo: number | '';
    setYearTo: (val: number | '') => void;
}

const Filters: React.FC<FiltersProps> = ({
    type, setType, yearFrom, setYearFrom, yearTo, setYearTo,
}) => {
    return (
        <div className="glass-effect filter-bar">
            <div className="flex items-center gap-2">
                <Filter size={16} className="text-sapphire" />
                <span className="filter-label">Refine</span>
            </div>

            <div className="filter-group">
                <label className="filter-label">Category</label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Insights</option>
                    <option value="guideline">Guideline</option>
                    <option value="report">Report</option>
                </select>
            </div>

            <div className="filter-group">
                <label className="filter-label">Timeline Start</label>
                <input
                    type="number"
                    placeholder="Year"
                    value={yearFrom}
                    onChange={(e) => setYearFrom(e.target.value === '' ? '' : parseInt(e.target.value))}
                    className="filter-input w-24"
                />
            </div>

            <div className="filter-group">
                <label className="filter-label">Timeline End</label>
                <input
                    type="number"
                    placeholder="Year"
                    value={yearTo}
                    onChange={(e) => setYearTo(e.target.value === '' ? '' : parseInt(e.target.value))}
                    className="filter-input w-24"
                />
            </div>
        </div>
    );
};

export default Filters;
