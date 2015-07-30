/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router", 
    "ui.bootstrap", 
    "oc.lazyLoad",  
    "ngSanitize"
]); 
if (window.XMLHttpRequest)
                {
                    ajaxObject = new XMLHttpRequest();
                    
                    ajaxObject.open("POST","http://localhost/dealerAPI/public/connectSocket",true);
                    ajaxObject.send();
                    
                    ajaxObject.onreadystatechange = function()
                    {
                        if (ajaxObject.readyState == 4 && ajaxObject.status == 200)
                        {
                           
                            
                        }
                    }
                }

//document.getElementById('loading').style.display = "none";

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);
MetronicApp.config(['$controllerProvider', function($controllerProvider) {
  $controllerProvider.allowGlobals();
}]);
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: Metronic.getAssetsPath() + 'admin/layout/img/',
        layoutCssPath: Metronic.getAssetsPath() + 'admin/layout/css/'
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
        Metronic.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */






/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);
 // added by prem
 
 function authInterceptor(API, auth) {
   
   return {
     // automatically attach Authorization header
     request: function(config) {
       var token = auth.getToken();
       if (config.url.indexOf(API) === 0 && token) {
         config.headers.token = token;
       }

       return config;
     },

     // If a token was sent back, save it
     response: function(res) {
       if (res.config.url.indexOf(API) === 0 && res.data.token) {
         auth.saveToken(res.data.token);
       }
       return res;
     },
   }
 }

 function authService($window) {
  
   var self = this;

   self.saveToken = function(token) {
     $window.localStorage['jwtToken'] = token;
   }

   self.getToken = function() {
     return $window.localStorage['jwtToken'];
   }
   self.logout = function() {
     $window.localStorage.removeItem('jwtToken');
   }
 }

 function userService($http, API, auth,$state) {

   var self = this;
   self.getQuote = function() {
     return $http.post(API + '/getUser');
   }

   // add authentication methods here
   self.register = function($data) {
     
     return $http.post(API + 'register',{
       fname:$data.fname,
       mname:$data.mname,
       lname:$data.lname,
       address:$data.address,
       identity:$data.identity,
       nationality:$data.nationality,
       dob:$data.dob,
       ban:$data.ban,
       email:$data.email,
       cNumber:$data.contactNo,
       mNumber:$data.mobileNo
     })
       .then(function(res) {
         if(res.status == "200")
           console.log(res.statusText);
       })
   }
   self.login = function(username, password) {
     return $http.post(API + 'login',{
       username:username,
       password:password
     });
   }
   self.getUnverifiedMember = function(){
     return $http.post(API + 'API/getUnverifiedMember');
   }
   self.getOnlineMember = function(){
        return $http.post(API + 'API/getOnlineMember');
   }
   self.verifyMember = function(member_id,username,password,mtype){
        return $http.post(API + 'API/verifyMember',{
                member_id:member_id,
                username:username,
                password:password,
                mtype:mtype
       });
    }
   self.isAuthed = function(){
     return $http.post(API + 'API/isAuthed');
   }
   self.logout = function(){
        return $http.post(API + 'API/logout');
   }
   self.addBranch = function(branchName){
        return $http.post(API + 'API/createBranch',{
            branchName : branchName
        });
   }
 }
 MetronicApp.factory('authInterceptor', authInterceptor);
 MetronicApp.service('user', userService);
 MetronicApp.service('auth', authService);
 MetronicApp.constant('API', 'http://localhost/dealerAPI/public/');
 MetronicApp.config(function($httpProvider) {
   $httpProvider.interceptors.push('authInterceptor');
 });



MetronicApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/login.html");  
    
    $stateProvider

        // Dashboard
        .state('login', {
            url: "/login.html",
            templateUrl: "views/login.html",
            controller:"loginController"
        })
        .state('home',{
            url:"/dashboard.html",
            template:"",
            controller:'homeController'
        })
        //register
        .state('register', {
            url: "/register.html",
            templateUrl: "views/register.html",
            controller:"registerController"

           
        })
        .state('dashboard',{
            url: "/dashboard.html",
            templateUrl: "views/dashboard.html",
            controller:"dashboardController"
        })
        .state('dashboard2',{
            url: "/dashboard2.html",
            templateUrl: "views/dashboard2.html"      
        })
        // .state('dashboard', {
        //     url: "/dashboard.html",
        //     templateUrl: "views/dashboard.html",            
        //     data: {pageTitle: 'Admin Dashboard Template'},
        //     controller: "DashboardController",
        //     resolve: {
        //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
        //             return $ocLazyLoad.load({
        //                 name: 'MetronicApp',
        //                 insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
        //                 files: [
        //                     'css/morris.css',
        //                     'css/tasks.css',
                            
        //                     'js/morris.min.js',
        //                     'js/raphael-min.js',
        //                     'js/jquery.sparkline.min.js',

        //                     'js/index3.js',
        //                     'js/tasks.js',

        //                      'js/DashboardController.js'
        //                 ] 
        //             });
        //         }]
        //     }
        // })

        // AngularJS plugins
        .state('fileupload', {
            url: "/file_upload.html",
            templateUrl: "views/file_upload.html",
            data: {pageTitle: 'AngularJS File Upload'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'angularFileUpload',
                        files: [
                            '../../../assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
                        ] 
                    }, {
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // UI Select
        .state('uiselect', {
            url: "/ui_select.html",
            templateUrl: "views/ui_select.html",
            data: {pageTitle: 'AngularJS Ui Select'},
            controller: "UISelectController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'ui.select',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                            '../../../assets/global/plugins/angularjs/plugins/ui-select/select.min.js'
                        ] 
                    }, {
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/UISelectController.js'
                        ] 
                    }]);
                }]
            }
        })

        // UI Bootstrap
        .state('uibootstrap', {
            url: "/ui_bootstrap.html",
            templateUrl: "views/ui_bootstrap.html",
            data: {pageTitle: 'AngularJS UI Bootstrap'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })

        // Tree View
        .state('tree', {
            url: "/tree",
            templateUrl: "views/tree.html",
            data: {pageTitle: 'jQuery Tree View'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/jstree/dist/themes/default/style.min.css',

                            '../../../assets/global/plugins/jstree/dist/jstree.min.js',
                            '../../../assets/admin/pages/scripts/ui-tree.js',
                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })     

        // Form Tools
        .state('formtools', {
            url: "/form-tools",
            templateUrl: "views/form_tools.html",
            data: {pageTitle: 'Form Tools'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../../../assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                            '../../../assets/global/plugins/jquery-tags-input/jquery.tagsinput.css',
                            '../../../assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            '../../../assets/global/plugins/typeahead/typeahead.css',

                            '../../../assets/global/plugins/fuelux/js/spinner.min.js',
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            '../../../assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            '../../../assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                            '../../../assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                            '../../../assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            '../../../assets/global/plugins/jquery-tags-input/jquery.tagsinput.min.js',
                            '../../../assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                            '../../../assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                            '../../../assets/global/plugins/typeahead/handlebars.min.js',
                            '../../../assets/global/plugins/typeahead/typeahead.bundle.min.js',
                            '../../../assets/admin/pages/scripts/components-form-tools.js',

                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })        

        // Date & Time Pickers
        .state('pickers', {
            url: "/pickers",
            templateUrl: "views/pickers.html",
            data: {pageTitle: 'Date & Time Pickers'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/clockface/css/clockface.css',
                            '../../../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../../../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '../../../assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                            '../../../assets/global/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css',
                            '../../../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                            '../../../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../../../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            '../../../assets/global/plugins/clockface/js/clockface.js',
                            '../../../assets/global/plugins/bootstrap-daterangepicker/moment.min.js',
                            '../../../assets/global/plugins/bootstrap-daterangepicker/daterangepicker.js',
                            '../../../assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                            '../../../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

                            '../../../assets/admin/pages/scripts/components-pickers.js',

                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })

        // Custom Dropdowns
        .state('dropdowns', {
            url: "/dropdowns",
            templateUrl: "views/dropdowns.html",
            data: {pageTitle: 'Custom Dropdowns'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/bootstrap-select/bootstrap-select.min.css',
                            '../../../assets/global/plugins/select2/select2.css',
                            '../../../assets/global/plugins/jquery-multi-select/css/multi-select.css',

                            '../../../assets/global/plugins/bootstrap-select/bootstrap-select.min.js',
                            '../../../assets/global/plugins/select2/select2.min.js',
                            '../../../assets/global/plugins/jquery-multi-select/js/jquery.multi-select.js',

                            '../../../assets/admin/pages/scripts/components-dropdowns.js',

                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        }) 

        // Advanced Datatables
        .state('datatablesAdvanced', {
            url: "/datatables/advanced.html",
            templateUrl: "views/datatables/advanced.html",
            data: {pageTitle: 'Advanced Datatables'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/select2/select2.css',                             
                            '../../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css', 
                            '../../../assets/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            '../../../assets/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',

                            '../../../assets/global/plugins/select2/select2.min.js',
                            '../../../assets/global/plugins/datatables/all.min.js',
                            'js/scripts/table-advanced.js',

                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // Ajax Datetables
        .state('datatablesAjax', {
            url: "/datatables/ajax.html",
            templateUrl: "views/datatables/ajax.html",
            data: {pageTitle: 'Ajax Datatables'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/select2/select2.css',                             
                            '../../../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../../../assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',

                            '../../../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../../../assets/global/plugins/select2/select2.min.js',
                            '../../../assets/global/plugins/datatables/all.min.js',

                            '../../../assets/global/scripts/datatable.js',
                            'js/scripts/table-ajax.js',

                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // User Profile
        .state("profile", {
            url: "/profile",
            templateUrl: "views/profile/main.html",
            data: {pageTitle: 'User Profile'},
            controller: "UserProfileController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../../../assets/admin/pages/css/profile.css',
                            '../../../assets/admin/pages/css/tasks.css',
                            
                            '../../../assets/global/plugins/jquery.sparkline.min.js',
                            '../../../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../../../assets/admin/pages/scripts/profile.js',

                            'js/controllers/UserProfileController.js'
                        ]                    
                    });
                }]
            }
        })

        // User Profile Dashboard
        .state("profile.dashboard", {
            url: "/dashboard",
            templateUrl: "views/profile/dashboard.html",
            data: {pageTitle: 'User Profile'}
        })

        // User Profile Account
        .state("profile.account", {
            url: "/account",
            templateUrl: "views/profile/account.html",
            data: {pageTitle: 'User Account'}
        })

        // User Profile Help
        .state("profile.help", {
            url: "/help",
            templateUrl: "views/profile/help.html",
            data: {pageTitle: 'User Help'}      
        })

        // Todo
        .state('todo', {
            url: "/todo",
            templateUrl: "views/todo.html",
            data: {pageTitle: 'Todo'},
            controller: "TodoController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'MetronicApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../../../assets/global/plugins/bootstrap-datepicker/css/datepicker3.css',
                            '../../../assets/global/plugins/select2/select2.css',
                            '../../../assets/admin/pages/css/todo.css',
                            
                            '../../../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../../../assets/global/plugins/select2/select2.min.js',

                            '../../../assets/admin/pages/scripts/todo.js',

                            'js/controllers/TodoController.js'  
                        ]                    
                    });
                }]
            }
        })

}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
}]);