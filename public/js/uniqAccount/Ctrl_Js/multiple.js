CX.Controllers.prototype.MultipleCtrl = function ($scope, $location, $http, $sce, $route, $routeParams, $compile, Upload, $q, $filter, Wording) {

    var vm = this;

    // Flag, affiche ou non les messages erreur ou alert
    vm.isMsg;
    // Message à afficher
    vm.msg = "";

    // Liste des UserSig :
    vm.userSigCollec = CX.searchUserSigModel.userSigCollec;

    $scope.prefix_front = SEL.prefix_front;
    // Click bt "Continuer" :
    vm.onContinuer = function (selectedUser) {
        CX.log("bt continuer");
        // Désaffiche d'éventuel msg :
        vm.isMsg= false;
        vm.msg  = "";

        var exclusionCase = { "Décédé" : true, "Exclu": true, "Doublon":true };
        // check si user Sel existe :
        if (exclusionCase[vm.userSigCollec[selectedUser].libelleEtat]) {
            CX.error = 'CU-RAT-EC01-MSS_002';
            $location.path("/echec_identification");
            $scope.error =  Wording.get('cpt.cpt_erreur.CU-RAT-EC01-MSS_002');
            $scope.$emit('tagIdentificationErrorEvent');
            return;
        }

        isUserSel(vm.userSigCollec[selectedUser]);
    };

    //----------------------
    // UPDATE USERSEL :
    //----------------------
    function updateUserSel(userSigSelected){

        try{
            var request = new CX.MODEL.updateUserSel(updateUserSelSuccess, updateUserSelError, CX.Transformers.updateUserSelFromMultiple(userSigSelected));
            request.execute();
        } catch(e) {
            vm.isMsg= true;
            vm.msg  = CX.searchUserSigModel.email + " : " + Wording.get('cpt.cpt_erreur.CU-RAT-EC01-MSS_001');
        }


        // UPDATE USER SEL - SUCCESS :
        function updateUserSelSuccess(){
            $location.path('/confirmation_creation_espace');
        }


        // UPDATE USER SEL - ERROR :
        function updateUserSelError() {
            vm.isMsg= true;
            vm.msg  = Wording.get('cpt.cpt_erreur.CU-RAT-EC01-MSS_002');
        }
    }

    //----------------------
    // IS USERSEL :
    //----------------------
	function isUserSel(userSigSelected) {
        CX.log("execute / is User Sel");
        var request = new CX.MODEL.isUserSel(isUserSel_callback, isNotSelUser_callback, {"email":CX.searchUserSigModel.email} );
        request.execute();


        // IS USER SEL - callback
        function isUserSel_callback(data) {
            CX.log('isUserSel_callback ');

            if (!data.isSel ) {
            	isNotSelUser_callback(data);
            } else {
            	 vm.isMsg= true;
                 vm.msg  = CX.searchUserSigModel.email + " : " + Wording.get('cpt.cpt_erreur.CU-INS-EC01-ERR_001');
            }
        }

        // IS NOT SEL USER - callback - create User Sel !
        function isNotSelUser_callback(data) {
            CX.log('isNotSelUser_callback');
            if (data.code && data.code == 404 && !data.isSel ) {
                createUserSel(userSigSelected);
            } else {
                vm.isMsg= true;
                vm.msg  = Wording.get('cpt.cpt_erreur.CU-RAT-EC01-MSS_002');
            }
        }
    }


    //----------------------
    // CREATE USERSEL :
    //----------------------
    function createUserSel(userSigSelected){

        var request = new CX.MODEL.createUserSel(successCreateUserSel_callback, errorCreateuserSel_callback , CX.Transformers.createUserSelFromMultiple(userSigSelected));
        request.execute();

        // success - create
        function successCreateUserSel_callback() {
            CX.log('successCreateUserSel_callback ');
            $location.path('/confirmation_creation_espace');
        }

        // fail - create
        function errorCreateuserSel_callback (){
            CX.log('errorCreateuserSel_callback ');
            vm.isMsg= true;
            vm.msg  = Wording.get('cpt.cpt_erreur.CU-RAT-EC01-MSS_002');
        }

    }
};
