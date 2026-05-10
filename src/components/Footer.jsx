import { useContext } from "react";
import {ThemeContext} from "./context/ThemeContext.jsx"
const Footer = () => {
    const { theme } = useContext(ThemeContext)
    return (
        <footer className={`${theme !== 'light' ? 'dark ' : ''}footer`}>
            <div className="footer__container">

                <div className="footer__content">

                    <div className="footer__about">
                        <h2 className="footer__title">La Médiated</h2>

                        <p className="footer__text">
                            Une médiathèque personnelle créée pour organiser,
                            rechercher et retrouver facilement mes collections
                            culturelles.
                        </p>

                        <p className="footer__made">
                            Projet personnel développé avec passion ❤️
                        </p>
                    </div>

                    <div className="footer__tmdb">
                        <img
                            src="./tmdb-logo.svg"
                            alt="Logo TMDB"
                            height="18"
                        />

                        <p className="small">
                            This product uses the TMDB API but is not endorsed
                            or certified by TMDB.
                        </p>
                    </div>

                </div>

                <div className="footer__bottom">
                    <p className="footer__copy">
                        © 2026 La Médiated — Tous droits réservés
                    </p>
                </div>

            </div>
        </footer>
    )
}

export default Footer