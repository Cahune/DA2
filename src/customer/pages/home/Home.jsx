import Navbar from "../../navbar/Navbar";
import Header from "../../header/Header";
import Recommend from "./recommend/Recommend";
import Logo from "./logo/Logo";
import Email from "../../email/Email";
import Footer from "../../footer/Footer";
import "./home.css";
import Introduce from "./introduce/Introduce";

const Home = () => {

    return (
        <div>
            <Navbar />
            <Header showTitle={true} />
            <div className="home">
                <div className="home-container">
                    <h1 className="home-title">Điểm đến đang thịnh hành</h1>
                    <h3 className="home-describe">Du khách tìm kiếm về Việt Nam cũng đặt chỗ ở những nơi này</h3>   
                    <Recommend />
                    <Logo />
                    <Introduce />
                    <Email />
                    <Footer />
                </div>
            </div>

        </div>
    )
}

export default Home