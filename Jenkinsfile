pipeline {
    agent any

    tools {
        nodejs 'NodeJS-Jenkins'
    }

    environment {
        // --- CONFIG ---
        DOCKER_USER  = "dockerdevopsethos"
        APP_NAME     = "fe-extension-erp-dev"
        IMAGE_TAG    = "${DOCKER_USER}/${APP_NAME}:${BUILD_NUMBER}"
        LATEST_TAG   = "${DOCKER_USER}/${APP_NAME}:latest"

        // --- SERVER TUJUAN ---
        DEPLOY_USER  = "root"
        DEPLOY_HOST  = "182.253.236.139"
        DEPLOY_DIR   = "/var/www/html/fe-extension-erp-dev"
        DEPLOY_PORT  = "9194" // published port sesuai docker-compose.yml
        DEPLOY_URL   = "dev-extension-hashmicro.ethos.co.id"
        CONTAINER_NAME = "fe-extension-erp-dev" // sesuai container_name di docker-compose.yml

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

        stage('5. Test Coverage') {
            steps {
                script {
                    echo "🧪 Running tests with coverage..."
                    sh 'npm run test:coverage'
                }
            }
            post {
                always {
                    // Simpan laporan coverage sebagai artifact Jenkins
                    archiveArtifacts artifacts: 'coverage/**', allowEmptyArchive: true
                }
            }
        }

        stage('6. SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SONAR-FE-EXTENSION-DEV') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }

        stage('7. Quality Gate') {
            steps {
                script {
                    timeout(time: 2, unit: 'MINUTES') {
                        waitForQualityGate abortPipeline: true
                    }
                }
            }
        }

        stage('8. Build & Push Docker') {
            steps {
                script {
                    echo "🐳 Building Docker image..."
                    sh "docker build -t ${IMAGE_TAG} ."
                    sh "docker tag ${IMAGE_TAG} ${LATEST_TAG}"

                    echo "📤 Pushing to Docker Hub..."
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-login', passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                        sh "echo \$PASS | docker login -u \$USER --password-stdin"
                        sh "docker push ${IMAGE_TAG}"
                        sh "docker push ${LATEST_TAG}"
                    }
                }
            }
        }

        stage('9. Transfer Files to Server (SCP)') {
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
                        echo "📁 Mengirim docker-compose.yml dan .env ke server..."
                        sh "scp -o StrictHostKeyChecking=no docker-compose.yml .env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_DIR}/"
                        echo "✅ Transfer file selesai."
                    }
                }
            }
        }

        stage('10. Deploy Production (SSH)') {
            steps {
                sshagent([SSH_CREDS_ID]) {
                    script {
                        // ---------------------------------------------------------
                        // EKSEKUSI DOCKER DI SERVER
                        // set -e: begitu ada command gagal, langsung stop & exit non-zero
                        // ---------------------------------------------------------
                        sh """
                            ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} '
                                set -e
                                cd ${DEPLOY_DIR}
                                echo "🚀 Connected to Server..."

                                echo "--- Membersihkan container lama yang mungkin bentrok nama ---"
                                docker rm -f ${CONTAINER_NAME} 2>/dev/null || true

                                echo "--- Menghentikan container project (jika ada) ---"
                                docker compose down --remove-orphans

                                echo "--- Menarik image terbaru ---"
                                docker compose pull

                                echo "--- Menyalakan container ---"
                                docker compose up -d --force-recreate --remove-orphans

                                echo "✅ Deploy command selesai dieksekusi"
                            '
                        """
                    }
                }
            }
        }

        stage('11. Verify Deployment') {
            steps {
                sshagent([SSH_CREDS_ID]) {
                    script {
                        // ---------------------------------------------------------
                        // VERIFIKASI: cek container running + health check HTTP
                        // Kalau gagal, stage ini FAILED -> pipeline stop, tidak lanjut ke post{success}
                        // ---------------------------------------------------------
                        sh """
                            ssh -o StrictHostKeyChecking=no ${DEPLOY_USER}@${DEPLOY_HOST} '
                                set -e
                                cd ${DEPLOY_DIR}

                                echo "--- Container Status ---"
                                docker compose ps

                                echo "--- Checking container health ---"
                                RUNNING=\$(docker compose ps --status running -q | wc -l)
                                if [ "\$RUNNING" -eq 0 ]; then
                                    echo "❌ Tidak ada container yang running!"
                                    exit 1
                                fi
                                echo "✅ Container running: \$RUNNING"

                                echo "--- HTTP Health Check (localhost:${DEPLOY_PORT}) ---"
                                LOCAL_OK=0
                                for i in 1 2 3 4 5; do
                                    STATUS=\$(curl -s -o /dev/null -w "%{http_code}" http://localhost:${DEPLOY_PORT} || echo "000")
                                    echo "Attempt \$i - HTTP Status: \$STATUS"
                                    if [ "\$STATUS" = "200" ] || [ "\$STATUS" = "301" ] || [ "\$STATUS" = "302" ]; then
                                        echo "✅ Container merespon dengan baik (HTTP \$STATUS)"
                                        LOCAL_OK=1
                                        break
                                    fi
                                    sleep 5
                                done

                                if [ "\$LOCAL_OK" -eq 0 ]; then
                                    echo "❌ Container tidak merespon setelah 5x percobaan"
                                    exit 1
                                fi
                            '
                        """
                    }
                }
            }
        }

        stage('12. Verify Public Domain') {
            steps {
                script {
                    // ---------------------------------------------------------
                    // Cek dari Jenkins ke domain publik (via reverse proxy/DNS)
                    // Memastikan domain benar-benar reachable dari luar server,
                    // bukan cuma container hidup secara lokal.
                    // ---------------------------------------------------------
                    sh """
                        for i in 1 2 3 4 5; do
                            STATUS=\$(curl -sk -o /dev/null -w "%{http_code}" https://${DEPLOY_URL} || echo "000")
                            echo "Attempt \$i - HTTP Status (https://${DEPLOY_URL}): \$STATUS"
                            if [ "\$STATUS" = "200" ] || [ "\$STATUS" = "301" ] || [ "\$STATUS" = "302" ]; then
                                echo "✅ Domain merespon dengan baik (HTTP \$STATUS)"
                                exit 0
                            fi
                            sleep 5
                        done
                        echo "❌ Domain ${DEPLOY_URL} tidak merespon setelah 5x percobaan"
                        exit 1
                    """
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
            echo "❌ Deployment Gagal. Cek log stage yang berwarna merah untuk detail error."
        }
    }
}