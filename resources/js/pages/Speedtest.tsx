import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { useSpeedtest } from '@/Hooks/use-speedtest'
import { Stats } from '@/Components/Stats'
import { ThemeToggle } from '@/Components/ThemeToggle'
import { Gauges } from '@/Components/Gauges'
import { LiveCharts } from '@/Components/LiveCharts'
import { TestControls } from '@/Components/TestControls'
import { FeatureGrid } from '@/Components/FeatureGrid'
import { Activity, Globe, LayoutDashboard, Zap } from 'lucide-react'
import { useState, useMemo } from 'react'
import { Head } from '@inertiajs/react'

export default function Speedtest() {
    const {
        result,
        startTest,
        abortTest
    } = useSpeedtest();

    const {
        testState,
        dlStatus,
        ulStatus,
        pingStatus,
        jitterStatus,
        dlProgress,
        ulProgress,
        chartData
    } = result;

    const isTesting = testState >= 0 && testState < 4;

    const [activeTab, setActiveTab] = useState('test');

    const formattedChartData = useMemo(() => {
        return chartData.map((d: { dl: string; ul: string; ping: string; jitter: string }, i: number) => ({
            time: i.toString(),
            dl: parseFloat(d.dl),
            ul: parseFloat(d.ul),
            ping: parseFloat(d.ping),
            jitter: parseFloat(d.jitter)
        }));
    }, [chartData]);

    return (
        <>
            <Head title="Network Speed Test" />
            <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10 relative overflow-hidden transition-colors duration-300">
                {/* Background Glow Points - subtle for Vercel feel */}
                <div className="bg-glow-point top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 dark:bg-blue-500/5" />
                <div className="bg-glow-point bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-500/5" />

                {/* Header */}
                <header className="glass-header">
                    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => setActiveTab('test')}>
                            <div className="w-8 h-8 bg-foreground rounded flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
                                <Zap className="w-5 h-5 text-background fill-current" />
                            </div>
                            <span className="font-bold text-xl tracking-tight">speed.test</span>
                        </div>
                        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                            <a href="#" className="hover:text-foreground transition-colors">Infrastructure</a>
                            <a href="#" className="hover:text-foreground transition-colors">Edge Network</a>
                            <a href="#" className="hover:text-foreground transition-colors">API</a>
                        </nav>
                        <div className="flex items-center gap-4">
                            <Badge variant="outline" className="hidden sm:flex gap-1.5 border-border bg-secondary/50 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                SG-01
                            </Badge>
                            <ThemeToggle />
                        </div>
                    </div>
                </header>

                <main className="container mx-auto px-4 py-8 md:py-12">
                    <div className="max-w-4xl mx-auto space-y-12">

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <div className="flex justify-center mb-16">
                                <TabsList className="tabs-list-vercel h-10">
                                    <TabsTrigger value="test" className="tabs-trigger-vercel gap-2">
                                        <Activity className="w-3.5 h-3.5" /> Speed Test
                                    </TabsTrigger>
                                    <TabsTrigger value="stats" className="tabs-trigger-vercel gap-2">
                                        <LayoutDashboard className="w-3.5 h-3.5" /> Analytics
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="test" className="space-y-16 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="space-y-12">
                                    <Card className="border-border bg-card shadow-sm rounded-xl overflow-hidden">
                                        <CardHeader className="border-b border-border bg-secondary/10 px-8 py-6">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Telemetery Node</CardTitle>
                                                    <CardDescription className="text-xs font-medium font-mono">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</CardDescription>
                                                </div>
                                                <div className="flex gap-8">
                                                    <div className="text-right">
                                                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Latancy</div>
                                                        <div className="font-mono font-bold text-sm">{pingStatus || '--'}<span className="text-[10px] ml-0.5 opacity-40">ms</span></div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Jitter</div>
                                                        <div className="font-mono font-bold text-sm">{jitterStatus || '--'}<span className="text-[10px] ml-0.5 opacity-40">ms</span></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="px-8 py-10 space-y-12">
                                            <Gauges
                                                dlStatus={dlStatus}
                                                ulStatus={ulStatus}
                                                dlProgress={dlProgress}
                                                ulProgress={ulProgress}
                                            />

                                            <LiveCharts data={formattedChartData} />

                                            <TestControls
                                                isTesting={isTesting}
                                                startTest={startTest}
                                                abortTest={abortTest}
                                            />
                                        </CardContent>
                                    </Card>

                                    <FeatureGrid />
                                </div>
                            </TabsContent>

                            <TabsContent value="stats" className="outline-none">
                                <Stats />
                            </TabsContent>
                        </Tabs>

                        {/* Footer */}
                        <footer className="pt-24 pb-16 border-t border-border mt-32">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setActiveTab('test')}>
                                    <Zap className="w-5 h-5 fill-current" />
                                    <span className="font-bold text-sm tracking-tight uppercase">speed.test</span>
                                </div>
                                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                                    © 2026 speed.test — Built with React & LibreSpeed.
                                </p>
                                <div className="flex gap-8 text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
                                    <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                                    <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                                    <a href="#" className="hover:text-foreground transition-colors">Status</a>
                                </div>
                            </div>
                        </footer>
                    </div>
                </main>
            </div>
        </>
    );
}
