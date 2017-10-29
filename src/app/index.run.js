(function () {
    'use strict';

    angular
        .module('app')
        .run(runBlock);

    /** @ngInject */
    function runBlock($rootScope) {
        $rootScope.languages = [
            "English",
            "Spanish",
            "French",
            "German",
            "Japanese",
            "Korean",
            "Chinese",
            "Russian",
            "Hindi",
            "Dutch"
        ];
        $rootScope.langInd = localStorage.lang || 0;

        var Sentences = {
            "American": ["American", "Americano", "Américain", "Amerikanisch", "アメリカ人", "미국 사람", "美国人", "Американская", "अमेरिकन", "Amerikaans"],
            "European": ["European", "Europeo", "Européen", "Europäisch", "ヨーロッパ人", "유럽 사람", "欧洲", "Европейский", "यूरोपीय", "Europese"],
            "Asian": ["Asian", "Asiático", "Asiatique", "Asiatisch", "アジア人", "아시아 사람", "亚洲人", "Азиатский", "एशियाई", "Aziatisch"],
            "Latin": ["Latin", "Latín", "Latin", "Lateinisch", "ラテン", "라틴어", "拉丁", "Латинский", "लैटिन", "Latijns"],
            "Mediterranean": ["Mediterranean", "Mediterráneo", "Méditerranéen", "Mittelmeer", "地中海", "지중해", "地中海", "Средиземноморье", "मेडिटेरेनियन", "Middellandse Zee"],
            "Other": ["Other", "Otro", "Autre", "Andere", "その他", "다른", "其他", "Другие", "अन्य", "Anders"],
            "Search for...": ["Search for...","Buscar","Rechercher ...","Suchen nach ...","検索する ...","검색 대상 ...","搜索 ...","Искать ...","निम्न को खोजें ...","Zoeken ..."],
            "Order Now": ["Order Now", "Ordenar ahora", "Commandez maintenant", "Jetzt bestellen", "今すぐ注文", "지금 주문하세요", "现在下单", "Заказать сейчас", "अब ऑर्डर दें", "Bestel nu"],
            "Order Delivery": ["Order Delivery", "Entrega de la orden", "Livraison de la commande", "Bestellung Lieferung", "注文の配信", "주문 납품", "订单交货", "Доставка заказа", "आदेश वितरण", "Bestel Delivery"],
            "Reservation": ["Reservation", "Reserva", "Réservation", "Reservierung", "予約", "예약", "保留", "Бронирование", "आरक्षण", "Reservering"],
            "Terms And Conditions": ["Terms And Conditions", "Términos y Condiciones", "Termes et conditions", "Geschäftsbedingungen", "規約と条件", "이용 약관", "条款和条件", "Условия и положения", "नियम और शर्तें", "Voorwaarden"],
            "Home": ["Home", "Casa", "Accueil", "Zuhause", "ホーム", "집", "家", "Главная", "घर", "Huis"],
            "Privacy Policy": ["Privacy Policy", "Política de privacidad", "Politique de confidentialité", "Datenschutz-Bestimmungen", "個人情報保護方針", "개인 정보 정책", "隐私政策", "Политика Конфиденциальности", "गोपनीयता नीति", "Privacybeleid"]
        };
        $rootScope.translate = function (word) {
            var val = word;
            if (typeof Sentences[word] == 'object') {
                val = Sentences[word][$rootScope.langInd] || word;
            }
            return val;
        }
    }

})();

