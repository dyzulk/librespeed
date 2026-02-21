<?php

namespace App\Http\Controllers;

use App\Models\SpeedtestUser;
use Illuminate\Http\Request;

class TelemetryController extends Controller
{
    public function store(Request $request)
    {
        $telemetry = SpeedtestUser::create([
            'ip' => $request->ip(),
            'ispinfo' => $request->input('ispinfo'),
            'extra' => $request->input('extra'),
            'ua' => $request->userAgent(),
            'lang' => $request->header('Accept-Language'),
            'dl' => $request->input('dl'),
            'ul' => $request->input('ul'),
            'ping' => $request->input('ping'),
            'jitter' => $request->input('jitter'),
            'log' => $request->input('log'),
        ]);

        return response('id ' . $telemetry->id);
    }

    public function stats()
    {
        $results = SpeedtestUser::latest()->limit(100)->get();

        $summary = [
            'total_tests' => SpeedtestUser::count(),
            'avg_download' => round(SpeedtestUser::avg('dl') ?? 0, 2),
            'avg_upload' => round(SpeedtestUser::avg('ul') ?? 0, 2),
            'avg_ping' => round(SpeedtestUser::avg('ping') ?? 0, 2),
        ];

        return response()->json([
            'summary' => $summary,
            'results' => $results,
        ]);
    }

    public function getIp()
    {
        return response(request()->ip());
    }
}
