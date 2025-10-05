import React, { useState, useEffect } from 'react';

// Dados das constelações
const constellationData = {
  ursaMajor: {
    name: "Ursa Maior",
    stars: [
      { id: 'um1', x: 54, y: 80, name: 'Dubhe' },
      { id: 'um2', x: 53, y: 70, name: 'Merak' },
      { id: 'um3', x: 43, y: 74, name: 'Phecda' },
      { id: 'um4', x: 42, y: 78, name: 'Megrez' },
      { id: 'um5', x: 35, y: 82, name: 'Alioth' },
      { id: 'um6', x: 27, y: 90, name: 'Mizar' },
      { id: 'um7', x: 20, y: 84, name: 'Alkaid' }
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
      { id: 'umin1', x: 70, y: 20, name: 'Polaris', isPolar: true },
      { id: 'umin2', x: 63, y: 24, name: 'Yildun' },
      { id: 'umin3', x: 57, y: 28, name: 'Epsilon UMi' },
      { id: 'umin4', x: 50, y: 44, name: 'Delta UMi' },
      { id: 'umin5', x: 40, y: 48, name: 'Pherkad' },
      { id: 'umin6', x: 46, y: 50, name: 'Kochab' },
      { id: 'umin7', x: 44, y: 42, name: 'Zeta UMi' }
    ],
    connections: [
      ['umin1', 'umin2'], ['umin2', 'umin3'], ['umin3', 'umin4'],
      ['umin4', 'umin5'], ['umin5', 'umin6'], ['umin6', 'umin7'],
      ['umin7', 'umin1']
    ]
  }
};

// Componente Estrela
const Star = ({ star, isSelected, isConnected, onClick, isHinted }) => {
  const baseSize = star.isPolar ? 20 : 12;
  const size = isSelected ? baseSize + 4 : baseSize;
  
  return (
    <g
      onClick={() => onClick(star)}
      style={{ cursor: 'pointer' }}
    >
      {/* Brilho da estrela polar */}
      {star.isPolar && (
        <circle
          cx={star.x + '%'}
          cy={star.y + '%'}
          r="25"
          fill="url(#polarGlow)"
          className="animate-pulse"
          style={{ pointerEvents: 'none' }}
        />
      )}
      
      {/* Estrela principal */}
      <circle
        cx={star.x + '%'}
        cy={star.y + '%'}
        r={size}
        fill={star.isPolar ? '#FFD700' : (isConnected ? '#4A90E2' : '#FFFFFF')}
        stroke={isSelected ? '#FFD700' : (isHinted ? '#FFD700' : '#FFFFFF')}
        strokeWidth={isSelected || isHinted ? '3' : '1'}
        opacity={isConnected ? 1 : 0.7}
        className={star.isPolar ? 'animate-pulse' : ''}
        style={{
          filter: isSelected || star.isPolar ? 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8))' : 
                  isConnected ? 'drop-shadow(0 0 5px rgba(74, 144, 226, 0.8))' : 'none',
          transition: 'all 0.3s ease'
        }}
      />
      
      {/* Nome da estrela (aparece ao passar o mouse) */}
      <text
        x={star.x + '%'}
        y={(star.y - 3) + '%'}
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="10"
        opacity={isSelected || star.isPolar ? 1 : 0}
        style={{ 
          pointerEvents: 'none',
          transition: 'opacity 0.3s ease'
        }}
      >
        {star.name}
      </text>
    </g>
  );
};

// Componente Linha de Conexão
const Connection = ({ start, end, isComplete }) => (
  <line
    x1={start.x + '%'}
    y1={start.y + '%'}
    x2={end.x + '%'}
    y2={end.y + '%'}
    stroke={isComplete ? '#4A90E2' : '#FFD700'}
    strokeWidth="2"
    opacity={isComplete ? 1 : 0.8}
    strokeDasharray={isComplete ? "0" : "5,5"}
    style={{
      filter: 'drop-shadow(0 0 3px rgba(74, 144, 226, 0.6))',
      transition: 'all 0.5s ease'
    }}
  />
);

// Componente Principal do Jogo
const ConstellationGame = () => {
  const [selectedStars, setSelectedStars] = useState([]);
  const [connections, setConnections] = useState([]);
  const [completedConstellations, setCompletedConstellations] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Conecte as estrelas para formar as constelações!");
  const [hintedConstellation, setHintedConstellation] = useState(null);
  const [backgroundStars, setBackgroundStars] = useState([]);

  // Gerar estrelas de fundo
  useEffect(() => {
    const stars = [];
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2
      });
    }
    setBackgroundStars(stars);
  }, []);

  const handleStarClick = (star) => {
    const lastStar = selectedStars[selectedStars.length - 1];
    
    if (selectedStars.find(s => s.id === star.id)) {
      // Se clicar em uma estrela já selecionada, limpar seleção
      setSelectedStars([]);
      setConnections([]);
      return;
    }
    
    const newSelectedStars = [...selectedStars, star];
    setSelectedStars(newSelectedStars);
    
    if (lastStar) {
      const newConnection = { start: lastStar, end: star };
      setConnections([...connections, newConnection]);
      
      // Verificar se completou uma constelação
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
      setMessage(`Parabéns! Você formou a ${constellation.name}! 🌟`);
      setSelectedStars([]);
      setConnections([]);
      
      if (completedConstellations.length === 0) {
        setTimeout(() => {
          setMessage("Agora tente formar a outra constelação!");
        }, 3000);
      } else {
        setTimeout(() => {
          setMessage("🎉 Você completou todas as constelações! Parabéns!");
        }, 3000);
      }
    }
  };

  const showHint = (constellationName) => {
    const constellation = constellationData[constellationName];
    setHintedConstellation(constellation);
    setTimeout(() => setHintedConstellation(null), 3000);
  };

  const resetGame = () => {
    setSelectedStars([]);
    setConnections([]);
    setCompletedConstellations([]);
    setScore(0);
    setMessage("Conecte as estrelas para formar as constelações!");
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-black relative overflow-hidden">
      {/* Definições SVG */}
      <svg width="0" height="0">
        <defs>
          <radialGradient id="polarGlow">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFD700" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* Estrelas de fundo */}
      <div className="absolute inset-0">
        {backgroundStars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>

      {/* Cabeçalho do Jogo */}
      <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 p-4 text-white">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">🌌 Jogo das Constelações</h1>
            <p className="text-lg">{message}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold mb-2">Pontuação: {score}</div>
            <div className="text-sm">
              Constelações: {completedConstellations.length}/2
            </div>
          </div>
        </div>
      </div>

      {/* Área do Jogo */}
      <svg className="absolute inset-0 w-full h-full" style={{ cursor: 'crosshair' }}>
        {/* Conexões completadas */}
        {completedConstellations.map(constellation => 
          constellation.connections.map((conn, i) => {
            const start = constellation.stars.find(s => s.id === conn[0]);
            const end = constellation.stars.find(s => s.id === conn[1]);
            return <Connection key={`${constellation.name}-${i}`} start={start} end={end} isComplete={true} />;
          })
        )}
        
        {/* Conexões atuais */}
        {connections.map((conn, i) => (
          <Connection key={i} start={conn.start} end={conn.end} isComplete={false} />
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
              />
            );
          })
        )}
      </svg>

      {/* Controles */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4">
        <div className="max-w-4xl mx-auto flex justify-center gap-4">
          <button
            onClick={() => showHint('ursaMajor')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            disabled={completedConstellations.find(c => c.name === "Ursa Maior")}
          >
            💡 Dica: Ursa Maior
          </button>
          <button
            onClick={() => showHint('ursaMinor')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            disabled={completedConstellations.find(c => c.name === "Ursa Menor")}
          >
            💡 Dica: Ursa Menor
          </button>
          <button
            onClick={() => { setSelectedStars([]); setConnections([]); }}
            className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
          >
            🔄 Limpar Seleção
          </button>
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            🎮 Reiniciar Jogo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConstellationGame;