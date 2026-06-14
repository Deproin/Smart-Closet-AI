import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../main.dart';
import '../translations.dart';

class ModernHomeScreen extends StatefulWidget {
  const ModernHomeScreen({super.key});

  @override
  State<ModernHomeScreen> createState() => _ModernHomeScreenState();
}

class _ModernHomeScreenState extends State<ModernHomeScreen> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
      body: SafeArea(
        child: IndexedStack(
          index: _selectedIndex,
          children: const [
            HomeView(),
            ClosetView(),
            AiStyleView(),
            ProfileView(),
          ],
        ),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF1E293B) : Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 20,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _buildNavItem(0, LucideIcons.home, AppTranslations.t(context, 'home')),
            _buildNavItem(1, LucideIcons.shirt, AppTranslations.t(context, 'closet')),
            _buildNavItem(2, LucideIcons.sparkles, AppTranslations.t(context, 'aiMagic')),
            _buildNavItem(3, LucideIcons.user, AppTranslations.t(context, 'profile')),
          ],
        ),
      ),
    );
  }

  Widget _buildNavItem(int index, IconData icon, String label) {
    bool isSelected = _selectedIndex == index;
    final primaryColor = const Color(0xFFFF479E);
    
    return GestureDetector(
      onTap: () => setState(() => _selectedIndex = index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? primaryColor.withOpacity(0.1) : Colors.transparent,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Row(
          children: [
            Icon(
              icon,
              color: isSelected ? primaryColor : Colors.slate[400],
              size: 24,
            ),
            if (isSelected) ...[
              const SizedBox(width: 8),
              Text(
                label,
                style: GoogleFonts.outfit(
                  color: primaryColor,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class HomeView extends StatelessWidget {
  const HomeView({super.key});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final isAr = Localizations.localeOf(context).languageCode == 'ar';

    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    AppTranslations.t(context, 'welcome'),
                    style: GoogleFonts.outfit(
                      fontSize: 16,
                      color: Colors.slate[500],
                    ),
                  ),
                  Text(
                    AppTranslations.t(context, 'discover'),
                    style: GoogleFonts.outfit(
                      fontSize: 28,
                      fontWeight: FontWeight.w800,
                      color: isDark ? Colors.white : Colors.slate[900],
                    ),
                  ),
                ],
              ),
              Row(
                children: [
                  IconButton(
                    onPressed: () => SmartClosetApp.of(context).toggleTheme(),
                    icon: Icon(isDark ? LucideIcons.sun : LucideIcons.moon),
                  ),
                  IconButton(
                    onPressed: () {
                      final newLocale = isAr ? const Locale('en') : const Locale('ar');
                      SmartClosetApp.of(context).setLocale(newLocale);
                    },
                    icon: const Icon(LucideIcons.languages),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 32),
          // Weather Suggestion Card
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFFF479E), Color(0xFFE11D48)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(32),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFFFF479E).withOpacity(0.3),
                  blurRadius: 20,
                  offset: const Offset(0, 10),
                ),
              ],
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(LucideIcons.cloudSun, color: Colors.white, size: 40),
                        const SizedBox(width: 16),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "24°C ${isAr ? 'مشمس' : 'Sunny'}",
                              style: GoogleFonts.outfit(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 20,
                              ),
                            ),
                            Text(
                              AppTranslations.t(context, 'weatherSub'),
                              style: GoogleFonts.outfit(
                                color: Colors.white.withOpacity(0.8),
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    Icon(isAr ? LucideIcons.arrowUpLeft : LucideIcons.arrowUpRight, color: Colors.white),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 40),
          Text(
            AppTranslations.t(context, 'recentItems'),
            style: GoogleFonts.outfit(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: isDark ? Colors.white : Colors.slate[800],
            ),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: GridView.builder(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 0.75,
              ),
              itemCount: 4,
              itemBuilder: (context, index) {
                return Container(
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF1E293B) : Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: isDark ? Colors.slate[800]! : Colors.slate[100]!),
                  ),
                  child: Column(
                    children: [
                      Expanded(
                        child: Container(
                          margin: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: isDark ? const Color(0xFF0F172A) : Colors.slate[50],
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: const Center(child: Icon(LucideIcons.image, color: Color(0xFFE2E8F0))),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              isAr ? "قميص كاجوال" : "Casual Shirt", 
                              style: TextStyle(fontWeight: FontWeight.bold, color: isDark ? Colors.white : Colors.slate[900])
                            ),
                            Text(
                              isAr ? "أزرق" : "Blue", 
                              style: TextStyle(color: Colors.slate[400], fontSize: 12, fontWeight: FontWeight.bold)
                            ),
                          ],
                        ),
                      ),
                    ],
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

class ClosetView extends StatelessWidget { const ClosetView({super.key}); @override Widget build(BuildContext context) => const Center(child: Text("Closet View")); }
class AiStyleView extends StatelessWidget { const AiStyleView({super.key}); @override Widget build(BuildContext context) => const Center(child: Text("AI Recommendation View")); }
class ProfileView extends StatelessWidget { const ProfileView({super.key}); @override Widget build(BuildContext context) => const Center(child: Text("Profile View")); }
