import Logo3 from "../../../../images/Logo3.png"
import "./logo.css"
const Logo = () => {
    return(
    <div className="logo">
        <div className="logo-container">
            <div className="logo-img">
                <img src={Logo3} alt="logo" width="200 px" />
            </div>
        </div>
    </div>
    )
}

export default Logo