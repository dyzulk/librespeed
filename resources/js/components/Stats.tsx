import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Globe, ArrowDown, ArrowUp, Activity, Loader2 } from 'lucide-react';

export function Stats() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/stats')
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch stats:', err);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center p-24">
            <Loader2 className="w-8 h-8 animate-spin opacity-20" />
        </div>
    );

    const chartData = stats?.history?.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })) || [];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Network Points', value: stats?.count || 0, icon: Globe, color: 'text-blue-500' },
                    { label: 'Avg Download', value: `${stats?.averages?.dl || 0}`, icon: ArrowDown, color: 'text-emerald-500' },
                    { label: 'Avg Upload', value: `${stats?.averages?.ul || 0}`, icon: ArrowUp, color: 'text-purple-500' },
                    { label: 'Avg Ping', value: `${stats?.averages?.ping || 0}ms`, icon: Activity, color: 'text-amber-500' },
                ].map((item, i) => (
                    <Card key={i} className="border-border bg-card shadow-sm hover:bg-secondary/20 transition-all">
                        <CardHeader className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</span>
                                <item.icon className={`w-4 h-4 ${item.color}`} />
                            </div>
                            <div className="text-3xl font-black tracking-tighter tabular-nums">{item.value}</div>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            {/* Main Infrastructure Chart */}
            <Card className="border-border bg-card shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="border-b border-border bg-secondary/10 px-8 py-6 flex flex-row items-center justify-between">
                    <div className="space-y-0.5">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Historical Throughput</CardTitle>
                        <CardDescription className="text-xs font-medium italic opacity-60">Real-world performance logging across recent nodes</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.05} />
                                <XAxis
                                    dataKey="timestamp"
                                    stroke="currentColor"
                                    opacity={0.3}
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="currentColor"
                                    opacity={0.3}
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    width={30}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        fontWeight: '600'
                                    }}
                                />
                                <Legend
                                    verticalAlign="top"
                                    align="right"
                                    iconType="circle"
                                    wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', paddingBottom: '20px' }}
                                />
                                <Line type="monotone" dataKey="dl" stroke="hsl(var(--chart-1))" strokeWidth={3} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} name="Download" />
                                <Line type="monotone" dataKey="ul" stroke="hsl(var(--chart-2))" strokeWidth={3} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} name="Upload" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Nodes Table */}
            <Card className="border-border bg-card shadow-sm rounded-xl overflow-hidden text-vercel">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary/10 border-b border-border">
                                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Timestamp</th>
                                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Download</th>
                                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Upload</th>
                                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Latency</th>
                                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Identifier</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {stats?.history?.slice(0, 10).map((entry: any, i: number) => (
                                <tr key={i} className="hover:bg-secondary/10 transition-colors group">
                                    <td className="px-8 py-4 text-xs font-mono font-bold opacity-40">{new Date(entry.timestamp).toLocaleString()}</td>
                                    <td className="px-8 py-4 font-bold text-sm tabular-nums">{entry.dl} <span className="text-[10px] opacity-30">Mbps</span></td>
                                    <td className="px-8 py-4 font-bold text-sm tabular-nums">{entry.ul} <span className="text-[10px] opacity-30">Mbps</span></td>
                                    <td className="px-8 py-4 font-bold text-sm tabular-nums">{entry.ping} <span className="text-[10px] opacity-30">ms</span></td>
                                    <td className="px-8 py-4 text-right">
                                        <Badge variant="outline" className="text-[9px] font-mono border-border bg-background group-hover:bg-foreground group-hover:text-background transition-all">
                                            #{entry.id}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
