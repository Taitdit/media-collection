import { useState, useContext } from "react";
import {ThemeContext} from "./context/ThemeContext.jsx"
import FilterA from "./svg/FilterA"
import FilterB from "./svg/FilterB"


const Filters = ({
    availableTypes,
    availableGenres,
    availableYears,
    toggleFilter,
    typeLabel,
    typeGenre,
    setSelectedYear,
    selectedYear,
    selectedTypes,
    selectedGenres,
    clearFilters,
}) => {
    const [showFilsters, setShowFilters] = useState(false)
    const { theme } = useContext(ThemeContext)

    const classContainer = showFilsters && 'show'
    

    return (
        <div className={`filters${theme !== 'light' ? '-dark' : ''}`}>
        <button className={`cta-acc${theme !== 'light' ? '-dark' : ''}`} onClick={() => setShowFilters(currentValue => !currentValue)}><span className="label">Filtrez votre recherche</span> {!showFilsters ? <FilterA className="picto" /> : <FilterB className="picto" />}</button>
          <div className={`filters__container ${classContainer}`}>
           
          {availableTypes?.length > 0 && (

          <div className="filters__card">
            <h3>Selectionnez le type de format :</h3>
            <button type="button" value="all" key='all' onClick={() => toggleFilter('all', 'type')}>Tous les formats</button>
            {availableTypes.map((type) => (
              <button type="button" value={type} key={type} onClick={() => toggleFilter(type, 'type')}>{typeLabel(type)}</button>
            ))}
            <p>Format selectionné : {typeLabel(selectedTypes.map(typeLabel).join(", "))}</p>
          </div>

          )
          }
          {availableGenres?.length > 0 && (
            <div className="filters__card">
            <h3>Selectionnez le genre :</h3>
            <button type="button" value="all" key='all' onClick={() => toggleFilter('all', 'genre')}>Tous les formats</button>
            {availableGenres.map((genre) => (
              <button type="button" value={genre} key={genre} onClick={() => toggleFilter(genre, 'genre')}>{genre}</button>
            ))}
            <p>Genre selectionné : {selectedGenres.map(typeGenre).join(", ")}</p>
          </div>
          )
          }
          
          {availableYears?.length > 0 && (    
            <div className="filters__card">
              <h3>Selectionnez l'année :</h3>
              <select name="years" value={selectedYear} id="years-select" onChange={(e) => setSelectedYear(e.target.value)}>
                <option value="all" key="Toutes les années">Toutes les années</option>             
                {availableYears.map((year) => (
                  <option value={year} key={year}>{year}</option>
                ))}
              </select>
            </div>

          
          )}
          {(selectedYear !== "all" || selectedTypes[0] !== "all" || selectedGenres[0] !== "all") && (
          <button onClick={clearFilters}>
            Réinitialiser les filtres
          </button>
          )}
          </div>
        </div>
    )
}

export default Filters