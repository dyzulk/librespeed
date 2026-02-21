import { Card, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Activity, ShieldCheck, Zap } from 'lucide-react';

export function FeatureGrid() {
    const features = [
        { icon: Activity, title: 'Real-time Metrics', desc: 'Atomic-level telemetry processed by our local compute nodes.', color: 'text-blue-500' },
        { icon: ShieldCheck, title: 'Security First', desc: 'Privacy-hardened nodes with IP redaction and zero-tracking.', color: 'text-emerald-500' },
        { icon: Zap, title: 'Global Backbone', desc: 'Ultra-low latency delivery via our primary SDN backbone.', color: 'text-amber-500' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
                <Card key={i} className="border-border bg-card hover:bg-secondary/20 transition-all duration-300 cursor-default group shadow-sm rounded-lg overflow-hidden border">
                    <CardHeader className="p-6 relative">
                        <feature.icon className={`w-7 h-7 mb-4 ${feature.color} transition-transform group-hover:-translate-y-1 duration-200`} />
                        <CardTitle className="text-sm font-bold tracking-tight mb-2 uppercase">{feature.title}</CardTitle>
                        <CardDescription className="text-xs font-medium leading-relaxed text-muted-foreground">{feature.desc}</CardDescription>
                    </CardHeader>
                </Card>
            ))}
        </div>
    );
}
