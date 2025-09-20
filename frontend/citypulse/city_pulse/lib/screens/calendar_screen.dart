import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:table_calendar/table_calendar.dart';

class CalendarScreen extends StatefulWidget {
  const CalendarScreen({Key? key}) : super(key: key);

  @override
  _CalendarScreenState createState() => _CalendarScreenState();
}

class _CalendarScreenState extends State<CalendarScreen> {
  final MapController mapController = MapController();
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;

  // Example campaign events
  final Map<DateTime, List<String>> _events = {
    DateTime.utc(2025, 9, 20): ["Cleanliness Drive at Connaught Place"],
    DateTime.utc(2025, 9, 22): ["Tree Plantation in Lodhi Garden"],
    DateTime.utc(2025, 9, 25): ["Awareness Rally at India Gate"],
  };

  List<String> _getEventsForDay(DateTime day) {
    return _events[DateTime.utc(day.year, day.month, day.day)] ?? [];
  }

  @override
  Widget build(BuildContext context) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      mapController.move(LatLng(28.6139, 77.2090), 12);
    });

    return Scaffold(
      appBar: AppBar(
        title: const Text("Campaign Calendar"),
        backgroundColor: const Color(0xFF2E7D32),
        elevation: 0,
      ),
      body: Column(
        children: [
          // Map stays fixed at the top
          SizedBox(
            height: 220,
            child: ClipRRect(
              borderRadius: const BorderRadius.only(
                bottomLeft: Radius.circular(20),
                bottomRight: Radius.circular(20),
              ),
              child: FlutterMap(
                mapController: mapController,
                options: MapOptions(),
                children: [
                  TileLayer(
                    urlTemplate: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
                  ),
                  MarkerLayer(
                    markers: [
                      Marker(
                        point: LatLng(28.6139, 77.2090),
                        width: 50,
                        height: 50,
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
            ),
          ),

          // Scrollable section
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Column(
                children: [
                  TableCalendar(
                    firstDay: DateTime.utc(2023, 1, 1),
                    lastDay: DateTime.utc(2030, 12, 31),
                    focusedDay: _focusedDay,
                    selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
                    onDaySelected: (selectedDay, focusedDay) {
                      setState(() {
                        _selectedDay = selectedDay;
                        _focusedDay = focusedDay;
                      });
                    },
                    eventLoader: _getEventsForDay,
                    calendarStyle: const CalendarStyle(
                      todayDecoration: BoxDecoration(
                        color: Color(0xFF2E7D32),
                        shape: BoxShape.circle,
                      ),
                      selectedDecoration: BoxDecoration(
                        color: Colors.orange,
                        shape: BoxShape.circle,
                      ),
                    ),
                    headerStyle: const HeaderStyle(
                      formatButtonVisible: false,
                      titleCentered: true,
                    ),
                  ),

                  const SizedBox(height: 12),

                  // Campaign list appears below calendar
                  if (_selectedDay != null && _getEventsForDay(_selectedDay!).isNotEmpty)
                    ..._getEventsForDay(_selectedDay!).map((event) {
                      return Card(
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        margin: const EdgeInsets.symmetric(vertical: 6),
                        child: ListTile(
                          leading: const Icon(Icons.event, color: Colors.green),
                          title: Text(event),
                          subtitle: Text(
                            "${_selectedDay!.day}-${_selectedDay!.month}-${_selectedDay!.year}",
                          ),
                          trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                          onTap: () {
                            // Example: move map to event location
                            mapController.move(LatLng(28.6139, 77.2090), 14);
                          },
                        ),
                      );
                    }).toList()
                  else
                    const Padding(
                      padding: EdgeInsets.only(top: 20),
                      child: Text(
                        "No campaigns scheduled on this day.",
                        style: TextStyle(color: Colors.grey, fontSize: 16),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
