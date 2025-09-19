import 'package:flutter/material.dart';

class QuoteBanner extends StatelessWidget {
  final String quote;
  const QuoteBanner({super.key, required this.quote});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      color: const Color.fromARGB(255, 50, 132, 54),
      padding: const EdgeInsets.all(16),
      child: Text(
        quote,
        style: const TextStyle(color: Color.fromARGB(255, 5, 242, 88), fontSize: 16, fontWeight: FontWeight.bold),
        textAlign: TextAlign.center,
      ),
    );
  }
}
