#!/bin/bash

echo "============= DEPLOY START ============="
date

REPO_PATH="/www/wwwroot/speed.test"
BRANCH="main"
WEB_USER="www"

# 1️⃣ Pastikan HOME ada (dibutuhkan git)
if [ -z "$HOME" ]; then
    export HOME=/root
    echo "HOME was not set. Set to /root"
fi

# 2️⃣ Pastikan safe.directory (tidak error jika sudah ada)
git config --system --add safe.directory $REPO_PATH 2>/dev/null || true

# 3️⃣ Perbaiki ownership jika bukan milik web user
if [ -d "$REPO_PATH" ]; then
    CURRENT_OWNER=$(stat -c '%U' $REPO_PATH)
    if [ "$CURRENT_OWNER" != "$WEB_USER" ]; then
        echo "Fixing ownership..."
        chown -R $WEB_USER:$WEB_USER $REPO_PATH
    fi
fi

# 4️⃣ Masuk ke directory
cd $REPO_PATH || { echo "ERROR: Directory $REPO_PATH not found"; exit 1; }

# 5️⃣ Pull terbaru
echo "Pulling latest code from branch $BRANCH..."
git fetch origin $BRANCH
git reset --hard origin/$BRANCH

# 6️⃣ Opsional: Build ulang jika dibutuhkan (hapus komentar jika ingin build di server)
# echo "Building frontend..."
# cd frontend && npm install && npm run build

echo "🚀 Application deployed successfully!"
echo "============= DEPLOY END ==============="
