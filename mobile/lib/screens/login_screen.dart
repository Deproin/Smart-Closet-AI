import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_lucide/flutter_lucide.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:dio/dio.dart';
import '../services/api_service.dart';
import 'home_screen.dart';
import '../translations.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  bool isLogin = true;
  bool loading = false;
  String error = '';
  final _usernameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _apiService = ApiService();

  Future<void> _handleSubmit() async {
    final username = _usernameController.text.trim();
    final password = _passwordController.text.trim();
    final email = _emailController.text.trim();

    if (username.isEmpty || password.isEmpty || (!isLogin && email.isEmpty)) {
      setState(() {
        error = 'Please fill in all fields';
      });
      return;
    }

    setState(() {
      loading = true;
      error = '';
    });

    try {
      if (isLogin) {
        final response = await _apiService.login(username, password);
        
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('token', response.data['access_token']);
        await prefs.setString('username', username);

        if (mounted) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (_) => const ModernHomeScreen()),
          );
        }
      } else {
        // Registering
        await _apiService.register(username, email, password);
        
        setState(() {
          isLogin = true;
          error = '';
          _passwordController.clear();
        });

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Account created successfully! Please sign in.'),
              backgroundColor: Colors.green,
            ),
          );
        }
      }
    } catch (e) {
      String errorMessage = 'Authentication failed. Please try again.';
      if (e is DioException) {
        if (e.response?.data != null && e.response?.data['detail'] != null) {
          final detail = e.response?.data['detail'];
          if (detail is String) {
            errorMessage = detail;
          } else if (detail is List && detail.isNotEmpty) {
            errorMessage = detail[0]['msg'] ?? errorMessage;
          }
        }
      }
      setState(() {
        error = errorMessage;
      });
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final primaryGradient = const LinearGradient(
      colors: [Color(0xFFFF479E), Color(0xFFE11D48)],
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
    );

    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Header with Gradient
            Container(
              height: 300,
              width: double.infinity,
              decoration: BoxDecoration(
                gradient: primaryGradient,
                borderRadius: const BorderRadius.only(
                  bottomLeft: Radius.circular(60),
                  bottomRight: Radius.circular(60),
                ),
              ),
              child: SafeArea(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(30),
                      ),
                      child: const Icon(
                        LucideIcons.sparkles,
                        color: Colors.white,
                        size: 48,
                      ),
                    ),
                    const SizedBox(height: 20),
                    Text(
                      isLogin ? 'Welcome Back' : 'Join SmartCloset',
                      style: GoogleFonts.outfit(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            Padding(
              padding: const EdgeInsets.all(30.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    isLogin 
                      ? 'Enter your details to pick up where you left off.' 
                      : 'Create an account to digitize your wardrobe.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.outfit(
                      color: Colors.slate[500],
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 30),

                  if (error.isNotEmpty)
                    Container(
                      padding: const EdgeInsets.all(15),
                      margin: const EdgeInsets.bottom(20),
                      decoration: BoxDecoration(
                        color: Colors.red[50],
                        borderRadius: BorderRadius.circular(15),
                        border: Border.all(color: Colors.red[100]!),
                      ),
                      child: Text(
                        error,
                        style: const TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
                      ),
                    ),

                  _buildTextField(
                    controller: _usernameController,
                    hint: 'Username',
                    icon: LucideIcons.user,
                  ),
                  const SizedBox(height: 15),

                  if (!isLogin) ...[
                    _buildTextField(
                      controller: _emailController,
                      hint: 'Email Address',
                      icon: LucideIcons.mail,
                    ),
                    const SizedBox(height: 15),
                  ],

                  _buildTextField(
                    controller: _passwordController,
                    hint: 'Password',
                    icon: LucideIcons.lock,
                    isPassword: true,
                  ),
                  const SizedBox(height: 30),

                  GestureDetector(
                    onTap: loading ? null : _handleSubmit,
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 20),
                      decoration: BoxDecoration(
                        gradient: primaryGradient,
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFFFF479E).withOpacity(0.3),
                            blurRadius: 20,
                            offset: const Offset(0, 10),
                          ),
                        ],
                      ),
                      child: Center(
                        child: loading
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                            )
                          : Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  isLogin ? 'Sign In to Closet' : 'Create Account',
                                  style: GoogleFonts.outfit(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 18,
                                  ),
                                ),
                                const SizedBox(width: 10),
                                const Icon(LucideIcons.arrow_right, color: Colors.white, size: 20),
                              ],
                            ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 30),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        isLogin ? "Don't have an account?" : "Already have an account?",
                        style: GoogleFonts.outfit(color: Colors.slate[500]),
                      ),
                      TextButton(
                        onPressed: () => setState(() => isLogin = !isLogin),
                        child: Text(
                          isLogin ? 'Sign Up' : 'Sign In',
                          style: GoogleFonts.outfit(
                            color: const Color(0xFFFF479E),
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hint,
    required IconData icon,
    bool isPassword = false,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.slate[50],
        borderRadius: BorderRadius.circular(20),
      ),
      child: TextField(
        controller: controller,
        obscureText: isPassword,
        decoration: InputDecoration(
          hintText: hint,
          prefixIcon: Icon(icon, color: Colors.slate[400], size: 20),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
          hintStyle: GoogleFonts.outfit(color: Colors.slate[400]),
        ),
      ),
    );
  }
}
