allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

// الحل النهائي: إجبار المكتبات على إصدارات متوافقة مع AGP 8.7.3
subprojects {
    project.configurations.all {
        resolutionStrategy.eachDependency {
            if (requested.group == "androidx.activity") {
                useVersion("1.9.2")
            }
            if (requested.group == "androidx.core") {
                useVersion("1.13.1")
            }
        }
    }
}

val newBuildDir: Directory =
    rootProject.layout.buildDirectory
        .dir("../../build")
        .get()
rootProject.layout.buildDirectory.value(newBuildDir)

subprojects {
    val newSubprojectBuildDir: Directory = newBuildDir.dir(project.name)
    project.layout.buildDirectory.value(newSubprojectBuildDir)
}
subprojects {
    project.evaluationDependsOn(":app")
}

tasks.register<Delete>("clean") {
    delete(rootProject.layout.buildDirectory)
}
