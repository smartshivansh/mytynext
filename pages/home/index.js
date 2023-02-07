import Home from "./Home/Home"
import SearchBox from "./SearchBox/SearchBox";


export default function Homepage(){

    return <div>
    <Home />
            <div className="container">
              <div className="sticky-top py-2 bg-white" style={{ zIndex: 1 }}>
                <SearchBox />
              </div>
              {/* <Feeds /> */}
            </div>
    </div>
}