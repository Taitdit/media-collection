const NoResult = ({emptyResult}) => {
    return (
        <>
        {emptyResult && <p>&#128557; Aucun résultat</p>}
        <p>&#128269; Recherchez votre film via la <b>barre de recherche</b></p>
        </>
    )
}

export default NoResult