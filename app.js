let geojsonLayer;

const map = L.map('map').setView([-20.4697, -54.6201], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

const drawControl = new L.Control.Draw({
    draw: {
        polygon: true,
        rectangle: true,
        circle: true,
        marker: true,
        polyline: true,
        circlemarker: false
    },
    edit: {
        featureGroup: drawnItems
    }
});

map.addControl(drawControl);

function bindEditPopup(layer) {

    layer.on("dblclick", function (event) {

        const l = event.target;

        if (!l.feature) {
            l.feature = { type: "Feature", properties: {}, geometry: {} };
        }

        if (!l.feature.properties) {
            l.feature.properties = {};
        }

        const props = l.feature.properties;

        const novoNome = prompt("Editar nome:", props.nome || "");
        if (novoNome !== null) props.nome = novoNome;

        if (l instanceof L.Marker) {
            const novoEndereco = prompt("Editar endereço:", props.endereco || "");
            if (novoEndereco !== null) props.endereco = novoEndereco;
        }

        let popup = props.nome ? `<b>${props.nome}</b>` : "";

        if (props.endereco) popup += `<br>${props.endereco}`;

        if (l instanceof L.Marker) {
            const ll = l.getLatLng();
            popup += `<br>Lat: ${ll.lat}<br>Lon: ${ll.lng}`;
        }

        if (l instanceof L.Circle) {
            const ll = l.getLatLng();
            popup += `<br>Raio: ${l.getRadius()}m<br>Lat: ${ll.lat}<br>Lon: ${ll.lng}`;
        }

        l.bindPopup(popup);

        saveData();

    });

}

function createGeoJSONLayer(data) {

    return L.geoJSON(data, {

        pointToLayer: function (feature, latlng) {

            const props = feature.properties || {};

            if (props.tipo === "circle") {
                return L.circle(latlng, {
                    radius: props.raio || 100
                });
            }

            return L.marker(latlng);
        },

        onEachFeature: function (feature, layer) {

            layer.feature = feature;

            const props = feature.properties || {};

            let popup = "";

            if (props.nome) popup += `<b>${props.nome}</b><br>`;
            if (props.endereco) popup += `${props.endereco}<br>`;

            if (layer instanceof L.Circle) {

                const ll = layer.getLatLng();

                popup += `Raio: ${layer.getRadius()}m<br>`;
                popup += `Lat: ${ll.lat}<br>Lon: ${ll.lng}`;

            } else {

                const ll = layer.getLatLng?.();

                if (ll) {
                    popup += `Lat: ${ll.lat}<br>Lon: ${ll.lng}`;
                }

            }

            layer.bindPopup(popup);

            bindEditPopup(layer);

        }

    });

}

function saveData() {
    const data = drawnItems.toGeoJSON();
    localStorage.setItem("mapData", JSON.stringify(data));
}

const savedData = localStorage.getItem("mapData");

if (savedData) {

    const geojson = JSON.parse(savedData);

    const loadedLayer = createGeoJSONLayer(geojson);

    loadedLayer.eachLayer(layer => drawnItems.addLayer(layer));

    if (loadedLayer.getLayers().length > 0) {
        map.fitBounds(loadedLayer.getBounds());
    }

} else {

    fetch("data/sanesul.geojson")
        .then(response => response.json())
        .then(data => {

            const sanesulLayer = createGeoJSONLayer(data);

            sanesulLayer.eachLayer(layer => drawnItems.addLayer(layer));

        });

    fetch("data/data.geojson")
        .then(response => response.json())
        .then(data => {

            geojsonLayer = createGeoJSONLayer(data);

            geojsonLayer.eachLayer(layer => drawnItems.addLayer(layer));

            if (geojsonLayer.getLayers().length > 0) {
                map.fitBounds(geojsonLayer.getBounds());
            }

        });

}

map.on(L.Draw.Event.CREATED, function (event) {

    const layer = event.layer;
    const type = event.layerType;

    let nome = prompt("Nome do local:");
    if (!nome) nome = "Local sem nome";

    let endereco = "";
    let lat, lon;

    if (type === "marker") {

        endereco = prompt("Endereço:") || "Não informado";

        const ll = layer.getLatLng();
        lat = ll.lat;
        lon = ll.lng;

        layer.feature = {
            type: "Feature",
            properties: { nome, endereco, latitude: lat, longitude: lon },
            geometry: { type: "Point", coordinates: [lon, lat] }
        };

    }

    else if (type === "circle") {

        const center = layer.getLatLng();

        layer.feature = {
            type: "Feature",
            properties: { nome, tipo: "circle", raio: layer.getRadius() },
            geometry: { type: "Point", coordinates: [center.lng, center.lat] }
        };

    }

    else if (type === "polygon" || type === "rectangle") {

        const coords = layer.getLatLngs()[0].map(p => [p.lng, p.lat]);

        layer.feature = {
            type: "Feature",
            properties: { nome },
            geometry: { type: "Polygon", coordinates: [coords] }
        };

    }

    else if (type === "polyline") {

        const coords = layer.getLatLngs().map(p => [p.lng, p.lat]);

        layer.feature = {
            type: "Feature",
            properties: { nome },
            geometry: { type: "LineString", coordinates: coords }
        };

    }

    let popup = `<b>${nome}</b>`;

    if (endereco) popup += `<br>${endereco}`;
    if (lat && lon) popup += `<br>Lat: ${lat}<br>Lon: ${lon}`;

    layer.bindPopup(popup);

    bindEditPopup(layer);

    drawnItems.addLayer(layer);

    saveData();

});

map.on(L.Draw.Event.EDITED, function (event) {

    event.layers.eachLayer(function (layer) {

        const props = layer.feature?.properties || {};

        if (layer instanceof L.Marker) {

            const ll = layer.getLatLng();

            layer.feature.geometry.coordinates = [ll.lng, ll.lat];

            props.latitude = ll.lat;
            props.longitude = ll.lng;

        }

        if (layer instanceof L.Circle) {

            const center = layer.getLatLng();

            layer.feature.geometry.coordinates = [center.lng, center.lat];

            props.raio = layer.getRadius();

        }

        if (layer instanceof L.Polygon) {

            const coords = layer.getLatLngs()[0].map(p => [p.lng, p.lat]);

            layer.feature.geometry.coordinates = [coords];

        }

        if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {

            const coords = layer.getLatLngs().map(p => [p.lng, p.lat]);

            layer.feature.geometry.coordinates = coords;

        }

    });

    saveData();

});

map.on(L.Draw.Event.DELETED, saveData);

const loadBtn = document.getElementById("loadBtn");
const fileInput = document.getElementById("fileInput");

loadBtn.addEventListener("click", () => {
    fileInput.click();
});


fileInput.addEventListener("change", function (event) {

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        const geojsonData = JSON.parse(e.target.result);

        drawnItems.clearLayers();

        const importedLayer = createGeoJSONLayer(geojsonData);

        importedLayer.eachLayer(layer => drawnItems.addLayer(layer));

        if (importedLayer.getLayers().length > 0) {
            map.fitBounds(importedLayer.getBounds());
        }

        localStorage.setItem("mapData", JSON.stringify(geojsonData));

    };

    reader.readAsText(file);

});

exportBtn.addEventListener("click", function () {

    const data = drawnItems.toGeoJSON();

    const dataStr = JSON.stringify(data, null, 2);

    const blob = new Blob([dataStr], { type: "application/json" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "map-data.geojson";
    a.click();

    URL.revokeObjectURL(url);

});

