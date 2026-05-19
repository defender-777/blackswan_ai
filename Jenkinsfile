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
            -Dsonar.host.url=http://localhost:9000 \
            -Dsonar.login=$SONAR_TOKEN
            '''
        }
    }
}

        stage('Trivy Vulnerability Scan') {
        steps {
            sh '''
            export PATH="/opt/homebrew/bin:$PATH"
            trivy fs .
            '''
    }
}

      stage('Build Docker Image') {
    steps {
        sh '''
        export PATH=/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin
        /usr/local/bin/docker build -t 7204392712/blackswan-ai:latest .
        '''
    }
}

stage('Push Docker Image') {
    steps {
        sh '''
        export PATH=/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin
        /usr/local/bin/docker push 7204392712/blackswan-ai:latest
        '''
    }
}
    }
}