﻿angular.module('storefront.account')
.component('vcAccountCompanyInfo', {
    templateUrl: "themes/assets/js/account/account-company-info.tpl.liquid",
    require: {
        accountManager: '^vcAccountManager'
    },
    controller: ['storefrontApp.mainContext', '$scope', 'loadingIndicatorService', 'confirmService', '$translate', function (mainContext, $scope, loader, confirmService, $translate) {
        var $ctrl = this;
        $ctrl.loader = loader;

        $scope.$watch(
            function () { return mainContext.customer; },
            function (newValue) {
                $ctrl.accountManager.getCustomerOrganization(function (company) {
                    $ctrl.company = company;
                });
            }
        );

        $ctrl.updateOrganizationInfo = function () {
            $ctrl.accountManager.updateCustomerOrganization($ctrl.company);
        };

        $ctrl.addNewAddress = function () {
            if (_.last(components).validate()) {
                $ctrl.company.addresses.push($ctrl.newAddress);
                $ctrl.newAddress = null;
                $ctrl.accountManager.updateCustomerOrganization($ctrl.company);
            }
        };

        $ctrl.submitCompanyAddress = function () {
            if (components[$ctrl.editIdx].validate()) {
                angular.copy($ctrl.editItem, $ctrl.addresses[$ctrl.editIdx]);
                $ctrl.accountManager.updateCustomerOrganization($ctrl.company).then($ctrl.cancel);
            }
        };

        $ctrl.cancel = function () {
            $ctrl.editIdx = -1;
            $ctrl.editItem = null;
        };

        $ctrl.edit = function ($index) {
            $ctrl.editIdx = $index;
            $ctrl.editItem = angular.copy($ctrl.company.addresses[$ctrl.editIdx]);
        };

        $ctrl.delete = function ($index) {
            var showDialog = function (text) {
                confirmService.confirm(text).then(function (confirmed) {
                    if (confirmed) {
                        $ctrl.company.addresses.splice($index, 1);
                        $ctrl.accountManager.updateCustomerOrganization($ctrl.company);
                    }
                });
            };

            $translate('customer.addresses.delete_confirm').then(showDialog, showDialog);
        };

        var components = [];
        $ctrl.addComponent = function (component) {
            components.push(component);
        };
        $ctrl.removeComponent = function (component) {
            components = _.without(components, component);
        };
    }]
});
