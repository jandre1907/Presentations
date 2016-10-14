

CMC.photoIncomplete = function($scope, $location, $http, Upload, Wording) {
    var photoWording;
    var imgBlob; // base64 String img
    var stage;
    var bitmap;
    var rotationValue = 0;

    $scope.$on('$viewContentLoaded', function(event) {
        CMC.log("photo template loaded");
        initCtrl();
    });

    //


    var initCtrl = function() {
        CMC.MODEL = new CMC.Model();
        CMC.objects.userSig.reference = CMC.reference;
        CMC.objects.userSel.reference = CMC.reference;
        $scope.errorMessages = Wording.getCategorie("cdc").cdc_erreur;
        CMC.MODEL.loadStep($scope);
        CMC.log("reference");
        CMC.log($scope.userSig.reference);

        photoWording = {
            photoOrigin:"Votre photo",
            photoApresTraitement:"Votre photo après traitement"
        };

        $scope.photo_labelImage = photoWording.photoApresTraitement;
        $scope.userSig.reference = $scope.userSel.reference || $scope.userSig.reference;
        //===========================
        //      Upload d'image - bouton " PARCOURIR "
        //===========================
        $scope.is_imgFileUploaded = false;  // Flag , Affiche ou non les boutons - parcourir & prendre photo
        $scope.photoOriginal;               // Urls ...
        $scope.photoCroped;

        //**************************************
        // Gestion traitement de l'image :
        //**************************************
        //  Flag pour afficher ou non la Zone de traitement de l'image :
        $scope.is_imgTransform = false;


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


    };

    function checkRemotePhoto () {
        // Vérif si user a déjà une photo affectée ( bouton retour pour modif)
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
        $scope.isUserMedia = false; // FLAG -  pour activé ou non le bouton "prendre une photo"
        if (isUserMediaFn()) {
            $scope.isUserMedia = true;
        }
    }


    $scope.gotoStep = function (nextStep) {
        CMC.MODEL.saveStep($scope);
        $location.path(nextStep);
    };

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
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                Upload.upload({
                    url: 'api/sig/file/uploads.json',
                    fields: {
                        'reference': $scope.userSig.reference
                    },
                    sendFieldsAs: 'form',
                    file: file
                }).progress(function (evt) {

                }).success(function (data, status, headers, config) {

                    // Applique le bon label :
                    $scope.photo_labelImage = photoWording.photoApresTraitement;

                    // Flag - Affiche l'image :
                    $scope.is_imgFileUploaded   = true;

                    $scope.photoOriginal        = data.OriginalFileUrl;
                    $scope.photoCroped          = data.CropedFileUrl;

                    // Assigne l'url de la photo au model SIG
                    $scope.userSig.photoValid       = data.CropedFileUrl;
                    $scope.userSig.photoOriginal    = data.OriginalFileUrl;

                    //-----------------
                    // Load l'image originale (objet bitmap) dans le canvas de modif - zoom + lum + contrast
                    // La zone de modif est cachée par défaut.
                    initCanvasImg($scope.photoOriginal);

                    return;
                }).error(
                    function(){
                        CMC.log("upload error");
                        window.location.hash = "";
                        window.location.pathname += "/../espace_client";
                    }
                )

            }
        }
    };



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
    };

    //-------------------------------------
    // Reset Canvas :
    function resetCanvas() {
        rotationValue = 0
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


    // Fonction de vérification si le navigateur accepte l'API Vidéo :
    function isUserMediaFn() {
        return navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia || null;
    };

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

    //----------------------------
    // Envoi de l'image depuis capture image vidéo :
    //----------------------------
    $scope.onSelectImg = function () {
        imgBlob = imgBlob.split("data:image/jpeg;base64,")[1];
        $http.post('api/sig/file/blob/uploads.json',
            {
                'reference': $scope.userSig.reference,
                'fileBlob': imgBlob
            }
        ).
            success(function (data, status, headers, config) {

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
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                CMC.log("file upload - fail");

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

        $http.post('api/sig/file/blob/uploads.json',
            {
                'reference': $scope.userSig.reference,
                'fileBlob': imgBlob
            }
        ).
            success(function (data, status, headers, config) {
                // Passe ce flag a false pour ne pas afficher automatiquement la zone de traitement de l'image :
                $scope.is_imgTransform = false;

                // Assigne l'url de la photo au model SIG
                $scope.userSig.photoValid       = data.OriginalFileUrl;
                $scope.userSig.photoOriginal    = data.OriginalFileUrl;

                // étape suivante :
                window.location.pathname += "/../espace_client";

                return;

            }).
            error(function (data, status, headers, config) {
                // TODO : (lv) traitement d'erreur a implémenter :
                CMC.log("envoie image modifié - KO");
            });
    };
};

(function(){
    angular.module("updatePhoto")
    .controller("PhotoCtrl",
        ['$scope', '$location', '$http', 'Upload', CMC.photoIncomplete])
})();
