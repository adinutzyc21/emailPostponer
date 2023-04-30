import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ButtonAppBar from './components/ButtonAppBar';
import TabBook from './components/TabBook';


ReactDOM.render(
    <React.StrictMode>
        <ButtonAppBar />
        <TabBook />
    </React.StrictMode>,
    document.getElementById('root')
);
