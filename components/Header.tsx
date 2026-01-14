
import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Project } from '../types';

interface HeaderProps {
  projects: Project[];
  onSelectProject: (id: string, step: number) => void;
}

const Header: React.FC<HeaderProps> = ({ projects, onSelectProject }) => {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredResults = query.trim().length > 0 
    ? projects.filter(p => 
        (p.clientName?.toLowerCase().includes(query.toLowerCase()) || '') ||
        (p.phone?.includes(query) || '') ||
        (p.budgetNumber?.toLowerCase().includes(query.toLowerCase()) || '')
      )
    : [];

  const handleResultClick = (id: string, step: number) => {
    onSelectProject(id, step);
    setQuery('');
    setShowResults(false);
  };

  return (
    <header className="bg-white border-b h-[72px] sticky top-0 z-50 flex items-center px-4 md:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
        <div className="flex items-center">
          <span className="text-xl md:text-3xl font-black text-[#669900] tracking-tighter whitespace-nowrap cursor-default select-none">
            LEROY MERLIN
          </span>
          <div className="hidden md:block h-8 w-[1px] bg-gray-200 ml-6 mr-6"></div>
          <h1 className="hidden xl:block text-lg font-bold text-gray-800">
            Gestión de Proyectos
          </h1>
        </div>

        <div className="flex-1 max-w-xl relative">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-[#669900]" />
            <input 
              type="text"
              placeholder="Buscar por nombre, teléfono o presupuesto..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent border focus:bg-white focus:border-[#669900] rounded-full outline-none transition-all text-sm"
            />
          </div>

          {showResults && filteredResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border overflow-hidden z-50 max-h-80 overflow-y-auto">
              {filteredResults.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleResultClick(p.id, p.currentStep)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between border-b last:border-0"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{p.clientName || 'Sin nombre'}</p>
                    <p className="text-xs text-gray-500">{p.phone || 'Sin teléfono'} • {p.store}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] uppercase font-bold rounded-md">
                      Paso {p.currentStep}
                    </span>
                    {p.budgetNumber && (
                      <span className="text-[10px] text-gray-400 mt-1">
                        #{p.budgetNumber}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden lg:flex items-center space-x-2 text-gray-500 text-sm">
          <MapPin className="w-4 h-4 text-[#669900]" />
          <span className="font-medium">Tienda Gandia 047</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
