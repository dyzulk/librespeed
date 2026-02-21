<?php
session_start();
error_reporting(0);

require 'telemetry_settings.php';
require_once 'telemetry_db.php';

header('Content-Type: application/json');

$op = $_GET['op'] ?? '';

// Login check
if ($op === 'login') {
    $password = $_POST['password'] ?? '';
    if (isset($stats_password) && $password === $stats_password) {
        $_SESSION['logged'] = true;
        echo json_encode(['success' => true]);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid password']);
    }
    exit;
}

// Session check
if ($op === 'check') {
    echo json_encode(['logged' => (isset($_SESSION['logged']) && $_SESSION['logged'] === true)]);
    exit;
}

// Authentication guard for data
if (!isset($_SESSION['logged']) || $_SESSION['logged'] !== true) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

// Logout
if ($op === 'logout') {
    $_SESSION['logged'] = false;
    echo json_encode(['success' => true]);
    exit;
}

// Fetch Stats
if ($op === 'stats') {
    $speedtests = getLatestSpeedtestUsers();
    
    if (false === $speedtests) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error fetching tests']);
        exit;
    }

    // Calculate Summary
    $total = count($speedtests);
    $avgDl = 0;
    $avgUl = 0;
    $avgPing = 0;
    
    if ($total > 0) {
        foreach ($speedtests as $test) {
            $avgDl += floatval($test['dl']);
            $avgUl += floatval($test['ul']);
            $avgPing += floatval($test['ping']);
        }
        $avgDl /= $total;
        $avgUl /= $total;
        $avgPing /= $total;
    }

    echo json_encode([
        'success' => true,
        'summary' => [
            'total_tests' => $total,
            'avg_download' => round($avgDl, 2),
            'avg_upload' => round($avgUl, 2),
            'avg_ping' => round($avgPing, 1)
        ],
        'results' => $speedtests
    ]);
    exit;
}

http_response_code(400);
echo json_encode(['success' => false, 'message' => 'Invalid operation']);
