/**
 * Class responsible for generating and managing interactive maps using Leaflet and OpenStreetMap.
 */
export class MapManager {
  /**
   * Initializes the MapManager.
   * @param {string} cidade 
   * @param {string} containerId 
   */
  constructor(cidade, containerId) {
    this.cidade = cidade;
    this.containerId = containerId;
  }

  /**
   * Fetches the coordinates for the city and renders the Leaflet map.
   * Handles errors by displaying a fallback message if the map fails to load.
   * @returns {Promise<void>}
   */
  async init() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    try {
      const urlGeo = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(this.cidade)}`;
      const resposta = await fetch(urlGeo);
      const dados = await resposta.json();

      if (dados.length === 0) throw new Error("Cidade não encontrada");

      const lat = parseFloat(dados[0].lat);
      const lon = parseFloat(dados[0].lon);

      // Map container styling
      container.style.height = "150px"; 
      container.style.marginTop = "10px";
      container.style.borderRadius = "8px";

      // Initialize Leaflet map
      const map = L.map(this.containerId).setView([lat, lon], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);
      L.marker([lat, lon]).addTo(map);

    } catch (erro) {
        container.textContent = 'Mapa indisponível';
        container.style.color = 'red';
        container.style.fontSize = '0.8em';
    }
  }
}