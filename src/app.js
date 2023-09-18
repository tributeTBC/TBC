import React from 'react';
import { Link, animateScroll as scroll } from 'react-scroll';
import './App.css';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <div className="logo">Tribute Token Logo</div>
                <nav>
                    <Link to="story" smooth={true} duration={1000}>Story</Link>
                    <Link to="contract" smooth={true} duration={1000}><i className="fas fa-file-contract"></i> Contract</Link>
                    <Link to="buy" smooth={true} duration={1000}><i className="fas fa-shopping-cart"></i> Buy</Link>
                    <Link to="telegram" smooth={true} duration={1000}><i className="fab fa-telegram"></i> Telegram</Link>
                    <Link to="twitter" smooth={true} duration={1000}><i className="fab fa-twitter"></i> Twitter</Link>
                </nav>
            </header>
            <section id="story" className="content-section">
                <h2>Our Story</h2>
                <p>First part of the Tribute story...</p>
                <p>Second part of the Tribute story...</p>
                <p>Third part of the Tribute story...</p>
            </section>
            {/* ... you can add other sections similarly */}
        </div>
    );
}

export default App;
