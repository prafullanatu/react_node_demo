import React from 'react';
import Menu from './Menu';

const Layout = ({
    title = "Title", description = "Description",
    className, children }) => {
    return (
        <div className='container-fluid'>
            <Menu />  
        </div>
    );
}

export default Layout;