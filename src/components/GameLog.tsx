import React, { useEffect, useRef } from 'react';

interface GameLogProps {
  logs: string[];
  className?: string;
}

/**
 * Component for displaying game events and actions
 */
export const GameLog: React.FC<GameLogProps> = ({ logs, className = '' }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className={`bg-gray-900 text-green-400 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-2 text-white">Game Log</h3>
      <div className="h-64 overflow-y-auto bg-black rounded p-2 font-mono text-sm">
        {logs.length === 0 ? (
          <div className="text-gray-500 italic">No events yet...</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="mb-1">
              <span className="text-gray-400">[{index + 1}]</span> {log}
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}; 