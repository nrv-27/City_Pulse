import 'package:flutter/material.dart';
import '../models/issue.dart';
import '../widgets/issue_card.dart';
import 'report_screen.dart';
import 'map_screen.dart';
import 'calendar_screen.dart';
import 'leaderboard_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<Issue> issues = [];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('CityPulse'),
        backgroundColor: const Color(0xF1B5E20),
      ),
      body: Column(
        children: [
          Expanded(
            child: issues.isEmpty
                ? Center(child: Text('No reported issues yet'))
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: issues.length,
                    itemBuilder: (context, index) {
                      final issue = issues[index];
                      return IssueCard(
                        issue: issue,
                        onUpvote: () {
                          setState(() {
                            issue.upvotes++;
                          });
                        },
                      );
                    },
                  ),
          ),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: ElevatedButton.icon(
              onPressed: () async {
                // Navigate to ReportScreen and wait for new issue
                final newIssue = await Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (_) => ReportScreen(
                        issues: issues,
                        onSubmit: (issue) => setState(() => issues.add(issue)),
                      ),
                ));

                if (newIssue != null && newIssue is Issue) {
                  setState(() {
                    issues.add(newIssue);
                  });
                }
              },
              icon: const Icon(Icons.add),
              label: const Text('Report New Issue'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF388E3C),
                minimumSize: const Size(double.infinity, 50),
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        selectedItemColor: const Color(0xFF2E7D32),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: "Home"),
          BottomNavigationBarItem(icon: Icon(Icons.map), label: "Map"),
          BottomNavigationBarItem(icon: Icon(Icons.calendar_today), label: "Calendar"),
          BottomNavigationBarItem(icon: Icon(Icons.leaderboard), label: "Leaderboard"),
        ],
        onTap: (index) {
          switch (index) {
            case 1:
              Navigator.push(context, MaterialPageRoute(builder: (_) => MapScreen()));
              break;
            case 2:
              Navigator.push(context, MaterialPageRoute(builder: (_) => const CalendarScreen()));
              break;
            case 3:
              Navigator.push(context, MaterialPageRoute(builder: (_) => LeaderboardScreen()));
              break;
          }
        },
      ),
    );
  }
}
