import 'dart:io';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  // Use this for Android Emulator:
  // static const String baseUrl = 'http://10.0.2.2:8000';
  
  // Replace this with your actual Render URL when deployed:
  // e.g., 'https://smart-closet-api.onrender.com'
  static const String baseUrl = 'http://10.0.2.2:8000';

  final Dio _dio = Dio(BaseOptions(
    baseUrl: baseUrl,
    connectTimeout: const Duration(seconds: 15),
    receiveTimeout: const Duration(seconds: 15),
  ));

  ApiService() {
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final prefs = await SharedPreferences.getInstance();
        final token = prefs.getString('token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
    ));
  }

  Future<Response> login(String username, String password) async {
    final formData = FormData.fromMap({
      'username': username,
      'password': password,
    });
    return await _dio.post('/auth/login', data: formData);
  }

  Future<Response> register(String username, String email, String password) async {
    return await _dio.post('/auth/register', data: {
      'username': username,
      'email': email,
      'password': password,
    });
  }

  Future<Response> getItems() async {
    return await _dio.get('/items/');
  }

  Future<Response> addItem({
    required String name,
    required String category,
    required String color,
    required File imageFile,
    List<String>? tags,
  }) async {
    String fileName = imageFile.path.split('/').last;
    final formData = FormData.fromMap({
      "file": await MultipartFile.fromFile(imageFile.path, filename: fileName),
      "name": name,
      "category": category,
      "color": color,
      "tags": tags?.join(',') ?? '[]',
    });

    return await _dio.post('/items/', data: formData);
  }

  Future<Response> getRecommendation() async {
    return await _dio.post('/ai/recommend', data: {});
  }
}
