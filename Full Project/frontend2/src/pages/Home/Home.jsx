import Header from "../../components/header/Header.jsx";
import Footer from "../../components/footer/Footer.jsx";
import SubHeader from "../../components/header/subHeader/SubHeader.jsx";
import NewsBox from "../../components/grid/NewsBox.jsx";
import NewsGrid from "../../components/grid/NewsGrid.jsx";
import SmallNewsGrid from "../../components/grid/small/SmallNewsGrid.jsx";
import RectangularNewsGrid from "../../components/grid/SmallRectangleGrid/RectangularNewsGrid.jsx";
import Ad from "../../components/ad/Ad.jsx";
import CommentSection from "../comment/CommentSection.jsx";
import {AdProvider} from "../../components/ad/AdContext.jsx";


function Home() {


    return (
        <>

            <Header/>

            <SubHeader/>
            <NewsGrid/>
            <SmallNewsGrid/>
            <RectangularNewsGrid/>
            <SmallNewsGrid/>

            <NewsBox/> <NewsBox/>
            <RectangularNewsGrid/>
            <CommentSection/>
                <AdProvider>
                <Ad/>
                </AdProvider>
                <Footer/>

            </>
            )

            }

            export default Home;