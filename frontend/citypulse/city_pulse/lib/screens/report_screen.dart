import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import '../models/issue.dart';

class ReportScreen extends StatefulWidget {
  final List<Issue> issues;
  final Function(Issue) onSubmit;

  ReportScreen({super.key, required this.issues, required this.onSubmit});

  @override
  _ReportScreenState createState() => _ReportScreenState();
}

class _ReportScreenState extends State<ReportScreen> {
  File? _image;
  double? latitude;
  double? longitude;
  final picker = ImagePicker();
  final TextEditingController _descController = TextEditingController();

  Future pickImage() async {
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);
    if (pickedFile != null) {
      setState(() => _image = File(pickedFile.path));
    }
  }

  Future getLocation() async {
    // For prototype, we simulate location
    setState(() {
      latitude = 28.6139;
      longitude = 77.2090;
    });
  }

  void submitIssue() {
    final issue = Issue(
      description: _descController.text,
      image: _image,
      latitude: latitude,
      longitude: longitude,
    );
    widget.onSubmit(issue);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("Issue submitted")),
    );
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Report Issue"), backgroundColor: const Color(0xFF2E7D32)),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              TextField(
                controller: _descController,
                decoration: const InputDecoration(
                  labelText: "Describe the issue",
                  border: OutlineInputBorder(),
                ),
                maxLines: 4,
              ),
              const SizedBox(height: 16),
              _image == null ? const Text("No image selected") : Image.file(_image!, height: 200),
              ElevatedButton.icon(
                onPressed: pickImage,
                icon: const Icon(Icons.image),
                label: const Text("Pick Image"),
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF2E7D32)),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: getLocation,
                icon: const Icon(Icons.location_on),
                label: Text(latitude != null ? "Location Selected" : "Pick Location"),
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF2E7D32)),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: submitIssue,
                child: const Text("Submit"),
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF2E7D32)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
