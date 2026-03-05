import { useContext, useEffect, useState } from "react";
import {ListContext} from "./context/ListContext.jsx"
import {ThemeContext} from "./context/ThemeContext.jsx"
import Grille from './svg/Grille'
import Liste from './svg/Liste'
import { useSticky } from "./context/StickyContext";


const RadioFilter = ({ jsonItems, filmFilter, setFilmFilter}) => {
    const { fixed } = useSticky()
    const { theme } = useContext(ThemeContext)
    const { list, toggleList } = useContext(ListContext)
    const arrayFIlter = jsonItems ? ["all", "physical", "disc"] : ["all", "physicalAndDisc", "physical", "disc"]

    useEffect(() => {
        if(jsonItems && filmFilter === 'physicalAndDisc') {
            setFilmFilter("all")
        }

    },[jsonItems])
    return (
        <>
        <div className={`radioFilter ${theme !== 'light' ? 'dark' : ''}${fixed ? ' fixed' : ''}`}>
         <h3>Quels médias afficher ?</h3>
         <form className="radioFilter__filters">
            {arrayFIlter.map((el) => {
                return (
                    <label className="radioFilter__label" key={`filmFilter-${el}`}>
                        <input
                        type="radio"
                        name={`filmFilter-${el}`}
                        value={el}
                        checked={filmFilter === el}
                        onChange={(e) => setFilmFilter(e.target.value)}/>
                        <span className={`falseradio ${el===filmFilter && 'selected'}`}></span>
                        {el === 'all' ? jsonItems ? "Tous les médias que j'ai" : 'Tous les médias recherché' : el === 'physicalAndDisc' ? "Seulement ceux que j'ai" : el==='physical' ? "Seulement ceux que j'ai en DVD ou Blu-ray " : "Seulement ceux que j'ai sur disque"}

                    </label>
                )
            })
            }
        </form>
        <button className="radioFilter__list" onClick={() => toggleList()}>{list ? <Liste className='picto' /> : <Grille className='picto' />}</button>
        </div>
        {fixed && <button className={`scrollTop${theme !== 'light' ? ' dark' : ''}`} onClick={() => window.scrollTo(0, 0)} ><span className="arrow">&#11145;</span><span>Haut</span></button>}
        </>
    )
}
export default RadioFilter