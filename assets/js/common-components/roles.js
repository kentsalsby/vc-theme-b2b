﻿var storefrontApp = angular.module('storefrontApp');
storefrontApp.component('vcRoles', {
    templateUrl: "themes/assets/roles.tpl.html.liquid",
    bindings: {
        value: '=',
        accounts: "<",
        form: '=',
        name: "@",
        required: "<",
        disabled: "<"
    },
    controller: ['$scope', 'roleService', 'loadingIndicatorService', function ($scope, roleService, loader) {
        var $ctrl = this;
        $ctrl.loader = loader;

        $scope.$watch(function(){
            return roleService.available;
        }, function(){
            $ctrl.availableRoles = _.map(roleService.available, function(availableRole) {
                return availableRole;
            });
            $ctrl.getRole();
        });

        $ctrl.$onChanges = function() {
            $ctrl.getRole();
        };
        
        $ctrl.getRole = function() {
            if ($ctrl.accounts) {
                $ctrl.value = roleService.get($ctrl.accounts);
            }
        };

        $ctrl.selectRole = function(role){
            if ($ctrl.value)
                $ctrl.value.assigned = false;
            role.assigned = true;
        };
    }]
});