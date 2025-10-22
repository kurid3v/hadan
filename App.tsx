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


const QuestionView: React.FC<{ name: string }> = ({ name }) => {
  const [isYes, setIsYes] = useState(false);
  const [noPosition, setNoPosition] = useState<Position>({
    top: 'auto',
    left: 'auto',
    position: 'static',
  });
  const [yesButtonScale, setYesButtonScale] = useState(1);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const yesButtonRef = useRef<HTMLButtonElement>(null);


  const handleNoHover = () => {
    if (!noButtonRef.current || !yesButtonRef.current) return;

    const noButton = noButtonRef.current;
    const yesButton = yesButtonRef.current;
    
    const noRect = noButton.getBoundingClientRect();
    const yesRect = yesButton.getBoundingClientRect();
    
    // Define a smaller range around the 'Yes' button
    const maxDistance = 100; // The button will move within a 100px radius of the 'Yes' button's center.

    // Center of the 'Yes' button, relative to viewport
    const yesCenterX = yesRect.left + yesRect.width / 2;
    const yesCenterY = yesRect.top + yesRect.height / 2;

    // Generate a random position around the 'Yes' button
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * maxDistance;
    
    let newLeft = yesCenterX + distance * Math.cos(angle) - noRect.width / 2;
    let newTop = yesCenterY + distance * Math.sin(angle) - noRect.height / 2;

    // Ensure the button stays within the viewport boundaries
    const padding = 15;
    const safeLeft = Math.max(padding, Math.min(newLeft, window.innerWidth - noRect.width - padding));
    const safeTop = Math.max(padding, Math.min(newTop, window.innerHeight - noRect.height - padding));

    setNoPosition({
      top: `${safeTop}px`,
      left: `${safeLeft}px`,
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
          ref={yesButtonRef}
          onClick={handleYesClick}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition-transform duration-300 ease-in-out transform origin-center"
          style={{ transform: `scale(${yesButtonScale})` }}
        >
          Có chứ!
        </button>
        <button
          ref={noButtonRef}
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

      <QuestionView name="Sang" />
    </main>
  );
};

export default App;