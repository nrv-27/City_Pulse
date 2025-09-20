import 'package:flutter/material.dart';

class LeaderboardScreen extends StatelessWidget {
  final List<Map<String, dynamic>> users = [
    {"name": "Bhavya", "points": 120},
    {"name": "Pratishtha", "points": 100},
    {"name": "Neerav", "points": 80},
    {"name": "Sahil", "points": 70},
    {"name": "Sachin", "points": 60},
    {"name": "Shreyash", "points": 95},
  ];

  LeaderboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Sort users by points (highest first)
    users.sort((a, b) => b['points'].compareTo(a['points']));
    int topPoints = users.first['points'];

    return Scaffold(
      appBar: AppBar(
        title: const Text("Leaderboard"),
        backgroundColor: const Color(0xFF2E7D32),
        elevation: 0,
      ),
      body: Column(
        children: [
          // Top 3 podium
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: Color(0xFF388E3C),
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(20),
                bottomRight: Radius.circular(20),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: List.generate(
                3,
                (index) {
                  if (index >= users.length) return const SizedBox();
                  final user = users[index];
                  final medal = index == 0
                      ? "🥇"
                      : index == 1
                          ? "🥈"
                          : "🥉";

                  return Column(
                    children: [
                      Text(
                        medal,
                        style: const TextStyle(fontSize: 32),
                      ),
                      const SizedBox(height: 6),
                      CircleAvatar(
                        radius: 28,
                        backgroundColor: Colors.white,
                        child: Text(
                          user['name'][0],
                          style: const TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 22),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        user['name'],
                        style: const TextStyle(
                            color: Colors.white, fontWeight: FontWeight.bold),
                      ),
                      Text(
                        "${user['points']} pts",
                        style: const TextStyle(color: Colors.white70),
                      ),
                    ],
                  );
                },
              ),
            ),
          ),

          const SizedBox(height: 16),

          // Full leaderboard list
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: users.length,
              itemBuilder: (context, index) {
                final user = users[index];
                final progress = user['points'] / topPoints;

                return Card(
                  margin: const EdgeInsets.symmetric(vertical: 8),
                  elevation: 3,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: Colors.green[100],
                      child: Text(
                        "${index + 1}",
                        style: const TextStyle(
                            fontWeight: FontWeight.bold, color: Colors.black),
                      ),
                    ),
                    title: Text(
                      user['name'],
                      style: const TextStyle(
                          fontWeight: FontWeight.w600, fontSize: 16),
                    ),
                    subtitle: LinearProgressIndicator(
                      value: progress,
                      color: Colors.green,
                      backgroundColor: Colors.grey[200],
                    ),
                    trailing: Text(
                      "${user['points']} pts",
                      style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF2E7D32)),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
