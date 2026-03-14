import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import FlipCounter from '../components/FlipCounter';
import Footer from '../components/Footer';
import { getCity, getCityBreakdown } from '../utils/cityLoader';
import { generateReportInconsistencyMailto } from '../utils/emailHelpers';
import './CityDetails.css';

function CityDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [city, setCity] = useState(null);
  const [breakdown, setBreakdown] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showInterpretModal, setShowInterpretModal] = useState(false);

  useEffect(() => {
    const cityData = getCity(slug);
    if (!cityData) {
      // Redirect to home if city not found
      navigate('/');
      return;
    }
    setCity(cityData);
    setBreakdown(getCityBreakdown(slug));
  }, [slug, navigate]);

  if (!city) {
    return null;
  }

  const handleInfoClick = (category) => {
    setSelectedCategory(category);
    setShowInfoModal(true);
  };

  const handleReportClick = (category) => {
    const link = document.createElement('a');
    link.href = generateReportInconsistencyMailto(city.name, category.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate total for percentage visualization
  const total = breakdown.reduce((sum, item) => sum + item.amount, 0);
  const getBackgroundStyle = (amount) => {
    const percentage = (amount / total) * 100;
    return {
      backgroundImage: `linear-gradient(90deg, rgba(80, 180, 15, 0.2) 0%, rgba(80, 180, 15, 0.2) ${percentage}%, transparent ${percentage}%, transparent 100%)`,
    };
  };

  return (
    <div className="city-details-page">
      <button className="back-button" onClick={() => navigate('/')} aria-label="Go back">
        ← Back
      </button>
      <div className="city-details-content">
        {/* Main heading with amount */}
        <div className="main-section">
          <h1 className="main-title">
            You need
            <br />
            <span className="amount-currency">{city.currency}</span><FlipCounter value={city.real_amount} className="amount-highlight" prefix="" />
            <br />
            net to live in
            <br />
            <span className="city-name-display">{city.name}</span>
            <span>{city.flag}</span>
          </h1>
        </div>

        {/* Breakdown cards */}
        <div className="breakdown-section">
          <div className="breakdown-list">
            {breakdown.map((category, index) => (
              <div
                key={category.id}
                className="breakdown-item"
                style={{
                  ...getBackgroundStyle(category.amount),
                  animation: `slideInRow 0.6s ease-out forwards`,
                  animationDelay: `${1.7 + index * 0.15}s`,
                }}
              >
                <span className="category-name">{category.name}</span>
                <span className="category-amount">{category.currency}{category.amount}</span>
                <div className="category-actions">
                  <button
                    className="action-button info-button"
                    onClick={() => handleInfoClick(category)}
                    title="More information"
                    aria-label={`Info about ${category.name}`}
                  >
                    ?
                  </button>
                  <button
                    className="action-button report-button"
                    onClick={() => handleReportClick(category)}
                    title="Report inaccuracy"
                    aria-label={`Report issue with ${category.name}`}
                  >
                    !
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Numbeo comparison */}
        <div className="numbeo-section">
          <p className="numbeo-text">
            Numbeo says you only need
            <br />
            <div className="numbeo-amount-wrapper">
              <div className="numbeo-amount-inner">
                <span className="currency-symbol">{city.currency}</span><span className="numbeo-amount">{city.numbeo_amount?.toLocaleString('en-US')}</span>
              </div>
              <span className="numbeo-percentage">(-{Math.round(city.real_amount - city.numbeo_amount)})</span>
            </div>
          </p>

          <button
            className="interpret-button"
            onClick={() => setShowInterpretModal(true)}
          >
            How to interpret these results?
          </button>
        </div>
      </div>

      {/* Info Modal */}
      <Modal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title={selectedCategory?.name}
      >
        <p>{selectedCategory?.explanation}</p>
      </Modal>

      {/* Interpret Results Modal */}
      <Modal
        isOpen={showInterpretModal}
        onClose={() => setShowInterpretModal(false)}
        title="How to interpret these results?"
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

export default CityDetails;
