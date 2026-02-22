import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import './App.css';

// 生日验证页面组件
function BirthdayVerification({ onVerified }) {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 验证答案：2月23号、2.23、2/23、223 都算正确
    const validAnswers = ['2月23号', '2月23日', '2.23', '2/23', '223', '二月二十三', '二月二十三日'];
    const normalizedAnswer = answer.trim().toLowerCase();
    
    if (validAnswers.some(valid => normalizedAnswer.includes(valid) || valid === normalizedAnswer)) {
      onVerified();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <motion.div
      className="verification-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="verification-container">
        <motion.div
          className="verification-card"
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className="verification-icon"
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎂
          </motion.div>
          
          <h2 className="verification-title">生日验证</h2>
          <p className="verification-question">大帅的生日是几号？</p>
          
          <form onSubmit={handleSubmit} className="verification-form">
            <input
              type="text"
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setError(false);
              }}
              placeholder="请输入答案..."
              className={`verification-input ${error ? 'error' : ''}`}
              autoFocus
            />
            
            <motion.button
              type="submit"
              className="verification-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              验证 ✨
            </motion.button>
          </form>
          
          {error && (
            <motion.p
              className="verification-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ❌ 答案不对哦，再想想~ 💭
            </motion.p>
          )}
          
          <p className="verification-hint">💡 提示：输入月份和日期即可</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// 水波背景组件
function WaterWaveBackground() {
  return (
    <div className="water-wave-container">
      <div className="water-wave"></div>
      <div className="water-wave"></div>
      <div className="water-wave"></div>
    </div>
  );
}

// 点击涟漪效果组件
function RippleEffect() {
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    const handleClick = (e) => {
      const newRipple = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now(),
      };
      setRipples(prev => [...prev, newRipple]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 800);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="ripple"
          style={{
            left: ripple.x - 50,
            top: ripple.y - 50,
            width: 100,
            height: 100,
          }}
        />
      ))}
    </>
  );
}

// 可交互的爱心组件
function InteractiveHeart({ emoji, initialX, initialY }) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const heartRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      
      if (heartRef.current) {
        const rect = heartRef.current.getBoundingClientRect();
        const heartCenterX = rect.left + rect.width / 2;
        const heartCenterY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(
          Math.pow(e.clientX - heartCenterX, 2) + 
          Math.pow(e.clientY - heartCenterY, 2)
        );
        
        // 当鼠标靠近时（100px范围内），爱心弹开
        if (distance < 100) {
          const angle = Math.atan2(heartCenterY - e.clientY, heartCenterX - e.clientX);
          const force = (100 - distance) / 100 * 15; // 力度随距离变化
          
          setVelocity(prev => ({
            x: prev.x + Math.cos(angle) * force,
            y: prev.y + Math.sin(angle) * force
          }));
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const animationFrame = () => {
      setPosition(prev => ({
        x: prev.x + velocity.x,
        y: prev.y + velocity.y
      }));
      
      // 摩擦力，让爱心慢慢停下来
      setVelocity(prev => ({
        x: prev.x * 0.95,
        y: prev.y * 0.95
      }));
    };

    const interval = setInterval(animationFrame, 16);
    return () => clearInterval(interval);
  }, [velocity]);

  return (
    <motion.div
      ref={heartRef}
      className="interactive-heart"
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        fontSize: '2rem',
        cursor: 'pointer',
        zIndex: 50,
        pointerEvents: 'none',
      }}
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 10, -10, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      whileHover={{ scale: 1.5 }}
    >
      {emoji}
    </motion.div>
  );
}

function App() {
  const [isVerified, setIsVerified] = useState(false); // 生日验证状态
  const [currentPage, setCurrentPage] = useState('welcome'); // welcome, timeline, letter
  const [activeNode, setActiveNode] = useState(null);
  const [unlockedNodes, setUnlockedNodes] = useState([0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAutoPlayed, setHasAutoPlayed] = useState(false);
  const [letterOpened, setLetterOpened] = useState(false);
  const audioRef = useRef(null);

  const timelineData = [
    {
      date: '2017年9月',
      title: '1',
      content: '2017年9月我们一起进入到景炎学校，很庆幸初一的第一个学期我们分到一个组，那时候我还叫萱萱。',
      icon: '🎒',
      photo: '/photos/photo1.jpg'
    },
    {
      date: '2018年',
      title: '2',
      content: '我上初二的时候，我们四个就已经一起吃饭一起散步一起玩了，我当时初二还在篮球队训练，那时候视力好，可以看到你们在操场上跑步。',
      icon: '🏀',
      photo: '/photos/photo2.jpg'
    },
    {
      date: '2020年',
      title: '3',
      content: '我上初三了，当时因为中考我不用训练了，每天放学就跟你走到中心广场的公交站，那时候总有说不完的话。',
      icon: '🚌',
      photo: '/photos/photo3.jpg'
    },
    {
      date: '高考后',
      title: '4',
      content: '我高考完，跟当时的男朋友闹矛盾了，哭着跑到你家楼下。',
      icon: '🤗',
      photo: '/photos/photo4.jpg'
    },
    {
      date: 'Now',
      title: '5',
      content: '我们会有很多很多个将来。',
      icon: '💕',
      photo: '/photos/photo5.jpg'
    }
  ];

  // 自动播放音乐
  useEffect(() => {
    if ((currentPage === 'timeline' || currentPage === 'letter') && audioRef.current && !hasAutoPlayed) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasAutoPlayed(true);
          })
          .catch(() => {
            console.log('Auto-play prevented');
          });
      }
    }
  }, [currentPage, hasAutoPlayed]);

  // 爆炸音效
  const playExplosionSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    gainNode.gain.setValueAtTime(0.8, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    const bufferSize = audioContext.sampleRate * 0.5;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = audioContext.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = audioContext.createGain();
    noiseGain.gain.setValueAtTime(0.3, audioContext.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    noise.connect(noiseGain);
    noiseGain.connect(audioContext.destination);
    noise.start();
  };

  // 气球烟花效果
  const triggerBalloonFireworks = () => {
    const duration = 3000;
    const end = Date.now() + duration;
    const colors = ['#ff6b9d', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3'];

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
        shapes: ['circle'],
        scalar: 1.5
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
        shapes: ['circle'],
        scalar: 1.5
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        confetti({
          particleCount: 1,
          spread: 0,
          origin: { x: Math.random(), y: 1 },
          colors: [colors[Math.floor(Math.random() * colors.length)]],
          shapes: ['circle'],
          scalar: 2,
          drift: 0,
          gravity: -0.5,
          ticks: 200,
          startVelocity: 15
        });
      }, i * 100);
    }
  };

  const handleWelcomeClick = () => {
    playExplosionSound();
    triggerBalloonFireworks();
    setTimeout(() => {
      setCurrentPage('timeline');
    }, 1500);
  };

  const handleNodeClick = (index) => {
    if (!unlockedNodes.includes(index)) return;
    setActiveNode(index);
  };

  const handleCloseModal = () => {
    const currentIndex = activeNode;
    setActiveNode(null);
    
    if (currentIndex !== null && currentIndex < timelineData.length - 1 && !unlockedNodes.includes(currentIndex + 1)) {
      setTimeout(() => {
        setUnlockedNodes([...unlockedNodes, currentIndex + 1]);
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#ff6b9d', '#ffd700']
        });
      }, 300);
    }
    
    // 如果解锁了最后一个节点，显示进入第三页的提示
    if (currentIndex === timelineData.length - 1) {
      setTimeout(() => {
        // 可以在这里添加提示
      }, 500);
    }
  };

  const handleGoToLetter = () => {
    setCurrentPage('letter');
  };

  const handleOpenLetter = () => {
    setLetterOpened(true);
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="app">
      {/* 背景音乐 - SOLO */}
      <audio
        ref={audioRef}
        src="/music/solo.mp3.flac"
        loop
      />

      <AnimatePresence mode="wait">
        {currentPage === 'welcome' && (
          <WelcomePage 
            key="welcome"
            onClick={handleWelcomeClick} 
          />
        )}
        
        {currentPage === 'timeline' && (
          <TimelinePage
            key="timeline"
            timelineData={timelineData}
            activeNode={activeNode}
            unlockedNodes={unlockedNodes}
            onNodeClick={handleNodeClick}
            isPlaying={isPlaying}
            onToggleMusic={toggleMusic}
            onGoToLetter={handleGoToLetter}
          />
        )}

        {currentPage === 'letter' && (
          <LetterPage
            key="letter"
            isOpened={letterOpened}
            onOpen={handleOpenLetter}
            isPlaying={isPlaying}
            onToggleMusic={toggleMusic}
          />
        )}
      </AnimatePresence>

      {/* 弹窗 */}
      <AnimatePresence>
        {currentPage === 'timeline' && activeNode !== null && (
          <Modal
            data={timelineData[activeNode]}
            onClose={handleCloseModal}
            isLast={activeNode === timelineData.length - 1}
            onGoToLetter={handleGoToLetter}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// 欢迎页面组件
function WelcomePage({ onClick }) {
  return (
    <motion.div
      className="welcome-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-decoration">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-heart"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 20}px`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              rotate: [0, 360]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          >
            {['💖', '💕', '💗', '💝', '💘'][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="welcome-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="crown"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          👑
        </motion.div>

        <motion.h1
          className="welcome-title"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          大帅
        </motion.h1>

        <motion.p
          className="welcome-subtitle"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          生日快乐！
        </motion.p>

        <motion.div
          className="cake-container"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7, type: "spring" }}
        >
          <div className="cake">🎂</div>
          <div className="candles">
            <span className="candle">🕯️</span>
            <span className="candle">🕯️</span>
            <span className="candle">🕯️</span>
          </div>
        </motion.div>

        <motion.button
          className="birthday-btn"
          onClick={onClick}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ 
            scale: 1.1,
            boxShadow: '0 0 40px rgba(255, 107, 157, 0.8)'
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="btn-text">大帅，生日快乐！</span>
          <span className="btn-sparkles">✨</span>
        </motion.button>

        <motion.p
          className="date-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          2.23 💝
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

// 时间轴页面组件
function TimelinePage({ timelineData, activeNode, unlockedNodes, onNodeClick, isPlaying, onToggleMusic, onGoToLetter }) {
  const allUnlocked = unlockedNodes.length === timelineData.length;

  // 生成随机初始位置的交互爱心
  const interactiveHearts = [
    { emoji: '💖', x: 100, y: 150 },
    { emoji: '💕', x: 300, y: 200 },
    { emoji: '💗', x: 500, y: 100 },
    { emoji: '💝', x: 700, y: 250 },
    { emoji: '💘', x: 200, y: 400 },
    { emoji: '🩷', x: 400, y: 350 },
    { emoji: '💖', x: 600, y: 450 },
    { emoji: '💕', x: 150, y: 550 },
  ];

  return (
    <motion.div
      className="timeline-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 交互式爱心 - 鼠标碰到会弹开 */}
      {interactiveHearts.map((heart, index) => (
        <InteractiveHeart
          key={index}
          emoji={heart.emoji}
          initialX={heart.x}
          initialY={heart.y}
        />
      ))}

      {/* 背景烟花效果 */}
      <div className="fireworks-bg">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="firework"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeOut",
            }}
          >
            {['✨', '🌟', '💫', '⭐', '🎆', '🎇'][Math.floor(Math.random() * 6)]}
          </motion.div>
        ))}
      </div>

      {/* 旋转木马装饰 */}
      <div className="carousel-decoration">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="carousel-item"
            style={{
              position: 'absolute',
              left: `${10 + i * 10}%`,
              top: i % 2 === 0 ? '5%' : '85%',
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3 + Math.random(),
              repeat: Infinity,
              delay: i * 0.3,
            }}
          >
            {['🎠', '🎡', '🎢', '🦄', '🌸', '💝', '🎀', '💖'][i]}
          </motion.div>
        ))}
      </div>

      {/* 漂浮爱心 */}
      <div className="floating-hearts-bg">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-heart-item"
            style={{
              left: `${Math.random() * 100}%`,
              fontSize: `${15 + Math.random() * 25}px`,
            }}
            initial={{ y: '100vh', opacity: 0 }}
            animate={{
              y: '-10vh',
              opacity: [0, 1, 1, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          >
            {['💖', '💕', '💗', '💝', '💘', '🩷'][Math.floor(Math.random() * 6)]}
          </motion.div>
        ))}
      </div>

      {/* 旋转唱片 */}
      <motion.div
        className="vinyl-record"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        onClick={onToggleMusic}
        style={{ cursor: 'pointer' }}
      >
        <div className="vinyl-outer">
          <div className="vinyl-inner">
            <div className="vinyl-label">
              <span>🎵</span>
              <small>Jennie</small>
              <small>Solo</small>
            </div>
          </div>
        </div>
        {!isPlaying && <div className="play-overlay">▶️</div>}
      </motion.div>

      <motion.p
        className="music-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {isPlaying ? '正在播放 🎵' : '点击唱片播放音乐 🎵'}
      </motion.p>

      <motion.h1
        className="timeline-title"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        工地四巨头的故事 💕
      </motion.h1>

      <div className="timeline-container">
        <div className="timeline-line">
          <motion.div
            className="timeline-progress"
            initial={{ height: '0%' }}
            animate={{ height: `${(unlockedNodes.length / timelineData.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="timeline-nodes">
          {timelineData.map((item, index) => (
            <TimelineNode
              key={index}
              index={index}
              data={item}
              isActive={activeNode === index}
              isUnlocked={unlockedNodes.includes(index)}
              onClick={() => onNodeClick(index)}
            />
          ))}
        </div>
      </div>

      {/* 进入下一页按钮 */}
      <AnimatePresence>
        {allUnlocked && (
          <motion.div
            className="next-page-btn-container"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <motion.button
              className="next-page-btn"
              onClick={onGoToLetter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              有一封信给你 💌
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// 时间节点组件
function TimelineNode({ index, data, isActive, isUnlocked, onClick }) {
  return (
    <motion.div
      className={`timeline-node ${isUnlocked ? 'unlocked' : 'locked'} ${isActive ? 'active' : ''}`}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.2 }}
      onClick={onClick}
    >
      <div className={`node-dot ${isUnlocked ? 'pulse' : ''}`}>
        {isUnlocked ? data.icon : '🔒'}
      </div>
      <div className="node-content">
        <span className="node-date">{data.date}</span>
        <span className="node-title">{data.title}</span>
      </div>
    </motion.div>
  );
}

// 弹窗组件
function Modal({ data, onClose, isLast, onGoToLetter }) {
  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-icon">{data.icon}</div>
        <h3 className="modal-date">{data.date}</h3>
        <h4 className="modal-title">{data.title}</h4>
        
        {/* 照片展示 */}
        {data.photo && (
          <motion.div 
            className="modal-photo-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <img 
              src={data.photo} 
              alt={`${data.date}的回忆`}
              className="modal-photo"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </motion.div>
        )}
        
        <p className="modal-text">{data.content}</p>
        <div className="modal-hearts">
          {[...Array(5)].map((_, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            >
              💖
            </motion.span>
          ))}
        </div>
        <motion.button
          className="modal-back-btn"
          onClick={onClose}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLast ? '关闭' : '回到时间轴'} ✨
        </motion.button>
        {isLast && (
          <motion.button
            className="modal-next-btn"
            onClick={() => {
              onClose();
              setTimeout(onGoToLetter, 300);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            查看信件 💌
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}

// 纸飞机信件页面
function LetterPage({ isOpened, onOpen, isPlaying, onToggleMusic }) {
  return (
    <motion.div
      className="letter-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 旋转唱片 */}
      <motion.div
        className="vinyl-record small"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        onClick={onToggleMusic}
        style={{ cursor: 'pointer' }}
      >
        <div className="vinyl-outer">
          <div className="vinyl-inner">
            <div className="vinyl-label">
              <span>🎼</span>
              <small>卡农</small>
            </div>
          </div>
        </div>
        {!isPlaying && <div className="play-overlay">▶️</div>}
      </motion.div>

      {/* 背景装饰 */}
      <div className="letter-bg-decoration">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-cloud"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          >
            ☁️
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div
            key="paperplane"
            className="paperplane-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.5, y: -200 }}
            transition={{ duration: 0.8 }}
          >
            <motion.p
              className="letter-hint"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              点击纸飞机打开信件 ✉️
            </motion.p>
            
            <motion.div
              className="paperplane"
              onClick={onOpen}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{ 
                scale: 1.1,
                cursor: 'pointer'
              }}
              whileTap={{ scale: 0.95 }}
            >
              ✈️
            </motion.div>
            
            <motion.div
              className="paperplane-shadow"
              animate={{
                scale: [1, 0.8, 1],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            className="letter-container"
            initial={{ opacity: 0, scale: 0.5, rotateX: 90 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ 
              duration: 1,
              type: "spring",
              damping: 20
            }}
          >
            <div className="letter-envelope">
              <motion.div
                className="letter-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <div className="letter-header">
                  <span className="letter-stamp">💌</span>
                  <span className="letter-date">2026年2月20日</span>
                </div>
                
                <div className="letter-body">
                  <p className="letter-greeting">致大帅：</p>
                  <p className="letter-text letter-text-black">
                    从17年我们认识，到现在，我觉得大帅一直是一个善良的，好相处的难得碰到的好朋友，所以我觉得遇见大帅真的很幸运，希望我一直这幸运。
                  </p>
                  <p className="letter-text-pink">
                    我觉得我们的关系可以用这样一句话概括：
                  </p>
                  <p className="letter-quote">
                    "我们各自忙碌，却互相牵挂；<br />
                    不用刻意想起，因为从未忘记"
                  </p>
                </div>
                
                <div className="letter-signature">
                  <p>—— 猪头</p>
                  <motion.div
                    className="letter-heart"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    💖
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.div
                className="letter-decorations"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
              >
                <span className="deco-flower">🌸</span>
                <span className="deco-star">⭐</span>
                <span className="deco-flower">🌸</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 水波背景 */}
      <WaterWaveBackground />
      
      {/* 点击涟漪效果 */}
      <RippleEffect />
    </motion.div>
  );
}

// 主应用组件
function AppWrapper() {
  const [isVerified, setIsVerified] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {!isVerified ? (
        <BirthdayVerification 
          key="verification"
          onVerified={() => setIsVerified(true)} 
        />
      ) : (
        <App key="main" />
      )}
    </AnimatePresence>
  );
}

export default AppWrapper;
