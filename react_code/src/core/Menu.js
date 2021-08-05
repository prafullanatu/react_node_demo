import React from "react";

import { 
    useHistory,
    useLocation
} from "react-router-dom";

const Menu = ({
    className, children }) => {
    const history = useHistory();
    const logout = () => {
        /* eslint-disable */
        /* eslint-enable */

            localStorage.clear();
            history.push("/login");
        };
        const location = useLocation();
        //destructuring pathname from location
    const { pathname } = location;

    //Javascript split method to get the name of the path in array
    const splitLocation = pathname.split("/");
    
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">

                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarText"
                    aria-controls="navbarText"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav mr-auto">
                        <li className={splitLocation[1] === "dashboard" ? "nav-item active" : "nav-item"}>
                            <a className="nav-link" href="/dashboard">
                                Dashboard <span className="sr-only">(current)</span>
                            </a>
                        </li>
                        <li className={splitLocation[1] === "users" ? "nav-item active" : "nav-item"}>
                            <a className="nav-link" href="/users">
                                Users <span className="sr-only">(current)</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <span
                                className="nav-link cursor-pointer"
                                onClick={() => logout()}
                            >
                                Logout
            </span>
                        </li>
                    </ul>
                </div>
            </nav>
            </div>
    );

}

export default Menu;