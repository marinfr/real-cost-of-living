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

    // Update document title
    document.title = `Real Cost of Living in ${cityData.name} | Real Cost of Living Calculator`;

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = `https://realcostofliving.cc/cities/${slug}`;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = `Calculate the real cost of living in ${cityData.name}. Detailed breakdown of housing, utilities, food, transportation, and more.`;

    // Update OG tags
    const updateOGTag = (property, content) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    updateOGTag('og:title', `Real Cost of Living in ${cityData.name}`);
    updateOGTag('og:description', `Detailed breakdown of housing, utilities, food, transportation, and more.`);
    updateOGTag('og:url', `https://realcostofliving.cc/cities/${slug}`);

    // Update Twitter tags
    const updateTwitterTag = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = name;
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    updateTwitterTag('twitter:title', `Real Cost of Living in ${cityData.name}`);
    updateTwitterTag('twitter:description', `Detailed breakdown of housing, utilities, food, transportation, and more.`);
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
            net monthly to live in
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
        <div dangerouslySetInnerHTML={{ __html: selectedCategory?.explanation }} />
      </Modal>

      {/* Interpret Results Modal */}
      <Modal
        isOpen={showInterpretModal}
        onClose={() => setShowInterpretModal(false)}
        title="How to interpret these results?"
      >
        <p>
          If you earn more than the calculated amount, you may consider yourself relatively secure. However, it is important to recognize that this level of comfort exists within an economic system in which many others can only manage by accepting lower standards — in housing, food, consumer goods, finances, leisure, and working conditions.
        </p>
        <p>
          A large part of the problem is the widespread <strong>illusion of affordability</strong>. Markets are saturated with low-quality options designed to fit “any budget”, creating the impression that basic needs remain accessible to everyone. As a result, individuals are often led to believe that financial struggle is primarily the result of personal failure rather than structural conditions.
        </p>
        <p>
          Consider a simple thought experiment: imagine that governments suddenly banned unsafe housing, poor-quality goods, toxic food, and exploitative labour practices. Overnight, a significant portion of the population would find themselves unable to afford what would then be considered the minimum acceptable standard of living. Not because their needs changed, but because the system currently relies on the availability of lower standards to maintain the appearance of affordability.
        </p>
        <p>
          These results are not intended to prescribe solutions or assign blame. They are meant as a reality check — a tool to better understand the gap between <strong>decent living</strong> and what many people can realistically afford today.
        </p>
        <p>
          Awareness is the first step toward meaningful change.
        </p>
      </Modal>

      <Footer />
    </div>
  );
}

export default CityDetails;
