CMC.Controllers.prototype.PhotoCtrl = function($rootScope, $scope, $location, $http, Upload, $log, Wording) {

    // Wording du label a droite de la photo de preview :
    // 1) Message photo aprés traitement
    // 2) Aprés que l'appli lui affiche son image si il en possède une.

    var photoWording = {
        photoOrigin:"Votre photo",
        photoApresTraitement:"Votre photo après traitement"
    };

    //
    $scope.photo_labelImage    = photoWording.photoApresTraitement;


    $scope.$on('$viewContentLoaded', function(event) {
        $log.log("PHOTO TEMPLATE LOADED");
        initCtrl();
    });

    var initCtrl = function() {
        $scope.errorMessages = Wording.getCategorie("cdc").cdc_erreur;
        CMC.MODEL.loadStep($scope);
        $scope.userSig.reference = $scope.userSel.reference || $scope.userSig.reference;

        // Affiche son portrait si deja créé :
        checkRemotePhoto();

        checkWebCamEnabled();

        //**********************************************
        // **********************************************
        // POUR TEST A COMMENTER :
        // 15051010;
        // 17544988;
        // $scope.userInfo.isNewInSIG = true;
        // $scope.userSig.reference = "15051010";
        //**********************************************
        // **********************************************

        // Si l'User a déjà un compte
        // et qu'il n'a pas fait de modifs de sa photo , affiche son portrait original (API SIG) :
        if(!$scope.userInfo.isNewInSIG && $scope.userSig.photoValid === null){
            afficheUserPhoto();
        }
        $rootScope.$broadcast("receiveResponse");
    };

    function checkRemotePhoto () {
        // Vérif si user a déjà une photo affectée ( exemple : bouton retour depuis recapitulatif pour modif ... )
        // si oui - affiche la preview -
        if($scope.userSig.photoValid) {
            $scope.photoOriginal        = $scope.userSig.photoOriginal;
            $scope.photoCroped          = $scope.userSig.photoValid;

            $scope.is_imgFileUploaded = true;

            // Load l'image originale (objet bitmap) dans le canvas de modif - zoom + lum + contrast
            // La zone de modif est cachée par défaut.
            initCanvasImg($scope.photoOriginal);
        }
    }

    function checkWebCamEnabled () {
        // Vérif si le navigateur supporte la video pour capturer son portrait :
        $scope.isUserMedia  = false; // FLAG -  pour activé ou non le bouton "prendre une photo"
        $scope.isUserMediaWording = "(navigateur incompatible !)";
        if (isUserMediaFn()) {
            $scope.isUserMedia = true;
        }
    }

    function afficheUserPhoto() {
        //**********************************************
        // **********************************************
        // POUR TEST A COMMENTER :
        // 15051010;
        // 17544988;
         // $scope.userSig.reference = 15051010;
        //**********************************************
        // **********************************************

        // Event Spinner :
        $rootScope.$broadcast("sendRequest");

        $http.get(
            CMC.routes.getPhotoClient.url,
            {params: {clientNumber : $scope.userSig.reference }}
        ).then(
            function(response){
                // Event Spinner :
                $rootScope.$broadcast("receiveResponse");

                // Si anomalie -
                if(response.data.resultatClient.messageAnomalie != "") {
                    return;
                }

                //-------------------
                // Vérif de la date (valeur de :  ....image.isValid.... ):
                // l'image doit etre de maximun 5 ans:
                var imageValide = response.data.resultatClient.image.isValid;
                if(!imageValide){

                    // Flag - propose directement l'upload ou la prise de photo
                    // pour forcer a prendre une nouvelle photo.
                    $scope.is_imgFileUploaded = false;
                    return;
                }
                // La photo est valide on l'affiche :

                // Applique le bon label :
                $scope.photo_labelImage = photoWording.photoOrigin;

                // Affiche l'image originale de l'user ( Flag - is_imgFileUploaded ).
                $scope.is_imgFileUploaded = true;

                $scope.photoOriginal            = response.data.resultatClient.image.OriginalFileUrl;
                $scope.photoCroped              = response.data.resultatClient.image.OriginalFileUrl;

                // Assigne l'url de la photo au model SIG
                $scope.userSig.photoValid       = $scope.photoOriginal;
                $scope.userSig.photoOriginal    = $scope.photoOriginal;

                // Load l'image originale (objet bitmap) dans le canvas de modif - zoom + lum + contrast
                // La zone de modif est cachée par défaut.
                initCanvasImg($scope.photoOriginal);
            },
            // Fail
            function(){
                // Event Spinner :
                $rootScope.$broadcast("receiveResponseError");
            }
        );
    }

    $scope.gotoStep = function (nextStep) {
        CMC.MODEL.saveStep($scope);
        $location.path(nextStep);
    };

    //===========================
    //      Upload d'image - bouton " PARCOURIR "
    //===========================
    $scope.is_imgFileUploaded = false;  // Flag , Affiche ou non les boutons - parcourir & prendre photo
    $scope.photoOriginal;               // Urls ...
    $scope.photoCroped;

    //----------------------
    // Supprime la photo uploader ( bouton de la view )
    $scope.delete_imgFileUpoaded = function(){
        // FLAGs -
        $scope.is_imgFileUploaded = false;
        $scope.is_imgTransform    = false;

        $scope.photoOriginal   = "";
        $scope.photoCroped     = "";
    };

    //----------------------
    // Supprime la photo en cours de modification ( bouton de la view )
    $scope.delete_imgTransform = function(){
        $scope.is_imgFileUploaded   = false;
        $scope.is_imgTransform      = false;
        $scope.photoOriginal   = "";
        $scope.photoCroped     = "";

        // Clean le canvas & et range
        resetCanvas();
    };


    //------------------------------------
    $scope.$watch('files', function () {
        $scope.upload($scope.files);
    });

    $scope.upload = function (files) {

        // Flag : Affiche/Desaffiche le message d'alerte - pas de visage detecté
        // Désaffiche :
         $scope.is_photoInvalid = false;

        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                // Event Spinner :
                $rootScope.$broadcast("sendRequest");

                Upload.upload({
                    url: CMC.routes.photoFileUpload.url,
                    fields: {
                        'reference': $scope.userSig.reference,
                        'cardOrderId': CMC.objects.userInfo.cardOrderId
                    },
                    sendFieldsAs: 'form',
                    file: file
                }).progress(function (evt) {

                }).success(function (data, status, headers, config) {
                    // Event Spinner :
                    $rootScope.$broadcast("receiveResponse");

                    // Pas de visage detecté / photo non valide
                    if(data.isCropped === false){
                        // Flag : Affiche/Desaffiche le message d'alerte
                        // Affiche :
                        $scope.is_photoInvalid = true;
                        return;
                    }

                    // Applique le bon label :
                    $scope.photo_labelImage = photoWording.photoApresTraitement;

                    // Flag - Affiche l'image :
                    $scope.is_imgFileUploaded   = true;

                    $scope.photoOriginal        = data.OriginalFileUrl + '?' +  Math.floor(Math.random()*10000);
                    $scope.photoCroped          = data.CropedFileUrl + '?' +  Math.floor(Math.random()*10000);

                    // Assigne l'url de la photo au model SIG
                    $scope.userSig.photoValid       = data.CropedFileUrl + '?' +  Math.floor(Math.random()*10000);
                    $scope.userSig.photoOriginal    = data.OriginalFileUrl + '?' +  Math.floor(Math.random()*10000);

                    //-----------------
                    // Load l'image originale (objet bitmap) dans le canvas de modif - zoom + lum + contrast
                    // La zone de modif est cachée par défaut.
                    initCanvasImg($scope.photoOriginal);

                    return;
                })

            }
        }
    };


    //**************************************
    // Gestion traitement de l'image :
    //**************************************
    //  Flag pour afficher ou non la Zone de traitement de l'image :
    $scope.is_imgTransform = false;
    var stage, bitmap;
    var rotationValue = 0;
    //-------------------------------------
    // Creation du stage-canvas & load image (original File Url )
    function initCanvasImg(imgUrl) {

        diplayImgTransform = true;

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
        rotationValue = 0;
        stage.removeChildAt(0);
        stage.update();
        $scope.zoomValue = $scope.lumiValue = $scope.contrastValue = 100;
    }

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
    // Prendre une photo avec WebCam - bouton " PRENDRE UN PHOTO "
    //**************************************
    var imgBlob; // base64 String img

    // Fonction de vérification si le navigateur accepte l'API Vidéo :
    function isUserMediaFn() {
        return navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia || null;
    }

    // Ouvre Modal de capture d'image vidéo :
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

            // Problème de flux vidéo (pas de webcam) / ou / utilisateur n'accepte pas la Webcam -
        }, function (error) {
            $("#modalPrendrePhoto").modal("hide");
            $scope.isUserMedia = false;
            $scope.isUserMediaWording = "(pas de webcam !)";
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

    //----------------------------
    // Envoi de l'image depuis capture image vidéo :
    //----------------------------
    $scope.onSelectImg = function () {
        // Event Spinner :
        $rootScope.$broadcast("sendRequest");


        imgBlob = imgBlob.split("data:image/jpeg;base64,")[1];
        $http.post('api/sig/file/blob/uploads.json',
            {
                'reference': $scope.userSig.reference,
                'cardOrderId': CMC.objects.userInfo.cardOrderId,
                'fileBlob': imgBlob
            }
        ).
            success(function (data, status, headers, config) {

                // Event Spinner :
                $rootScope.$broadcast("receiveResponse");

                // Si le traitement n'a pas pu effectuer le crop automatique
                // sur la capture d'image de la camera :
                if(!data.isCropped){
                    // Flag - Affiche le message "Votre photo est invalide"
                    // $scope.isWebCamImageValid= true;
                    $scope.isWebCamImageValid= false;

                    return;
                }

                // Assigne l'url de la photo au model SIG
                $scope.userSig.photoValid       = data.CropedFileUrl;
                $scope.userSig.photoOriginal    = data.OriginalFileUrl;

                // Applique le bon label :
                $scope.photo_labelImage = photoWording.photoApresTraitement;

                // Affiche l'image -
                $scope.is_imgFileUploaded   = true;

                $scope.photoOriginal        = data.OriginalFileUrl;
                $scope.photoCroped          = data.CropedFileUrl;

                //-----------------
                // Affiche l'image dans le canvas de traitement d'image (caché par défault):
                initCanvasImg(data.OriginalFileUrl);

                // Passe ce flag a false pour ne pas afficher automatiquement la zone de traitement

                $scope.is_imgTransform = false;

                // Flag désafficher l'ancienne image capturé...
                // quand utilisateur reprend une image avec WebCam
                $scope.isVideoCaptureDone = false;

                $("#modalPrendrePhoto").modal("hide");

            }).
            error(function (data, status, headers, config) {
                // Event Spinner :
                $rootScope.$broadcast("receiveResponseError");

                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
    };


    //----------------------------
    // Envoi de l'image depuis Zone de modif de l'image (Luminosité Contraste) :
    // et passe a la suite
    //----------------------------
    $scope.onSelectImgModified = function () {
        var canvas      = document.getElementById("canvasImg");
        var imgBlob     = canvas.toDataURL("image/jpeg", 1.0);
        imgBlob         = imgBlob.split("data:image/jpeg;base64,")[1];

        // Event Spinner :
        $rootScope.$broadcast("sendRequest")

        $http.post('api/sig/file/blob/uploads.json',
            {
                'reference': $scope.userSig.reference,
                'cardOrderId': CMC.objects.userInfo.cardOrderId,
                'fileBlob': imgBlob
            }
        ).
            success(function (data, status, headers, config) {

                // Event Spinner :
                $rootScope.$broadcast("receiveResponse");

                // Passe ce flag a false pour ne pas afficher automatiquement la zone de traitement de l'image :
                $scope.is_imgTransform = false;

                // Assigne l'url de la photo au model SIG
                $scope.userSig.photoValid       = data.OriginalFileUrl;
                $scope.userSig.photoOriginal    = data.OriginalFileUrl;

                // étape suivante :
                $scope.gotoStep("/Recapitulatif");

                return;
            }).
            error(function (data, status, headers, config) {
                // Event Spinner :
                $rootScope.$broadcast("receiveResponseError");

            });
    };
};