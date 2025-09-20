import 'package:flutter/material.dart';
import '../models/issue.dart';

class IssueCard extends StatelessWidget {
  final Issue issue;
  final VoidCallback onUpvote;

  const IssueCard({super.key, required this.issue, required this.onUpvote});

  Color _getStatusColor(String status) {
    switch (status) {
      case "Resolved":
        return Colors.green.shade700;
      case "In Progress":
        return Colors.blue.shade700;
      default:
        return Colors.orange.shade700;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 5,
      margin: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (issue.image != null)
              ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: Image.file(
                  issue.image!,
                  height: 180,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
              ),
            const SizedBox(height: 10),
            Text(
              issue.description,
              style: const TextStyle(
                  fontSize: 16, fontWeight: FontWeight.w600, color: Colors.black87),
            ),
            const SizedBox(height: 6),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                if (issue.category != null)
                  Text(
                    "Category: ${issue.category}",
                    style: const TextStyle(color: Colors.black54, fontSize: 13),
                  ),
                Text(
                  "${issue.createdAt.toLocal().toString().split(' ')[0]}",
                  style: const TextStyle(color: Colors.black45, fontSize: 12),
                ),
              ],
            ),
            const SizedBox(height: 6),
            if (issue.latitude != null && issue.longitude != null)
              Text(
                "📍 Location: ${issue.latitude}, ${issue.longitude}",
                style: const TextStyle(color: Colors.black54, fontSize: 13),
              ),
            const SizedBox(height: 8),
            Align(
              alignment: Alignment.centerLeft,
              child: Chip(
                label: Text(issue.status),
                backgroundColor: _getStatusColor(issue.status).withOpacity(0.2),
                labelStyle: TextStyle(
                  color: _getStatusColor(issue.status),
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            const SizedBox(height: 6),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Text(
                  "${issue.upvotes} 👍",
                  style: const TextStyle(color: Colors.black87, fontWeight: FontWeight.w500),
                ),
                IconButton(
                  icon: const Icon(Icons.thumb_up, color: Colors.green),
                  onPressed: onUpvote,
                  tooltip: "Upvote this issue",
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
