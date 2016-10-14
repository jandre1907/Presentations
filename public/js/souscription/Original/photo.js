SEL.App.prototype.PhotoCtrl = function ($scope, $io, $location, $http, $sce, $route, $routeParams, $compile, Upload, $q, $cookieStore, $rootScope, Wording) {

    this.name = "PhotoCtrl";
    this.$route = $route;
    this.$location = $location;

    $scope.errorMessages = Wording.getCategorie('sna').sna_erreur;

    // Flag - pour activer les boutons "Valider cette photo et continuer"
    $scope.isUserPhoto = false;


    var initCtrl = function () {
        SEL.APP.fall($location, { 
           	"profil" : "/Profil",
           	"forfait" : "/Forfait",
       	    "porteur" : "/Porteur"
        });    	
    	
        // SEL.HOLDER.porteur.data = SEL.MODEL.overwriteObject(SEL.MODEL.getDataFromCookie($cookieStore), SEL.MODEL.userDefault());
        if (SEL.HOLDER.porteur.data) {
            SEL.HOLDER.porteur.data = SEL.MODEL.overwriteObject(SEL.HOLDER.porteur.data, SEL.MODEL.userDefault());
        } else {
            SEL.HOLDER.porteur.data = SEL.MODEL.userDefault();
        }

        $scope.disableSubmit = true;
        $scope.errorMessages = Wording.getCategorie('sna').sna_erreur;
        $scope = SEL.loadStep($scope);


        $scope.error = null;

        $scope.showOriginalPhoto = false;



        $scope.isUserPhoto = $scope.cart.documents.url_photo ? true: false;

        $scope.Holder = SEL.HOLDER.porteur.data;
		SEL.HOLDER.forfait.hasBeenReached        = true;
		SEL.HOLDER.porteur.hasBeenReached        = true;
		SEL.HOLDER.photo.hasBeenReached          = true;
		SEL.HOLDER.paiement.hasBeenReached       = false;
		SEL.HOLDER.recapitulatif.hasBeenReached  = false;
		SEL.HOLDER.signature.hasBeenReached      = false;
		//SEL.HOLDER.confirmation.hasBeenReached   = false;

        // Vérif si le navigateur supporte la video pour capturer son portrait :
        $scope.isUserMedia = false; // flag pour activé ou non le bouton "prendre une photo"
        if (isUserMediaFn()) $scope.isUserMedia = true;

        SEL.MODEL.photoStep = SEL.MODEL.photoStep || false;

        //********************************
        //*********************************
        // POUR LE TEST A ENLEVER :
        // $scope.Holder.reference = "51545454";
        //*********************************
        //*********************************
        nextCase('init');
    };

    $scope.submitForm = function () {
    	$rootScope.$broadcast("receiveResponse");
    	nextCase("paiement");
        return;
    };


    var gotoStep = function (nextStep) {
        SEL.saveStep($scope);
        $rootScope.$broadcast("receiveResponse");
        $location.path(nextStep);
    }


    var disableSubmit = function() {
        $scope.disableSubmit = true;
    };

    var enableSubmit = function() {
        $scope.disableSubmit = false;
    };

    var completeStep = function(){
        SEL.MODEL.Holder.photo.valid = true;
    }
    var stepSubmit = function() {
        var expose = $q.defer();
        var receive = $io.execute(
            "stepSubmit",
            {
                "params": {
                	"cart":    $scope.cart,
                	"userSig": $scope.userSig,
                	"payerSig": $scope.payerSig,
                	"userSel": $scope.userSel,
                	"userInfo":  $scope.userInfo
                	},
                "step": "Photo"
            }
        );
        receive.then(
            function(data) {
                expose.resolve(data);
            },
            function(msg){
                SEL.APP.log(msg);
                expose.reject(msg);
            }
        );

        return expose.promise;
    }

    var error = function(msg){
        $scope.error = $scope.errorMessages['SNA-CO-EC01-ERR_008'];
        SEL.APP.log(msg);
    }

    var gotoNextStep = function(){
        completeStep();
        gotoStep("/Paiement");
    };

    var getCase = function() {
        if($scope.orderCase) {
            return $scope.orderCase;
        }
        var guessCase = "default";
        return guessCase;
    }

    var defaultCase = function() {
        SEL.APP.log("execute defaultCase");
        enableSubmit();
    }

    var stepLoad = function() {
        var expose = $q.defer();
        var receive = $io.execute("stepLoad", {
            "params" : {
                "reference" : $scope.userSig.reference || $scope.userSel.reference || "",
                "email" :     $scope.userSig.email || $scope.userSel.email || "",
                "hasCard" :   $scope.userInfo.hasCard || "",
                "newUser" :   $scope.userInfo.isNew || "",
                "userSig":    $scope.userSig || "",
                "payerSig":   $scope.payerSig || "",
                "userSel":    $scope.userSel || "",
                "userInfo":   $scope.userInfo || ""
            },
            "step" : "Photo"
        });

        receive.then(
            function(data) {
                var image = data.image || null;
                if ( image && image.isCropped ) {

                    SEL.MODEL.photoStep       = true;
                    $scope.userSig.photoValid = true;
                    $scope.isUserPhoto = true;
                    SEL.APP.log(image);
                    SEL.HOLDER.porteur.data.photoUrl = image.CropedFileUrl;
                    $scope.Holder.OriginalFileUrl    = image.OriginalFileUrl;
                    $scope.Holder.CropedFileUrl      = image.CropedFileUrl;
                    $scope.cart.documents.url_photo  = image.CropedFileUrl;
                    initCanvasImg(image.OriginalFileUrl);
                }

            },
            function(msg) {
                SEL.APP.log(msg);
                expose.reject(msg);
            }
        );

        return expose.promise;
    }




    var nextCase = function(orderCase) {
        $scope.orderCase = $scope.orderCase || orderCase || false;
        var useCase = getCase();
        $scope.orderCase = false;
        switch(useCase) {
            case "init":
                SEL.APP.log("init");
                stepLoad()
                break;
            case "paiement":
            	stepSubmit()
            	.then(gotoNextStep, error);
                break;
            default:
                defaultCase();
        }
    }

    $scope.$on('$locationChangeStart', function(event) {
        SEL.saveStep($scope);
     });

    $scope.$on('$viewContentLoaded', function (event) {
        initCtrl();
        //$scope.hasCard = SEL.HOLDER.profil.hasCard ? "true" : "false";
        //$scope.isUser = SEL.HOLDER.profil.isUser ? "true" : "false";
    });





    $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });


    $scope.log = '';

    $scope.Holder = SEL.HOLDER.porteur.data;

    // http://www.sel.local/front/app_dev.php/api/sig/client/by/reference/birth/date.json?clientNumber=1111

    // http://www.sel.local/api/sig/file/uploads.json
    $scope.upload = function (files) {
    	$rootScope.$broadcast("sendResponse");
        if (files && files.length) {
            SEL.MODEL.photoStep = false;
            $scope.userSig.photoValid = false;
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: 'api/sig/file/uploads.json',
                    method:"POST",
                    fields: {
                        'reference': $scope.Holder.reference,
                        'contractId': SEL.objects.userSig.contractId
                    },
                    sendFieldsAs: 'form',
                    file: file
                }).progress(function (evt) {
                    /*
                     var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                     $scope.log = 'progress: ' + progressPercentage + '% ' +
                     evt.config.file.name + '\n' + $scope.log;*/
                }).success(function (data, status, headers, config) {

                    // flag pour valider le fait que l' user a
                    // une photo valide ou nom (necessaire pour passer a l'étape finale = signature)
                    SEL.MODEL.photoStep = true;
                    $scope.userSig.photoValid = false;

                    // Flag - pour activer/desactiver les boutons "Valider cette photo et continuer"
                    $scope.isUserPhoto = true;

                    // User photo Load :
                    SEL.APP.log(data);
                    SEL.HOLDER.porteur.data.photoUrl = data.CropedFileUrl + '?' +  Math.floor(Math.random()*10000);
                    $scope.Holder.OriginalFileUrl = data.OriginalFileUrl + '?' +  Math.floor(Math.random()*10000);
                    $scope.Holder.CropedFileUrl = data.CropedFileUrl + '?' +  Math.floor(Math.random()*10000);
                    $scope.cart.documents.url_photo = data.CropedFileUrl + '?' +  Math.floor(Math.random()*10000);

                    //-----------------
                    // Affiche l'image dans le canvas de modif (caché pour le moment) :
                    initCanvasImg($scope.Holder.OriginalFileUrl);
                    $rootScope.$broadcast("receiveResponse");
                });
            }
        }
        $rootScope.$broadcast("receiveResponse");
    };

    //**************************************
    // Gestion traitement de l'image :
    //**************************************
    var stage, bitmap;
    var rotationValue = 0;
    //-------------------------------------
    // Creation du stage-canvas & load image
    function initCanvasImg(imgUrl) {
        var canvasW = 208;
        var canvasH = 246;

        $("#canvasImg").attr("width", canvasW + "px");
        $("#canvasImg").attr("height", canvasH + "px");

        stage = new createjs.Stage("canvasImg");
        var img = new Image();
        img.src = imgUrl;

        $(img).load(function () {
            bitmap = new createjs.Bitmap(img);
            stage.addChild(bitmap);

            // passe le pivot au milieu de l'image :
            bitmap.set({regX: img.width / 2, regY: img.height / 2});
            // centre l'image :
            bitmap.set({x: (canvasW / 2), y: (canvasH / 2)});

            bitmap.cache(0, 0, img.width, img.height);
            stage.addChild(bitmap);
            stage.update();

            // Au click image : calcule deltaX et deltaY
            var deltaX, deltaY;
            bitmap.on("mousedown", function (evt) {
                deltaX = evt.currentTarget.x - evt.stageX;
                deltaY = evt.currentTarget.y - evt.stageY;
            });

            // au PressMove : "click-and-drag" sur l'image :
            bitmap.on("pressmove", function (evt) {
                // passe le centre pivot au coordonnées du click :
                bitmap.set({x: (canvasW / 2), y: (canvasH / 2)});

                evt.currentTarget.set({
                    x: evt.stageX + deltaX,
                    y: evt.stageY + deltaY
                });
                stage.update();
            });
        });
    }

    //-------------------------------------
    // Reset Canvas :
    function resetCanvas() {
        rotationValue = 0
        stage.removeChildAt(0);
        stage.update();
        $scope.zoomValue = $scope.lumiValue = $scope.contrastValue = 100;
    };

    //-------------------------------------
    // Control rotation :
    $scope.onRotateImg = function (direction) {
        switch (direction) {
            case "undo":
                rotationValue -= 90;
                break;
            case "redo":
                rotationValue += 90;
                break;
        }
        TweenLite.to(bitmap, 0, {easel: {rotation: rotationValue}});
        stage.update();
    };

    //--------------------------
    // Control Zoom :
    $scope.onZoom = function (zoomValue) {
        zoomValue = zoomValue / 100;
        TweenLite.to(bitmap, 0, {easel: {scaleX: zoomValue, scaleY: zoomValue}});
        stage.update();
    };

    //--------------------------
    // Control Luminosité :
    $scope.onLumi = function (lumiValue) {
        lumiValue = lumiValue / 100;
        TweenLite.to(bitmap, 0, {easel: {brightness: lumiValue}});
        stage.update();
    };

    //--------------------------
    // Control Contrast :
    $scope.onContrast = function (contrastValue) {
        contrastValue = contrastValue / 100;
        TweenLite.to(bitmap, 0, {easel: {contrast: contrastValue}});
        stage.update();
    };



    //**************************************
    // Prendre une photo avec WebCam:
    //**************************************
    var imgBlob; // base64 String img

    // Fonction de vérification si le navigateur accepte l'API Vidéo :
    function isUserMediaFn() {
        return navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia || null;
    };

    // Ouvre Popin de capture d'image :
    $scope.onTakePic = function () {

        // Flag pour désafficher l'image capturée du flux video :
        $scope.isVideoCaptureDone = false;

        var videoPlaying = false;
        var video;

        // Affiche modal flux vidéo :
        $("#modalPrendrePhoto").modal("show");

        // Mandatory :
        var constraints = {video: true, audio: false};

        // Init du flux vidéo :
        var media = navigator.getUserMedia(constraints, function (stream) {
            video = document.getElementById('videoCanvas');

            // URL Object in WebKit
            var url = window.URL || window.webkitURL;
            // create the url and set the source of the video element
            video.src = url ? url.createObjectURL(stream) : stream;

            // ! -  l'utilisateur doit accepter l'utilisation de la Webcam - !
            video.play();
            videoPlaying = true;

            // Problème de flux vidéo / utilisateur n'accepte pas la Webcam -
        }, function (error) {
            $("#modalPrendrePhoto").modal("hide");
            $scope.isUserMedia = false;
            $scope.$apply();
        });

        //----------------------------------------------------
        //  click Capture image depuis la video :
        $("#btCaptureImg").on("click", function () {

            // Flag - Affiche par defaut ou re-affiche le bouton "garder cette image"
            // dans le cas ou la précédente etait invalide :
            $scope.isWebCamImageValid= true;

            if (videoPlaying) {
                var canvas = document.getElementById('hiddenCanvasCaptureImage');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0);
                // type, qualité 0 - 1
                var data = canvas.toDataURL("image/jpeg", 1.0);
                imgBlob = data;
                // Affiche l'image dans la balise img de preview:
                document.getElementById('previewCapture').setAttribute('src', data);

                // Affiche la capture image :
                $scope.isVideoCaptureDone = true;
                $scope.$apply();
            }
        })
    };


    // Envoi de l'image pour traitement depuis capture image :
    $scope.onSelectImg = function () {
        imgBlob = imgBlob.split("data:image/jpeg;base64,")[1];
        $http.post('api/sig/file/blob/uploads.json',
            {
                'reference': $scope.Holder.reference,
                'contractId': SEL.objects.userSig.contractId,
                'fileBlob': imgBlob
            }
        ).
            success(function (data, status, headers, config) {

                if(!data.isCropped){
                    // Flag - Affiche le message "Votre photo est invalide"
                    // $scope.isWebCamImageValid= true;
                    $scope.isWebCamImageValid= false;

                    return;
                }

                // flag pour valider le fait que l' user a
                // une photo valide ou nom (necessaire pour passer a l'étape finale = signature)
                SEL.MODEL.photoStep = true;
                $scope.userSig.photoValid = false;

                // Flag - pour activer/desactiver les boutons "Valider cette photo et continuer"
                $scope.isUserPhoto = true;

                SEL.HOLDER.porteur.data.photoUrl = data.CropedFileUrl;
                $scope.Holder.OriginalFileUrl = data.OriginalFileUrl;
                $scope.Holder.CropedFileUrl = data.CropedFileUrl;

                $scope.cart.documents.url_photo  = data.CropedFileUrl;
                //-----------------
                // Affiche l'image dans le canvas de traitement d'image (caché):
                initCanvasImg(data.OriginalFileUrl);

                // Passe ce flag a false pour ne pas afficher automatiquement la zone de traitement de l'image :
                $scope.showOriginalPhoto = false;

                // Flag désafficher l'ancienne image capturé...
                $scope.isVideoCaptureDone = false;

                $("#modalPrendrePhoto").modal("hide");

            }).
            error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
    };


    //----------------------------
    // Envoi de l'image depuis Zone modif de l'image (Luminosité Contraste) :

    $scope.onSelectImgModifed = function () {
        var canvas = document.getElementById("canvasImg");
        var imgBlob    = canvas.toDataURL("image/jpeg", 1.0);
        imgBlob = imgBlob.split("data:image/jpeg;base64,")[1];

        $http.post('api/sig/file/blob/uploads.json',
            {
                'reference': $scope.Holder.reference,
                'contractId': SEL.objects.userSig.contractId,
                'fileBlob': imgBlob
            }
        ).
            success(function (data, status, headers, config) {

                // Passe ce flag a false pour ne pas afficher automatiquement la zone de traitement de l'image :
                $scope.showOriginalPhoto = false;

                // Affecte l'image "Originale" du retour de l'API qui correspond a l'image traité par la canvas
                // (zoom + luminosité + contraste).
                SEL.HOLDER.porteur.data.photoUrl = data.OriginalFileUrl;

                // étape suivante :
                $location.path("/Paiement");
                return;

            }).
            error(function (data, status, headers, config) {

            });

    };

    $scope.deletePhoto = function () {
        // flag pour valider le fait que l' user a
        // une photo valide ou nom (necessaire pour passer a l'étape finale = signature)
        SEL.MODEL.photoStep = false;
        $scope.userSig.photoValid = false;

        // Flag - pour activer/desactiver les boutons "Valider cette photo et continuer"
        $scope.isUserPhoto = false;


        SEL.HOLDER.porteur.data.photoUrl = "";
        $scope.Holder.CropedFileUrl = "";
    };

    $scope.deleteOriginalPhoto = function () {
        // flag pour valider le fait que l' user a
        // une photo valide ou nom (necessaire pour passer a l'étape finale = signature)
        SEL.MODEL.photoStep = false;
        $scope.userSig.photoValid = false;

        // Flag - pour activer/desactiver les boutons "Valider cette photo et continuer"
        $scope.isUserPhoto = false;


        SEL.HOLDER.porteur.data.photoUrl = "";
        $scope.Holder.CropedFileUrl = "";
        // Clean le canvas & et range
        resetCanvas();
    };





}

/** Step 4: Photo **********************************************************************************/
SEL.Model.prototype.photoProcess = function () {

}

SEL.Model.prototype.updateCarteItemAttribute = function () {

}
