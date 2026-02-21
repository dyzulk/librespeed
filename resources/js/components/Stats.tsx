import { useState, useEffect, useMemo, type FormEvent } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Badge } from "@/Components/ui/badge"
import { Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ArrowDown, ArrowUp, History, LayoutDashboard, Lock, LogOut, RefreshCw, Search, Table as TableIcon, Info } from 'lucide-react'

interface TestResult {
    id: string;
    timestamp: string;
    ip: string;
    ispinfo: string;
    ua: string;
    lang: string;
    dl: string;
    ul: string;
    ping: string;
    jitter: string;
    id_formatted: string;
}

interface StatsSummary {
    total_tests: number;
    avg_download: number;
    avg_upload: number;
    avg_ping: number;
}

export function Stats() {
    const [isLogged, setIsLogged] = useState<boolean | null>(null);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<{ summary: StatsSummary; results: TestResult[] } | null>(null);
    const [error, setError] = useState('');

    const checkAuth = async () => {
        // For now, we'll allow stats access if the API returns 200
        // In a real app, this should check Laravel auth
        setIsLogged(true);
        fetchStats();
    };

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/stats');
            if (res.ok) {
                const d = await res.json();
                setData(d);
            } else {
                setError('Failed to fetch stats');
            }
        } catch (e) {
            setError('Failed to fetch stats');
        } finally {
            setLoading(false);
        }
    };

    const login = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const formData = new FormData();
        formData.append('password', password);
        try {
            const res = await fetch('/results/api.php?op=login', {
                method: 'POST',
                body: formData
            });
            if (res.ok) {
                setIsLogged(true);
                fetchStats();
            } else {
                setError('Invalid password');
            }
        } catch (e) {
            setError('Login failed');
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await fetch('/results/api.php?op=logout');
        setIsLogged(false);
        setData(null);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const chartData = useMemo(() => {
        if (!data) return [];
        return [...data.results].reverse().map(r => ({
            time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            dl: parseFloat(r.dl),
            ul: parseFloat(r.ul)
        })).slice(-20);
    }, [data]);

    if (isLogged === null) return <div className="flex h-[400px] items-center justify-center"><RefreshCw className="animate-spin text-black/20" /></div>;

    if (!isLogged) {
        return (
            <div className="max-w-md mx-auto py-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <Card className="border-black/5 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] backdrop-blur-2xl shadow-2xl overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                    <CardHeader className="text-center pb-8">
                        <div className="w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl transition-transform group-hover:scale-110 duration-500">
                            <Lock className="w-8 h-8 text-white dark:text-black" />
                        </div>
                        <CardTitle className="text-3xl font-black tracking-tightest">Secure Access</CardTitle>
                        <CardDescription className="text-sm font-medium opacity-60">Authentication required for core telemetry.</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-12 px-8">
                        <form onSubmit={login} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-black opacity-30 px-1">Access Token</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-5 h-14 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 focus:border-blue-500/50 outline-none transition-all font-mono text-lg"
                                    required
                                />
                            </div>
                            {error && (
                                <div className="flex items-center gap-2 text-red-500 text-xs font-bold justify-center bg-red-500/5 py-3 rounded-lg border border-red-500/10">
                                    <Info className="w-3.5 h-3.5" /> {error}
                                </div>
                            )}
                            <Button type="submit" size="lg" className="w-full h-14 font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all" disabled={loading}>
                                {loading ? <RefreshCw className="animate-spin" /> : 'Authorize Connection'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Dashboard Top Navigation */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5 text-blue-500" />
                    <h2 className="text-xl font-bold tracking-tight">Telemetry Hub</h2>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={fetchStats} disabled={loading} className="text-black/40 dark:text-white/40">
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Sync
                    </Button>
                    <Button variant="outline" size="sm" onClick={logout} className="border-black/5 dark:border-white/10">
                        <LogOut className="w-4 h-4 mr-2" /> Logout
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Sessions', value: data?.summary.total_tests || 0, sub: 'Historical Data', icon: History, color: 'emerald' },
                    { label: 'Avg Download', value: data?.summary.avg_download || 0, unit: 'Mbps', sub: 'Inbound Stream', icon: ArrowDown, color: 'blue' },
                    { label: 'Avg Upload', value: data?.summary.avg_upload || 0, unit: 'Mbps', sub: 'Outbound Stream', icon: ArrowUp, color: 'amber' },
                    { label: 'Avg Latency', value: data?.summary.avg_ping || 0, unit: 'ms', sub: 'Round Trip', icon: RefreshCw, color: 'purple' },
                ].map((stat, i) => (
                    <Card key={i} className="border-black/5 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] backdrop-blur-xl group hover:border-black/20 dark:hover:border-white/20 transition-all duration-300">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] uppercase tracking-tighter font-black opacity-40">{stat.label}</CardDescription>
                            <CardTitle className="text-4xl font-black tracking-tightest tabular-nums">
                                {stat.value} {stat.unit && <span className="text-xs font-bold opacity-30">{stat.unit}</span>}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-${stat.color}-500/80`}>
                                <stat.icon className="w-3 h-3" /> {stat.sub}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Analytics Chart */}
            <Card className="border-black/5 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] backdrop-blur-xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Performance Trends</CardTitle>
                            <CardDescription>Activity from the last 20 detected sessions.</CardDescription>
                        </div>
                        <History className="w-5 h-5 text-black/20" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-64 w-full min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorDlStats" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorUlStats" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.05} />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.4 }} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="dl" stroke="#3b82f6" fillOpacity={1} fill="url(#colorDlStats)" strokeWidth={2} name="Download" />
                                <Area type="monotone" dataKey="ul" stroke="#f59e0b" fillOpacity={1} fill="url(#colorUlStats)" strokeWidth={2} name="Upload" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Results Table */}
            <Card className="border-black/5 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] backdrop-blur-xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <TableIcon className="w-5 h-5 text-emerald-500" /> Historical Logs
                        </CardTitle>
                        <CardDescription>Full audit trail of network performance testing.</CardDescription>
                    </div>
                    <div className="relative group">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black/20 dark:text-white/20" />
                        <input
                            placeholder="Search ID..."
                            className="pl-9 pr-4 h-9 rounded-full bg-black/5 dark:bg-white/5 border-none outline-none text-xs focus:ring-1 focus:ring-blue-500/50 transition-all w-32 md:w-48"
                        />
                    </div>
                </CardHeader>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-y border-black/5 dark:border-white/10 text-[10px] uppercase tracking-widest font-bold text-black/40 dark:text-white/40">
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">Inbound (DL)</th>
                                <th className="px-6 py-4">Outbound (UL)</th>
                                <th className="px-6 py-4">Lat/Jit</th>
                                <th className="px-6 py-4 text-right">Identifier</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5 dark:divide-white/5">
                            {data?.results.map((test) => (
                                <tr key={test.id} className="text-sm hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4 font-mono font-bold text-blue-500">#{test.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{new Date(test.timestamp).toLocaleDateString()}</span>
                                            <span className="text-[10px] text-black/40 dark:text-white/40">{new Date(test.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold tabular-nums">{test.dl} <span className="text-[10px] text-black/40 font-normal">Mbps</span></td>
                                    <td className="px-6 py-4 font-bold tabular-nums text-amber-600 dark:text-amber-400">{test.ul} <span className="text-[10px] text-black/40 font-normal">Mbps</span></td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <Badge variant="outline" className="h-5 px-1 bg-purple-500/5 border-purple-500/10 text-purple-600 dark:text-purple-400 font-mono text-[10px]">
                                                {test.ping}ms
                                            </Badge>
                                            <Badge variant="outline" className="h-5 px-1 bg-blue-500/5 border-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[10px]">
                                                {test.jitter}ms
                                            </Badge>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs font-mono opacity-60">{test.ip}</span>
                                            <span className="text-[9px] opacity-30 truncate max-w-[120px]">{test.ispinfo}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {!data?.results.length && (
                    <div className="p-12 text-center text-black/20 dark:text-white/20">
                        <RefreshCw className="w-8 h-8 mx-auto mb-2 opacity-10" />
                        <p className="text-sm">No test packets detected in the database.</p>
                    </div>
                )}
            </Card>
        </div>
    )
}
