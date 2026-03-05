import { useState, useContext } from "react";
import {ThemeContext} from "./context/ThemeContext.jsx"
import FilterA from "./svg/FilterA"
import FilterB from "./svg/FilterB"
import { useSticky } from "./context/StickyContext";

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
    const { fixed } = useSticky()
    const [showFilsters, setShowFilters] = useState(false)
    const { theme } = useContext(ThemeContext)

    const classContainer = showFilsters && 'show'
    const arrayFilter = ['type', 'genre', 'year']

    return (
        <section className="container-filter">
        <div className={`filters${theme !== 'light' ? '-dark' : ''}${fixed ? ' fixed' : ''}`}>
        <button className={`cta-acc${theme !== 'light' ? '-dark' : ''}`} onClick={() => setShowFilters(currentValue => !currentValue)}><span className="label">Filtrez votre recherche</span> {!showFilsters ? <FilterA className="picto" /> : <FilterB className="picto" />}</button>
          <div className={`filters__container ${classContainer}`}>
           
          {arrayFilter.map((f) => {
            const typeFilterOk = availableTypes?.length > 0 && f === 'type'
            const genreFilterOk = availableGenres?.length > 0 && f === 'genre'
            const yearFilterOk = availableYears?.length > 0 && f === 'year'
            const label = f==='type' ? 'le type de format' : f==='genre' ? 'le genre' : "l'année"
            const wichAvailable = f==='type' ? availableTypes : f==='genre' ? availableGenres : availableYears
            const wichSelected  = f==='type' ? selectedTypes : f==='genre' ? selectedGenres : false
            const buttons = () => {
              return f!== 'year' ? 
              <>
              <button className={`cta-tertiary${theme !== 'light' ? '-dark' : ''} ${wichSelected?.includes('all') && 'selected'}`} type="button" value={`all ${f}`} key={`all-to-${f}`} onClick={() => toggleFilter('all', f)}>Tous les {f!=="genre" ? "formats" : "genres"}</button> 
                {wichAvailable.map((a) => (
                  <button className={`cta-tertiary${theme !== 'light' ? '-dark' : ''} ${wichSelected?.includes(a) && 'selected'}`} type="button" value={a} key={`${a}-to-${f}`} onClick={() => toggleFilter(a, f)}>{typeLabel(a)}</button>
                ))}
                <p className="filters__selected">{f=== 'type' ? 'Format(s)' : 'Genre(s)'} selectionné : <b>{
                f!=='type' ? selectedGenres.map(typeGenre).join(", ") : typeLabel(selectedTypes.map(typeLabel).join(", "))
                }</b></p>

              </>
              : 
              <select className={`cta-tertiary${theme !== 'light' ? '-dark' : ''}`} name="years" value={selectedYear} id="years-select" onChange={(e) => setSelectedYear(e.target.value)}>
                <option value="all" key="Toutes les années">Toutes les années</option>             
                {wichAvailable.map((year) => (
                  <option value={year} key={year}>{year}</option>
                ))}
              </select> 
            }
            
            if(typeFilterOk || genreFilterOk || yearFilterOk) {
              return (
              <div key={`card-${f}`} className="filters__card">
                <h3>Selectionnez {label} :</h3>
                <div className="filters__buttons">
                {buttons()}
                </div>

              </div>
              )
            }
            
          })}

          {(selectedYear !== "all" || selectedTypes[0] !== "all" || selectedGenres[0] !== "all") && (
          <button className={`cta-secondary${theme !== 'light' ? '-dark' : ''}`} onClick={() => clearFilters(false)}>
            Réinitialiser les filtres
          </button>
          )}
          </div>
        </div>
        </section>
    )
}

export default Filters