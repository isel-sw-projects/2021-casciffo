import React from 'react';
import logo from './logo.svg';
import './App.css';
import SearchComponent from "./view/SearchComponent";
import TracksModel from "./model/TracksModel";
import {Navbar} from "react-bootstrap";
import {ReactComponent} from "*.svg";
import {Router} from "workbox-routing";

function App() {
  return (
      <ReactComponent>
        <Navbar>

        </Navbar>
        <SearchComponent model={new TracksModel()}/>
      </ReactComponent>
);
}

export default App;
