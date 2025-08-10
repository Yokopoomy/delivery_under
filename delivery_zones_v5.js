ymaps.ready(init);

//console.log(btn.textContent);


function init() {
    //const btn = document.querySelector('.conf');
    //const div = document.querySelector('.div1');
    //const city = document.querySelector('.city');
    const street = document.querySelector('[name="dstreet"]');
    const house = document.querySelector('[name="dhouse"]');
    const price = document.querySelector('[name="price"]');
    const zone = document.querySelector('[name="zone"]');
    const free = document.querySelector('[name="free"]');
    //const apt = document.querySelector('.apt');
    //const floor = document.querySelector('.floor');
    //const phone = document.querySelector('.phone');
    //const name = document.querySelector('.name');

    var myMap = new ymaps.Map('map', {
            center: [30.32981955459618, 59.9467962610097],
            zoom: 9,
            controls: ['searchControl']
        }),
        deliveryPoint = new ymaps.GeoObject({
            geometry: {type: 'Point'},
            properties: {iconCaption: 'Адрес'}
        }, {
            preset: 'islands#blackDotIconWithCaption',
            draggable: true,
            iconCaptionMaxWidth: '215'
        }),
        searchControl = myMap.controls.get('searchControl');
        
    searchControl.options.set({size: 'large', noPlacemark: true, placeholderContent: 'Введите адрес доставки'});
    myMap.geoObjects.add(deliveryPoint);

    function onZonesLoad(json) {
        // Добавляем зоны на карту.
        var deliveryZones = ymaps.geoQuery(json).addToMap(myMap);
        // Задаём цвет и контент балунов полигонов.
        deliveryZones.each(function (obj) {
            obj.options.set({
                fillColor: obj.properties.get('fill'),
                fillOpacity: obj.properties.get('fill-opacity'),
                strokeColor: obj.properties.get('stroke'),
                strokeWidth: obj.properties.get('stroke-width'),
                strokeOpacity: obj.properties.get('stroke-opacity')
            });
            obj.properties.set('balloonContent', obj.properties.get('description'));
        });

        // Проверим попадание результата поиска в одну из зон доставки.
        searchControl.events.add('resultshow', function (e) {
            highlightResult(searchControl.getResultsArray()[e.get('index')]);
        });

        // Проверим попадание метки геолокации в одну из зон доставки.
        //myMap.controls.get('geolocationControl').events.add('locationchange', function (e) {
            //highlightResult(e.get('geoObjects').get(0));
        //});

        // При перемещении метки сбрасываем подпись, содержимое балуна и перекрашиваем метку.
        deliveryPoint.events.add('dragstart', function () {
            deliveryPoint.properties.set({iconCaption: '', balloonContent: ''});
            deliveryPoint.options.set('iconColor', 'black');
        });

        // По окончании перемещения метки вызываем функцию выделения зоны доставки.
        deliveryPoint.events.add('dragend', function () {
            highlightResult(deliveryPoint);
        });

        function highlightResult(obj) {
            // Сохраняем координаты переданного объекта.
            var coords = obj.geometry.getCoordinates(),
            // Находим полигон, в который входят переданные координаты.
                polygon = deliveryZones.searchContaining(coords).get(0);       

            if (polygon) {
                //btn.addEventListener('click', () => {
                    //const input_search = document.querySelector('.ymaps-2-1-79-islets_serp-item__title');
                    //div.textContent = data;
                //});
                //let data = "Адрес: " + input_search.textContent + " входит в зону доставки. Доставка - " + polygon.properties._data.test + " рублей";
                //console.log(data);

                //console.log(polygon);
                //console.log(polygon.properties._data.test);
                //console.log(polygon.properties._data.delivery);
                //console.log(polygon.properties._data.min);

                // Уменьшаем прозрачность всех полигонов, кроме того, в который входят переданные координаты.
                deliveryZones.setOptions('fillOpacity', 0.4);
                polygon.options.set('fillOpacity', 0.8);
                // Перемещаем метку с подписью в переданные координаты и перекрашиваем её в цвет полигона.
                //deliveryPoint.geometry.setCoordinates(coords);
                //deliveryPoint.options.set('iconColor', polygon.properties.get('fill'));
                // Задаем подпись для метки.
                
                myMap.balloon.open(coords, polygon.properties._data.description, {
                    // Опция: не показываем кнопку закрытия.
                    closeButton: true
                });

				//deliveryPoint.properties.set({
                    //iconCaption: polygon.properties._data.test,
                   //balloonContent: polygon.properties._data.description,
                    //balloonContentHeader: ''
                //});

				
				if (typeof(obj.getThoroughfare) === 'function') {
                    
					
					setData(obj);
					console.log(polygon.properties._data.description);
                } else {
                    // Если вы не хотите, чтобы при каждом перемещении метки отправлялся запрос к геокодеру,
                    // закомментируйте код ниже.
                    ymaps.geocode(coords, {results: 1}).then(function (res) {
                        var obj = res.geoObjects.get(0);
                        setData(obj);
                    });
                }
            } else {
                //btn.addEventListener('click', () => {
                    //const input_search = document.querySelector('.ymaps-2-1-79-islets_serp-item__title');
                    //let data = "Адрес: " + input_search.textContent + " не входит в зону доставки.";
                   //div.textContent = data;
                //});
                // Если переданные координаты не попадают в полигон, то задаём стандартную прозрачность полигонов.
                deliveryZones.setOptions('fillOpacity', 0.4);
                // Перемещаем метку по переданным координатам.
                deliveryPoint.geometry.setCoordinates(coords);
                // Задаём контент балуна и метки.
                deliveryPoint.properties.set({
                    iconCaption: 'Доставка не осуществляется',
                    balloonContent: 'Cвяжитесь с оператором',
                    balloonContentHeader: ''
                });
                // Перекрашиваем метку в чёрный цвет.
                deliveryPoint.options.set('iconColor', 'black');

                const deliveryTotal = document.querySelector('.deliver_total');
                house.value = '';
                street.value = '';
                free.value = '-1';
                city.value = obj._xalEntities.administrativeAreas[0];
                deliveryTotal.outerHTML = `
                <div class="deliver_total t-descr t-descr_sm" style="display: block; padding-bottom: 20px; font-size: 16px; text-align: right; font-weight: 600; color: #000; font-family: 'Noah',Arial,sans-serif;">
                    <span class="t706__cartwin-totalamount-info_label">Доставка:</span>
                    <span class="t706__cartwin-totalamount-info_value">
                        <div class="t706__cartwin-prodamount-price" style="display: inline-block;">Не входит в зону</div>
                        <div class="t706__cartwin-prodamount-currency" style="display: inline-block;"></div>
                    </span>
                </div>
                `
            }

            function setData(obj){
                var address = [obj.getThoroughfare(), obj.getPremiseNumber(), obj.getPremise()].join(' ');
                //console.log(address);
                if(typeof obj._xalEntities.premiseNumber == 'undefined'){
                    house.value = '';
                 }else{
                    house.value = obj._xalEntities.premiseNumber;
                 }
                //house.value = obj._xalEntities.premiseNumber;
                street.value = obj._xalEntities.thoroughfare.replace(/(улица)\s/g, '');
                price.value = polygon.properties._data.delivery;
                zone.value = polygon.properties._data.min;
                free.value = polygon.properties._data.free;
                const deliveryTotal = document.querySelector('.deliver_total');
                deliveryTotal.outerHTML = `
                <div class="deliver_total t-descr t-descr_sm" style="display: block; padding-bottom: 20px; font-size: 16px; text-align: right; font-weight: 600; color: #000; font-family: 'Noah',Arial,sans-serif;">
                    <span class="t706__cartwin-totalamount-info_label">Доставка:</span>
                    <span class="t706__cartwin-totalamount-info_value">
                        <div class="t706__cartwin-prodamount-price" style="display: inline-block;">${polygon.properties._data.delivery}</div>
                        <div class="t706__cartwin-prodamount-currency" style="display: inline-block;">р.</div>
                    </span>
                </div>
                `
                
                city.value = obj._xalEntities.administrativeAreas[0];
                //console.log(house);
                //console.log(street);
                //console.log(free);
                //console.log(city);

                if (address.trim() === '') {
                    address = obj.getAddressLine();
                }

                //var price = polygon.properties.get('description');
                //price = price.match(/<strong>(.+)<\/strong>/)[1];
                //deliveryPoint.properties.set({
                    //iconCaption: polygon.properties._data.test,
                    //balloonContent: address,
                //});
            }
        }
    }

    $.ajax({
        url: 'https://cdn.jsdelivr.net/gh/Yokopoomy/delivery_under@main/data_v5.geojson',
        dataType: 'json',
        success: onZonesLoad
    });
}
