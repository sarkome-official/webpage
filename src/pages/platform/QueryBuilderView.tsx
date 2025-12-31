import React, { useEffect, useRef, useState } from 'react';
import { getAgentUrl } from '@/lib/langgraph-api';
import { Paperclip, Rocket, Pill, Search, ArrowLeftRight, Bot, Zap, CheckCircle, Loader2 } from 'lucide-react';

export const QueryBuilderView = () => {
    const [query, setQuery] = useState('');
    const [isStarting, setIsStarting] = useState(false);
    const [clientRunId, setClientRunId] = useState<string | null>(null);
    type LogEntry = { node: string; message: string; ts: number; status: 'pending' | 'active' | 'done'; raw?: any };
    const [agentLogs, setAgentLogs] = useState<LogEntry[]>([]);
    const [activeNode, setActiveNode] = useState<string | null>(null);
        const [kgContext, setKgContext] = useState<any>(null);
        const [alphafoldContext, setAlphafoldContext] = useState<any>(null);
        const [webResearchDrafts, setWebResearchDrafts] = useState<any[]>([]);
        const [reflectionNotes, setReflectionNotes] = useState<any>(null);
        const [finalAnswer, setFinalAnswer] = useState<string | null>(null);
    const esRef = useRef<EventSource | null>(null);

    const STEP_ORDER = ['query_knowledge_graph','query_alphafold','generate_query','web_research','reflection','finalize_answer'];

    const NODE_LABELS: Record<string, {title: string; message: string}> = {
        query_knowledge_graph: { title: 'Grafo de Conocimiento', message: 'Consultando Grafo de Conocimiento Biomédico...' },
        query_alphafold: { title: 'AlphaFold', message: 'Analizando estructuras proteicas en AlphaFold...' },
        generate_query: { title: 'Estrategia', message: 'Diseñando estrategia de búsqueda web basada en evidencia biológica...' },
        web_research: { title: 'Investigación Web', message: 'Leyendo fuentes externas y artículos científicos...' },
        reflection: { title: 'Reflexión', message: 'Reflexión: evaluando si hay información suficiente...' },
        finalize_answer: { title: 'Finalizando', message: 'Generando respuesta final.' },
    };

    const handleStart = () => {
        setIsStarting(true);
        setAgentLogs([]);
        setActiveNode(null);
        // generate client run id for correlation with backend logs
        const runId = `client_${Date.now()}_${Math.random().toString(16).slice(2)}`;
        setClientRunId(runId);
        connectToAgentStream(runId, query);
    };

    useEffect(() => {
        return () => {
            if (esRef.current) {
                esRef.current.close();
                esRef.current = null;
            }
        };
    }, []);

    function pushLog(node: string, message?: string, raw?: any) {
        const msg = message ?? NODE_LABELS[node]?.message ?? `Ejecutando ${node}`;
        setAgentLogs((s) => {
            const next: LogEntry[] = s.map(l => ({...l, status: l.status === 'active' ? 'done' as const : l.status}));
            next.push({ node, message: msg, ts: Date.now(), status: 'active', raw });
            return next;
        });
        setActiveNode(node);
    }

    function markDone(node: string) {
        setAgentLogs((s) => s.map(l => l.node === node ? {...l, status: 'done'} : l));
        if (activeNode === node) setActiveNode(null);
    }

    function handleNodeEvent(payload: any) {
        const nodeName = payload?.event || payload?.node || payload?.metadata?.node || payload?.type;
        if (!nodeName) return;

        // Prefer explicit message text from payload.message/data, but also
        // detect backend-emitted assistant messages inside payload.messages
        let userMessage = payload?.message ?? payload?.data ?? undefined;
        const maybeMsgs = payload?.messages ?? payload?.output?.messages ?? payload?.result?.messages;
        if (!userMessage && Array.isArray(maybeMsgs) && maybeMsgs.length > 0) {
            try {
                const assistantPieces = maybeMsgs
                    .filter((m: any) => (m.role === 'assistant' || m.type === 'ai' || m.role === 'system' || !m.role))
                    .map((m: any) => (typeof m.content === 'string' ? m.content : (m.text ?? JSON.stringify(m))))
                    .filter(Boolean);
                if (assistantPieces.length > 0) userMessage = assistantPieces.join('\n\n');
            } catch (e) {
                // ignore
            }
        }

        pushLog(nodeName, userMessage, payload);
            // Extract and surface structured contexts for the UI
            try {
                if (nodeName === 'query_knowledge_graph') {
                    if (payload.kg_context) setKgContext(payload.kg_context);
                    if (payload.extracted_entities) setKgContext((prev:any)=>({...(prev||{}), entities: payload.extracted_entities}));
                    if (payload.entities) setKgContext((prev:any)=>({...(prev||{}), entities: payload.entities}));
                }

                if (nodeName === 'query_alphafold') {
                    if (payload.alphafold_context) setAlphafoldContext(payload.alphafold_context);
                    if (payload.alphafold_logs) setAlphafoldContext((prev:any)=>({...(prev||{}), logs: payload.alphafold_logs}));
                }

                if (nodeName === 'web_research') {
                    const draft = payload.web_research_result ?? payload.summary ?? payload;
                    if (draft) setWebResearchDrafts((prev) => [...prev, draft]);
                }

                if (nodeName === 'reflection') {
                    setReflectionNotes(payload.reflection ?? payload);
                }

                if (nodeName === 'finalize_answer') {
                    // final answer may include messages array
                    const msgs = payload.messages ?? payload.output?.messages ?? payload.result?.messages ?? null;
                    if (Array.isArray(msgs) && msgs.length > 0) {
                        const m = msgs[0];
                        const content = typeof m.content === 'string' ? m.content : (m.text ?? JSON.stringify(m));
                        setFinalAnswer(content);
                    } else if (typeof payload.content === 'string') {
                        setFinalAnswer(payload.content);
                    }
                }
            } catch (e) {
                // ignore structured extraction errors
            }

        // If reflection indicates routing back, keep as active until next event
        if (nodeName === 'finalize_answer') {
            markDone(nodeName);
            setTimeout(() => {
                if (esRef.current) {
                    esRef.current.close();
                    esRef.current = null;
                }
                window.location.href = '/platform/agents';
            }, 1200);
        } else {
            // mark previous active as done after a short delay to show progression
            setTimeout(() => markDone(nodeName), 900);
        }
    }

    async function connectToAgentStream(runId: string, q: string) {
        // Start a streaming POST to the agent endpoint so the backend actually
        // receives the query and emits node events. This mirrors useAgent.submit
        // behavior but attaches logs to this view.
        const controller = new AbortController();
        esRef.current = null; // mark EventSource not used; keep ref for cancellation

        try {
            const endpoint = `${getAgentUrl().replace(/\/$/, '')}/runs/stream`;
            const threadId = runId;

            const messages = [
                { role: 'user', content: q }
            ];

            const body = JSON.stringify({
                assistant_id: 'agent',
                input: { messages },
                config: {
                    assistant_id: 'agent',
                    configurable: { thread_id: threadId, assistant_id: 'agent', client_run_id: runId },
                }
            });

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body,
                signal: controller.signal,
            });

            if (!res.ok) {
                simulateAgentSequence(q);
                return;
            }

            if (!res.body) {
                simulateAgentSequence(q);
                return;
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let streamBuffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunkText = decoder.decode(value, { stream: true });
                streamBuffer += chunkText;
                const lines = streamBuffer.split(/\r?\n/);
                streamBuffer = lines.pop() || '';

                for (const line of lines) {
                    if (!line.trim()) continue;
                    let contentPiece: any = null;
                    try {
                        if (line.startsWith('data:')) {
                            contentPiece = JSON.parse(line.slice(5).trim());
                        } else {
                            contentPiece = JSON.parse(line);
                        }
                    } catch (e) {
                        contentPiece = line;
                    }

                    try {
                        handleNodeEvent(contentPiece);
                    } catch (e) {
                        // ignore handler errors
                    }
                }
            }
        } catch (err) {
            simulateAgentSequence(q);
        }
    }

    function simulateAgentSequence(q?: string) {
        // Simulate the node events in order for local dev/demo
        let t = 0;
        STEP_ORDER.forEach((node, idx) => {
            t += 900 + Math.floor(Math.random() * 400);
            setTimeout(() => {
                const message = NODE_LABELS[node]?.message ?? `Ejecutando ${node}`;
                // include query text in the first step for demo clarity
                handleNodeEvent({ event: node, message: idx === 0 && q ? `${message} — Query: ${q}` : message });
            }, t);
        });
    }

    return (
        <div className="flex flex-col min-h-screen font-display bg-background text-foreground">
            {/* Top Navigation - Inner Header */}

            <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-primary/5 rounded-full blur-3xl"></div>
                </div>

                <div className="w-full max-w-3xl z-10 flex flex-col gap-6 md:gap-8">
                    <div className="text-center">
                        <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4">Start New Investigation</h1>
                        <p className="text-base md:text-lg text-muted-foreground">Initiate the Sarkome In-Silico Agent to analyze complex biomedical queries.</p>
                    </div>

                    {/* Query Input */}
                    <div className="bg-muted/30 p-2 rounded-2xl border border-border shadow-2xl shadow-black/20">
                        <div className="relative">
                            <textarea
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Describe your investigation target..."
                                className="w-full bg-background text-foreground text-base md:text-lg placeholder:text-muted-foreground/50 rounded-xl p-4 md:p-6 min-h-[120px] md:min-h-[160px] outline-none border border-transparent focus:border-primary/50 transition-colors resize-none"
                            />
                            <div className="absolute bottom-4 right-4 flex items-center gap-2 md:gap-3">
                                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted" title="Attach Context">
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleStart}
                                    className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-lg shadow-lg shadow-primary/10 transition-all text-sm md:text-base"
                                >
                                    <Rocket className="w-5 h-5" />
                                    <span className="hidden xs:inline">Launch Agent</span>
                                    <span className="xs:hidden">Launch</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Starters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="flex flex-col gap-2 p-5 bg-muted/30 border border-border hover:border-primary/50 rounded-xl text-left transition-all group hover:-translate-y-1">
                            <div className="size-10 rounded bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <Pill className="w-6 h-6" />
                            </div>
                            <span className="text-foreground font-bold text-sm">Find New Drug Targets</span>
                            <p className="text-xs text-muted-foreground">Identify molecular targets for ASPS based on recent fusion protein studies.</p>
                        </button>
                        <button className="flex flex-col gap-2 p-5 bg-muted/30 border border-border hover:border-primary/50 rounded-xl text-left transition-all group hover:-translate-y-1">
                            <div className="size-10 rounded bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <Search className="w-6 h-6" />
                            </div>
                            <span className="text-foreground font-bold text-sm">Analyze Side Effects</span>
                            <p className="text-xs text-muted-foreground">Cross-reference clinical trial data to build a safety profile for a specific compound.</p>
                        </button>
                        <button className="flex flex-col gap-2 p-5 bg-muted/30 border border-border hover:border-primary/50 rounded-xl text-left transition-all group hover:-translate-y-1">
                            <div className="size-10 rounded bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <ArrowLeftRight className="w-6 h-6" />
                            </div>
                            <span className="text-foreground font-bold text-sm">Mechanism Comparison</span>
                            <p className="text-xs text-muted-foreground">Compare efficacy of different TKI generations against TFE3-ASPSCR1.</p>
                        </button>
                    </div>
                </div>
            </main>

            {/* Launch Overlay */}
            {isStarting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 animate-in fade-in duration-500">
                    <div className="w-full max-w-4xl mx-4 md:mx-0 bg-muted/10 border border-border rounded-2xl p-6 flex gap-6">
                        <div className="w-1/3 flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="relative size-12">
                                    <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Bot className="w-8 h-8 text-foreground animate-pulse" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">Sarkome In-Silico</h3>
                                    <p className="text-sm text-muted-foreground">Procesando tu investigación...</p>
                                </div>
                            </div>

                            <div className="bg-background/50 p-3 rounded-lg border border-border overflow-auto h-64">
                                <h4 className="text-sm font-semibold mb-2">Progreso</h4>
                                <ul className="flex flex-col gap-2">
                                    {STEP_ORDER.map((step) => {
                                        const last = agentLogs.find(l => l.node === step && l.status === 'done');
                                        const active = activeNode === step;
                                        return (
                                            <li key={step} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${active ? 'bg-primary/20' : last ? 'bg-green-200' : 'bg-muted/20'}`}>
                                                        {last ? <CheckCircle className="w-4 h-4 text-green-700" /> : active ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-muted-foreground" />}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium">{NODE_LABELS[step]?.title ?? step}</div>
                                                        <div className="text-xs text-muted-foreground">{NODE_LABELS[step]?.message ?? ''}</div>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col">
                            <div className="bg-background/10 rounded-lg p-4 border border-border mb-3">
                                <h4 className="text-sm font-semibold mb-2">Proceso de investigación (detalles)</h4>
                                <div className="text-xs text-muted-foreground space-y-2">
                                    {kgContext && (
                                        <div>
                                            <div className="font-medium text-[12px]">Grafo de Conocimiento</div>
                                            <div className="text-[11px] mt-1 text-muted-foreground">{JSON.stringify(kgContext, null, 2)}</div>
                                        </div>
                                    )}
                                    {alphafoldContext && (
                                        <div>
                                            <div className="font-medium text-[12px]">AlphaFold Context</div>
                                            <div className="text-[11px] mt-1 text-muted-foreground">{JSON.stringify(alphafoldContext, null, 2)}</div>
                                        </div>
                                    )}
                                    {webResearchDrafts.length > 0 && (
                                        <div>
                                            <div className="font-medium text-[12px]">Borradores de Investigación Web</div>
                                            <ul className="text-[11px] mt-1 list-disc list-inside text-muted-foreground">
                                                {webResearchDrafts.map((d, idx) => (
                                                    <li key={idx}>{typeof d === 'string' ? d : JSON.stringify(d)}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {reflectionNotes && (
                                        <div>
                                            <div className="font-medium text-[12px]">Reflexión</div>
                                            <div className="text-[11px] mt-1 text-muted-foreground">{JSON.stringify(reflectionNotes, null, 2)}</div>
                                        </div>
                                    )}
                                    {finalAnswer && (
                                        <div className="mt-2 p-3 bg-muted/20 rounded">
                                            <div className="font-medium text-[12px]">Respuesta final (preview)</div>
                                            <div className="text-[13px] mt-1 text-foreground">{finalAnswer}</div>
                                        </div>
                                    )}
                                    {!kgContext && !alphafoldContext && webResearchDrafts.length === 0 && !reflectionNotes && !finalAnswer && (
                                        <div className="text-xs text-muted-foreground">No hay detalles técnicos aún; esperando nodos del agente...</div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 bg-background/10 rounded-lg p-4 border border-border overflow-auto h-64">
                                <h4 className="text-sm font-semibold mb-2">Logs de pensamiento</h4>
                                <div className="flex flex-col gap-3">
                                    {agentLogs.length === 0 && <div className="text-sm text-muted-foreground">Conectando al agente...</div>}
                                    {agentLogs.map((l, i) => (
                                        <div key={`${l.node}-${l.ts}-${i}`} className="text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${l.status === 'active' ? 'bg-primary' : l.status === 'done' ? 'bg-green-500' : 'bg-muted'}`}></span>
                                                <strong className="text-foreground">{NODE_LABELS[l.node]?.title ?? l.node}</strong>
                                                <span className="text-muted-foreground text-xs ml-2">{new Date(l.ts).toLocaleTimeString()}</span>
                                            </div>
                                            <div className="text-muted-foreground text-xs ml-5">{l.message}</div>
                                            <div className="ml-5 mt-1">
                                                <details className="text-xs text-muted-foreground">
                                                    <summary className="cursor-pointer">Ver raw</summary>
                                                    <pre className="text-[11px] whitespace-pre-wrap mt-1 p-2 bg-muted/10 rounded">{JSON.stringify(l.raw ?? {}, null, 2)}</pre>
                                                </details>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-2 text-xs text-muted-foreground">{clientRunId ? `Run ID: ${clientRunId}` : ''}</div>
                            <div className="mt-4 flex items-center justify-end gap-3">
                                <button className="px-4 py-2 rounded-lg border border-border bg-background text-sm text-muted-foreground" onClick={() => { if (esRef.current) { esRef.current.close(); esRef.current = null; } setIsStarting(false); }}>Cancelar</button>
                                <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold" onClick={() => { if (esRef.current) { esRef.current.close(); esRef.current = null; } window.location.href = '/platform/agents'; }}>Ir a Agentes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
