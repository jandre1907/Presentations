angular
    .module("Subscription", ['ngRoute', 'ngFileUpload', 'Common'])
    .config([
        '$logProvider',
        '$sceDelegateProvider',
        function ($logProvider, $sceDelegateProvider) {
            $logProvider.debugEnabled(true);
            $sceDelegateProvider
                .resourceUrlWhitelist([
                    'self',
                    'https://www.google.com'
                ]);
        }
    ]);