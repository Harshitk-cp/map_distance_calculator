let origins = null;
let destinations = null;
let map = null;

const INPUTS = {
  origin: document.getElementById("etOrigin"),
  destination: document.getElementById("etDest"),
};

const setupInput = (input, onChange) => {
  const autocomplete = new google.maps.places.Autocomplete(input);
  const marker = new google.maps.Marker({ map });
  autocomplete.bindTo("bounds", map);
  autocomplete.setFields(["address_components", "geometry", "name"]);
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    const { geometry } = place;
    if (!geometry) {
      console.log("Returned place contains no geometry");
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    marker.setPosition(geometry.location);

    if (geometry.viewport) bounds.union(geometry.viewport);
    else bounds.extend(geometry.location);

    map.fitBounds(bounds);

    const coords = {
      lat: geometry.location.lat(),
      lng: geometry.location.lng(),
    };
    onChange(coords);
  });
};

const initAutocomplete = () => {
  const directionsService = new google.maps.DirectionsService();
  const directionsDisplay = new google.maps.DirectionsRenderer();

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 48, lng: 4 },
    zoom: 4,
    disableDefaultUI: true,
  });
  directionsDisplay.setMap(map);

  const draw = () => {
    if (origins && destinations) {
      var start = INPUTS.origin.value;
      var end = INPUTS.destination.value;
      drawPath(directionsService, directionsDisplay, start, end);
    }
  };

  setupInput(INPUTS.origin, (coords) => {
    origins = coords;
    draw();
  });

  setupInput(INPUTS.destination, (coords) => {
    destinations = coords;
    draw();
  });
};

const drawPath = (directionsService, directionsDisplay, start, end) => {
  directionsService.route(
    {
      origin: start,
      destination: end,
      optimizeWaypoints: true,
      travelMode: "DRIVING",
    },
    (response, status) => {
      if (status === "OK") {
        directionsDisplay.setDirections(response);
      } else {
        window.alert("Problem in showing direction due to " + status);
      }
    }
  );
};

document.addEventListener("DOMContentLoaded", () => {
  initAutocomplete();
});

const makeRequest = async (payload) => {
  if (!payload.origins || !payload.destinations) return;
  const result = document.getElementById("txtResult");
  result.textContent = `Loading...`;

  const endpoint = "/getDistance";
  const options = {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      origin: payload.origins,
      destination: payload.destinations,
    }),
  };
  const res = await fetch(endpoint, options);
  const data = await res.json();
  const { distance, duration } = data.rows[0].elements[0];
  result.textContent = `${duration.text} (${distance.text})`;
};

const button = document.getElementById("btnReq");
button.addEventListener("click", () => {
  makeRequest({ origins, destinations });
});
