import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_map_marker_popup/flutter_map_marker_popup.dart';
import 'package:latlong2/latlong.dart';

class MapScreen extends StatefulWidget {
  const MapScreen({super.key});

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  final MapController _mapController = MapController();
  final PopupController _popupController = PopupController();

  LatLng delhiLatLng = LatLng(28.6139, 77.2090);
  double _zoom = 12.0;

  void _zoomIn() {
    setState(() => _zoom++);
    _mapController.move(delhiLatLng, _zoom);
  }

  void _zoomOut() {
    setState(() => _zoom--);
    _mapController.move(delhiLatLng, _zoom);
  }

  void _goToDelhi() {
    _mapController.move(delhiLatLng, 13);
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _mapController.move(delhiLatLng, _zoom);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFE8F5E9),
      appBar: AppBar(
        title: const Text("City Pulse Map"),
        backgroundColor: const Color(0xFF2E7D32),
      ),
      body: Stack(
        children: [
          FlutterMap(
            mapController: _mapController,
            options: MapOptions(
              initialCenter: delhiLatLng,
              initialZoom: _zoom,
              onTap: (_, __) => _popupController.hideAllPopups(),
            ),
            children: [
              TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
              ),

              // ✅ Popup marker layer (new API)
              PopupMarkerLayerWidget(
                options: PopupMarkerLayerOptions(
                  popupController: _popupController,
                  markers: [
                    Marker(
                      point: delhiLatLng,
                      width: 50,
                      height: 50,
                      child: const Icon(
                        Icons.location_on,
                        color: Colors.red,
                        size: 40,
                      ),
                    ),
                  ],
                  popupDisplayOptions: PopupDisplayOptions(
                    builder: (BuildContext context, Marker marker) => Card(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Text(
                              "📍 New Delhi",
                              style: TextStyle(
                                  fontSize: 14, fontWeight: FontWeight.bold),
                            ),
                            SizedBox(height: 4),
                            Text(
                              "Capital of India",
                              style: TextStyle(fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),

          // Zoom buttons
          Positioned(
            right: 15,
            bottom: 100,
            child: Column(
              children: [
                FloatingActionButton.small(
                  heroTag: "zoomIn",
                  backgroundColor: const Color(0xFF2E7D32),
                  onPressed: _zoomIn,
                  child: const Icon(Icons.add, color: Colors.white),
                ),
                const SizedBox(height: 10),
                FloatingActionButton.small(
                  heroTag: "zoomOut",
                  backgroundColor: const Color(0xFF2E7D32),
                  onPressed: _zoomOut,
                  child: const Icon(Icons.remove, color: Colors.white),
                ),
              ],
            ),
          ),

          // Center on Delhi button
          Positioned(
            right: 15,
            bottom: 30,
            child: FloatingActionButton(
              backgroundColor: const Color(0xFF2E7D32),
              onPressed: _goToDelhi,
              child: const Icon(Icons.my_location, color: Colors.white),
            ),
          ),
        ],
      ),
    );
  }
}
