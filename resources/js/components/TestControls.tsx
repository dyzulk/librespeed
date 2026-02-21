import { Button } from "@/Components/ui/button";
import { Play, Loader2, Globe } from 'lucide-react';

interface TestControlsProps {
    isTesting: boolean;
    startTest: () => void;
    abortTest: () => void;
}

export function TestControls({ isTesting, startTest, abortTest }: TestControlsProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {!isTesting ? (
                <button
                    onClick={startTest}
                    className="w-full sm:flex-1 h-12 text-sm font-bold uppercase tracking-widest transition-all active:scale-[0.98] bg-foreground text-background hover:opacity-90 rounded-md group flex items-center justify-center gap-3"
                >
                    <Play className="w-4 h-4 fill-current transition-transform group-hover:scale-110" />
                    Run Diagnostics
                </button>
            ) : (
                <button
                    onClick={abortTest}
                    className="w-full sm:flex-1 h-12 text-sm font-bold uppercase tracking-widest rounded-md bg-destructive text-destructive-foreground hover:opacity-90 transition-all flex items-center justify-center gap-3"
                >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Abort Mission
                </button>
            )}
            <Button variant="outline" className="w-full sm:w-auto h-12 px-8 border-border hover:bg-secondary font-bold text-sm tracking-wide rounded-md">
                <Globe className="w-4 h-4 mr-2.5 opacity-60" /> Node Network
            </Button>
        </div>
    );
}
