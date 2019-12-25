import React, { Component } from 'react';

class Navbar extends Component {

  render() {
    return (
      // <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
      //   <a
      //     className="navbar-brand col-sm-3 col-md-2 mr-0"
      //     href="http://www.dappuniversity.com/bootcamp"
      //     target="_blank"
      //     rel="noopener noreferrer"
      //   >
      //     Dapp Marketplace with IPFS
      //   </a>
      //   <ul className="navbar-nav px-3">
      //     <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
      //       <small className="text-white"><span id="account">{this.props.account}</span></small>
      //     </li>
      //   </ul>
      // </nav>

     <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="App.js">Home</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <a className="nav-link" href="AddMusic.js">Add Music <span className="sr-only">(current)</span></a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Stream Music</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Buy Music</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">View Music Stats</a>
          </li>
        </ul>
      </div>
    </nav>
    );
  }
}

export default Navbar;
