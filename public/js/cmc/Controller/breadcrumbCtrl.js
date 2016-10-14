CMC.Controllers.prototype.BreadcrumbCtrl =
    function ($rootScope) {

        var vm = this;

        // Flag isBreadActive
        // Affiche ou non le BreadCrumd
        vm.isBreadActive = false;

        vm.routeCollec = {
            "/Porteur": {
                isActive: false,
                isComplete: CMC.objects.step.porteur.formState.valid || false,
                isEnabled: CMC.objects.step.porteur.stepState.hasBeenReached || true,
                link: CMC.objects.step.porteur.stepState.hasBeenReached ||false,
                index: 0
            },
            "/Photo": {
                isActive: false,
                isComplete: CMC.objects.step.photo.formState.valid || false,
                isEnabled: CMC.objects.step.photo.stepState.hasBeenReached || false,
                link: CMC.objects.step.photo.stepState.hasBeenReached ||false,
                index: 1
            },
            "/Recapitulatif": {
                isActive: false,
                isComplete: false,
                isEnabled: false,
                link:false,
                index: 2
            }
        };

        $rootScope.$on('$locationChangeSuccess', function (evt, newRoute, oldRoute) {

            var old_route = oldRoute.split("#")[1];
            var new_route = newRoute.split("#")[1];

            // N'affiche que les routes désirées
            if (vm.routeCollec[new_route]) {
                vm.isBreadActive = true;
            }
            else {
                vm.isBreadActive = false;

                return;
            }

            if (old_route === new_route) {
                vm.routeCollec[new_route].isEnabled = true;
                vm.routeCollec[new_route].isActive = true;

                return;
            }

            //-------------------------------
            // Désactive l'ancienne route (si presente dans l'Obj de définition - routeCollec):
            if (vm.routeCollec[old_route]) {
                vm.routeCollec[old_route].isActive = false;

                //-------------------------------
                // Passe a incomplete les anciennes route si elle sont apres celle selectionn�e.
                if (vm.routeCollec[old_route].index > vm.routeCollec[new_route].index) {
                    for (var routeObj in vm.routeCollec) {
                        if (vm.routeCollec[routeObj].index > vm.routeCollec[new_route].index) {
                            vm.routeCollec[routeObj].isComplete = false;
                            vm.routeCollec[routeObj].link = false;
                        }
                    }
                }
                else {
                    vm.routeCollec[old_route].isComplete = true;
                    vm.routeCollec[old_route].link = true;
                }

            }
            //-------------------------------
            // Active la nouvelle ( current ):
            vm.routeCollec[new_route].isEnabled = true;
            vm.routeCollec[new_route].isActive = true;
            vm.routeCollec[new_route].link= true;

        });
    };
