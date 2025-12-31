import React, { useEffect, useRef, useState } from "react";

type Props = {
  initialText?: string;
  onComplete?: (result: string) => void;
  onClose?: () => void;
};

export default function InstructionImprover({ initialText = "", onComplete, onClose }: Props) {
  const [input, setInput] = useState(initialText);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "thinking">("idle");
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Use public worker path to avoid Vite pre-bundling
    try {
      const w = new Worker('/worker.js', { type: 'module' });
      workerRef.current = w;

      w.onmessage = (event: MessageEvent) => {
        const { status: s, result, error } = event.data as any;
        if (s === 'loading') setStatus('loading');
        else if (s === 'ready') setStatus('ready');
        else if (s === 'complete') {
          setOutput(result ?? '');
          setStatus('ready');
          if (typeof result === 'string') onComplete?.(result);
        } else if (s === 'error') {
          console.error('Worker reported error:', error);
          setOutput(String(error ?? 'Worker error'));
          setStatus('idle');
        }
      };

      w.onerror = (e: ErrorEvent) => {
        // Extract meaningful information from the ErrorEvent
        const msg = e?.message ?? 'Unknown worker error';
        const filename = (e as any).filename ?? '';
        const lineno = (e as any).lineno ?? '';
        console.error('Worker error:', msg, filename, lineno, e);
        setOutput(`Worker error: ${msg} ${filename ? `(${filename}:${lineno})` : ''}`);
        setStatus('idle');
      };

      return () => {
        w.terminate();
        workerRef.current = null;
      };
    } catch (e) {
      // Worker not supported
      setStatus('idle');
    }
  }, [onComplete]);

  const handleImprove = () => {
    if (!input) return;
    setStatus('thinking');
    workerRef.current?.postMessage({ text: input });
  };

  return (
    <div style={{ padding: 20, maxWidth: 720, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <h3 style={{ margin: 0 }}>Mejorador de Instrucciones (Local AI)</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onClose?.()} style={{ padding: 6, borderRadius: 6 }}>Cerrar</button>
        </div>
      </div>

      <p style={{ color: '#666' }}>
        Estado: <strong>{status === 'idle' ? 'idle' : status}</strong>
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={6}
        placeholder="Escribe una instrucción..."
        style={{ width: '100%', padding: 10 }}
      />

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <button
          onClick={handleImprove}
          disabled={status === 'loading' || status === 'thinking'}
          style={{ padding: '8px 12px', borderRadius: 6 }}
        >
          Mejorar con IA
        </button>
        <button onClick={() => onClose?.()} style={{ padding: '8px 12px', borderRadius: 6 }}>Cancelar</button>
      </div>

      {output && (
        <div style={{ marginTop: 18, padding: 14, background: '#f6f6f6', borderRadius: 8 }}>
          <strong>Resultado:</strong>
          <p style={{ marginTop: 8 }}>{output}</p>
        </div>
      )}
    </div>
  );
}
