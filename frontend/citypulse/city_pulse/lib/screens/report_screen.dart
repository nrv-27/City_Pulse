import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'package:geolocator/geolocator.dart';
import '../models/issue.dart';

class ReportScreen extends StatefulWidget {
  final List<Issue> issues;
  final Function(Issue) onSubmit;

  const ReportScreen({super.key, required this.issues, required this.onSubmit});

  @override
  _ReportScreenState createState() => _ReportScreenState();
}

class _ReportScreenState extends State<ReportScreen> {
  File? _image;
  double? latitude;
  double? longitude;
  final picker = ImagePicker();
  final TextEditingController _descController = TextEditingController();

  // Pick image (camera or gallery)
  Future<void> pickImage(ImageSource source) async {
    final pickedFile = await picker.pickImage(source: source, imageQuality: 75);
    if (pickedFile != null) {
      setState(() => _image = File(pickedFile.path));
    }
  }

  // Get current location
  Future<void> getLocation() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Location services are disabled")),
      );
      return;
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Location permission denied")),
        );
        return;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Location permanently denied")),
      );
      return;
    }

    final position = await Geolocator.getCurrentPosition();
    setState(() {
      latitude = position.latitude;
      longitude = position.longitude;
    });
  }

  // Submit issue
  void submitIssue() {
    if (_descController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please enter a description")),
      );
      return;
    }
    if (latitude == null || longitude == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please select location")),
      );
      return;
    }

    final issue = Issue(
      description: _descController.text,
      image: _image,
      latitude: latitude,
      longitude: longitude,
    );
    widget.onSubmit(issue);

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("✅ Issue submitted successfully")),
    );

    setState(() {
      _descController.clear();
      _image = null;
      latitude = null;
      longitude = null;
    });

    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F8E9),
      appBar: AppBar(
        title: const Text("Report Issue"),
        backgroundColor: const Color(0xFF2E7D32),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              // Description
              Card(
                elevation: 2,
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: TextField(
                    controller: _descController,
                    decoration: const InputDecoration(
                      labelText: "Describe the issue",
                      border: InputBorder.none,
                    ),
                    maxLines: 4,
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Image section
              _image == null
                  ? const Text("No image selected",
                      style: TextStyle(color: Colors.black54))
                  : ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.file(_image!, height: 200, fit: BoxFit.cover),
                    ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ElevatedButton.icon(
                    onPressed: () => pickImage(ImageSource.gallery),
                    icon: const Icon(Icons.image, color: Colors.white),
                    label: const Text(
                      "Gallery",
                      style: TextStyle(
                          color: Colors.white, fontWeight: FontWeight.bold),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF2E7D32),
                    ),
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton.icon(
                    onPressed: () => pickImage(ImageSource.camera),
                    icon: const Icon(Icons.camera_alt, color: Colors.white),
                    label: const Text(
                      "Camera",
                      style: TextStyle(
                          color: Colors.white, fontWeight: FontWeight.bold),
                    ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF2E7D32),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Location section
              ElevatedButton.icon(
                onPressed: getLocation,
                icon: const Icon(Icons.location_on, color: Colors.white),
                label: Text(
                  latitude != null
                      ? "Location: (${latitude!.toStringAsFixed(4)}, ${longitude!.toStringAsFixed(4)})"
                      : "Pick Current Location",
                  style: const TextStyle(
                      color: Colors.white, fontWeight: FontWeight.bold),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2E7D32),
                ),
              ),
              const SizedBox(height: 24),

              // Submit button
              ElevatedButton(
                onPressed: submitIssue,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1B5E20),
                  minimumSize: const Size(double.infinity, 50),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text(
                  "Submit Issue",
                  style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
