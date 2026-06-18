pipeline {
    agent any

    environment {
        // --- CONFIG ---
        DOCKER_USER  = "dockerdevopsethos"
        APP_NAME     = "fe-extension-erp-dev"
        IMAGE_TAG    = "${DOCKER_USER}/${APP_NAME}:${BUILD_NUMBER}"
        LATEST_TAG   = "${DOCKER_USER}/${APP_NAME}:latest"
        
        // --- SERVER TUJUAN ---
        DEPLOY_USER  = "root"
        DEPLOY_HOST  = "89.21.85.2" 
        DEPLOY_DIR   = "/var/www/html/fe-extension-erp"
        
        // --- CREDENTIALS ID ---
        DOCKER_CREDS = credentials('docker-hub-login')
        ENV_SECRET   = credentials('ENV-FE-HM-DEV') // File rahasia .env
        SSH_CREDS_ID = 'ssh-server-deploy' // SSH Key
    }

    stages {
        stage('1. Checkout') {
            steps {
                cleanWs()
                checkout scm
            }
        }

        stage('2. Install Dependencies') {
            steps {
                script {
                    echo "📦 Installing Node.js dependencies..."
                    sh 'node --version'
                    sh 'npm --version'
                    sh 'npm install'
                }
            }
        }

        stage('3. Lint & Code Quality') {
            steps {
                script {
                    echo "🔍 Running ESLint..."
                    sh 'npm run lint || true' // Continue even if lint has warnings
                }
            }
        }

        stage('4. Build Application') {
            steps {
                script {
                    echo "🔨 Building React application..."
                    sh 'npm run build'
                    
                    // Verify build output
                    sh 'ls -la dist/'
                }
            }
        }

        stage('5. SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner' 
                    withSonarQubeEnv('SONAR-FE-EXTENSION-DEV') { 
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }

        stage('6. Quality Gate') {
            steps {
                script {
                    timeout(time: 2, unit: 'MINUTES') {
                        waitForQualityGate abortPipeline: true
                    }
                }
            }
        }

        stage('7. Build & Push Docker') {
            steps {
                script {
                    echo "🐳 Building Docker image..."
                    sh "docker build -t ${IMAGE_TAG} ."
                    sh "docker tag ${IMAGE_TAG} ${LATEST_TAG}"
                    
                    echo "📤 Pushing to Docker Hub..."
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-login', passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                        sh "echo $PASS | docker login -u $USER --password-stdin"
                        sh "docker push ${IMAGE_TAG}"
                        sh "docker push ${LATEST_TAG}"
                    }
                }
            }
        }

        stage('8. Deploy Production (SSH)') {
            steps {
                sshagent([SSH_CREDS_ID]) {
                    script {
                        // ---------------------------------------------------------
                        // LANGKAH 1: PERSIAPAN FILE .ENV
                        // ---------------------------------------------------------
                        
                        // A. BACA isi file rahasia dari Jenkins (Bukan path-nya)
                        def secretContent = readFile(file: ENV_SECRET)
                        
                        // B. Gabungkan isi rahasia + Variable Image Tag
                        def finalEnvContent = "${secretContent}\nFULL_IMAGE_NAME=${LATEST_TAG}"

                        // C. Tulis menjadi file .env fisik di Workspace Jenkins
                        writeFile file: '.env', text: finalEnvContent

                        // Debug: Pastikan formatnya KEY=VALUE (Bukan /var/jenkins/...)
                        echo "--- PREVIEW 3 BARIS PERTAMA .ENV ---"
                        sh "head -n 3 .env"

                        // ---------------------------------------------------------
                        // LANGKAH 2: KIRIM FILE KE SERVER
                        // ---------------------------------------------------------
                        // Kirim docker-compose dan .env ke server
                        sh "scp -o StrictHostKeyChecking=no docker-compose.yml .env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_DIR}/"
                        
                        // ---------------------------------------------------------
                        // LANGKAH 3: EKSEKUSI DOCKER DI SERVER
                        // ---------------------------------------------------------
                        sh """
                            ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} '
                                cd ${DEPLOY_DIR}
                                echo "🚀 Connected to Server..."
                                
                                # Matikan container lama
                                docker compose down --remove-orphans
                                
                                # Pull image baru (Docker akan baca FULL_IMAGE_NAME dari .env)
                                docker compose pull
                                
                                # Nyalakan container
                                docker compose up -d
                                
                                # Verifikasi container berjalan
                                docker compose ps
                                
                                echo "✅ Deployment Selesai!"
                            '
                        """
                    }
                }
            }
        }
    }
        
    post {
        always {
            script {
                // Bersihkan image sampah di Jenkins (Hemat Disk Space)
                sh "docker rmi ${IMAGE_TAG} || true"
                sh "docker image prune -f"
            }
            cleanWs()
        }
        success {
            echo "✅ Deployment Sukses di Server Host: ${DEPLOY_DIR}"
            echo "🎉 Image: ${LATEST_TAG}"
        }
        failure {
            echo "❌ Deployment Gagal. Cek log di atas untuk detail error."
        }
    }
}
