import 'dart:io';

class Issue {
  String description;
  File? image;
  double? latitude;
  double? longitude;
  int upvotes;
  String status; // Pending, In Progress, Resolved

  Issue({
    required this.description,
    this.image,
    this.latitude,
    this.longitude,
    this.upvotes = 0,
    this.status = "Pending",
  });
}
