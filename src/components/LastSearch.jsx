const LastSearch = ({lastSearch, clearMoovie, darkmode}) => {
    return (
        <div className="lastSearch">
            <p className="lastSearch__label" aria-label={`Votre recherche pour : ${lastSearch}`}>Votre recherche pour : <b>{lastSearch}</b></p>
            <button className={`cta-primary${darkmode}`} onClick={clearMoovie}>Supprimer la recherche</button>
        </div>
    )
}   
export default LastSearch

