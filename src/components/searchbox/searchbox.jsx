import { useState } from "react"
import { useNavigate } from "react-router-dom"
import './searchbox.css'


const SearchBox = ({
  placeholder = 'Buscar...',
  onSearch,
  searchPath,
  searchParam = 'search',
  className = '',
  autoNavigate = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if(searchTerm.trim()) {
      const trimmedSearch = searchTerm.trim();

      if(onSearch) {
        onSearch(trimmedSearch);
      }

      if(searchPath && autoNavigate) {
        navigate(`${searchPath}?${searchParam}=${encodeURIComponent(trimmedSearch)}`);
      }

      setSearchTerm('');
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`search-box ${className}`}>
      <div className="search-input-group">
        <input 
          type="text" 
          name="search" 
          id="search" 
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => {setSearchTerm(e.target.value)}}
        />
        <button 
          type="submit"
          className="search-btn"
          disabled={!searchTerm.trim()}
        >
          <i className="bi bi-search"></i> Buscar
        </button>
      </div>
    </form>
  );
};

export default SearchBox;