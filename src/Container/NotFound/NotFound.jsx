import React from 'react'
import notFoundImage from '../../assets/Images/Not_Found_Error_Image.jpg'


const NotFound = () => {

    return (
        <>
            <img src={notFoundImage} alt="Not Found" style={{ maxHeight: "20em", maxWidth: "20em", display: "flex", alignItems: "center", margin: "0 auto", marginTop: "10em" }} />
        </>
    )
}

export default NotFound
