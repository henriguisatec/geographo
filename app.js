"use strict";

const modal = document.getElementById("editModal");
const editNome = document.getElementById("editNome");
const editEndereco = document.getElementById("editEndereco");
const saveEdit = document.getElementById("saveEdit");
const cancelEdit = document.getElementById("cancelEdit");

let currentLayer = null;
let creatingLayer = false;


let geojsonLayer;

const map = L.map("map").setView([-20.4697, -54.6201], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
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


function buildPopup(layer, props) {

    let popup = "";

    if (props.nome) popup += `<b>${props.nome}</b><br>`;
    if (props.endereco) popup += `${props.endereco}<br>`;

    if (layer instanceof L.Marker || layer instanceof L.Circle) {

        const ll = layer.getLatLng();

        popup += `Lat: ${ll.lat}<br>Lon: ${ll.lng}`;

    }

    if (layer instanceof L.Circle) {

        popup += `<br>Raio: ${layer.getRadius()}m`;

    }

    if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {

        const center = layer.getBounds().getCenter();

        popup += `Lat: ${center.lat}<br>Lon: ${center.lng}`;

    }

    if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {

        const points = layer.getLatLngs();

        popup += `Pontos: ${points.length}`;

    }

    return popup;

}

function bindEditPopup(layer) {

    layer.on("dblclick", function (event) {

        const l = event.target;

        if (!l.feature) {
            l.feature = { type: "Feature", properties: {}, geometry: {} };
        }

        const props = l.feature.properties || {};

        editNome.value = props.nome || "";
        editEndereco.value = props.endereco || "";

        currentLayer = l;

        modal.style.display = "flex";

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

            layer.bindPopup(buildPopup(layer, props));

            bindEditPopup(layer);

        }

    });

}


const saveData = () => {

    const data = drawnItems.toGeoJSON();

    localStorage.setItem("mapData", JSON.stringify(data));

};


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
        .then(res => res.json())
        .then(data => {

            const layer = createGeoJSONLayer(data);

            layer.eachLayer(l => drawnItems.addLayer(l));

        })
        .catch(console.error);

    fetch("data/data.geojson")
        .then(res => res.json())
        .then(data => {

            const layer = createGeoJSONLayer(data);

            layer.eachLayer(l => drawnItems.addLayer(l));

            if (layer.getLayers().length > 0) {
                map.fitBounds(layer.getBounds());
            }

        })
        .catch(console.error);

}


map.on(L.Draw.Event.CREATED, function (event) {

    const layer = event.layer;
    const type = event.layerType;

    currentLayer = layer;
    creatingLayer = true;

    layer._drawType = type;

    editNome.value = "";
    editEndereco.value = "";

    modal.style.display = "flex";

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
const exportBtn = document.getElementById("exportBtn");


loadBtn.addEventListener("click", () => fileInput.click());


fileInput.addEventListener("change", function (event) {

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        try {

            const geojsonData = JSON.parse(e.target.result);

            drawnItems.clearLayers();
            map.closePopup();

            const importedLayer = createGeoJSONLayer(geojsonData);

            importedLayer.eachLayer(layer => drawnItems.addLayer(layer));

            if (importedLayer.getLayers().length > 0) {
                map.fitBounds(importedLayer.getBounds());
            }

            localStorage.setItem("mapData", JSON.stringify(geojsonData));

            fileInput.value = "";

        } catch (err) {

            console.error(err);
            alert("Arquivo GeoJSON inválido");

        }

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

saveEdit.onclick = function () {

    if (!currentLayer) return;

    const nome = editNome.value || "Local sem nome";
    const endereco = editEndereco.value || "Não informado";

    const layer = currentLayer;
    const type = layer._drawType;

    if (creatingLayer) {

        if (type === "marker") {

            const ll = layer.getLatLng();

            layer.feature = {
                type: "Feature",
                properties: { nome, endereco, latitude: ll.lat, longitude: ll.lng },
                geometry: { type: "Point", coordinates: [ll.lng, ll.lat] }
            };

        }

        else if (type === "circle") {

            const center = layer.getLatLng();

            layer.feature = {
                type: "Feature",
                properties: { nome, endereco, tipo: "circle", raio: layer.getRadius() },
                geometry: { type: "Point", coordinates: [center.lng, center.lat] }
            };

        }

        else if (type === "polygon" || type === "rectangle") {

            const coords = layer.getLatLngs()[0].map(p => [p.lng, p.lat]);

            layer.feature = {
                type: "Feature",
                properties: { nome, endereco },
                geometry: { type: "Polygon", coordinates: [coords] }
            };

        }

        else if (type === "polyline") {

            const coords = layer.getLatLngs().map(p => [p.lng, p.lat]);

            layer.feature = {
                type: "Feature",
                properties: { nome, endereco },
                geometry: { type: "LineString", coordinates: coords }
            };

        }

        layer.bindPopup(buildPopup(layer, layer.feature.properties));
        bindEditPopup(layer);

        drawnItems.addLayer(layer);

        creatingLayer = false;

    } else {

        const props = layer.feature.properties;

        props.nome = nome;
        props.endereco = endereco;

        layer.bindPopup(buildPopup(layer, props));

    }

    saveData();

    modal.style.display = "none";
    currentLayer = null;

};

cancelEdit.onclick = function () {

    modal.style.display = "none";
    currentLayer = null;

};