import 'package:flutter/material.dart';
import 'screens/login_screen.dart';
// import 'screens/home_screen.dart';  // Example future screen
// import 'screens/issue_report_screen.dart'; // Example

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CityPulse',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF338337), // Green theme seed
          brightness: Brightness.light,
        ),
        textTheme: const TextTheme(
          bodyLarge: TextStyle(fontSize: 18, fontWeight: FontWeight.w500),
          bodyMedium: TextStyle(fontSize: 16),
          titleLarge: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF338337),
          foregroundColor: Colors.white,
          centerTitle: true,
          elevation: 4,
        ),
        useMaterial3: true,
      ),
      debugShowCheckedModeBanner: false,

      // ✅ Centralized route system
      initialRoute: '/login',
      routes: {
        '/login': (context) => const LoginScreen(),
        // '/home': (context) => const HomeScreen(),
        // '/report': (context) => const IssueReportScreen(),
      },
    );
  }
}
