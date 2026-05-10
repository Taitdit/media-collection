import { Link } from "react-router-dom";
import { useContext } from "react";
import {ThemeContext} from "../components/context/ThemeContext.jsx"


const Home = () => {
    const { theme } = useContext(ThemeContext)
    const darkmode = theme !== 'light' ? '-dark' : ''
    
    return (
        <main className={`app${darkmode}`}>
            <div className="containerHome">
                <h1>Bienvenue sur La Médiated, ma médiathèque personnelle.</h1>
                 <p>
                    <b>La Médiated</b> est ma médiathèque personnelle, pensée pour
                    centraliser et organiser mes collections culturelles.
                </p>

                <p>
                    Ce projet est né d’un besoin simple : <b>me faciliter la vie lors des brocantes, braderies et achats
                    d’occasion
                    </b>, en me permettant de vérifier rapidement si je possède déjà un <b>DVD</b>, un <b>Blu-ray</b> ou un <b>jeu de société</b>.
                </p>

                <p>
                    Au-delà de l’inventaire, <b>La Médiated</b> m’aide aussi à <b>choisir quoi regarder ou à quoi jouer</b>, en rendant la recherche
                    dans mes propres collections plus rapide et plus agréable.
                </p>

                <p>
                    Par la suite, un espace dédié aux <b>livres</b> viendra compléter le
                    projet afin de centraliser encore davantage toutes mes collections.
                </p>
            </div>
            <div className={`${theme !== 'light' ? 'dark ' : ''} containerHome`}>
                <Link className={`${theme !== 'light' ? 'dark ' : ''} home__card`} to='/films-et-series' title='Film et Série'>
                    <h3>🎬 <b>Films & Séries</b></h3>

                    <p>
                        Recherchez un <b>film</b>, une <b>série</b>, un <b>animé</b> ou un <b>téléfilm</b> et vérifiez instantanément si je
                        le possède en version <b>physique</b> ou <b>numérique</b>.
                    </p>
                </Link>
                <Link className={`${theme !== 'light' ? 'dark ' : ''} home__card`} to='/jeux-de-societe' title='Film et Série'>
                    <h3>🎲 <b>Jeux de société</b></h3>

                    <p>
                        Retrouvez ma collection de <b>jeux de société</b>, leurs <b>extensions</b> et les différentes éditions disponibles dans ma
                        ludothèque.
                    </p>
                </Link>
                <div className={`${theme !== 'light' ? 'dark ' : ''} home__card disabled`}>
                    <h3>📚 <b>Livres</b></h3>

                    <p>
                        Une future section dédiée aux <b>livres</b> viendra prochainement
                        compléter <b>La Médiated</b>.
                    </p>
                </div>
            </div>
        </main>
    )

}

export default Home 
