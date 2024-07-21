import React from "react";
import './ImageLinkForm.css'

const ImageLinkForm = ({OnInputChange, OnSubmit}) => {
    return (
        <div>
            <p className="f3">
                {'This Brain will detect faces in your pictures, give it a try !!!'}
            </p>
            <div className="center">
                <div className="pa4 br3 shadow-5 form center">
                    <input className="f4 pa2 w-70 center" type="text" onChange={OnInputChange}></input>
                    <button className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple" onClick={OnSubmit}>Detect</button>
                </div>
            </div>
        </div>
    );
}

export default ImageLinkForm;