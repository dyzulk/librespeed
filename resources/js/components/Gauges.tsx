import { ArrowDown, ArrowUp } from 'lucide-react';

interface GaugesProps {
    dlStatus: string;
    ulStatus: string;
    dlProgress: number;
    ulProgress: number;
}

export function Gauges({ dlStatus, ulStatus, dlProgress, ulProgress }: GaugesProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6 group">
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                        <ArrowDown className="w-3.5 h-3.5 text-blue-500" /> Download
                    </span>
                    <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase opacity-40">Mbps</span>
                </div>
                <div className="text-8xl font-black tabular-nums tracking-[-0.05em] text-foreground leading-none">
                    {dlStatus}
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 transition-all duration-300 ease-out"
                        style={{ width: `${dlProgress * 100}%` }}
                    />
                </div>
            </div>

            <div className="space-y-6 group">
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                        <ArrowUp className="w-3.5 h-3.5 text-purple-500" /> Upload
                    </span>
                    <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase opacity-40">Mbps</span>
                </div>
                <div className="text-8xl font-black tabular-nums tracking-[-0.05em] text-foreground leading-none">
                    {ulStatus}
                </div>
                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                        className="h-full bg-purple-500 transition-all duration-300 ease-out"
                        style={{ width: `${ulProgress * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
