import { useState, useEffect, useCallback, useRef } from 'react';

export interface SpeedtestResult {
    testState: number;
    dlStatus: string;
    ulStatus: string;
    pingStatus: string;
    jitterStatus: string;
    clientIp: string;
    dlProgress: number;
    ulProgress: number;
    pingProgress: number;
    testId?: string;
    chartData: Array<{ dl: string; ul: string }>;
}

export function useSpeedtest() {
    const [result, setResult] = useState<SpeedtestResult>({
        testState: -1,
        dlStatus: '0.00',
        ulStatus: '0.00',
        pingStatus: '0',
        jitterStatus: '0',
        clientIp: '',
        dlProgress: 0,
        ulProgress: 0,
        pingProgress: 0,
        chartData: [],
    });

    const workerRef = useRef<Worker | null>(null);
    const intervalRef = useRef<any>(null);

    const cleanup = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => {
            cleanup();
            if (workerRef.current) {
                workerRef.current.terminate();
            }
        };
    }, [cleanup]);

    const startTest = useCallback(() => {
        cleanup();
        if (workerRef.current) {
            workerRef.current.terminate();
        }

        workerRef.current = new Worker('/speedtest_worker.js');

        workerRef.current.onmessage = (e: MessageEvent) => {
            try {
                const data = JSON.parse(e.data);
                setResult((prev: SpeedtestResult) => {
                    const next = { ...prev, ...data };
                    // Only add to chart data if it's a real status update (state 1, 2, or 3)
                    if (data.testState >= 1 && data.testState <= 3) {
                        const lastPoint = prev.chartData[prev.chartData.length - 1];
                        // Avoid duplicate points if status hasn't changed much
                        if (!lastPoint || lastPoint.dl !== data.dlStatus || lastPoint.ul !== data.ulStatus) {
                            next.chartData = [...prev.chartData, { dl: data.dlStatus, ul: data.ulStatus }].slice(-60);
                        }
                    }
                    return next;
                });

                // If finished or aborted, stop polling
                if (data.testState >= 4) {
                    cleanup();
                }
            } catch (err) {
                // Ignore non-json messages
            }
        };

        workerRef.current.postMessage('start ' + JSON.stringify({
            telemetry_level: "basic",
            url_getIp: "/api/getIp",
            url_telemetry: "/api/telemetry",
            url_dl: "backend/garbage.php",
            url_ul: "backend/empty.php",
            url_ping: "backend/empty.php"
        }));

        // Start polling for status
        intervalRef.current = window.setInterval(() => {
            if (workerRef.current) {
                workerRef.current.postMessage('status');
            }
        }, 100);
        setResult(prev => ({ ...prev, chartData: [], testState: 0 }));
    }, [cleanup]);

    const abortTest = useCallback(() => {
        cleanup();
        if (workerRef.current) {
            workerRef.current.postMessage('abort');
            workerRef.current.terminate();
            workerRef.current = null;
        }
        setResult((prev: SpeedtestResult) => ({ ...prev, testState: -1 }));
    }, [cleanup]);

    return { result, startTest, abortTest };
}
