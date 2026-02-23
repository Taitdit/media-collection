import { useState } from "react";

const ImgCard = ({title, picture }) => {
    const [popinPicture, setPopinPicture] = useState(false)
    const domain = 'https://image.tmdb.org/t/p/'
    const imgSize = (size) => domain + size + picture
    return (
        <>
        {popinPicture && 
            <div className="popinPicture" onClick={() => setPopinPicture(false)}>
                <img src={imgSize('original')} alt={title.fr}/>
            </div>
        }

        <img className="card_img" src={imgSize('w154')} alt={title.fr} onClick={() => setPopinPicture(true)}/>
        </>
    )
}
export default ImgCard