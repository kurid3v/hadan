import React, { useState, useEffect, useRef } from 'react';
import { images } from './images';

type Position = {
  top: string;
  left: string;
  position: 'static' | 'absolute';
};

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
  </svg>
);

const FallingHeart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
  </svg>
);

const FallingWish: React.FC<{ text: string }> = ({ text }) => (
  <div className="p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-md">
    <p className="text-sm sm:text-base font-semibold text-rose-500 italic whitespace-nowrap">
      {text}
    </p>
  </div>
);

type FallingItem = {
  id: string;
  type: 'image' | 'heart' | 'wish';
  value?: string;
};

const CelebrationView: React.FC = () => {
    const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        const wishes = [
            "20/10",
            "Chúc em hạnh phúc",
            "Iu",
            ":)))))",
            "?"
        ];
        
        const items: FallingItem[] = [];

        images.forEach((img, i) => items.push({ type: 'image', value: img, id: `img-${i}` }));
        
        for (let i = 0; i < 12; i++) {
            items.push({ type: 'heart', id: `heart-${i}` });
        }

        wishes.forEach(wish => {
            items.push({ type: 'wish', value: wish, id: `wish-${wish}-1` });
            items.push({ type: 'wish', value: wish, id: `wish-${wish}-2` });
        });

        const shuffledItems = items.sort(() => Math.random() - 0.5);
        setFallingItems(shuffledItems);
    }, []);

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

  return (
    <div className={`fixed inset-0 w-full h-full overflow-hidden z-10 ${selectedImage ? 'animation-paused' : ''}`} style={{ perspective: '1000px' }}>
      {fallingItems.map((item) => {
        const style: React.CSSProperties = {
          left: `${Math.random() * 95}vw`,
          animationDuration: `${Math.random() * 8 + 14}s`,
          animationDelay: `-${Math.random() * 20}s`,
          '--rotate-x-end': `${(Math.random() - 0.5) * 360}deg`,
          '--rotate-y-end': `${(Math.random() - 0.5) * 360}deg`,
          '--rotate-z-end': `${(Math.random() - 0.5) * 180}deg`,
        } as React.CSSProperties;
        
        let content;
        let isClickable = false;
        switch (item.type) {
            case 'image':
                isClickable = true;
                content = (
                     <div className="p-2 bg-white rounded-md shadow-lg">
                        <img
                          src={item.value}
                          alt={`Kỷ niệm`}
                          loading="lazy"
                          decoding="async"
                          className="rounded-sm object-cover w-32 h-40"
                        />
                    </div>
                );
                break;
            case 'heart':
                content = <FallingHeart />;
                break;
            case 'wish':
                content = <FallingWish text={item.value!} />;
                break;
        }

        return (
          <div
            key={item.id}
            className={`absolute animate-image-rain-3d ${isClickable ? 'cursor-pointer' : 'pointer-events-none'}`}
            style={style}
            onClick={isClickable ? () => handleImageClick(item.value!) : undefined}
          >
           {content}
          </div>
        );
      })}

      <div className="relative z-20 flex flex-col items-center justify-center text-center w-full h-full pointer-events-none">
        <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-2xl max-w-lg">
          <h1 className="text-2xl sm:text-3xl font-bold text-rose-600 mb-2">
            T biết mà:)))))
          </h1>
          <p className="text-gray-700 text-base sm:text-lg">
            Chúc em 20/10 vui vẻ mạnh khoẻ nhe🥸💗
          </p>
        </div>
      </div>
      
      {selectedImage && (
        <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={handleCloseModal}
        >
            <div 
                className="relative bg-white p-2 rounded-lg shadow-2xl max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
            >
                <img 
                    src={selectedImage} 
                    alt="Phóng to" 
                    className="rounded-md object-contain"
                    style={{ maxHeight: '90vh', maxWidth: '90vw' }}
                />
                 <button
                    onClick={handleCloseModal}
                    className="absolute -top-3 -right-3 bg-white text-gray-800 rounded-full h-8 w-8 flex items-center justify-center text-xl font-bold shadow-lg hover:bg-rose-200 transition-colors"
                    aria-label="Đóng"
                >
                    &times;
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

const NameInputView: React.FC<{ onNameSubmit: (name: string) => void }> = ({ onNameSubmit }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onNameSubmit(inputValue.trim());
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl animate-fade-in-up">
      <h2 className="text-2xl sm:text-3xl font-bold text-rose-600 mb-6 text-center">
        Cho tớ biết tên của bạn nhé?
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Nhập tên của bạn..."
          className="px-4 py-3 border-2 border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none transition w-full text-center sm:text-left"
          aria-label="Tên của bạn"
          required
        />
        <button
          type="submit"
          className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform duration-200 ease-in-out hover:scale-105 w-full sm:w-auto"
        >
          Xong!
        </button>
      </form>
    </div>
  );
};


const QuestionView: React.FC<{ name: string }> = ({ name }) => {
  const [isYes, setIsYes] = useState(false);
  const [noPosition, setNoPosition] = useState<Position>({
    top: 'auto',
    left: 'auto',
    position: 'static',
  });
  const [yesButtonScale, setYesButtonScale] = useState(1);

  const handleNoHover = () => {
    const buttonWidth = 120; // Approximate width in px
    const buttonHeight = 60; // Approximate height in px

    // Define the range of movement in pixels from the center of the screen
    const horizontalRange = 300; 
    const verticalRange = 250;

    // Calculate center of the viewport
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Calculate a random position within the defined range around the center
    // We subtract half the range to center the movement box, and then add a random value within the range.
    let left = (centerX - horizontalRange / 2) + Math.random() * horizontalRange;
    let top = (centerY - verticalRange / 2) + Math.random() * verticalRange;
    
    // Ensure the button doesn't go off-screen
    left = Math.max(0, Math.min(left, window.innerWidth - buttonWidth));
    top = Math.max(0, Math.min(top, window.innerHeight - buttonHeight));

    setNoPosition({
      top: `${top}px`,
      left: `${left}px`,
      position: 'absolute',
    });
    setYesButtonScale((prev) => prev + 0.2);
  };

  const handleYesClick = () => {
    setIsYes(true);
  };
  
  if (isYes) {
      return <CelebrationView />;
  }

  return (
    <div className="flex flex-col items-center animate-fade-in-up">
      <HeartIcon />
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 my-8 text-center">
        Hà Đan có thương {name} không?
      </h2>
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={handleYesClick}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition-transform duration-300 ease-in-out transform origin-center"
          style={{ transform: `scale(${yesButtonScale})` }}
        >
          Có chứ!
        </button>
        <button
          onMouseEnter={handleNoHover}
          onClick={handleNoHover}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition-all duration-300 ease-in-out"
          style={noPosition}
        >
          Không
        </button>
      </div>
       {yesButtonScale > 1.2 && <p className="mt-8 text-rose-500 animate-pulse text-center">Nút "Có" có vẻ là lựa chọn tốt hơn đó!</p>}
    </div>
  );
};

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [name, setName] = useState('');
  const [view, setView] = useState<'nameInput' | 'question'>('nameInput');

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNameSubmit = (submittedName: string) => {
    setName(submittedName);
    setView('question');
  };

  const renderContent = () => {
    switch (view) {
      case 'nameInput':
        return <NameInputView onNameSubmit={handleNameSubmit} />;
      case 'question':
        return <QuestionView name={name} />;
      default:
        return <NameInputView onNameSubmit={handleNameSubmit} />;
    }
  };
  
  return (
    <main className="bg-rose-100 min-h-screen w-full flex items-center justify-center p-4 overflow-hidden relative">
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }

        @keyframes image-rain-3d {
          from {
            transform: translateY(-25vh) rotateX(0) rotateY(0) rotateZ(0);
          }
          to {
            transform: translateY(125vh) rotateX(var(--rotate-x-end)) rotateY(var(--rotate-y-end)) rotateZ(var(--rotate-z-end));
          }
        }

        .animate-image-rain-3d {
          top: -25vh;
          animation-name: image-rain-3d;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          transform-style: preserve-3d;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
        }

        .animation-paused .animate-image-rain-3d {
          animation-play-state: paused;
        }
      `}</style>
      
      <audio 
        ref={audioRef} 
        src="https://cdn.pixabay.com/audio/2022/08/04/audio_2dde668d05.mp3" 
        loop 
        preload="auto"
      />

      <button
        onClick={toggleMusic}
        className="fixed bottom-5 right-5 bg-white/50 backdrop-blur-sm text-rose-600 p-3 rounded-full shadow-lg hover:bg-white/75 transition-colors z-50 focus:outline-none focus:ring-2 focus:ring-rose-400"
        aria-label={isPlaying ? "Tạm dừng nhạc" : "Phát nhạc"}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      {renderContent()}
    </main>
  );
};

export default App;