import ImageSlideshow from "./Imageslideshow";
import ExploreMenu from "./ExploreMenu";
import HotSellers from "./Hotseller";
import OurStory from "./Ourstory";
import Footer from "./Footer";
const Home = ({ onAddToCart }) => {
  return (
    <div>
      <ImageSlideshow />
      <ExploreMenu onAddToCart={onAddToCart} />
      <HotSellers onAddToCart={onAddToCart} />
      <OurStory />
      <Footer/>
    </div>
  );
};

export default Home;
