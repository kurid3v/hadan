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

const CelebrationView: React.FC = () => {
  const [shuffledImages, setShuffledImages] = useState<string[]>([]);

  // Xáo trộn ảnh khi component được mount
  useEffect(() => {
    setShuffledImages([...images].sort(() => Math.random() - 0.5));
  }, []);

  // Các lớp xoay ảnh để tạo hiệu ứng lộn xộn
  const rotations = [
    'transform -rotate-6',
    'transform rotate-3',
    'transform rotate-8',
    'transform -rotate-2',
    'transform rotate-5',
    'transform -rotate-4',
  ];

  return (
    <div className="flex flex-col items-center justify-center text-center p-4 sm:p-6 bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-auto animate-fade-in-up">
      {/* Container lưới ảnh linh hoạt */}
      <div className="flex flex-wrap justify-center gap-6 p-4 w-full mb-6">
        {shuffledImages.map((image, index) => {
          const rotationClass = rotations[index % rotations.length];
          return (
            <div
              key={index}
              // Đặt chiều rộng để khoảng 5 ảnh vừa một hàng
              className={`w-44 bg-white p-2 rounded-md shadow-lg transition-all duration-300 ease-in-out hover:scale-110 hover:z-10 cursor-pointer ${rotationClass}`}
            >
              <img
                src={image}
                alt={`Kỷ niệm ${index + 1}`}
                // Thêm lazy loading để cải thiện hiệu suất
                loading="lazy"
                decoding="async"
                // Đặt chiều cao cố định cho ảnh để đồng đều
                className="rounded-sm object-cover w-full h-56"
              />
            </div>
          );
        })}
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-rose-600 mb-2 z-20">
        T biết mà:)))))
      </h1>
      <p className="text-gray-700 text-base sm:text-lg z-20">
        Chúc em 20/10 vui vẻ mạnh khoẻ nhe🥸💗
      </p>
    </div>
  );
};


const QuestionView: React.FC = () => {
  const [isYes, setIsYes] = useState(false);
  const [noPosition, setNoPosition] = useState<Position>({
    top: 'auto',
    left: 'auto',
    position: 'static',
  });
  const [yesButtonScale, setYesButtonScale] = useState(1);

  const handleNoHover = () => {
    // Trừ đi kích thước nút để đảm bảo nó luôn ở trong khung nhìn
    const top = Math.random() * (window.innerHeight - 60);
    const left = Math.random() * (window.innerWidth - 120);
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
    <div className="flex flex-col items-center">
      <HeartIcon />
      <h2 className="text-4xl font-bold text-gray-800 my-8 text-center">
        Hà Đan có thương Sang không?
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

  // Phát hoặc tạm dừng nhạc khi trạng thái isPlaying thay đổi
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        // play() trả về một promise, có thể bị từ chối nếu trình duyệt chặn tự động phát
        audioRef.current.play().catch(() => {
          setIsPlaying(false); // Đặt lại trạng thái nếu không thể phát
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
      `}</style>
      
      {/* Phần tử audio cho nhạc nền */}
      {/* Thay thế 'src' bằng đường dẫn đến tệp nhạc của bạn. Ví dụ: '/background-music.mp3' */}
      <audio 
        ref={audioRef} 
        src="https://cdn.pixabay.com/audio/2022/08/04/audio_2dde668d05.mp3" 
        loop 
        preload="auto"
      />

      {/* Nút bật/tắt nhạc */}
      <button
        onClick={toggleMusic}
        className="fixed bottom-5 right-5 bg-white/50 backdrop-blur-sm text-rose-600 p-3 rounded-full shadow-lg hover:bg-white/75 transition-colors z-50 focus:outline-none focus:ring-2 focus:ring-rose-400"
        aria-label={isPlaying ? "Tạm dừng nhạc" : "Phát nhạc"}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      <QuestionView />
    </main>
  );
};

export default App;