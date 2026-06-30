// ================================================================
// Jenkinsfile for: https://github.com/rsiddiqui275/Todo.git
// Push this file to the ROOT of your Todo repo as: Jenkinsfile
// ================================================================

pipeline {
    agent any

    environment {
        IMAGE_NAME = "todo-frontend"
        IMAGE_TAG  = "${env.BUILD_NUMBER}"
        CONTAINER  = "todo-frontend"
        PORT       = "4200"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "Checking out Todo (Frontend)..."
                checkout scm
            }
        }

        stage('Docker Build') {
            steps {
                echo "Building frontend Docker image..."
                bat '''
                    docker build -t %IMAGE_NAME%:latest .
                    echo Build complete: %IMAGE_NAME%:latest
                '''
            }
        }

        stage('Tag Image') {
            steps {
                echo "Tagging image as build #${IMAGE_TAG}..."
                bat '''
                    docker tag %IMAGE_NAME%:latest %IMAGE_NAME%:%IMAGE_TAG%
                    echo Tagged: %IMAGE_NAME%:%IMAGE_TAG%
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo "Deploying frontend container..."
                bat '''
                    docker stop %CONTAINER% 2>nul || echo Container not running
                    docker rm %CONTAINER% 2>nul || echo Container not present

                    docker run -d ^
                        --name %CONTAINER% ^
                        --restart unless-stopped ^
                        -p %PORT%:8080 ^
                        %IMAGE_NAME%:latest

                    echo Container %CONTAINER% started on port %PORT%
                '''
            }
        }

        stage('Health Check') {
            steps {
                echo "Waiting for frontend to start..."
                bat '''
                    timeout /t 10 /nobreak >NUL
                    curl -f http://localhost:%PORT% && echo Frontend is healthy || exit /b 1
                '''
            }
        }
    }

    post {
        success {
            echo """
==============================================
  FRONTEND DEPLOYED SUCCESSFULLY  Build #${env.BUILD_NUMBER}
==============================================
  App : http://localhost:4200
==============================================
            """
        }
        failure {
            echo "Frontend deployment FAILED. Printing container logs..."
            bat 'docker logs %CONTAINER% --tail=50'
        }
    }
}
