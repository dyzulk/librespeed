import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Progress } from "@/Components/ui/progress"
import { Badge } from "@/Components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { useSpeedtest } from '@/Hooks/use-speedtest'
import { Stats } from '@/Components/Stats'
import { ThemeToggle } from '@/Components/ThemeToggle'
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, Tooltip } from 'recharts'
import { Activity, ArrowDown, ArrowUp, Globe, LayoutDashboard, Loader2, Play, ShieldCheck, Zap, Info } from 'lucide-react'
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
            <div className="min-h-screen bg-[#fafafa] dark:bg-black text-black dark:text-white font-sans selection:bg-blue-100 dark:selection:bg-blue-900/40 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

                {/* Header */}
                <header className="sticky top-0 z-50 w-full border-b border-black/5 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-xl">
                    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2 group cursor-pointer">
                            <div className="w-9 h-9 bg-black dark:bg-white rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12 duration-300">
                                <Zap className="w-5 h-5 text-white dark:text-black fill-current" />
                            </div>
                            <span className="font-black text-xl tracking-tighter">speed.test</span>
                        </div>
                        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-black/50 dark:text-white/50">
                            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Infrastructure</a>
                            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Global Edge</a>
                            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">API Docs</a>
                        </nav>
                        <div className="flex items-center gap-4">
                            <Badge variant="outline" className="hidden sm:flex gap-1.5 border-black/10 dark:border-white/20 bg-black/5 dark:bg-white/5 px-3 py-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                <span className="text-[10px] uppercase tracking-tighter font-bold">Node: SG-01</span>
                            </Badge>
                            <ThemeToggle />
                            <Button variant="default" size="sm" className="hidden sm:flex font-bold rounded-full px-5">Join Beta</Button>
                        </div>
                    </div>
                </header>

                <main className="container mx-auto px-4 py-12 md:py-24">
                    <div className="max-w-4xl mx-auto space-y-12">

                        <div className="text-center space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest border border-blue-500/20">
                                <Globe className="w-3 h-3" /> v2.4.0 Deployment Active
                            </div>
                            <h1 className="text-5xl md:text-8xl font-black tracking-tightest leading-tight bg-gradient-to-b from-black to-black/40 dark:from-white dark:to-white/20 bg-clip-text text-transparent">
                                Network <br /> Intelligence.
                            </h1>
                            <p className="text-lg md:text-xl text-black/50 dark:text-white/50 max-w-2xl mx-auto font-medium">
                                High-precision network performance metrics served via our geographically distributed edge clusters.
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

                            <TabsContent value="test" className="space-y-12 outline-none animate-in fade-in slide-in-from-bottom-8 duration-1000">
                                {/* Speedtest Card */}
                                <Card className="border-black/5 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] backdrop-blur-2xl shadow-2xl shadow-black/10 relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

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
                                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                            {!isTesting ? (
                                                <Button onClick={startTest} size="lg" className="w-full sm:flex-1 h-16 text-lg font-black uppercase tracking-widest transition-all hover:shadow-2xl hover:shadow-blue-500/40 active:scale-[0.98] bg-blue-600 hover:bg-blue-500 text-white rounded-2xl group">
                                                    <Play className="w-6 h-6 mr-3 fill-current group-hover:scale-110 transition-transform" /> Start Diagnostic
                                                </Button>
                                            ) : (
                                                <Button onClick={abortTest} variant="destructive" size="lg" className="w-full sm:flex-1 h-16 text-lg font-black uppercase tracking-widest rounded-2xl">
                                                    <Loader2 className="w-6 h-6 mr-3 animate-spin" /> Terminate Test
                                                </Button>
                                            )}
                                            <Button variant="outline" size="lg" className="w-full sm:w-auto h-16 px-10 border-black/10 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 font-bold rounded-2xl">
                                                <Globe className="w-5 h-5 mr-3 opacity-50" /> Network Map
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { icon: Activity, title: 'Real-time Metrics', desc: 'Atomic-level telemetry processed by our local compute nodes.', color: 'blue' },
                                { icon: ShieldCheck, title: 'Security First', desc: 'Privacy-hardened nodes with IP redaction and zero-tracking.', color: 'emerald' },
                                { icon: Zap, title: 'Global Backbone', desc: 'Ultra-low latency delivery via our primary SDN backbone.', color: 'amber' },
                            ].map((feature, i) => (
                                <Card key={i} className="border-black/5 dark:border-white/10 bg-white/30 dark:bg-white/[0.01] backdrop-blur-xl shadow-none hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-500 cursor-default group overflow-hidden relative">
                                    <div className={`absolute top-0 right-0 w-24 h-24 bg-${feature.color}-500/5 blur-3xl rounded-full transition-transform group-hover:scale-150 duration-700`} />
                                    <CardHeader className="relative">
                                        <feature.icon className={`w-8 h-8 mb-4 text-${feature.color}-500 transition-transform group-hover:-translate-y-1 duration-300`} />
                                        <CardTitle className="text-lg font-black tracking-tight">{feature.title}</CardTitle>
                                        <CardDescription className="text-sm font-medium leading-relaxed opacity-60">{feature.desc}</CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>

                        {/* Footer */}
                        <footer className="pt-32 pb-16 border-t border-black/5 dark:border-white/10">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                                <div className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                                    <Zap className="w-5 h-5 fill-current" />
                                    <span className="font-black text-sm tracking-widest uppercase">speed.test</span>
                                </div>
                                <p className="text-xs font-bold text-black/30 dark:text-white/20 tracking-wide uppercase">
                                    © 2026 speed.test — Built with React & LibreSpeed.
                                </p>
                                <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest opacity-30">
                                    <a href="#" className="hover:opacity-100 transition-opacity">Privacy</a>
                                    <a href="#" className="hover:opacity-100 transition-opacity">Terms</a>
                                    <a href="#" className="hover:opacity-100 transition-opacity">Uptime</a>
                                </div>
                            </div>
                        </footer>
                    </div>
                </main>
            </div>
        </>
    )
}
