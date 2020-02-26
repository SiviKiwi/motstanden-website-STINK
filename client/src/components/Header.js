import React from "react"
import styles from "./header.module.css"
import {Link} from "react-router-dom"

import Sidebar from "./sidebar/Sidebar.js"
import LogInPopup from "./popups/LogInPopup.js"

class Header extends React.Component {

    onHeaderTitleClick = () => {
        // Refreshes the entire website and loads the home screen
        window.location.assign(window.location.origin)
    }

    render() {    
        
        return (
            <header className={styles.header}>
                <div className={styles.grid}>
                    <h1 className={styles.headerTitle} >
                        <Link to="/"  onClick={this.onHeaderTitleClick}>
                            Studentorchesteret den Ohmske <span className={styles.green} >Motstanden</span>
                        </Link>
                        
                    </h1>
                    <LogInPopup className={styles.loginButton}/>
                    <Sidebar className={styles.hamburgerButton}/> 
                </div>
            </header>
        )
    }
}

export default Header