(function(){
    "use strict";

    angular.module("updatePhoto")
        .value("appMod", {
            title:{
                "fr": {
                    "Profil": "Client Existant ?",
                    "Coordonnees": "Vos coordonn�es",
                    "Photo": "Photo",
                    "Recapitulatif": "R�capitulatif",
                    "Confirmation": "Confirmation",
                    "Identification": "Identification",
                    "Detail": "Rattachement Donn�es compl�mentaires",
                    "Forfait": "Rattachement - Cas Payeur - S�l�ction du forfait",
                    "Service": "Contacter service client",
                    "Dedi": "Rattachement non autoris�",
                    "end": ""
                }
            },
            msg:{
                "fr": {
                    "SNA-CO-EC01-MSS_001": "Votre t�l�phone portable nous servira � finaliser votre souscription. Il ne sera en aucun cas utilis� � des fins commerciales sans votre autorisation.",
                    "SNA-CO-EC01-MSS_002": "Votre email et votre mot de passe seront vos identifiants pour acc�der � votre compte Services Navigo personnalis�.",
                    "SNA-CO-EC01-ERR_003": "Vous disposez d�j� d�un forfait annuel � votre nom. Vous ne pouvez pas souscrire un 2e forfait.",
                    "SNA-CO-EC01-MSS_004": "Un courrier envoy� � cette adresse n�a pas pu vous �tre remis. Veuillez mettre � jour votre adresse postale.",
                    "SNA-CO-EC01-MSS_005": "Veuillez-ressaisir votre code postal ou saisir la commune",
                    "SNA-CO-EC01-ERR_006": "L'�ge minimum pour souscrire � un forfait Navigo Annuel est de 4 ans.",
                    "SNA-CO-EC01-ERR_007": "Erreur dans la saisie de la date de naissance. Merci de la saisir � nouveau.",
                    "SNA-CO-EC01-ERR_008": "Nous ne sommes pas en mesure de donner suite � votre demande.",


                    "SNA-PAI-EC01-MSS_001": "Le numéro de téléphone portable du payeur nous servira à finaliser la souscription.",
                    "SNA-PAI-EC01-MSS_002": "Ces informations sont disponibles sur votre RIB.",
                    "SNA-PAI-EC01-ERR_003": "Le code banque de votre RIB n’est pas reconnu. Merci de saisir un nouveau BIC / IBAN associé à un compte bancaire domicilié en France,  DROM-COM inclus (hors compte épargne).",
                    "SNA-PAI-EC01-ERR_004": "L'IBAN et le BIC saisis ne sont pas valides. Veuillez les saisir à nouveau.",
                    "SNA-PAI-EC01-ERR_005": "Le payeur désigné finance déjà un forfait présentant une dette. Merci de la régulariser avant de souscrire  un nouveau forfait.",
                    "SNA-PAI-EC01-ERR_006": "L’âge minimum pour souscrire à un forfait Navigo Annuel est de 4 ans. Les enfants de moins de 4 ans voyagent gratuitement.",
                    "SNA-PAI-EC01-ERR_007": "Erreur de saisie dans la date de naissance. Merci de la saisir à nouveau.",
                    "SNA-PAI-EC01-ERR_008": "Nous ne sommes pas en mesure de donner suite à votre demande. Nous vous remercions de bien vouloir vous rapprocher de l’Agence Navigo Annuel au 09 63 39 22 22.",

                    "SNA-SIG-EC01-MSS_001": "Vous ne pouvez pas redemander l�envoi d�un code de signature par SMS. Vous pouvez demander l�envoi d�un code par email.",
                    "SNA-SIG-EC01-MSS_002": "Un code de signature vous a d�j� �t� transmis par email � l�adresse [mail du signataire].",
                    "SNA-SIG-EC01-MSS_003": "Vous allez maintenant signer �lectroniquement votre contrat Navigo Annuel. Pour cela vous devez accepter les conditions g�n�rales d�utilisation et de vente du forfait et renseigner un code de validation.<br/>Votre dossier ne sera transmis qu�apr�s la finalisation de l��tape de signature �lectronique.",
                    "SNA-SIG-EC01-MSS_004": "%s a demand� � souscrire un forfait navigo Annuel pour lequel vous �tes d�clar� comme payeur.<br/>Les caract�ristiques du forfait sont :<br/>Date de d�but du forfait    %S<br/>Zones du forfait                   %s<br/>Montant                                %s<br/>Vous allez proc�der maintenant � la signature �lectronique du contrat Navigo Annuel et de votre mandat de pr�l�vement.<br/>Veuillez-noter que votre dossier ne sera transmis qu�apr�s la finalisation de l��tape de signature �lectronique.",
                    "SNA-SIG-EC01-MSS_005": "Vous allez proc�der maintenant � la signature �lectronique de votre contrat Navigo Annuel.<br/>Veuillez-noter que votre dossier ne sera transmis qu�apr�s la finalisation de l��tape de signature �lectronique.",
                    "SNA-SIG-EC01-MSS_006": "Un code vous a été envoyé par sms. Si vous ne l'avez pas reçu dans 5 minutes, vous pouvez en demander un autre par e-mail à l'adresse %s.<br />Attention, l’envoi du code par e-mail désactive le code envoyé par SMS.",
                    "SNA-SIG-EC01-MSS_007": "Un code vous a été envoyé par e-mail.<br />Il restera valide durant 15 minutes à compter de sa réception.",
                    "SNA-SIG-EC01-MSS_008": "Nous vous avons envoy� un SMS. Si vous ne l�avez pas re�u apr�s 5 minutes, vous pouvez demander � recevoir un autre code par email � l�adresse %s. Attention, le code envoy� par SMS ne sera plus valable",
                    "SNA-SIG-EC01-ERR_003": "Le code de signature saisi est incorrect, veuillez le saisir � nouveau.",
                    "SNA-SIG-EC01-ERR_004": "Le code de signature saisi est incorrect et il a �t� verrouill�. Vous devez attendre 24h pour r�essayer. Vous pourrez alors recommencer votre processus de signature �lectronique ou souscrire � imagine R gr�ce au formulaire papier.",


                    "SNA-RAT-EC02-ERR_001": "L'�ge minimum pour souscrire � un forfait Navigo Annuel est de 4 ans.",
                    "SNA-RAT-EC02-ERR_002": "Erreur dans la saisie de la date de naissance. Merci de la saisir � nouveau.",

                    "SNA-FOR-EC01-MSS_001": "Votre choix n�est pas disponible pour la souscription en ligne. Pour en b�n�ficier rendez-vous en point de vente.",


                    "IHM-TRANS-ERR_001": "Informations obligatoires.",
                    "IHM-TRANS-ERR_002": "Information incorrecte, veuillez les saisir � nouveau.",
                    "IHM-TRANS-ERR_002_PLURIEL": "Informations incorrectes, veuillez les saisir � nouveau.",
                    "IHM-TRANS-ERR_003": "Mot de passe incorrecte, veuillez le saisir � nouveau.",
                    "IHM-TRANS-ERR_004": "L'adresse email saisie est invalide. Veuillez la saisir � nouveau.",
                    "IHM-TRANS-ERR_005": "Les deux mots de passe ne concordent pas. Veuillez les saisir � nouveau.",
                    "IHM-TRANS-ERR_006": "Les deux adresses email ne concordent pas. Veuillez les saisir � nouveau.",

                    "CU-INS-EC02-ERR_001": "Trois mails d�activation vous ont d�j� �t� envoy�s. Merci de cr�er un nouvel espace client. ",
                    "CU-INS-EC02-ERR_002": "Votre espace client a bien �t� cr��.",
                    "CU-INS-EC02-MSG_002": "Votre espace client a bien �t� cr��.", // ?????
                    "CU-INS-EC02-ERR_003": "Votre espace a d�j� �t� activ�. Merci d�utiliser vos identifiants pour y acc�der.",
                    "CU-INS-EC02-ERR_004": "Votre lien d�activation n�est plus valide. Veuillez recommencer le processus de cr�ation de votre espace.",

                    "CU-INS-EC03-MSS_001": "Un courrier envoy� � cette adresse n�a pas pu vous �tre remis. Veuillez mettre � jour votre adresse postale. ",
                    "CU-INS-EC03-MSS_002": "Nous vous recommandons de renseigner un num�ro de t�l�phone portable car celui-ci vous sera n�cessaire lors de vos futures souscriptions.",

                    "CU-RAT-EC01-MSS_001": "Nous ne sommes pas parvenus � retrouver vos informations client � partir des donn�es que vous nous avez fournies.<br/>Nous vous invitons � contacter le service client au n� <b>09 69 39 57 57</b>.",
                    "CU-RAT-EC01-MSS_002": "Nous ne sommes pas en mesure de donner suite � votre demande.",

                    "CU-CON-EC01-ERR_001": "Donn�es de connexion incorrectes.",
                    "CU-CON-EC01-ERR_002": "Votre compte est bloqu�. Un email vous a �t� envoy� pour modifier votre mot de passe.",
                    "CU-CON-EC01-ERR_003": "Votre compte n�est pas encore activ�. Un mail d�activation vous avait �t� adress� pour l�activation de votre compte.",
                    "CU-CON-EC01-ERR_004": "Votre mot de passe est incorrect. Veuillez recommencer. <br/>Il vous reste %s tentatives.",
                    "CU-CON-EC01-ERR_005": "Vous avez �t� d�connect� suite � une trop longue inactivit� sur notre site.",
                    "CU-CON-EC01-ERR_006": "Nous ne sommes pas parvenus � retrouver vos informations client � partir des donn�es que vous nous avez fournies.<br/>Nous vous invitons � contacter le service client au n� <b>09 69 39 57 57</b>.",

                    "CU-REI-EC03-MSS_001": "Votre nouveau mot de passe a bien �t� enregistr�.",
                    "CU-REI-EC03-MSS_002": "Votre nouveau mot de passe a bien �t� enregistr�. Nous vous confirmons le d�blocage de votre compte.",

                    "CMC-CO-EC01-MSS_001": "Pour information, vous pouvez �galement utiliser votre carte Navigo Annuel/Navigo imagine R pour acheter un forfait Mois ou un forfait semaine sur un automate de vente et de rechargement",
                    "CMC-CO-EC01-ERR_001": "Vous poss�dez d�j� une carte Navigo Mois Semaine. Si vous souhaitez d�clarer la perte ou le vol de votre carte vous pouvez vous rendre en agence.",
                    "CMC-CO-EC01-ERR_002": "Pour commander une carte Navigo vous devez r�sider en Ile de France. Si vous disposez d�une attestation de votre employeur (avec le num�ro SIRET) qui vous donne droit � une carte Navigo vous devez vous pr�senter en agence pour la faire faire.",
                    "end": ""
                    //
                }
            }

        })
})();
