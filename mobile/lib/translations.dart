import 'package:flutter/material.dart';

class AppTranslations {
  static Map<String, Map<String, String>> translations = {
    'en': {
      'welcome': 'Morning, Ahmed',
      'discover': 'Discover Style',
      'home': 'Home',
      'closet': 'Closet',
      'aiMagic': 'AI Magic',
      'profile': 'Profile',
      'recentItems': 'Recent Items',
      'weatherTitle': 'Today\'s Weather',
      'weatherSub': 'Perfect for light cotton',
    },
    'ar': {
      'welcome': 'صباح الخير، أحمد',
      'discover': 'استكشف أناقتك',
      'home': 'الرئيسية',
      'closet': 'الخزانة',
      'aiMagic': 'سحر الذكاء',
      'profile': 'الملف الشخصي',
      'recentItems': 'أحدث القطع',
      'weatherTitle': 'طقس اليوم',
      'weatherSub': 'مثالي للملابس القطنية الخفيفة',
    },
  };

  static String t(BuildContext context, String key) {
    final locale = Localizations.localeOf(context).languageCode;
    return translations[locale]?[key] ?? key;
  }
}
