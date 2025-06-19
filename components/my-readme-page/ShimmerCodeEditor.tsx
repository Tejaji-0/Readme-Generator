import React from "react";

export default function ShimmerCodeEditor() {
  return (
    <div className="flex gap-8 px-10">
      {/* Editor Panel Shimmer */}
      <div className="relative border border-gray-300 rounded-3xl overflow-hidden bg-gray-100 w-1/2 shadow-xl">
        <div className="animate-pulse">
          {/* Header with buttons */}
          <div className="flex items-center justify-between p-4 bg-gray-200">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
              <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
              <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
              <div className="h-6 w-20 bg-gray-300 rounded"></div>
            </div>
          </div>

          {/* Code content shimmer */}
          <div className="p-6 space-y-3 min-h-[500px]">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-4 w-6 bg-gray-300 rounded text-right"></div>
                <div
                  className={`h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-shimmer bg-[length:200%_100%] rounded`}
                  style={{
                    width: `${Math.random() * 60 + 20}%`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Panel Shimmer */}
      <div className="w-1/2 border border-gray-300 rounded-3xl bg-rose-50/30 shadow-xl">
        <div className="animate-pulse">
          {/* Preview header */}
          <div className="bg-gray-100 border-t border-rose-200 px-4 py-2 text-sm font-medium text-gray-400 flex items-center gap-2 rounded-t-3xl">
            <div className="h-4 w-4 bg-gray-300 rounded"></div>
            <div className="h-4 w-16 bg-gray-300 rounded"></div>
          </div>

          {/* Preview content shimmer */}
          <div className="py-6 px-8 space-y-6 min-h-[500px]">
            {/* Title shimmer */}
            <div className="h-10 w-3/4 bg-gradient-to-r from-rose-200 via-rose-100 to-rose-200 animate-shimmer bg-[length:200%_100%] rounded-lg"></div>

            {/* Paragraph shimmers */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div
                  className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded"
                  style={{
                    width: `${Math.random() * 40 + 60}%`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                ></div>
                <div
                  className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded"
                  style={{
                    width: `${Math.random() * 30 + 50}%`,
                    animationDelay: `${i * 0.15 + 0.1}s`,
                  }}
                ></div>
              </div>
            ))}

            {/* Code block shimmer */}
            <div className="bg-gray-100 p-4 rounded-lg space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-3 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-shimmer bg-[length:200%_100%] rounded"
                  style={{
                    width: `${Math.random() * 50 + 30}%`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                ></div>
              ))}
            </div>

            {/* List shimmer */}
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
                  <div
                    className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer bg-[length:200%_100%] rounded"
                    style={{
                      width: `${Math.random() * 40 + 40}%`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
        `}</style>
      </div>
    </div>
  );
}
