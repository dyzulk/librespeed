import { useState, useEffect, useMemo, type FormEvent } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ArrowDown, ArrowUp, History, LayoutDashboard, Lock, LogOut, RefreshCw, Search, Table as TableIcon } from 'lucide-react'

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
        try {
            const res = await fetch('/results/api.php?op=check');
            const d = await res.json();
            setIsLogged(d.logged);
            if (d.logged) fetchStats();
        } catch (e) {
            console.error(e);
            setIsLogged(false);
        }
    };

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await fetch('/results/api.php?op=stats');
            if (res.ok) {
                const d = await res.json();
                setData(d);
            } else if (res.status === 403) {
                setIsLogged(false);
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
            <div className="max-w-md mx-auto py-24">
                <Card className="border-black/5 dark:border-white/10 shadow-2xl">
                    <CardHeader className="text-center">
                        <div className="w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-6 h-6 text-white dark:text-black" />
                        </div>
                        <CardTitle className="text-2xl">Security Protocol</CardTitle>
                        <CardDescription>Authentication required to access network telemetry.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={login} className="space-y-4">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Admin Password"
                                className="w-full px-4 h-12 rounded-lg bg-black/5 dark:bg-white/5 border border-transparent focus:border-blue-500 outline-none transition-all"
                                required
                            />
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            <Button type="submit" className="w-full h-12 font-bold" disabled={loading}>
                                {loading ? <RefreshCw className="animate-spin mr-2" /> : 'Decrypt Access'}
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
                <Card className="border-black/5 dark:border-white/10 bg-white dark:bg-[#0a0a0a]">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] uppercase tracking-widest font-bold">Total Sessions</CardDescription>
                        <CardTitle className="text-3xl font-black">{data?.summary.total_tests || 0}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
                            <History className="w-3 h-3" /> Historical Data
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-black/5 dark:border-white/10 bg-white dark:bg-[#0a0a0a]">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] uppercase tracking-widest font-bold">Avg Download</CardDescription>
                        <CardTitle className="text-3xl font-black">
                            {data?.summary.avg_download || 0} <span className="text-sm font-normal text-black/40">Mbps</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-1.5 text-xs text-blue-500 font-medium">
                            <ArrowDown className="w-3 h-3" /> Network Ingress
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-black/5 dark:border-white/10 bg-white dark:bg-[#0a0a0a]">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] uppercase tracking-widest font-bold">Avg Upload</CardDescription>
                        <CardTitle className="text-3xl font-black">
                            {data?.summary.avg_upload || 0} <span className="text-sm font-normal text-black/40">Mbps</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-1.5 text-xs text-amber-500 font-medium">
                            <ArrowUp className="w-3 h-3" /> Network Egress
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-black/5 dark:border-white/10 bg-white dark:bg-[#0a0a0a]">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-[10px] uppercase tracking-widest font-bold">Avg Latency</CardDescription>
                        <CardTitle className="text-3xl font-black">
                            {data?.summary.avg_ping || 0} <span className="text-sm font-normal text-black/40">ms</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-1.5 text-xs text-purple-500 font-medium">
                            <RefreshCw className="w-3 h-3" /> Round Trip
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Analytics Chart */}
            <Card className="border-black/5 dark:border-white/10 bg-white dark:bg-[#0a0a0a] overflow-hidden">
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
            <Card className="border-black/5 dark:border-white/10 bg-white dark:bg-[#0a0a0a] overflow-hidden">
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
