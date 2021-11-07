import React from 'react';
import logo from './logo.svg';
import './App.css';
import SearchComponent from "./view/SearchComponent";
import TracksModel from "./model/TracksModel";

function App() {
  return (
      <SearchComponent model={new TracksModel()}/>
  );
}

export default App;
