pipeline {
    agent any

    environment {
        SONAR_TOKEN = credentials('sonar-token')
        DOCKER_IMAGE = "7204392712/blackswan-ai"
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/defender-777/blackswan_ai.git'
            }
        }

        stage('SonarQube Analysis') {
    steps {
        withSonarQubeEnv('sonarqube') {
            sh '''
            export PATH="/opt/homebrew/bin:$PATH"
            sonar-scanner \
            -Dsonar.projectKey=blackswan-ai \
            -Dsonar.sources=. \
            -Dsonar.host.url=http://host.docker.internal:9000 \
            -Dsonar.login=$SONAR_TOKEN
            '''
        }
    }
}

        stage('Trivy Vulnerability Scan') {
            steps {
                sh 'trivy fs .'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE:latest .'
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'

                    sh 'docker push $DOCKER_IMAGE:latest'
                }
            }
        }
    }
}