import React, { useEffect, useState } from 'react';

export const TauriDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const checkTauriEnvironment = async () => {
      const info: any = {
        isWindow: typeof window !== 'undefined',
        hasTauri: !!(window as any).__TAURI__,
        tauriKeys: (window as any).__TAURI__ ? Object.keys((window as any).__TAURI__) : [],
        hasCore: !!((window as any).__TAURI__?.core),
        coreKeys: (window as any).__TAURI__?.core ? Object.keys((window as any).__TAURI__.core) : [],
        hasInvoke: !!((window as any).__TAURI__?.core?.invoke),
        invokeType: typeof ((window as any).__TAURI__?.core?.invoke),
      };

      // Try importing the API
      try {
        const apiCore = await import('@tauri-apps/api/core');
        info.canImportApi = true;
        info.apiCoreKeys = Object.keys(apiCore);
        info.hasInvokeFromImport = !!apiCore.invoke;
        info.invokeFromImportType = typeof apiCore.invoke;
      } catch (e) {
        info.canImportApi = false;
        info.importError = (e as Error).message;
      }

      // Check user agent
      info.userAgent = navigator.userAgent;
      info.isTauriUserAgent = navigator.userAgent.includes('Tauri');

      setDebugInfo(info);
    };

    checkTauriEnvironment();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="font-bold mb-2">Tauri Environment Debug Info:</h3>
      <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-96">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
}; 