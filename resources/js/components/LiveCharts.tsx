import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';

interface ChartDataPoint {
    time: string;
    dl: number;
    ul: number;
    ping: number;
    jitter: number;
}

interface LiveChartsProps {
    data: ChartDataPoint[];
}

export function LiveCharts({ data }: LiveChartsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full mt-4">
            {/* Download Chart */}
            <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase opacity-50">Download</span>
                </div>
                <div className="h-40 w-full bg-secondary/5 border border-border rounded-lg p-2 overflow-hidden transition-all hover:bg-secondary/10">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorDl" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.05} />
                            <XAxis dataKey="time" hide />
                            <YAxis hide domain={[0, 'auto']} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '4px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    padding: '8px 12px'
                                }}
                                cursor={{ stroke: 'hsl(var(--foreground))', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.2 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="dl"
                                stroke="hsl(var(--chart-1))"
                                fillOpacity={1}
                                fill="url(#colorDl)"
                                strokeWidth={2}
                                name="Download"
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Upload Chart */}
            <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase opacity-50">Upload</span>
                </div>
                <div className="h-40 w-full bg-secondary/5 border border-border rounded-lg p-2 overflow-hidden transition-all hover:bg-secondary/10">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorUl" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.05} />
                            <XAxis dataKey="time" hide />
                            <YAxis hide domain={[0, 'auto']} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '4px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    padding: '8px 12px'
                                }}
                                cursor={{ stroke: 'hsl(var(--foreground))', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.2 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="ul"
                                stroke="hsl(var(--chart-2))"
                                fillOpacity={1}
                                fill="url(#colorUl)"
                                strokeWidth={2}
                                name="Upload"
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Latency Chart (Ping/Jitter) */}
            <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase opacity-50">Stability</span>
                </div>
                <div className="h-40 w-full bg-secondary/5 border border-border rounded-lg p-2 overflow-hidden transition-all hover:bg-secondary/10">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.05} />
                            <XAxis dataKey="time" hide />
                            <YAxis hide domain={[0, 'auto']} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    padding: '8px 12px'
                                }}
                                cursor={{ stroke: 'hsl(var(--foreground))', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.2 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="ping"
                                stroke="hsl(var(--chart-3, 142 71% 45%))"
                                strokeWidth={2}
                                dot={false}
                                name="Ping"
                                isAnimationActive={false}
                            />
                            <Line
                                type="monotone"
                                dataKey="jitter"
                                stroke="hsl(var(--chart-4, 47 95% 57%))"
                                strokeWidth={2}
                                dot={false}
                                name="Jitter"
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
