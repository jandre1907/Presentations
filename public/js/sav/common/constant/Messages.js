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
 *    <div class="col-xs-10 col-xs-offset-1" message-dv meskey="{{pageCtrl.meskey}}"></div>
 *    <div class="col-xs-10 col-xs-offset-1" message-dv meskey="{{pageCtrl.meskey2}}"></div>
 * </div>
 *
 */

angular.module("SAV").factory("MessageFty",[
    '$compile', 'lang', 'Wording',
    function($compile, lang, Wording) {
        var messageTemplate = {
                "fr" : {
                    //( +)"(.*?)"[:](.*)
                    //$1"$2": "{{'SAV.Declaration.$2'|trans({}, '$2', 'fr')|raw}}",$3
                    "SAV-PV-DEC-EC01-MSS_001": Wording.get('pv.pv_declaration.SAV-PV-DEC-EC01-MSS_001'),
                    "SAV-PV-DEC-EC01-MSS_002": Wording.get('pv.pv_declaration.SAV-PV-DEC-EC01-MSS_002'),
                    "SAV-PV-DEC-EC01-MSS_003": Wording.get('pv.pv_declaration.SAV-PV-DEC-EC01-MSS_003'),
                    "label_legendValidite_casNA_IR": Wording.get('pv.pv_declaration.label_legendValidite_casNA_IR'),
                    "label_legendValidite_casNA_IR_tiers_pa": Wording.get('pv.pv_declaration.label_legendValidite_casNA_IR_tiers_pa'),

                    "SAV-PV-PRE-MSS_001": Wording.get('pv.pv_paiement.SAV-PV-PRE-MSS_001'),
                    "SAV-PV-PRE-MSS_002": Wording.get('pv.pv_paiement.SAV-PV-PRE-MSS_002'),
                    "SAV-PV-PRE-MSS_003": Wording.get('pv.pv_paiement.SAV-PV-PRE-MSS_003'),
                    "SAV-PV-POC-EC01-MSS_001":  Wording.get('pv.pv_paiement.SAV-PV-POC-EC01-MSS_001'),
                    "SAV-P/V-PPA-MSS_001_DOCA": Wording.get('pv.pv_paiement.SAV-P/V-PPA-MSS_001_DOCA'),
                    "SAV-P/V-PPA-MSS_002_DOCA": Wording.get('pv.pv_paiement.SAV-P/V-PPA-MSS_002_DOCA'),
                    "SAV-P/V-PPA-MSS_003_DOCA": Wording.get('pv.pv_paiement.SAV-P/V-PPA-MSS_003_DOCA'),

                    "SAV-P/V-CONF-MSS_001": Wording.get('pv.pv_confirmation.SAV-P/V-CONF-MSS_001'),
                    "SAV-P/V-CONF-MSS_002": Wording.get('pv.pv_confirmation.SAV-P/V-CONF-MSS_002'),
                    "SAV-P/V-CONF-MSS_003": Wording.get('pv.pv_confirmation.SAV-P/V-CONF-MSS_003'),
                    "SAV-P/V-CONF-MSS_004": Wording.get('pv.pv_confirmation.SAV-P/V-CONF-MSS_004'),
                    "SAV-P/V-CONF-MSS_005": Wording.get('pv.pv_confirmation.SAV-P/V-CONF-MSS_005'),
                    "SAV-P/V-CONF-MSS_006": Wording.get('pv.pv_confirmation.SAV-P/V-CONF-MSS_006'),
                    "SAV-P/V-CONF-MSS_007": Wording.get('pv.pv_confirmation.SAV-P/V-CONF-MSS_007'),
                    "SAV-P/V-CONF-MSS_008": Wording.get('pv.pv_confirmation.SAV-P/V-CONF-MSS_008'),

                    "SAV-P/V-NMS": Wording.get('pv.pv_echec.SAV-P/V-NMS'),
                    "V-16A":       Wording.get('pv.pv_echec.V-16A'),
                    "V-LIM-EC01":  Wording.get('pv.pv_echec.V-LIM-EC01'),
                    "V-LIM-EC02":  Wording.get('pv.pv_echec.V-LIM-EC02'),
                    "NO_CONTRACT": Wording.get('pv.pv_echec.NO_CONTRACT'),

                    // Attestation :
                    "SAV-ATT-EC01-RG_006": Wording.get('demande_attestation.liste.SAV-ATT-EC01-RG_006'),
                    "INFO_ATTESTATION":    Wording.get('demande_attestation.liste.INFO_ATTESTATION'),
                    "att.att_list.lbl_titre":    Wording.get('att.att_list.lbl_titre'),
                    "SERVER_ERROR":        Wording.get('demande_attestation.liste.SERVER_ERROR'),
                    "demande_attestation.liste.liste_elt":      Wording.get('demande_attestation.liste.liste_elt'),
                    "demande_attestation.liste.liste_elt_link": Wording.get('demande_attestation.liste.liste_elt_link'),

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

angular.module("SAV").directive("messageDv",[
    'MessageFty',
    '$compile',
    function(MessageFty, $compile) {
        return {
            restrict: 'A',
            scope: true,
            link : function(scope, el, attrs){
                scope.$watch(
                    function(){
                        return attrs.meskey;
                    },
                    function(){
                        el.empty();
                        el.append($compile(MessageFty.get(attrs.meskey))(scope));
                    }
                );
            }
        }
    }
]);
