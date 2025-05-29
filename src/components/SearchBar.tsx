import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string, field: 'name' | 'category' | 'lastUpdated') => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchField, setSearchField] = React.useState<'name' | 'category' | 'lastUpdated'>('name');
  const [query, setQuery] = React.useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery, searchField);
  };

  return (
    <div className="flex space-x-4 mb-6">
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search materials..."
          value={query}
          onChange={handleSearch}
        />
      </div>
      <select
        className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        value={searchField}
        onChange={(e) => setSearchField(e.target.value as 'name' | 'category' | 'lastUpdated')}
      >
        <option value="name">Name</option>
        <option value="category">Category</option>
        <option value="lastUpdated">Last Updated</option>
      </select>
    </div>
  );
}