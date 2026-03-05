import { useState, useContext } from "react";
import {ThemeContext} from "./context/ThemeContext.jsx"
import {ListContext} from "./context/ListContext.jsx"
import Loupe from "./svg/Loupe";


const ImgCard = ({popin, title, picture, format }) => {
    const { list } = useContext(ListContext)
    const { theme } = useContext(ThemeContext)

    const [popinPicture, setPopinPicture] = useState(false)
    const [hover, setHover] = useState(false);

    const domain = 'https://image.tmdb.org/t/p/'
    const imgSize = (size) => domain + size + picture
    const size = list ? 'w154' : 'w342'
    return (
        <>
        {popinPicture && 
            <div className="popinPicture" onClick={() => setPopinPicture(false)}>
                <img src={imgSize('original')} alt={title}/>
            </div>
        }
        {popin ? 
            <img className="ImgCard__img" src={imgSize('w154')} alt={title} />

        : 
        <div className={`ImgCard${list ? ' list' : ''}`} onClick={() => setPopinPicture(true)} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
            {hover && <div className={`hover`}><Loupe /></div>}
            {format && <div className={`patch ${format}${theme !== 'light' ? ' dark' : ''}`}>{format}</div>}
            <img className="ImgCard__img" src={imgSize(size)} alt={title} />
        </div>
        }
        </>
    )
}
export default ImgCard