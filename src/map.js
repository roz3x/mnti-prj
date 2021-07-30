import React from "react";
import { useEffect } from "react";
import * as L from "leaflet";
import "leaflet.path.drag";

export default function App() {
  useEffect(() => {
    const map = L.map("map").fitWorld();
    window.Data = [];
    let accuracy;

    // L.Map.mergeOptions({
    //   touchExtend: true
    // });

    L.tileLayer(
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
      {
        maxZoom: 30,
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: "mapbox/light-v10",
        tileSize: 512,
        zoomOffset: -1
      }
    ).addTo(map);

    function onLocationFound(e) {
      accuracy = Math.min(e.accuracy / 2, 50);
      // L.marker(e.latlng)
      //   .addTo(map)
      //   .bindPopup(
      //     "You are within " + radius + " meters from this point" + "<input />"
      //   )
      //   .openPopup();
      // L.circle(e.latlng, radius).addTo(map);
    }

    function onLocationError(e) {
      alert(e.message);
    }

    map.on("locationfound", onLocationFound);
    map.on("locationerror", onLocationError);
    map.on("click", (e) => {
      console.log(e);
      // let marker = L.marker(e.latlng, { draggable: true });
      let thisEntry = {
        latlng: {},
        tree: "",
        comment: "",
        radius: accuracy,
        confidence: 1
      };

      let circle = L.circle(
        e.latlng,
        {
          color: "red",
          fillColor: "#f03",
          fillOpacity: 0.5,
          radius: accuracy,
          draggable: true
        },
        { draggable: true }
      ).addTo(map);

      console.log(circle);
      const infoLocation = document.createElement("div");
      infoLocation.innerHTML = `<div> LT: ${circle._latlng.lat}</div> </div> LN: ${circle._latlng.lng} </div> `;

      circle.on("dragend", (e) => {
        // update the data here.
        infoLocation.innerHTML = `<div> LT: ${e.target._latlng.lat}</div> </div> LN: ${e.target._latlng.lng} </div> `;
      });
      let btn = document.createElement("button");
      btn.innerText = "Delete Entry";
      btn.onclick = () => {
        map.removeLayer(circle);
      };

      let sendbtn = document.createElement("button");
      sendbtn.innerText = "Send Entry";
      sendbtn.onclick = () => {
        // api stuff
        thisEntry.latlng = e.latlng;
        window.Data.push(thisEntry);
      };

      let treeNameContainer = document.createElement("div");
      let treeName = document.createElement("input");
      treeName.onchange = (e) => {
        thisEntry.tree = e.target.value;
      };
      treeNameContainer.innerText = "tree species";
      treeNameContainer.appendChild(treeName);

      //comment changes handler
      let commentContainer = document.createElement("div");
      let comment = document.createElement("textarea");
      comment.onchange = (e) => {
        thisEntry.comment = e.target.value;
      };
      commentContainer.innerText = "comment";
      commentContainer.appendChild(comment);

      let radiusBtnLegend = document.createElement("div");
      let radiusBtnText = document.createElement("div");
      radiusBtnText.innerText = `radius ${accuracy}`;

      // circle around and responsive workaround
      let radiusBtn = document.createElement("input");
      radiusBtn.type = "range";
      radiusBtn.step = 0.1;
      radiusBtn.min = 1;
      radiusBtn.value = accuracy;
      radiusBtn.max = 50;
      radiusBtn.onmousemove = radiusBtn.onpointermove = (e) => {
        circle.setRadius(e.target.value);
        radiusBtnText.innerText = `radius ${e.target.value}`;
        thisEntry.radius = parseFloat(e.target.value);
      };
      radiusBtnLegend.appendChild(radiusBtnText);
      radiusBtnLegend.appendChild(radiusBtn);

      let confidenceBtn = document.createElement("input");
      let confidenceBtnText = document.createElement("div");
      confidenceBtn.type = "range";
      confidenceBtn.value = 1;
      confidenceBtn.min = 1;
      confidenceBtn.max = 5;
      confidenceBtn.onmousemove = confidenceBtn.onpointermove = (e) => {
        const val = parseInt(e.target.value, 10);
        confidenceBtnText.innerText = `confidence ${val}`;
        thisEntry.confidence = val;
        if (val === 1) {
          circle.setStyle({ color: "red", fillColor: "red" });
        } else if (val === 2) {
          circle.setStyle({ color: "red", fillColor: "orange" });
        } else if (val === 3) {
          circle.setStyle({ color: "orange", fillColor: "red" });
        } else if (val === 4) {
          circle.setStyle({ color: "green", fillColor: "orange" });
        } else {
          circle.setStyle({ color: "green", fillColor: "green" });
        }
      };
      let confidenceBtnContainer = document.createElement("div");
      confidenceBtnText.innerText = `confidence 1`;
      confidenceBtnContainer.appendChild(confidenceBtnText);
      confidenceBtnContainer.appendChild(confidenceBtn);

      let form = document.createElement("div");
      form.appendChild(infoLocation);
      form.appendChild(treeNameContainer);
      form.appendChild(commentContainer);
      form.appendChild(confidenceBtnContainer);
      form.appendChild(radiusBtnLegend);
      form.appendChild(btn);
      form.appendChild(sendbtn);
      circle
        .bindPopup(form, {
          maxWidth: "auto"
        })
        .addTo(map);

      // marker
      //   .addTo(map)
      //   .bindPopup(
      //     btn
      //     // "enter the diameter " + "<input />" + `<button  > delete </button> `
      //   )
      //   .openPopup();
      // L.circle(e.latlng, radius).addTo(map);
    });
    map.locate({ setView: true, maxZoom: 17 });
  });
  return <> </>;
}
