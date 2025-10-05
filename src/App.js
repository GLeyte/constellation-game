import React, { useState, useEffect } from 'react';

// Dados das constelações com posições ajustadas
const constellationData = {
  ursaMajor: {
    name: "Ursa Maior",
    stars: [
      { id: 'um1', x: 540, y: 800, name: 'Dubhe' },
      { id: 'um2', x: 530, y: 900, name: 'Merak' },
      { id: 'um3', x: 430, y: 860, name: 'Phecda' },
      { id: 'um4', x: 420, y: 820, name: 'Megrez' },
      { id: 'um5', x: 350, y: 780, name: 'Alioth' },
      { id: 'um6', x: 270, y: 700, name: 'Mizar' },
      { id: 'um7', x: 200, y: 760, name: 'Alkaid' }
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
      { id: 'umin1', x: 700, y: 200, name: 'Polaris', isPolar: true },
      { id: 'umin2', x: 630, y: 240, name: 'Yildun' },
      { id: 'umin3', x: 570, y: 280, name: 'Epsilon UMi' },
      { id: 'umin4', x: 500, y: 440, name: 'Delta UMi' },
      { id: 'umin5', x: 400, y: 480, name: 'Pherkad' },
      { id: 'umin6', x: 460, y: 500, name: 'Kochab' },
      { id: 'umin7', x: 440, y: 420, name: 'Zeta UMi' }
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
  const [isHovered, setIsHovered] = useState(false);
  const baseSize = star.isPolar ? 16 : 10;
  const size = isSelected || isHovered ? baseSize + 4 : baseSize;
  
  return (
    <g
      onClick={() => onClick(star)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: 'pointer' }}
    >
      {/* Brilho da estrela polar */}
      {star.isPolar && (
        <circle
          cx={star.x}
          cy={star.y}
          r="30"
          fill="url(#polarGlow)"
          className="animate-pulse"
          style={{ pointerEvents: 'none' }}
        />
      )}
      
      {/* Halo de seleção */}
      {(isSelected || isHinted) && (
        <circle
          cx={star.x}
          cy={star.y}
          r={size + 8}
          fill="none"
          stroke={isSelected ? '#FFD700' : '#FFA500'}
          strokeWidth="2"
          opacity="0.5"
          style={{ pointerEvents: 'none' }}
        />
      )}
      
      {/* Estrela principal */}
      <circle
        cx={star.x}
        cy={star.y}
        r={size}
        fill={star.isPolar ? '#FFD700' : (isConnected ? '#00BFFF' : '#FFFFFF')}
        stroke={isSelected ? '#FFD700' : (isHinted ? '#FFA500' : '#B0E0E6')}
        strokeWidth={isSelected || isHinted ? '3' : '2'}
        opacity={1}
        className={star.isPolar ? 'animate-pulse' : ''}
      />
      
      {/* Ponto central brilhante */}
      <circle
        cx={star.x}
        cy={star.y}
        r={size / 3}
        fill={star.isPolar ? '#FFFFFF' : (isConnected ? '#FFFFFF' : '#E0FFFF')}
        opacity={0.9}
        style={{ pointerEvents: 'none' }}
      />
      
      {/* Nome da estrela */}
      {(isSelected || isHovered || star.isPolar) && (
        <text
          x={star.x}
          y={star.y - size - 10}
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="12"
          fontWeight="bold"
          style={{ 
            pointerEvents: 'none',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
          }}
        >
          {star.name}
        </text>
      )}
    </g>
  );
};

// Componente Linha de Conexão
const Connection = ({ start, end, isComplete }) => (
  <line
    x1={start.x}
    y1={start.y}
    x2={end.x}
    y2={end.y}
    stroke={isComplete ? '#00BFFF' : '#FFD700'}
    strokeWidth="3"
    opacity={isComplete ? 0.8 : 0.6}
    strokeDasharray={isComplete ? "0" : "10,5"}
    style={{
      filter: isComplete ? 'drop-shadow(0 0 5px rgba(0, 191, 255, 0.8))' : 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.6))',
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
  const [showInstructions, setShowInstructions] = useState(true);

  // Gerar estrelas de fundo
  useEffect(() => {
    const stars = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.7 + 0.3,
        animationDelay: Math.random() * 5
      });
    }
    setBackgroundStars(stars);
    
    // Esconder instruções após 5 segundos
    setTimeout(() => setShowInstructions(false), 5000);
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
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-indigo-950 via-blue-950 to-black relative overflow-hidden">
      {/* Estrelas de fundo animadas */}
      <div className="absolute inset-0">
        {backgroundStars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animation: `twinkle ${3 + star.animationDelay}s infinite`,
              boxShadow: '0 0 2px white'
            }}
          />
        ))}
      </div>

      {/* Cabeçalho do Jogo */}
      <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-60 backdrop-blur-sm p-4 text-white z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <span className="text-4xl">🌌</span> 
                Jogo das Constelações
              </h1>
              <p className="text-lg text-yellow-300">{message}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-400">Pontuação: {score}</div>
              <div className="text-sm text-blue-300">
                Constelações: {completedConstellations.length}/2
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instruções iniciais */}
      {showInstructions && (
        <div className="absolute top-32 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white p-4 rounded-lg z-20 max-w-md text-center">
          <p className="mb-2">👆 Clique nas estrelas em sequência para conectá-las</p>
          <p>✨ Forme as constelações Ursa Maior e Ursa Menor</p>
          <p className="text-yellow-400 mt-2">⭐ A Estrela Polar está brilhando!</p>
        </div>
      )}

      {/* Área do Jogo */}
      <svg className="absolute inset-0 w-full h-full" style={{ cursor: 'crosshair' }}>
        {/* Definições de gradientes e filtros */}
        <defs>
          <radialGradient id="polarGlow">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#FFA500" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
          </radialGradient>
          <filter id="starGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
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
        
        {/* Todas as estrelas */}
        <g filter="url(#starGlow)">
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
        </g>
      </svg>

      {/* Controles */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 backdrop-blur-sm p-4 z-10">
        <div className="max-w-4xl mx-auto flex justify-center gap-3 flex-wrap">
          <button
            onClick={() => showHint('ursaMajor')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-all transform hover:scale-105 flex items-center gap-2"
            disabled={completedConstellations.find(c => c.name === "Ursa Maior")}
          >
            💡 Dica: Ursa Maior
          </button>
          <button
            onClick={() => showHint('ursaMinor')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-all transform hover:scale-105 flex items-center gap-2"
            disabled={completedConstellations.find(c => c.name === "Ursa Menor")}
          >
            💡 Dica: Ursa Menor
          </button>
          <button
            onClick={() => { setSelectedStars([]); setConnections([]); }}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-all transform hover:scale-105 flex items-center gap-2"
          >
            🔄 Limpar Seleção
          </button>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all transform hover:scale-105 flex items-center gap-2"
          >
            🎮 Reiniciar Jogo
          </button>
        </div>
      </div>

      {/* Estilos CSS para animações */}
      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default ConstellationGame;