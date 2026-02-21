import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Progress } from "@/Components/ui/progress"
import { Badge } from "@/Components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { useSpeedtest } from '@/Hooks/use-speedtest'
import { Stats } from '@/Components/Stats'
import { ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts'
import { Activity, ArrowDown, ArrowUp, Globe, LayoutDashboard, Loader2, Play, ShieldCheck, Zap } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { Head } from '@inertiajs/react'

export default function Speedtest() {
    const { result, startTest, abortTest } = useSpeedtest();

    // Accumulate real-time chart data
    const [dlHistory, setDlHistory] = useState<{ time: number; val: number }[]>([]);
    const [ulHistory, setUlHistory] = useState<{ time: number; val: number }[]>([]);

    useEffect(() => {
        if (result.testState === -1) {
            setDlHistory([]);
            setUlHistory([]);
            return;
        }

        const now = Date.now();
        if (result.testState === 1) { // Download
            const val = parseFloat(result.dlStatus);
            setDlHistory(prev => {
                if (prev.length > 0 && prev[prev.length - 1].val === val) return prev;
                return [...prev, { time: now, val }].slice(-30);
            });
        } else if (result.testState === 3) { // Upload
            const val = parseFloat(result.ulStatus);
            setUlHistory(prev => {
                if (prev.length > 0 && prev[prev.length - 1].val === val) return prev;
                return [...prev, { time: now, val }].slice(-30);
            });
        }
    }, [result.dlStatus, result.ulStatus, result.testState]);

    const dlChartData = useMemo(() => {
        if (dlHistory.length === 0) return Array.from({ length: 20 }).map((_, i) => ({ time: i, val: 0 }));
        return dlHistory;
    }, [dlHistory]);

    const ulChartData = useMemo(() => {
        if (ulHistory.length === 0) return Array.from({ length: 20 }).map((_, i) => ({ time: i, val: 0 }));
        return ulHistory;
    }, [ulHistory]);

    const isTesting = result.testState > 0 && result.testState < 4;

    return (
        <>
            <Head title="Network Speed Test" />
            <div className="min-h-screen bg-[#fafafa] dark:bg-[#000] text-black dark:text-white font-sans selection:bg-blue-100 dark:selection:bg-blue-900/40">
                {/* Header */}
                <header className="sticky top-0 z-50 w-full border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-md">
                    <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                                <Zap className="w-5 h-5 text-white dark:text-black fill-current" />
                            </div>
                            <span className="font-bold text-lg tracking-tight">speed.test</span>
                        </div>
                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-black/60 dark:text-white/60">
                            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Documentation</a>
                            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Enterprise</a>
                            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Stats</a>
                        </nav>
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="hidden sm:flex gap-1.5 border-black/10 dark:border-white/20">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Global Network
                            </Badge>
                            <Button variant="ghost" size="sm">Log in</Button>
                        </div>
                    </div>
                </header>

                <main className="container mx-auto px-4 py-12 md:py-24">
                    <div className="max-w-4xl mx-auto space-y-12">

                        {/* Header */}
                        <div className="text-center space-y-4">
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-black to-black/60 dark:from-white dark:to-white/40 bg-clip-text text-transparent">
                                Network Intelligence.
                            </h1>
                            <p className="text-lg text-black/60 dark:text-white/60 max-w-xl mx-auto">
                                Precision metrics served via our global edge network.
                            </p>
                        </div>

                        <Tabs defaultValue="test" className="w-full">
                            <div className="flex justify-center mb-8">
                                <TabsList className="bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 p-1 h-12 rounded-full">
                                    <TabsTrigger value="test" className="rounded-full px-8 data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:shadow-lg h-10 transition-all font-bold">
                                        <Activity className="w-4 h-4 mr-2" /> Speed Test
                                    </TabsTrigger>
                                    <TabsTrigger value="stats" className="rounded-full px-8 data-[state=active]:bg-white dark:data-[state=active]:bg-black data-[state=active]:shadow-lg h-10 transition-all font-bold">
                                        <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="test" className="space-y-12 outline-none">
                                {/* Speedtest Card */}
                                <Card className="border-black/5 dark:border-white/10 bg-white dark:bg-[#0a0a0a] shadow-2xl shadow-black/5 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle>Network Test</CardTitle>
                                                <CardDescription>Status: {isTesting ? 'In Progress' : 'Ready'}</CardDescription>
                                            </div>
                                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-none">
                                                {result.clientIp || 'Detecting...'}
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-8">
                                        {/* Primary Gauges (Numerical) */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2 group">
                                                <div className="flex items-center justify-between text-sm font-medium text-black/40 dark:text-white/40 group-hover:text-black/60 dark:group-hover:text-white/60 transition-colors">
                                                    <span className="flex items-center gap-1.5"><ArrowDown className="w-4 h-4" /> DOWNLOAD</span>
                                                    <span className="tabular-nums">Mbps</span>
                                                </div>
                                                <div className="text-6xl font-black tabular-nums tracking-tighter">
                                                    {result.dlStatus}
                                                </div>
                                                <Progress value={result.dlProgress * 100} className="h-1 bg-black/5 dark:bg-white/5" />
                                            </div>

                                            <div className="space-y-2 group">
                                                <div className="flex items-center justify-between text-sm font-medium text-black/40 dark:text-white/40 group-hover:text-black/60 dark:group-hover:text-white/60 transition-colors">
                                                    <span className="flex items-center gap-1.5"><ArrowUp className="w-4 h-4" /> UPLOAD</span>
                                                    <span className="tabular-nums">Mbps</span>
                                                </div>
                                                <div className="text-6xl font-black tabular-nums tracking-tighter">
                                                    {result.ulStatus}
                                                </div>
                                                <Progress value={result.ulProgress * 100} className="h-1 bg-black/5 dark:bg-white/5" />
                                            </div>
                                        </div>

                                        {/* Sub Stats */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                                            <div className="space-y-1">
                                                <div className="text-[10px] uppercase tracking-widest font-bold text-black/40 dark:text-white/40">Latency</div>
                                                <div className="text-lg font-bold tabular-nums">{result.pingStatus} <span className="text-xs font-medium text-black/40">ms</span></div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-[10px] uppercase tracking-widest font-bold text-black/40 dark:text-white/40">Jitter</div>
                                                <div className="text-lg font-bold tabular-nums">{result.jitterStatus} <span className="text-xs font-medium text-black/40">ms</span></div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-[10px] uppercase tracking-widest font-bold text-black/40 dark:text-white/40">Ping Progress</div>
                                                <div className="text-lg font-bold tabular-nums">{(result.pingProgress * 100).toFixed(0)} <span className="text-xs font-medium text-black/40">%</span></div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-[10px] uppercase tracking-widest font-bold text-black/40 dark:text-white/40">Provider</div>
                                                <div className="text-lg font-bold truncate">LibreSpeed</div>
                                            </div>
                                        </div>

                                        {/* Real-time Graphs (Split) */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Download Graph */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between px-1">
                                                    <div className="text-[10px] uppercase tracking-widest font-bold text-blue-500/60 dark:text-blue-400/60">Download Stream</div>
                                                    <div className="text-[10px] font-mono opacity-40">{result.testState === 1 ? 'LIVE' : 'IDLE'}</div>
                                                </div>
                                                <div className="h-32 w-full min-h-[150px] bg-black/5 dark:bg-white/5 rounded-xl p-2">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <AreaChart data={dlChartData}>
                                                            <defs>
                                                                <linearGradient id="colorDl" x1="0" y1="0" x2="0" y2="1">
                                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                                </linearGradient>
                                                            </defs>
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.05} />
                                                            <Area type="monotone" dataKey="val" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDl)" strokeWidth={2} isAnimationActive={false} />
                                                        </AreaChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>

                                            {/* Upload Graph */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between px-1">
                                                    <div className="text-[10px] uppercase tracking-widest font-bold text-purple-500/60 dark:text-purple-400/60">Upload Stream</div>
                                                    <div className="text-[10px] font-mono opacity-40">{result.testState === 3 ? 'LIVE' : 'IDLE'}</div>
                                                </div>
                                                <div className="h-32 w-full min-h-[150px] bg-black/5 dark:bg-white/5 rounded-xl p-2">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <AreaChart data={ulChartData}>
                                                            <defs>
                                                                <linearGradient id="colorUl" x1="0" y1="0" x2="0" y2="1">
                                                                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.1} />
                                                                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                                                </linearGradient>
                                                            </defs>
                                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.05} />
                                                            <Area type="monotone" dataKey="val" stroke="#a855f7" fillOpacity={1} fill="url(#colorUl)" strokeWidth={2} isAnimationActive={false} />
                                                        </AreaChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Control Bar */}
                                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                            {!isTesting ? (
                                                <Button onClick={startTest} size="lg" className="w-full sm:flex-1 h-14 text-lg font-bold transition-transform active:scale-95 shadow-xl shadow-blue-500/20">
                                                    <Play className="w-5 h-5 mr-2 fill-current" /> Start Test
                                                </Button>
                                            ) : (
                                                <Button onClick={abortTest} variant="destructive" size="lg" className="w-full sm:flex-1 h-14 text-lg font-bold">
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Abort Test
                                                </Button>
                                            )}
                                            <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 border-black/10 dark:border-white/20">
                                                <Globe className="w-5 h-5 mr-2" /> Global Stats
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="stats" className="outline-none">
                                <Stats />
                            </TabsContent>
                        </Tabs>

                        {/* Bottom Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="border-black/5 dark:border-white/10 bg-transparent shadow-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-default">
                                <CardHeader>
                                    <Activity className="w-6 h-6 mb-2 text-blue-500" />
                                    <CardTitle className="text-base">Real-time Metrics</CardTitle>
                                    <CardDescription>Live telemetry data processed by local nodes.</CardDescription>
                                </CardHeader>
                            </Card>
                            <Card className="border-black/5 dark:border-white/10 bg-transparent shadow-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-default">
                                <CardHeader>
                                    <ShieldCheck className="w-6 h-6 mb-2 text-emerald-500" />
                                    <CardTitle className="text-base">Privacy First</CardTitle>
                                    <CardDescription>Your IP is redacted and no tracking cookies are used.</CardDescription>
                                </CardHeader>
                            </Card>
                            <Card className="border-black/5 dark:border-white/10 bg-transparent shadow-none hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-default">
                                <CardHeader>
                                    <Zap className="w-6 h-6 mb-2 text-amber-500" />
                                    <CardTitle className="text-base">Edge Delivery</CardTitle>
                                    <CardDescription>Results delivered via a global edge network.</CardDescription>
                                </CardHeader>
                            </Card>
                        </div>

                        {/* Footer */}
                        <footer className="pt-24 pb-12 border-t border-black/5 dark:border-white/10 text-center">
                            <p className="text-sm text-black/40 dark:text-white/40">
                                © 2026 speed.test — Built with React & LibreSpeed.
                            </p>
                        </footer>
                    </div>
                </main>
            </div>
        </>
    )
}
