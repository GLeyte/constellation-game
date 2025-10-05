import React, { useState, useEffect, useRef } from 'react';

// CSS Styles
const styles = {
  container: {
    width: '100%',
    height: '100vh',
    background: 'linear-gradient(180deg, #1e1b4b 0%, #1e3a8a 50%, #000000 100%)',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  starsBackground: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none'
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(8px)',
    padding: '1rem',
    color: 'white',
    zIndex: 10,
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  headerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  title: {
    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
  },
  message: {
    fontSize: 'clamp(1rem, 2vw, 1.125rem)',
    color: '#fbbf24',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
    animation: 'fadeIn 0.5s ease-in'
  },
  scorePanel: {
    textAlign: 'right',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: '0.75rem',
    borderRadius: '0.5rem',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  score: {
    fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: '0.25rem',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
  },
  constellationCount: {
    fontSize: '0.875rem',
    color: '#93c5fd'
  },
  instructions: {
    position: 'absolute',
    top: '120px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    zIndex: 20,
    maxWidth: 'min(400px, 90vw)',
    textAlign: 'center',
    border: '2px solid rgba(255, 215, 0, 0.3)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    animation: 'slideDown 0.5s ease-out'
  },
  instructionText: {
    marginBottom: '0.5rem',
    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
    lineHeight: '1.5'
  },
  instructionHighlight: {
    color: '#fbbf24',
    fontWeight: 'bold',
    marginTop: '0.5rem'
  },
  gameArea: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    cursor: 'crosshair'
  },
  controlPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(8px)',
    padding: '1rem',
    zIndex: 10,
    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
  },
  controlsContainer: {
    maxWidth: '1024px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center',
    gap: '0.75rem',
    flexWrap: 'wrap'
  },
  button: {
    padding: 'clamp(0.5rem, 2vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  buttonHint: {
    backgroundColor: '#2563eb',
    color: 'white'
  },
  buttonHintHover: {
    backgroundColor: '#1d4ed8',
    transform: 'scale(1.05)',
    boxShadow: '0 4px 15px rgba(37, 99, 235, 0.5)'
  },
  buttonClear: {
    backgroundColor: '#eab308',
    color: 'white'
  },
  buttonClearHover: {
    backgroundColor: '#ca8a04',
    transform: 'scale(1.05)',
    boxShadow: '0 4px 15px rgba(234, 179, 8, 0.5)'
  },
  buttonReset: {
    backgroundColor: '#dc2626',
    color: 'white'
  },
  buttonResetHover: {
    backgroundColor: '#b91c1c',
    transform: 'scale(1.05)',
    boxShadow: '0 4px 15px rgba(220, 38, 38, 0.5)'
  },
  buttonDisabled: {
    backgroundColor: '#4b5563',
    cursor: 'not-allowed',
    opacity: 0.5
  },
  backgroundStar: {
    position: 'absolute',
    borderRadius: '50%',
    backgroundColor: 'white'
  }
};

// CSS Animations
const cssAnimations = `
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.1); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slideDown {
    from { opacity: 0; transform: translate(-50%, -20px); }
    to { opacity: 1; transform: translate(-50%, 0); }
  }
  
  @keyframes glow {
    0%, 100% { filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8)); }
    50% { filter: drop-shadow(0 0 20px rgba(255, 215, 0, 1)); }
  }
  
  .star-glow {
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.8));
  }
  
  .star-connected {
    filter: drop-shadow(0 0 8px rgba(0, 191, 255, 0.9));
  }
  
  .star-selected {
    filter: drop-shadow(0 0 12px rgba(255, 215, 0, 1));
  }
  
  .line-active {
    filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.8));
  }
  
  .line-complete {
    filter: drop-shadow(0 0 8px rgba(0, 191, 255, 0.8));
  }
`;

// Dados das constelações com posições em porcentagem
const constellationData = {
  ursaMajor: {
    name: "Ursa Maior",
    stars: [
      { id: 'um1', x: 60, y: 65, name: 'Dubhe' },
      { id: 'um2', x: 58, y: 80, name: 'Merak' },
      { id: 'um3', x: 47, y: 85, name: 'Phecda' },
      { id: 'um4', x: 42, y: 74, name: 'Megrez' },
      { id: 'um5', x: 33, y: 72, name: 'Alioth' },
      { id: 'um6', x: 27, y: 68, name: 'Mizar' },
      { id: 'um7', x: 15, y: 75, name: 'Alkaid' }
    ],
    connections: [
      ['um1', 'um2'], ['um2', 'um3'], ['um3', 'um4'],
      ['um4', 'um5'], ['um5', 'um6'], ['um6', 'um7'],
      ['um4', 'um1']
    ]
  },
  ursaMinor: {
    name: "Ursa Menor",
    stars: [
      { id: 'umin1', x: 70, y: 30, name: 'Polaris', isPolar: true },
      { id: 'umin2', x: 63, y: 34, name: 'Yildun' },
      { id: 'umin3', x: 57, y: 38, name: 'Epsilon UMi' },
      { id: 'umin4', x: 50, y: 44, name: 'Delta UMi' },
      { id: 'umin5', x: 40, y: 48, name: 'Pherkad' },
      { id: 'umin6', x: 46, y: 50, name: 'Kochab' },
      { id: 'umin7', x: 44, y: 42, name: 'Zeta UMi' }
    ],
    connections: [
      ['umin1', 'umin2'], ['umin2', 'umin3'], ['umin3', 'umin4'],
      ['umin4', 'umin6'], ['umin5', 'umin6'], ['umin5', 'umin7'], 
      ['umin4', 'umin7']
    ]
  }
};

// Componente Estrela
const Star = ({ star, isSelected, isConnected, onClick, isHinted, windowSize }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Calcular tamanhos responsivos baseados no tamanho da janela
  const minDimension = Math.min(windowSize.width, windowSize.height);
  const baseSizeMultiplier = minDimension / 100;
  const baseSize = star.isPolar ? baseSizeMultiplier * 2 : baseSizeMultiplier * 1.2;
  const size = isSelected || isHovered ? baseSize * 1.4 : baseSize;
  
  const starStyle = {
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };
  
  const starClass = isSelected ? 'star-selected' : 
                    isConnected ? 'star-connected' : 
                    'star-glow';
  
  // Calcular posições em pixels baseadas em porcentagem
  const xPos = (star.x * windowSize.width) / 100;
  const yPos = (star.y * windowSize.height) / 100;
  
  return (
    <g
      onClick={() => onClick(star)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={starStyle}
      className={starClass}
    >
      {/* Brilho da estrela polar */}
      {star.isPolar && (
        <>
          {/* <circle
            cx={xPos}
            cy={yPos}
            r={size * 3}
            fill="url(#polarGradient)"
            style={{ animation: 'pulse 2s infinite' }}
            pointerEvents="none"
          /> */}
          <circle
            cx={xPos}
            cy={yPos}
            r={size * 4}
            fill="url(#polarOuterGlow)"
            opacity="0.3"
            pointerEvents="none"
          />
        </>
      )}
      
      {/* Halo de seleção/dica */}
      {(isSelected || isHinted) && (
        <circle
          cx={xPos}
          cy={yPos}
          r={size * 2}
          fill="none"
          stroke={isSelected ? '#FFD700' : '#FFA500'}
          strokeWidth="2"
          opacity="0.6"
          strokeDasharray={isHinted ? "5,5" : "0"}
          style={{ animation: isHinted ? 'pulse 1s infinite' : 'none' }}
          pointerEvents="none"
        />
      )}
      
      {/* Estrela principal */}
      <circle
        cx={xPos}
        cy={yPos}
        r={size}
        fill={star.isPolar ? '#FFD700' : (isConnected ? '#00BFFF' : '#FFFFFF')}
        stroke={isSelected ? '#FFD700' : (isHinted ? '#FFA500' : '#87CEEB')}
        strokeWidth={Math.max(2, size / 5)}
        style={{
          animation: star.isPolar ? 'glow 2s infinite' : 'none'
        }}
      />
      
      {/* Núcleo brilhante */}
      <circle
        cx={xPos}
        cy={yPos}
        r={size / 2.5}
        fill="white"
        opacity="0.9"
        pointerEvents="none"
      />
      
      {/* Nome da estrela */}
      {(isSelected || isHovered || star.isPolar) && (
        <text
          x={xPos}
          y={yPos - size - 12}
          textAnchor="middle"
          fill="white"
          fontSize={Math.max(12, baseSizeMultiplier * 1.5)}
          fontWeight="bold"
          style={{ 
            textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
            pointerEvents: 'none'
          }}
        >
          {star.name}
        </text>
      )}
    </g>
  );
};

// Componente Linha de Conexão
const Connection = ({ start, end, isComplete, windowSize }) => {
  const lineClass = isComplete ? 'line-complete' : 'line-active';
  
  // Calcular posições em pixels
  const x1 = (start.x * windowSize.width) / 100;
  const y1 = (start.y * windowSize.height) / 100;
  const x2 = (end.x * windowSize.width) / 100;
  const y2 = (end.y * windowSize.height) / 100;
  
  const strokeWidth = Math.max(2, Math.min(windowSize.width, windowSize.height) / 300);
  
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={isComplete ? '#00BFFF' : '#FFD700'}
      strokeWidth={strokeWidth}
      opacity={isComplete ? 0.8 : 0.7}
      strokeDasharray={isComplete ? "0" : "8,4"}
      className={lineClass}
      style={{
        transition: 'all 0.5s ease',
        strokeLinecap: 'round'
      }}
    />
  );
};

// Componente Principal do Jogo
const ConstellationGame = () => {
  const [selectedStars, setSelectedStars] = useState([]);
  const [connections, setConnections] = useState([]);
  const [completedConstellations, setCompletedConstellations] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Conecte as estrelas para formar as constelações!");
  const [hintedConstellation, setHintedConstellation] = useState(null);
  const [backgroundStars, setBackgroundStars] = useState([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const svgRef = useRef(null);

  // Atualizar tamanho da janela
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Gerar estrelas de fundo
  useEffect(() => {
    const stars = [];
    const starCount = Math.min(200, Math.floor((windowSize.width * windowSize.height) / 10000));
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        animationDelay: Math.random() * 5,
        animationDuration: 3 + Math.random() * 4
      });
    }
    setBackgroundStars(stars);
    
    // Esconder instruções após 6 segundos
    const timer = setTimeout(() => setShowInstructions(false), 6000);
    return () => clearTimeout(timer);
  }, [windowSize]);

  const handleStarClick = (star) => {
    const lastStar = selectedStars[selectedStars.length - 1];
    
    if (selectedStars.find(s => s.id === star.id)) {
      setSelectedStars([]);
      setConnections([]);
      return;
    }
    
    const newSelectedStars = [...selectedStars, star];
    setSelectedStars(newSelectedStars);
    
    if (lastStar) {
      const newConnection = { start: lastStar, end: star };
      setConnections([...connections, newConnection]);
      checkConstellation(newSelectedStars);
    }
  };

  const checkConstellation = (stars) => {
    Object.values(constellationData).forEach(constellation => {
      if (stars.length === constellation.stars.length) {
        const starIds = stars.map(s => s.id).sort();
        const constellationIds = constellation.stars.map(s => s.id).sort();
        
        if (JSON.stringify(starIds) === JSON.stringify(constellationIds)) {
          completeConstellation(constellation);
        }
      }
    });
  };

  const completeConstellation = (constellation) => {
    if (!completedConstellations.find(c => c.name === constellation.name)) {
      setCompletedConstellations([...completedConstellations, constellation]);
      setScore(score + 100);
      setMessage(`🌟 Parabéns! Você formou a ${constellation.name}!`);
      setSelectedStars([]);
      setConnections([]);
      
      if (completedConstellations.length === 0) {
        setTimeout(() => {
          setMessage("Excelente! Agora forme a outra constelação!");
        }, 3000);
      } else {
        setTimeout(() => {
          setMessage("🎉 Incrível! Você completou todas as constelações!");
        }, 3000);
      }
    }
  };

  const showHint = (constellationName) => {
    const constellation = constellationData[constellationName];
    setHintedConstellation(constellation);
    setMessage(`💡 Mostrando as estrelas da ${constellation.name}`);
    setTimeout(() => {
      setHintedConstellation(null);
      setMessage("Continue conectando as estrelas!");
    }, 3000);
  };

  const resetGame = () => {
    setSelectedStars([]);
    setConnections([]);
    setCompletedConstellations([]);
    setScore(0);
    setMessage("Conecte as estrelas para formar as constelações!");
    setShowInstructions(true);
    setTimeout(() => setShowInstructions(false), 6000);
  };

  const getButtonStyle = (buttonType) => {
    const isHovered = hoveredButton === buttonType;
    const baseStyle = { ...styles.button };
    
    if (buttonType === 'hint1' || buttonType === 'hint2') {
      const isDisabled = (buttonType === 'hint1' && completedConstellations.find(c => c.name === "Ursa Maior")) ||
                        (buttonType === 'hint2' && completedConstellations.find(c => c.name === "Ursa Menor"));
      if (isDisabled) return { ...baseStyle, ...styles.buttonDisabled };
      return isHovered ? { ...baseStyle, ...styles.buttonHint, ...styles.buttonHintHover } : 
                        { ...baseStyle, ...styles.buttonHint };
    }
    
    if (buttonType === 'clear') {
      return isHovered ? { ...baseStyle, ...styles.buttonClear, ...styles.buttonClearHover } : 
                        { ...baseStyle, ...styles.buttonClear };
    }
    
    if (buttonType === 'reset') {
      return isHovered ? { ...baseStyle, ...styles.buttonReset, ...styles.buttonResetHover } : 
                        { ...baseStyle, ...styles.buttonReset };
    }
    
    return baseStyle;
  };

  return (
    <>
      <style>{cssAnimations}</style>
      <div style={styles.container}>
        {/* Estrelas de fundo */}
        <div style={styles.starsBackground}>
          {backgroundStars.map((star, i) => (
            <div
              key={i}
              style={{
                ...styles.backgroundStar,
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
                animation: `twinkle ${star.animationDuration}s ${star.animationDelay}s infinite`,
                boxShadow: `0 0 ${star.size * 2}px white`
              }}
            />
          ))}
        </div>

        {/* Cabeçalho */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div>
              <h1 style={styles.title}>
                <span style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)' }}>🌌</span>
                Jogo das Constelações
              </h1>
              <p style={styles.message}>{message}</p>
            </div>
            <div style={styles.scorePanel}>
              <div style={styles.score}>Pontuação: {score}</div>
              <div style={styles.constellationCount}>
                Constelações: {completedConstellations.length}/2
              </div>
            </div>
          </div>
        </div>

        {/* Instruções */}
        {showInstructions && (
          <div style={styles.instructions}>
            <p style={styles.instructionText}>
              👆 Clique nas estrelas em sequência para conectá-las
            </p>
            <p style={styles.instructionText}>
              ✨ Forme as constelações Ursa Maior e Ursa Menor
            </p>
            <p style={styles.instructionHighlight}>
              ⭐ A Estrela Polar (Polaris) está brilhando!
            </p>
          </div>
        )}

        {/* Área do Jogo */}
        <svg ref={svgRef} style={styles.gameArea}>
          {/* Definições SVG */}
          <defs>
            <radialGradient id="polarGradient">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#FFA500" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="polarOuterGlow">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
            </radialGradient>
            <filter id="blur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
          </defs>
          
          {/* Conexões completadas */}
          {completedConstellations.map(constellation => 
            constellation.connections.map((conn, i) => {
              const start = constellation.stars.find(s => s.id === conn[0]);
              const end = constellation.stars.find(s => s.id === conn[1]);
              return (
                <Connection 
                  key={`${constellation.name}-${i}`} 
                  start={start} 
                  end={end} 
                  isComplete={true}
                  windowSize={windowSize}
                />
              );
            })
          )}
          
          {/* Conexões atuais */}
          {connections.map((conn, i) => (
            <Connection 
              key={i} 
              start={conn.start} 
              end={conn.end} 
              isComplete={false}
              windowSize={windowSize}
            />
          ))}
          
          {/* Estrelas */}
          {Object.values(constellationData).map(constellation =>
            constellation.stars.map(star => {
              const isCompleted = completedConstellations.find(c => c.name === constellation.name);
              const isHinted = hintedConstellation?.name === constellation.name;
              return (
                <Star
                  key={star.id}
                  star={star}
                  isSelected={selectedStars.find(s => s.id === star.id)}
                  isConnected={isCompleted}
                  onClick={handleStarClick}
                  isHinted={isHinted}
                  windowSize={windowSize}
                />
              );
            })
          )}
        </svg>

        {/* Painel de Controles */}
        <div style={styles.controlPanel}>
          <div style={styles.controlsContainer}>
            <button
              onClick={() => showHint('ursaMajor')}
              style={getButtonStyle('hint1')}
              onMouseEnter={() => setHoveredButton('hint1')}
              onMouseLeave={() => setHoveredButton(null)}
              disabled={completedConstellations.find(c => c.name === "Ursa Maior")}
            >
              💡 Dica: Ursa Maior
            </button>
            <button
              onClick={() => showHint('ursaMinor')}
              style={getButtonStyle('hint2')}
              onMouseEnter={() => setHoveredButton('hint2')}
              onMouseLeave={() => setHoveredButton(null)}
              disabled={completedConstellations.find(c => c.name === "Ursa Menor")}
            >
              💡 Dica: Ursa Menor
            </button>
            <button
              onClick={() => { setSelectedStars([]); setConnections([]); }}
              style={getButtonStyle('clear')}
              onMouseEnter={() => setHoveredButton('clear')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              🔄 Limpar Seleção
            </button>
            <button
              onClick={resetGame}
              style={getButtonStyle('reset')}
              onMouseEnter={() => setHoveredButton('reset')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              🎮 Reiniciar Jogo
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConstellationGame;