/**
 * La directive messageDv a pour objectif de faire un rendu d'un template avec les données fournies par un controller.
 * Cette directive s'appuie sur la collection de template MessageFty.
 *
 * Son fonctionnement nécessite:
 * - le paramètre meskey, clé du template désiré.
 * - les variables de scopes utilisée par ce même template (exemple: {{reference}})
 *
 * exemple d'utilisation:
 * <div class="row">
 *    <div class="col-xs-10 col-xs-offset-1" message-dv meskey="{{pageCtrl.meskey}}">
 *    <div class="col-xs-10 col-xs-offset-1" message-dv meskey="{{pageCtrl.meskey2}}">
 * </div>
 *
 */
angular.module("Common").factory("MessageFty",[
    '$compile',
    'lang',
    function($compile, lang) {
        var messageTemplate = {
                "fr" : {
                    "SAV-PV-DEC-EC01-MSS_001": '<span>Si vous déclarez la perte/vol de votre carte en ligne, vous recevrez votre nouvelle carte sous un délai de 7 jours ouvrés.<br/>Pour obtenir une nouvelle carte plus rapidement, vous pouvez aussi vous rendre en <a href="#/PointDeVente" class="link">point de vente</a> (PDF).<br/>Votre carte N° <span ng-model="reference">{{reference}}</span> sera désactivée à l’issue de cette déclaration.</span>',
                    "SAV-PV-DEC-EC01-MSS_002": '<span><strong>A noter : En cas de racket ou de vol avec violence</strong>, de votre carte Navigo, vous pouvez la renouveler gratuitement en point de vente (PDF) en vous munissant de la copie de récépissé du dépôt de plainte établi auprès des services de police.</span>',
                    "SAV-PV-DEC-EC01-MSS_003":'<span>A l’issu de votre demande, celle-ci devra être validée par le Tiers payant qui finance votre forfait afin qu’il prenne en charge le coût du renouvellement de votre carte. Votre carte sera désactivé dès que votre demande aura été acceptée.</span>',

                    "SAV-PV-PRE-MSS_001": '<strong>Le renouvellement de votre carte vous sera facturé <span>{{deedPrice}}</span> €.</strong><br/> Ce montant sera intégré sur votre prélèvement de {{orderMonthName}}.',
                    "SAV-PV-PRE-MSS_002":'<span>Le montant de votre prochaine mensualité sera de {{standingOrder}} €.</span>',
                    "SAV-PV-PRE-MSS_003":'<span>Pour confirmer votre demande cliquez sur Valider.</span>',

                    "SAV-PV-POC-EC01-MSS_001":'<p>Votre paiement a échoué. Vous pouvez effectuer votre règlement avec une autre carte bancaire en cliquant sur « Payer avec une autre carte bancaire ».</p>',

                    "SAV-P/V-CONF-MSS_001": ' <h2><img alt="Confirmation" class="picto valid" ng-src="{{ element.image || \'../bundles/sel/images/check2x.png\' }}"><strong>Votre carte n° {{reference}} a bien été désactivée.</strong></h2><br/> ',
                    "SAV-P/V-CONF-MSS_002": ' <p><strong>Elle doit maintenant être validée par le Tiers Payant qui finance votre forfait.</strong></p> ',
                    "SAV-P/V-CONF-MSS_003": ' <p>Un mail de confirmation a été envoyé à l’adresse <strong>{{mail}}</strong>.</p> ',
                    "SAV-P/V-CONF-MSS_004": ' <strong>Votre nouvelle carte sera envoyée à votre domicile d’ici le {{sendDate | date:"dd/MM/yyyy"}}.</strong> ',
                    "SAV-P/V-CONF-MSS_005": ' <strong>Une nouvelle carte Bons Plans vous sera également adressé.</strong> ',
                    "SAV-P/V-CONF-MSS_006": ' <span>Rendez-vous sur votre espace Services Navigo pour suivre l’envoi de votre nouvelle carte.</span> ',
                    "SAV-P/V-CONF-MSS_007": ' <h2><img alt="Confirmation" class="picto valid" ng-src="{{ element.image || \'../bundles/sel/images/check2x.png\' }}"><strong>Votre demande a bien été prise en compte</strong></h2><br/> ',
                    "SAV-P/V-CONF-MSS_008": ' <p><strong>Vous venez d’effectuer un paiement par carte bancaire d’un montant de {{buyAmount}}€.</strong><br/> Votre ticket de paiement Payline vous a été envoyé par email.</p> ',

                    "SAV-P/V-PPA-MSS_001_DOCA": "<strong>Le renouvellement de votre carte s'élève à {{deedPrice}} €.</strong><br/>Vous pouvez régler cette somme en ligne par carte bancaire.<br/>Pour confirmer votre demande cliquez sur Valider.</span>",
                    "SNA-CO-ECO1-ERR_008": "<span>Nous ne sommes pas en mesure de donner suite à votre demande.</span>",
                    "CU-RAT-ECO1-MSS_001": '<span>Nous ne sommes pas parvenus à retrouver vos informations clients à partir des données que vous nous avez fournies.</p><p>Nous vous invitons à contacter le service client au 09 69 39 57 57 (coùt d’un appel local non surtaxé) du lundi au vendredi de 8h à 20h, le samedi de 9h à 20h, fermé le dimanche.</span>',
                    "SNA-SIG-EC01-MSS_006": '<span>Après action sur le bouton « Recevoir mon code par SMS », un message apparait tout de suite :   « Nous vous avons envoyé un SMS. Si vous ne l’avez pas reçu après 5 minutes, vous pouvez demander à recevoir un autre code par Email à l’adresse {{currentEmail}}.<br/>Attention le code reçu par SMS ne sera plus valable.</span>',

                    "vide": "<span></span>"
                    //
                },
               "en" : {
                    "end": ""
                    //
                }
            };

        return {
            get: function(key) {
                return messageTemplate[lang][key];
            }
        }
    }
]);


angular.module("Common").directive("messageDv",[
    'MessageFty',
    '$compile',
    function(MessageFty, $compile) {
        return {
            restrict: 'A',
            scope: true,
            link : function(scope, el, attrs){
                el.empty();
                el.append($compile(MessageFty.get(attrs.meskey))(scope));
            }
        }
    }
]);

angular.module("Common").directive("asHtml",[
    '$compile', '$log',
    function($compile, $log) {
        return {
            restrict: 'A',
            scope: true,
            link : function(scope, el, attrs){
                scope.$watch(
                    function() {
                        return attrs.htmlContent;
                    }
                    ,
                    function() {
                        el.html(attrs.htmlContent);
                    }
                );
            }
        }
    }
]);

angular.module("Common").directive("templateContent",[
    'MessageFty',
    '$compile',
    function(MessageFty, $compile) {
        return {
            restrict: 'A',
            scope: true,
            link : function(scope, el, attrs){
                scope.prefix_front = SEL.prefix_front;
                var templateMe = function(newVal, oldVal) {
                    el.empty();
                    try {
                        var content = $compile(attrs.templateContent)(scope);
                        el.append(content);
                    } catch(e) {
                        el.html(attrs.templateContent)
                    }

                };
                scope.$watch(
                    function() {
                        return attrs.templateContent;
                    }
                    ,templateMe
                );
                scope.$watch(
                        function() {
                            return scope.prefix_front;
                        }
                        ,templateMe
                    );

            }
        }
    }
]);