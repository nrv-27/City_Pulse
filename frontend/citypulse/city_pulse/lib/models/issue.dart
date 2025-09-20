import 'dart:io';
import 'package:uuid/uuid.dart';

class Issue {
  String id;
  String description;
  File? image;
  double? latitude;
  double? longitude;
  int upvotes;
  String status;
  String? reportedBy;
  String? category;
  DateTime createdAt;

  Issue({
    String? id,
    required this.description,
    this.image,
    this.latitude,
    this.longitude,
    this.upvotes = 0,
    this.status = "Pending",
    this.reportedBy,
    this.category,
    DateTime? createdAt,
  })  : id = id ?? const Uuid().v4(),
        createdAt = createdAt ?? DateTime.now();

  Map<String, dynamic> toMap() {
    return {
      "id": id,
      "description": description,
      "imagePath": image?.path,
      "latitude": latitude,
      "longitude": longitude,
      "upvotes": upvotes,
      "status": status,
      "reportedBy": reportedBy,
      "category": category,
      "createdAt": createdAt.toIso8601String(),
    };
  }

  factory Issue.fromMap(Map<String, dynamic> map) {
    return Issue(
      id: map["id"],
      description: map["description"],
      image: map["imagePath"] != null ? File(map["imagePath"]) : null,
      latitude: map["latitude"]?.toDouble(),
      longitude: map["longitude"]?.toDouble(),
      upvotes: map["upvotes"] ?? 0,
      status: map["status"] ?? "Pending",
      reportedBy: map["reportedBy"],
      category: map["category"],
      createdAt: DateTime.tryParse(map["createdAt"] ?? "") ?? DateTime.now(),
    );
  }

  Issue copyWith({
    String? id,
    String? description,
    File? image,
    double? latitude,
    double? longitude,
    int? upvotes,
    String? status,
    String? reportedBy,
    String? category,
    DateTime? createdAt,
  }) {
    return Issue(
      id: id ?? this.id,
      description: description ?? this.description,
      image: image ?? this.image,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      upvotes: upvotes ?? this.upvotes,
      status: status ?? this.status,
      reportedBy: reportedBy ?? this.reportedBy,
      category: category ?? this.category,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  @override
  String toString() {
    return "Issue(id: $id, desc: $description, status: $status, upvotes: $upvotes, category: $category)";
  }
}
