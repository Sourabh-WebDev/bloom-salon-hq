import { useEffect, useState } from "react";

type SprayLoaderProps = {
  compact?: boolean;
  showMessage?: boolean;
};

const SprayLoader = ({ compact = false, showMessage = true }: SprayLoaderProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 2 : 0));
    }, compact ? 80 : 50);

    return () => clearInterval(interval);
  }, [compact]);

  return (
    <div className={compact ? "flex items-center" : "flex flex-col items-center justify-center p-10 space-y-8"}>
      <div className={`relative flex items-center ${compact ? "w-40" : "w-full max-w-md"}`}>
        <div className={`${compact ? "text-2xl" : "text-5xl"} animate-bounce-slow z-10`}>🚿</div>

        <div className={`flex-1 ml-2 ${compact ? "h-4" : "h-8"} bg-gray-200 rounded-full overflow-hidden relative border-2 border-gray-300`}>
          <div
            className="absolute h-full bg-blue-400 opacity-60 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          >
            <div className={`absolute right-0 top-0 h-full ${compact ? "w-6" : "w-10"} flex flex-wrap justify-around`}>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`${compact ? "w-0.5 h-0.5" : "w-1 h-1"} bg-white rounded-full animate-ping`}
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>

          {!compact && (
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
              {progress}%
            </span>
          )}
        </div>
      </div>

      {showMessage && !compact && (
        <p className="text-gray-500 font-medium italic animate-pulse">
          Sprinkling some style...
        </p>
      )}

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          50% { transform: translateX(-5px) rotate(-10deg); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 0.8s infinite;
        }
      `}</style>
    </div>
  );
};

export default SprayLoader;
