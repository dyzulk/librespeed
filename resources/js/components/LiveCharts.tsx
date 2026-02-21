import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface ChartDataPoint {
    time: string;
    dl: number;
    ul: number;
}

interface LiveChartsProps {
    data: ChartDataPoint[];
}

export function LiveCharts({ data }: LiveChartsProps) {
    return (
        <div className="h-48 md:h-64 w-full mt-4 bg-secondary/20 border border-border rounded-lg p-2 overflow-hidden transition-all hover:bg-secondary/30">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorDl" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorUl" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.05} />
                    <XAxis
                        dataKey="time"
                        hide
                    />
                    <YAxis
                        hide
                        domain={[0, 'auto']}
                    />
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
                        itemStyle={{ padding: '2px 0' }}
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
                        isAnimationActive={true}
                        animationDuration={300}
                    />
                    <Area
                        type="monotone"
                        dataKey="ul"
                        stroke="hsl(var(--chart-2))"
                        fillOpacity={1}
                        fill="url(#colorUl)"
                        strokeWidth={2}
                        name="Upload"
                        isAnimationActive={true}
                        animationDuration={300}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
