plugins {
    id("com.android.application")
    id("kotlin-android")
    id("dev.flutter.flutter-gradle-plugin")
}

android {
    namespace = "com.example.city_pulse"
    
    compileSdk = 35       // MUST be 35 or higher
    ndkVersion = "27.0.12077973"

    defaultConfig {
        applicationId = "com.example.city_pulse"
        minSdk = 24        // Required by flutter_sound
        targetSdk = 35     // MUST match compileSdk
        versionCode = 1
        versionName = "1.0"
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }

    kotlinOptions {
        jvmTarget = JavaVersion.VERSION_11.toString()
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("debug")
        }
    }
}

flutter {
    source = "../.."
}
