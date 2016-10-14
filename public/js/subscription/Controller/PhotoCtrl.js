
angular.module("Subscription").controller("PhotoCtrl", ["$log", "$scope", "$http","$rootScope", "$location", "Upload", 'Wording', function ($log, $scope, $http, $rootScope, $location, Upload, Wording)
{
    var vm = this;
    $scope.photo;
    $scope.photoValid;
    $scope.isUserPhoto;
    $scope.showOriginalPhoto;
    $scope.photoTraitment;
    $scope.originalPhoto;
    $scope.courseType;

    var PHOTO_TRAITMENT_ORIGINAL = 1; // Pas de traitement effectué
    var PHOTO_TRAITMENT_MANUEL   = 2; // Traitement manuel
    var PHOTO_TRAITMENT_AUTO     = 3; // Retouche automatique
    var PHOTO_TRAITMENT_MIXTE    = 4; // Retouche automatique + manuel,

    /**
     * detect IE
     * returns version of IE or false, if browser is not Internet Explorer
     */
    $scope.detectIE = function() {
        var ua = window.navigator.userAgent;
        // IE 10
        // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
        // IE 11
        // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
        // IE 12 / Spartan
        // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
        // Edge (IE 12+)
        // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';
        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
            return true;
        }

        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // var rv = ua.indexOf('rv:');
            // return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
            return true;
        }

        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
            return true;
        }

        return false;
    }

/*********************************** TAG ERROR PHOTO ***************************************/
    /**
     * emit event when one of these errors append
     */
    var watchedErrors =  [
        'myForm.photoUpload.$error.pattern',
        'myForm.photoUpload.$error.minHeight',
        'myForm.photoUpload.$error.minWidth',
        'myForm.photoUpload.$error.maxSize',
        'myForm.photoUpload.$error.minSize',
    ]

    $scope.$watchGroup(
        watchedErrors,
        function(newValues, oldValues, scope) {
            for (expression in newValues) {
                if (newValues[expression] == oldValues[expression]
                    || !!newValues[expression] == false // use !! for cast to boolean
                ) {
                    continue;
                }

                scope.$emit("tagErrorPhotoEvent", {"expression": expression});
            }
        }
    )

/*****************************************************************************************/

    var initCtrl = function ()
    {
        $scope.disableSubmit = true;
        $scope.errorMessages = Wording.getCategorie('sna').sna_erreur;
        $scope.error = null;
        $scope.stage;
        $scope.bitmap;
        $scope.rotationValue = 0;
        // $scope.initCanvasImg( false );

        // Vérif si le navigateur supporte la video pour capturer son portrait :
        $scope.isUserMedia = false; // flag pour activé ou non le bouton "prendre une photo"
        if (isUserMediaFn()) $scope.isUserMedia = true;
        //console.log($scope.photo);
    };

    $scope.submitForm = function ()
    {
        if ( $scope.acceptModifiedPhoto ) {
            $scope.onSelectImgModifed();
        } else {
            document.step_form.isUserPhoto.value         = $scope.isUserPhoto;
            document.step_form.photoValid.value          = $scope.photoValid;
            document.step_form.photoTraitment.value      = $scope.photoTraitment;
            document.step_form.isWebCamImageValid.value  = null;
            document.step_form.submit();
        }

        return;
    };

    var disableSubmit = function() {
        $scope.disableSubmit = true;
    };

    var enableSubmit = function() {
        $scope.disableSubmit = false;
    };


    var error = function(msg){
        $scope.error = $scope.errorMessages['SNA-CO-EC01-ERR_008'];
        //SEL.APP.log(msg);
    }

    $scope.$on('$locationChangeSuccess', function(event) {
        initCtrl();
     });

    $scope.$watch('files', function () {
        if ($scope.myForm.photoUpload.$valid) {
            $scope.upload($scope.files);
        }
    });

    $scope.log = '';

    var cacheBuster = function(url)
    {
        return (url ?  (url + '?' +  Math.floor(Math.random()*10000)) : '');
    }

    $scope.upload = function (files)
    {
        $scope.photoValid = 0;

        if (files && files.size) {

            $rootScope.$broadcast("sendRequest");
            var file = files;
            Upload.upload({
                //url: $scope.prefix_front + 'api/sig/file/uploads.json',
                url: $scope.prefix_front + 'api/photo/uploads.json',
                method:"POST",
                fields: {
                    'courseType': $scope.courseType,
                    'retouching': false
                },
                sendFieldsAs: 'form',
                file: file
            }).progress(function (evt) {
                /*
                 var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                 $scope.log = 'progress: ' + progressPercentage + '% ' +
                 evt.config.file.name + '\n' + $scope.log;*/
            }).success(function (data, status, headers, config) {
                try {
                    xt_click(this,'C',window.xtn2,'parcourir','A');
                } catch (err) {
                    //console.log(err.message);
                }

                $rootScope.$broadcast("receiveResponse");
                $scope.photoValid = data.isCropped;

                $scope.isUserPhoto    = 0;
                //$scope.photoTraitment = PHOTO_TRAITMENT_AUTO;

                // User photo Load :

                $scope.photo.OriginalFileUrl = cacheBuster(data.OriginalFileUrl);
                $scope.originalPhoto = $scope.photo.OriginalFileUrl;
                $scope.photo.CroppedFileUrl = cacheBuster(data.CroppedFileUrl);
                $scope.photo.isCropped = data.isCropped;
                if ( data.isCropped ) {
                    $scope.photoTraitment = PHOTO_TRAITMENT_AUTO;
                    $scope.acceptPhoto = true;
                } else {
                    $scope.photoTraitment = PHOTO_TRAITMENT_ORIGINAL;
                    $scope.acceptPhoto = false;
                }

                //-----------------
                // Affiche l'image dans le canvas de modif (caché pour le moment) :
                //$scope.initCanvasImg( data.OriginalFileUrl  );
                $scope.showOriginalPhoto = 0;
                // Flag désafficher l'ancienne image capturé...
                $scope.isVideoCaptureDone = false;

                $("#modalPrendrePhoto").modal("hide");
            }).
            error(function (data, status, headers, config) {
                $rootScope.$broadcast("receiveResponse");
                // $scope.photoTraitment = PHOTO_TRAITMENT_AUTO;
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                 $scope.acceptPhoto = false;
                 $scope.showOriginalPhoto = 0;
            });

        }

    };

    //**************************************
    // Gestion traitement de l'image :
    //**************************************
    //var stage, bitmap;
    //var rotationValue = 0;
    //-------------------------------------
    // Creation du stage-canvas & load image
    $scope.initCanvasImg = function (restoreOriginalPhoto)
    {
        if (restoreOriginalPhoto) {
        $scope.photo.OriginalFileUrl = $scope.originalPhoto;
        }
        var imgUrl = $scope.photo.OriginalFileUrl;
        $scope.retouche = true;
        // console.log(imgUrl);

        $scope.showOriginalPhoto = true;

        var canvasW = 208;
        var canvasH = 246;

        $("#canvasImg").attr("width", canvasW + "px");
        $("#canvasImg").attr("height", canvasH + "px");

        $scope.stage = new createjs.Stage("canvasImg");
        var img = new Image();

        img.src = cacheBuster(imgUrl);

        $(img).load(function () {
            $scope.bitmap = new createjs.Bitmap(img);
            $scope.stage.addChild($scope.bitmap);

            // passe le pivot au milieu de l'image :
            $scope.bitmap.set({regX: img.width / 2, regY: img.height / 2});
            // centre l'image :
            $scope.bitmap.set({x: (canvasW / 2), y: (canvasH / 2)});

            $scope.bitmap.cache(0, 0, img.width, img.height);
            $scope.stage.addChild($scope.bitmap);
            $scope.stage.update();

            // Au click image : calcule deltaX et deltaY
            var deltaX, deltaY;
            $scope.bitmap.on("mousedown", function (evt) {
                deltaX = evt.currentTarget.x - evt.stageX;
                deltaY = evt.currentTarget.y - evt.stageY;
                // $scope.photoValid = 0;
                // $scope.isUserPhoto = 0;
            });

            // au PressMove : "click-and-drag" sur l'image :
            $scope.bitmap.on("pressmove", function (evt) {
                // passe le centre pivot au coordonnées du click :
                $scope.bitmap.set({x: (canvasW / 2), y: (canvasH / 2)});

                evt.currentTarget.set({
                    x: evt.stageX + deltaX,
                    y: evt.stageY + deltaY
                });
                $scope.stage.update();
                // $scope.photoValid = 0;
                // $scope.isUserPhoto = 0;
            });
            window.scrollTo(0, 2500);
            window.scrollBy(0, -300);
        });

    }

    //-------------------------------------
    // Reset Canvas :
    function resetCanvas()
    {
        $scope.retouche = false;
        $scope.rotationValue = 0

        if ( $scope.stage ) {
            $scope.stage.removeChildAt(0);
            $scope.stage.update();
            $scope.zoomValue = $scope.lumiValue = $scope.contrastValue = 100;
            // $scope.photoTraitment = 0;
        }
    };

    //-------------------------------------
    // Control rotation :
    $scope.onRotateImg = function (direction) {
        switch (direction) {
            case "undo":
                $scope.rotationValue -= 90;
                break;
            case "redo":
                $scope.rotationValue += 90;
                break;
        }
        TweenLite.to($scope.bitmap, 0, {easel: {rotation: $scope.rotationValue}});
        $scope.stage.update();
        $scope.isUserPhoto = 0;
        $scope.photoValid = 0;
        if ( $scope.photoTraitment == PHOTO_TRAITMENT_AUTO || $scope.photoTraitment == PHOTO_TRAITMENT_MIXTE  ) {
            $scope.photoTraitment = PHOTO_TRAITMENT_MIXTE;
        } else {
            $scope.photoTraitment = PHOTO_TRAITMENT_MANUEL;
        }
    };

    //--------------------------
    // Control Zoom :
    $scope.zoomValue = 100;
    $scope.updateZoom = function (zoomValue, iDelta) {
        zoomValue = zoomValue + iDelta;
        zoomValue = (zoomValue < 0) ? 0 : zoomValue;
        zoomValue = (zoomValue > 200) ? 200 : zoomValue;

        $scope.onZoom(zoomValue);

        $scope.zoomValue = zoomValue;
    };

    $scope.onZoom = function (zoomValue) {
        zoomValue = zoomValue / 100;
        TweenLite.to($scope.bitmap, 0, {easel: {scaleX: zoomValue, scaleY: zoomValue}});
        $scope.stage.update();
        $scope.isUserPhoto = 0;
        $scope.photoValid = 0;
        if ( $scope.photoTraitment == PHOTO_TRAITMENT_AUTO || $scope.photoTraitment == PHOTO_TRAITMENT_MIXTE  ) {
            $scope.photoTraitment = PHOTO_TRAITMENT_MIXTE;
        } else {
            $scope.photoTraitment = PHOTO_TRAITMENT_MANUEL;
        }
    };

    //--------------------------
    // Control Luminosité :
    $scope.lumiValue = 100;
    $scope.updateLumi = function (lumiValue, iDelta) {
        lumiValue = lumiValue + iDelta;
        lumiValue = (lumiValue < 0) ? 0 : lumiValue;
        lumiValue = (lumiValue > 200) ? 200 : lumiValue;

        $scope.onLumi(lumiValue);

        $scope.lumiValue = lumiValue;
    };

    $scope.onLumi = function (lumiValue) {
        lumiValue = lumiValue / 100;
        TweenLite.to($scope.bitmap, 0, {easel: {brightness: lumiValue}});
        $scope.stage.update();
        $scope.isUserPhoto = 0;
        $scope.photoValid = 0;
        if ( $scope.photoTraitment == PHOTO_TRAITMENT_AUTO || $scope.photoTraitment == PHOTO_TRAITMENT_MIXTE  ) {
            $scope.photoTraitment = PHOTO_TRAITMENT_MIXTE;
        } else {
            $scope.photoTraitment = PHOTO_TRAITMENT_MANUEL;
        }
    };

    //--------------------------
    // Control Contrast :
    $scope.contrastValue = 100;
    $scope.updateContrast = function (contrastValue, iDelta) {
        contrastValue = contrastValue + iDelta;
        contrastValue = (contrastValue < 0) ? 0 : contrastValue;
        contrastValue = (contrastValue > 200) ? 200 : contrastValue;

        $scope.onContrast(contrastValue);

        $scope.contrastValue = contrastValue;
    };

    $scope.onContrast = function (contrastValue) {
        contrastValue = contrastValue / 100;
        TweenLite.to($scope.bitmap, 0, {easel: {contrast: contrastValue}});
        $scope.stage.update();
        $scope.isUserPhoto = 0;
        $scope.photoValid = 0;
       if ( $scope.photoTraitment == PHOTO_TRAITMENT_AUTO || $scope.photoTraitment == PHOTO_TRAITMENT_MIXTE  ) {
            $scope.photoTraitment = PHOTO_TRAITMENT_MIXTE;
        } else {
            $scope.photoTraitment = PHOTO_TRAITMENT_MANUEL;
        }
    };



    //**************************************
    // Prendre une photo avec WebCam:
    //**************************************
    var imgBlob; // base64 String img

    // Fonction de vérification si le navigateur accepte l'API Vidéo :
    function isUserMediaFn()
    {
        return navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia || null;
    };

    // Ouvre Popin de capture d'image :
    $scope.onTakePic = function ()
    {

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
    $scope.onSelectImg = function ()
    {
        var byteString = atob(/*imgBlob.replace(/^data:image\/(png|jpg);base64,/, "")*/imgBlob.split("data:image/jpeg;base64,")[1]);
        var buffer = new Uint8Array(imgBlob.split("data:image/jpeg;base64,")[1].length);

        for (var i = 0; i < byteString.length; i++) {
            buffer[i] = byteString.charCodeAt(i);
        }

        var dataView = new DataView(buffer.buffer);
        var blob = new Blob([dataView], {type: "image/jpeg"});
        blob.lastModified = 1432225577648;
        blob.lastModifiedDate = new Date();
        var id = blob
            .lastModifiedDate
            .toISOString()
            .split('-')
            .join('')
            .split(':')
            .join('')
            .split('.')
            .join('')
            + Math.random(100);
        blob.name = "orig" + id + ".jpg";
        blob.size = buffer.length;

       $scope.upload(blob);
       return;
    };
    //----------------------------
    // Envoi de l'image depuis Zone modif de l'image (Luminosité Contraste) :

    $scope.onSelectImgModifed = function () {
        var canvas = document.getElementById("canvasImg");
        var imgBlob    = canvas.toDataURL("image/jpeg", 1.0);
        imgBlob = imgBlob.split("data:image/jpeg;base64,")[1];

        $http.post($scope.prefix_front + 'api/photo/blob/uploads.json',
            {
                'fileBlob': imgBlob,
                'courseType': $scope.courseType,
                'retouching': true
            }
        ).
            success(function (data, status, headers, config) {

                // Passe ce flag a false pour ne pas afficher automatiquement la zone de traitement de l'image :
                $scope.showOriginalPhoto = false;

                // Affecte l'image "Originale" du retour de l'API qui correspond a l'image traité par la canvas
                // (zoom + luminosité + contraste).

                // User photo Load :
                $scope.photo.OriginalFileUrl = data.OriginalFileUrl;
                $scope.photo.CroppedFileUrl  = cacheBuster(data.CroppedFileUrl);
                $scope.originalPhoto         = cacheBuster($scope.photo.OriginalFileUrl);
                $scope.photo.isCropped       = data.isCropped;
                if ( data.isCropped ) {
                    $scope.photoTraitment = PHOTO_TRAITMENT_AUTO;
                    $scope.isWebCamImageValid= true;
                } else {
                    $scope.photoTraitment = PHOTO_TRAITMENT_ORIGINAL;
                    $scope.isWebCamImageValid= false;
                }

                document.step_form.isUserPhoto.value         = $scope.isUserPhoto;
                document.step_form.photoValid.value          = $scope.photoValid;
                document.step_form.photoTraitment.value      = $scope.photoTraitment;
                document.step_form.isWebCamImageValid.value  = $scope.isWebCamImageValid;
                document.step_form.submit();

                document.step_form.submit();

                return;

            }).
            error(function (data, status, headers, config) {
                 $scope.acceptModifiedPhoto = false;
                 $scope.showOriginalPhoto = 0;

            });

    };

    $scope.deletePhoto = function () {

        $http.post($scope.prefix_front + 'api/delete/photo/uploads.json',
            {
                'courseType': $scope.courseType
            }
        ).
        success(function (data, status, headers, config) {
            $scope.isUserPhoto = 0;
            $scope.photoValid = 0;

            $scope.photo.CroppedFileUrl = "";
            $scope.photo.OriginalFileUrl = "";
            $scope.photo.isCropped = 0;
            $scope.acceptPhoto = false;
            // Clean le canvas & et range
            resetCanvas();
        }).
        error(function (data, status, headers, config) {
            /*$scope.isUserPhoto = 0;
            $scope.photoValid = 1;*/
        });
    };

    $scope.deleteOriginalPhoto = function () {

        $scope.isUserPhoto = 0;
        $scope.photoValid = 0;

        //$scope.photo.OriginalFileUrl = "";

        $scope.acceptModifiedPhoto = false;
        $scope.showOriginalPhoto = 0;

        // Clean le canvas & et range
        resetCanvas();
    };


    vm.httpGet = function(url, param, success, error) {

        $http
            .get(url,
                {
                    "params": param,
                    "responseType": "json"
                }
            )
            .success(success)
            .error(error || SEL.MODEL.defaultError);
    };

}]);



