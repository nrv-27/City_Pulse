import 'package:flutter/material.dart';
import '../models/issue.dart';

class IssueCard extends StatelessWidget {
  final Issue issue;
  final VoidCallback onUpvote;

  const IssueCard({super.key, required this.issue, required this.onUpvote});

  @override
  Widget build(BuildContext context) {
    return Card(
      color: const Color.fromARGB(255, 67, 149, 70),
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if(issue.image != null)
              Image.file(issue.image!, height: 150, width: double.infinity, fit: BoxFit.cover),
            const SizedBox(height: 8),
            Text(issue.description, style: const TextStyle(color: Color.fromARGB(255, 38, 202, 65))),
            const SizedBox(height: 4),
            Text("Status: ${issue.status}", style: const TextStyle(color: Color.fromARGB(255, 38, 202, 65))),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Text("${issue.upvotes} 👍", style: const TextStyle(color:Color.fromARGB(255, 38, 202, 65))),
                IconButton(
                  icon: const Icon(Icons.thumb_up, color: Color.fromARGB(255, 38, 202, 65)),
                  onPressed: onUpvote,
                )
              ],
            )
          ],
        ),
      ),
    );
  }
}
