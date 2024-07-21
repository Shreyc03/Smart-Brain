import React from "react";
import Tilt from 'react-parallax-tilt';
import brain from './brain.png'
import './Logo.css'

const Logo = () => {
    return (
        <div className="ma4 mt0">
            <Tilt className="br2 shadow-2 logo" scale = '1.1' style={{ height: 150, width: 150, backgroundColor: 'darkgreen' }}>
                <div className="Tilt-inner pa3">
                    <img alt = "logo" src = {brain} style = {{paddingTop: '5px', height: 100, width: 100}}></img>
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;