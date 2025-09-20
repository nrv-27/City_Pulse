import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

class MapScreen extends StatelessWidget {
  MapScreen({super.key});

  final mapController = MapController();

  @override
  Widget build(BuildContext context) {
    // Move the map initially
    WidgetsBinding.instance.addPostFrameCallback((_) {
      mapController.move(LatLng(28.6139, 77.2090), 12);
    });

    return Scaffold(
      appBar: AppBar(
        title: const Text("City Pulse Map"),
        backgroundColor: const Color(0xFF2E7D32),
      ),
      body: FlutterMap(
        mapController: mapController,
        options: MapOptions(
          // no center/zoom here
        ),
        children: [
          TileLayer(
            urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          ),
          MarkerLayer(
            markers: [
              Marker(
                point: LatLng(28.6139, 77.2090),
                width: 40,
                height: 40,
                child: const Icon(
                  Icons.location_on,
                  color: Colors.red,
                  size: 40,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
