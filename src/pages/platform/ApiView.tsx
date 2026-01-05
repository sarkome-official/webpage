import React from 'react';
import { Database, Table, Terminal, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const ApiView = () => {


    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
            <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 gap-6 lg:gap-8">
                
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">API Reference</h1>
                    <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
                        Connect your research tools directly to the Sarkome Knowledge Graph.
                    </p>
                </div>

                {/* Endpoints Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                            <Database className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                            Knowledge Graph Gateway
                        </CardTitle>
                        <CardDescription className="text-xs sm:text-sm">
                            RESTful endpoints to query the PrimeKG graph. Base URL: <code className="bg-muted px-1 py-0.5 rounded text-xs">http://localhost:3000</code>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Desktop/Tablet Table */}
                        <div className="hidden sm:block rounded-md border overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/50 text-muted-foreground font-medium">
                                        <tr>
                                            <th className="p-3 whitespace-nowrap">Method</th>
                                            <th className="p-3 whitespace-nowrap">Endpoint</th>
                                            <th className="p-3 whitespace-nowrap">Description</th>
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
                                                <td className="p-3"><Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50/50 dark:text-blue-400 dark:border-blue-800 dark:bg-blue-900/20 text-xs whitespace-nowrap">{row.m}</Badge></td>
                                                <td className="p-3 font-mono text-xs text-foreground break-all">{row.u}</td>
                                                <td className="p-3 text-muted-foreground text-xs">{row.d}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Cards */}
                        <div className="sm:hidden space-y-3">
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
                                <div key={i} className="bg-muted/30 p-3 rounded-lg border space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50/50 dark:text-blue-400 dark:border-blue-800 dark:bg-blue-900/20 text-xs">{row.m}</Badge>
                                    </div>
                                    <div className="font-mono text-xs text-foreground break-all">{row.u}</div>
                                    <div className="text-muted-foreground text-xs">{row.d}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Integration Guides */}
                <div className="space-y-4 lg:space-y-6">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Integration Guides</h2>
                    
                    <div className="grid gap-4 lg:gap-6 lg:grid-cols-2">
                        {/* Excel */}
                        <Card className="lg:col-span-2 border-green-500/20 bg-green-500/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400 text-base sm:text-lg">
                                    <Table className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Microsoft Excel / Google Sheets
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm">
                                    Connect directly without coding using Power Query.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 sm:space-y-4">
                                <div className="bg-background/50 p-3 sm:p-4 rounded-lg space-y-2 text-xs sm:text-sm border border-green-500/10">
                                    <p className="font-medium">Workflow:</p>
                                    <ol className="list-decimal list-inside space-y-1.5 sm:space-y-2 text-muted-foreground ml-2">
                                        <li className="leading-relaxed">Go to <strong>Data</strong> tab &gt; <strong>Get Data</strong> &gt; <strong>From Other Sources</strong> &gt; <strong>From Web</strong>.</li>
                                        <li className="leading-relaxed">Enter the API URL (e.g., <code className="text-xs bg-muted px-1 rounded break-all">http://localhost:3000/api/kg/hypothesis/targets/Sarcoma</code>).</li>
                                        <li className="leading-relaxed">Excel will import the JSON data and convert it into a dynamic table.</li>
                                    </ol>
                                </div>
                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                    <strong>Productivity Boost:</strong> Create "live" spreadsheets where changing a disease name automatically updates the list of candidate drugs by querying PrimeKG in real-time.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Jupyter / R */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                    <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                                    Jupyter & RStudio
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 sm:space-y-4">
                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                    For bioinformaticians, use standard libraries to cross-reference patient data with the graph.
                                </p>
                                <div className="space-y-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs font-mono bg-muted p-2 sm:p-3 rounded border border-border overflow-x-auto">
                                        <span className="text-blue-500 font-bold whitespace-nowrap">Python</span>
                                        <span className="break-all">import pandas as pd</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs font-mono bg-muted p-2 sm:p-3 rounded border border-border overflow-x-auto">
                                        <span className="text-blue-500 font-bold whitespace-nowrap">R</span>
                                        <span className="break-all">library(httr)</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* BI Tools */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                                    PowerBI & Tableau
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                    Connect visualization dashboards to <code className="text-xs bg-muted px-1 rounded">/stats</code> or <code className="text-xs bg-muted px-1 rounded">/subgraph</code> endpoints to generate visual reports of the therapeutic landscape for specific cancer types.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
