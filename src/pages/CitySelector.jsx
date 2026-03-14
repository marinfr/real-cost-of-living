import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import Footer from '../components/Footer';
import { getCitiesList } from '../utils/cityLoader';
import { generateCityNotFoundMailto } from '../utils/emailHelpers';
import './CitySelector.css';

function CitySelector() {
  const [cities, setCities] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showWhyModal, setShowWhyModal] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Load cities list from cache
    const citiesList = getCitiesList();
    setCities(citiesList.sort((a, b) => a.name.localeCompare(b.name)));
  }, []);

  // Close dropdown when clicking away
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handleSelectCity = (slug) => {
    navigate(`/cities/${slug}`);
  };

  const handleCityNotFound = () => {
    if (searchInput.trim()) {
      const link = document.createElement('a');
      link.href = generateCityNotFoundMailto(searchInput);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // Close dropdown after email is triggered
      setTimeout(() => setShowDropdown(false), 100);
    }
  };

  return (
    <div className="city-selector-page">
      <div className="city-selector-content">
        {/* Why modal link */}
        <button
          className="why-button"
          onClick={() => setShowWhyModal(true)}
        >
          Why does this calculator exist?
        </button>

        {/* Main heading */}
        <h1 className="main-heading">
          The real cost<br />of living in:
        </h1>

        {/* City search input */}
        <div className="city-search-container" ref={dropdownRef}>
          <input
            type="text"
            className="city-search-input"
            placeholder="type your city"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
          />

          {/* Dropdown list */}
          {showDropdown && (
            <div className="city-dropdown">
              {filteredCities.length > 0 ? (
                <>
                  <ul className="city-list">
                    {filteredCities.map((city) => (
                      <li key={city.slug}>
                        <button
                          className="city-option"
                          onClick={() => {
                            handleSelectCity(city.slug);
                            setShowDropdown(false);
                          }}
                        >
                          <span className="city-flag">{city.flag}</span>
                          <span className="city-name">{city.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  {searchInput.trim() && (
                    <button
                      className="suggest-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCityNotFound();
                      }}
                    >
                      Can't find your city?
                    </button>
                  )}
                </>
              ) : (
                <div className="city-not-found">
                  {searchInput && (
                    <>
                      <p>No results found for "{searchInput}"</p>
                      <button
                        className="suggest-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCityNotFound();
                        }}
                      >
                        Can't find your city?
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Why Modal */}
      <Modal
        isOpen={showWhyModal}
        onClose={() => setShowWhyModal(false)}
        title="Why does this calculator exist?"
      >
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </Modal>

      <Footer />
    </div>
  );
}

export default CitySelector;
