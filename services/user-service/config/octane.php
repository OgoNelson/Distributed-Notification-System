<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Octane Server
    |--------------------------------------------------------------------------
    |
    | This value determines the default "server" that will be used by Octane
    | when starting, restarting, or stopping your server via the CLI. You
    | are free to change this to the supported server of your choice.
    |
    | Supported: "swoole", "roadrunner"
    |
    */

    'server' => env('OCTANE_SERVER', 'swoole'),

    /*
    |--------------------------------------------------------------------------
    | Force HTTPS
    |--------------------------------------------------------------------------
    |
    | When this configuration value is set to "true", Octane will inform the
    | framework that all absolute links must be generated using the HTTPS
    | protocol. Otherwise your links may be generated using plain HTTP.
    |
    */

    'https' => env('OCTANE_HTTPS', false),

    /*
    |--------------------------------------------------------------------------
    | Octane Listeners
    |--------------------------------------------------------------------------
    |
    | All of the event listeners for Octane's events are defined below. These
    | listeners are responsible for resetting your application's state for
    | the next request. You may even add your own listeners to the list.
    |
    */

    'listeners' => [
        \Laravel\Octane\Events\WorkerStarting::class => [
            \Laravel\Octane\Listeners\EnsureUploadedFilesAreValid::class,
            \Laravel\Octane\Listeners\EnsureUploadedFilesCanBeMoved::class,
        ],

        \Laravel\Octane\Events\RequestReceived::class => [
            // \Laravel\Octane\Listeners\FlushOnce::class,
        ],

        \Laravel\Octane\Events\RequestHandled::class => [],

        \Laravel\Octane\Events\RequestTerminated::class => [],

        \Laravel\Octane\Events\TaskReceived::class => [],

        \Laravel\Octane\Events\TaskTerminated::class => [],

        \Laravel\Octane\Events\TickReceived::class => [],

        \Laravel\Octane\Events\TickTerminated::class => [],

        \Laravel\Octane\Events\WorkerErrorOccurred::class => [
            \Laravel\Octane\Listeners\ReportException::class,
            \Laravel\Octane\Listeners\StopWorkerIfNecessary::class,
        ],

        \Laravel\Octane\Events\WorkerStopping::class => [],
    ],

    /*
    |--------------------------------------------------------------------------
    | Warm / Flush Bindings
    |--------------------------------------------------------------------------
    |
    | The bindings listed below will either be pre-warmed when a worker boots
    | or they will be flushed before every new request is handled so that
    | no information from a previous request is leaked to the next one.
    |
    */

    'warm' => [
        'auth',
        'cache',
        'cache.store',
        'config',
        'cookie',
        'db',
        'encrypter',
        'hash',
        'log',
        'queue',
        'router',
        'session',
        'session.store',
        'url',
        'view',
    ],

    'flush' => [
        'auth',
        'cache',
        'cookie',
        'db',
        'encrypter',
        'queue',
        'session',
    ],

    /*
    |--------------------------------------------------------------------------
    | Octane Cache Table
    |--------------------------------------------------------------------------
    |
    | While using Swoole, you may leverage the Octane cache, which is powered
    | by a Swoole table. You may set the maximum number of rows as well as
    | the number of bytes per row using the configuration options below.
    |
    */

    'cache' => [
        'rows' => 1000,
        'bytes' => 10000,
    ],

    /*
    |--------------------------------------------------------------------------
    | Octane Swoole Tables
    |--------------------------------------------------------------------------
    |
    | While using Swoole, you may define additional tables as required by the
    | application. These tables can be used to store data that needs to be
    | quickly accessed by other workers on the particular Swoole server.
    |
    */

    'tables' => [
        'example:1000' => [
            'name' => 'string:1000',
            'votes' => 'int',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | File Watching
    |--------------------------------------------------------------------------
    |
    | The following list of files and directories will be watched when using
    | the --watch option offered by Octane. If any of the directories and
    | files are changed, Octane will automatically reload your workers.
    |
    */

    'watch' => [
        'app',
        'bootstrap',
        'config',
        'database',
        'public/**/*.php',
        'resources/**/*.php',
        'routes',
        'composer.lock',
        '.env',
    ],

    /*
    |--------------------------------------------------------------------------
    | Garbage Collection Threshold
    |--------------------------------------------------------------------------
    |
    | When executing long-lived PHP scripts such as Octane, memory can build
    | up before being cleared by PHP. You can force Octane to run garbage
    | collection after each request by setting this value to "1" or fewer.
    |
    */

    'garbage_collection' => [
        'dispatches_between_cleanups' => 500,
    ],

    /*
    |--------------------------------------------------------------------------
    | Maximum Execution Time
    |--------------------------------------------------------------------------
    |
    | The following setting configures the maximum execution time for requests
    | being handled by Octane. You may set this value to 0 to indicate that
    | there is no specific time limit on Octane request execution time.
    |
    */

    'max_execution_time' => 30,

];
