pipeline {
    agent any

    environment {
        SONAR_TOKEN = credentials('sonar-token')
        DOCKER_IMAGE = "7204392712/blackswan-ai"
    }

    stages {

        stage('Clone Repository') {
            steps {
                git 'https://github.com/defender-777/blackswan_ai.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonarqube') {
                    sh '''
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
    }
}

