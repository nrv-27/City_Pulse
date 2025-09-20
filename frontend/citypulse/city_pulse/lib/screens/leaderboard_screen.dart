import 'package:flutter/material.dart';

class LeaderboardScreen extends StatelessWidget {
  final List<Map<String, dynamic>> users = [
    {"name": "Alice", "points": 120},
    {"name": "Bob", "points": 100},
    {"name": "Charlie", "points": 80},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Leaderboard"), backgroundColor: const Color(0xFF2E7D32)),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: users.length,
        itemBuilder: (context, index) {
          final user = users[index];
          return Card(
            color: const Color(0xFFA5D6A7),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: Colors.white,
                child: Text("${index + 1}"),
              ),
              title: Text(user['name'], style: const TextStyle(color: Colors.white)),
              trailing: Text("${user['points']} pts", style: const TextStyle(color: Colors.white)),
            ),
          );
        },
      ),
    );
  }
}
