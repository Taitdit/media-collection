import { useContext } from "react";
import {ThemeContext} from "./context/ThemeContext.jsx"

const RadioFilter = ({filmFilter, setFilmFilter}) => {
    const { theme } = useContext(ThemeContext)
    const arrayFIlter = ["all", "physicalAndDisc", "physical", "disc"]

    return (
        <div className={`radioFilter ${theme !== 'light' ? 'dark' : ''}`}>
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
                        {el === 'all' ? 'Tous les médias' : el === 'physicalAndDisc' ? "Seulement ceux que j'ai" : el==='physical' ? "Seulement ceux que j'ai en DVD ou Blu-ray " : "Seulement ceux que j'ai sur disque"}

                    </label>
                )
            })
            }
        </form>
        </div>

    )
}
export default RadioFilter