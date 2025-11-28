import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAnimating, setIsAnimating] = useState(false);

  // Sample data with more Dzongkha phrases
  const sampleFlashcards = [
    {
      id: 1,
      dzongkha: 'ཀུང་ཌྲུ',
      english: 'Hello',
      pronunciation: 'Kuzu zangpo la',
      category: 'Greetings'
    },
    {
      id: 2,
      dzongkha: 'བཀྲ་ཤིས་བདེ་ལེགས།',
      english: 'Blessings and good luck',
      pronunciation: 'Tashi delek',
      category: 'Greetings'
    },
    {
      id: 3,
      dzongkha: 'ཁ་རྗེ་ག་དེ་རེད།',
      english: 'What is your name?',
      pronunciation: 'Chhoe gi minga ga chi mo?',
      category: 'Questions'
    },
    {
      id: 4,
      dzongkha: 'ང་ཚོ་......ལ་སྤྲོ་པོ་ཡིན།',
      english: 'My name is...',
      pronunciation: 'Nga... la ringochen',
      category: 'Basics'
    },
    {
      id: 5,
      dzongkha: 'ཐུགས་རྗེ་ཆེ།',
      english: 'Thank you',
      pronunciation: 'Kadrin cheyla',
      category: 'Greetings'
    },
    {
      id: 6,
      dzongkha: 'ག་པ་ཡེ་ཡོད།',
      english: 'How are you?',
      pronunciation: 'Ga de bay yoe?',
      category: 'Questions'
    },
    {
      id: 7,
      dzongkha: 'ལེགས་སོ།',
      english: 'Goodbye',
      pronunciation: 'Legso',
      category: 'Greetings'
    },
    {
      id: 8,
      dzongkha: 'ཅི་རེད།',
      english: 'What is this?',
      pronunciation: 'Chi re?',
      category: 'Questions'
    }
  ];

  useEffect(() => {
    loadFlashcards();
  }, []);

  useEffect(() => {
    const uniqueCategories = ['All', ...new Set(flashcards.map(card => card.category))];
    setCategories(uniqueCategories);
  }, [flashcards]);

  const loadFlashcards = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/flashcards');
      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.log('Using sample data');
      setFlashcards(sampleFlashcards);
    }
  };

  const filteredCards = selectedCategory === 'All' 
    ? flashcards 
    : flashcards.filter(card => card.category === selectedCategory);

  const currentCard = filteredCards[currentIndex];

  const handleNext = () => {
    if (filteredCards.length <= 1) return;
    
    setIsAnimating(true);
    setIsFlipped(false);
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
      setIsAnimating(false);
    }, 300);
  };

  const handlePrev = () => {
    if (filteredCards.length <= 1) return;
    
    setIsAnimating(true);
    setIsFlipped(false);
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
      setIsAnimating(false);
    }, 300);
  };

  const handleFlip = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsFlipped(!isFlipped);
      setIsAnimating(false);
    }, 300);
  };

  const handleKnow = () => {
    setScore(prev => prev + 1);
    handleNext();
  };

  const handleReset = () => {
    setScore(0);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleInitialize = async () => {
    try {
      await fetch('http://localhost:5001/api/init');
      await loadFlashcards();
      handleReset();
    } catch (error) {
      console.log('Initialization failed');
    }
  };

  if (!currentCard) {
    return (
      <div className="app">
        <div className="loading">
          <h1>Dzongkha Master</h1>
          <p>Loading your learning journey...</p>
          <button className="btn-primary" onClick={handleInitialize}>
            Load Sample Data
          </button>
        </div>
      </div>
    );
  }

  const progress = filteredCards.length > 0 ? ((currentIndex + 1) / filteredCards.length) * 100 : 0;
  const mastery = filteredCards.length > 0 ? Math.round((score / filteredCards.length) * 100) : 0;

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="title-section">
            <h1>🇧🇹 Dzongkha Master</h1>
            <p>Learn the beautiful language of Bhutan</p>
          </div>
          
          <div className="stats">
            <div className="stat">
              <span className="number">{filteredCards.length}</span>
              <span className="label">Cards</span>
            </div>
            <div className="stat">
              <span className="number">{score}</span>
              <span className="label">Mastered</span>
            </div>
            <div className="stat">
              <span className="number">{mastery}%</span>
              <span className="label">Progress</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        {/* Controls */}
        <div className="controls">
          <div className="category-selector">
            <label>Filter by category:</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="progress">
            <span>Card {currentIndex + 1} of {filteredCards.length}</span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Flashcard */}
        <div className="flashcard-container">
          <div 
            className={`flashcard ${isFlipped ? 'flipped' : ''} ${isAnimating ? 'animating' : ''}`}
            onClick={handleFlip}
          >
            <div className="flashcard-inner">
              {/* Front Side */}
              <div className="flashcard-front">
                <div className="card-badge">{currentCard.category}</div>
                <div className="dzongkha-text">{currentCard.dzongkha}</div>
                <div className="pronunciation">{currentCard.pronunciation}</div>
                <div className="hint">Click to reveal translation</div>
              </div>
              
              {/* Back Side */}
              <div className="flashcard-back">
                <div className="card-badge">{currentCard.category}</div>
                <div className="english-text">{currentCard.english}</div>
                <div className="pronunciation">{currentCard.pronunciation}</div>
                <div className="original">{currentCard.dzongkha}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="actions">
          <button 
            className="btn-secondary" 
            onClick={handlePrev}
            disabled={filteredCards.length <= 1}
          >
            ← Previous
          </button>
          
          <button className="btn-flip" onClick={handleFlip}>
            {isFlipped ? 'Show Dzongkha' : 'Show English'}
          </button>
          
          <button className="btn-success" onClick={handleKnow}>
            ✓ I Know This
          </button>
          
          <button 
            className="btn-secondary" 
            onClick={handleNext}
            disabled={filteredCards.length <= 1}
          >
            Next →
          </button>
        </div>

        {/* Dashboard */}
        <div className="dashboard">
          <div className="mastery">
            <h3>Learning Progress</h3>
            <div className="mastery-circle">
              <div className="circle-bg"></div>
              <div 
                className="circle-progress" 
                style={{ transform: `rotate(${mastery * 3.6}deg)` }}
              ></div>
              <div className="circle-text">
                <span>{mastery}%</span>
                <small>Mastered</small>
              </div>
            </div>
          </div>
          
          <div className="tools">
            <h3>Tools</h3>
            <button className="btn-warning" onClick={handleReset}>
              Reset Progress
            </button>
            <button className="btn-danger" onClick={handleInitialize}>
              Reload Data
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Dzongkha Master • Embrace the Language of Thunder Dragon</p>
      </footer>
    </div>
  );
};

export default App;