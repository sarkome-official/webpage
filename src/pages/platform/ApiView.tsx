import React from 'react';
import { Database, Table, Terminal, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const ApiView = () => {


    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
            <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full p-4 md:p-6 lg:p-10 gap-6 md:gap-8">
                
                {/* Left Column: Documentation */}
                <div className="flex-[2] flex flex-col gap-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">API Reference</h1>
                        <p className="text-muted-foreground text-lg">
                            Connect your research tools directly to the Sarkome Knowledge Graph.
                        </p>
                    </div>

                    {/* Endpoints Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="w-5 h-5 text-primary" />
                                Knowledge Graph Gateway
                            </CardTitle>
                            <CardDescription>
                                RESTful endpoints to query the PrimeKG graph. Base URL: <code className="bg-muted px-1 py-0.5 rounded">http://localhost:3000</code>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/50 text-muted-foreground font-medium">
                                        <tr>
                                            <th className="p-3">Method</th>
                                            <th className="p-3">Endpoint</th>
                                            <th className="p-3">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {[
                                            { m: 'GET', u: '/api/kg/health', d: 'KG API health status' },
                                            { m: 'GET', u: '/api/kg/stats', d: 'Graph statistics (nodes, edges, embeddings)' },
                                            { m: 'GET', u: '/api/kg/search/text?q=...', d: 'Text search (exact/partial match)' },
                                            { m: 'GET', u: '/api/kg/search/semantic?q=...', d: 'AI-powered semantic search' },
                                            { m: 'GET', u: '/api/kg/neighbors/{node}', d: 'Get 1-hop neighbors' },
                                            { m: 'GET', u: '/api/kg/subgraph/{entity}', d: 'Get subgraph for visualization' },
                                            { m: 'GET', u: '/api/kg/path/{source}/{target}', d: 'Find shortest path' },
                                            { m: 'GET', u: '/api/kg/hypothesis/repurposing/{disease}', d: 'Drug repurposing candidates' },
                                            { m: 'GET', u: '/api/kg/hypothesis/targets/{disease}', d: 'Therapeutic targets' },
                                            { m: 'GET', u: '/api/kg/hypothesis/mechanisms/{drug}/{disease}', d: 'Drug-disease mechanism' },
                                        ].map((row, i) => (
                                            <tr key={i} className="hover:bg-muted/50 transition-colors">
                                                <td className="p-3"><Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50/50 dark:text-blue-400 dark:border-blue-800 dark:bg-blue-900/20">{row.m}</Badge></td>
                                                <td className="p-3 font-mono text-xs text-foreground">{row.u}</td>
                                                <td className="p-3 text-muted-foreground">{row.d}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Integration Guides */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold tracking-tight">Integration Guides</h2>
                        
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Excel */}
                            <Card className="md:col-span-2 border-green-500/20 bg-green-500/5">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                                        <Table className="w-5 h-5" />
                                        Microsoft Excel / Google Sheets
                                    </CardTitle>
                                    <CardDescription>
                                        Connect directly without coding using Power Query.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-background/50 p-4 rounded-lg space-y-2 text-sm border border-green-500/10">
                                        <p className="font-medium">Workflow:</p>
                                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-2">
                                            <li>Go to <strong>Data</strong> tab &gt; <strong>Get Data</strong> &gt; <strong>From Other Sources</strong> &gt; <strong>From Web</strong>.</li>
                                            <li>Enter the API URL (e.g., <code className="text-xs bg-muted px-1 rounded">http://localhost:3000/api/kg/hypothesis/targets/Sarcoma</code>).</li>
                                            <li>Excel will import the JSON data and convert it into a dynamic table.</li>
                                        </ol>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        <strong>Productivity Boost:</strong> Create "live" spreadsheets where changing a disease name automatically updates the list of candidate drugs by querying PrimeKG in real-time.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Jupyter / R */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Terminal className="w-5 h-5 text-orange-500" />
                                        Jupyter & RStudio
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        For bioinformaticians, use standard libraries to cross-reference patient data with the graph.
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-xs font-mono bg-muted p-2 rounded border border-border">
                                            <span className="text-blue-500 font-bold">Python</span>
                                            <span>import pandas as pd</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-mono bg-muted p-2 rounded border border-border">
                                            <span className="text-blue-500 font-bold">R</span>
                                            <span>library(httr)</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* BI Tools */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5 text-yellow-500" />
                                        PowerBI & Tableau
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Connect visualization dashboards to <code className="text-xs bg-muted px-1 rounded">/stats</code> or <code className="text-xs bg-muted px-1 rounded">/subgraph</code> endpoints to generate visual reports of the therapeutic landscape for specific cancer types.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>


            </div>


        </div>
    );
};
