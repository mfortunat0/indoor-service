apt-get update && \
apt-get full-upgrade -y && \
apt-get install ffmpeg git -y && \
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash && \
source ~/.bashrc && \
nvm install 22 && \
npm i -g yarn pm2 && \
sudo echo "export LOCAL_IP=$(ip addr show eno1 | grep 'inet ' | cut -d/ -f1 | sed "s/    inet //")" >> ~/.bashrc && \
git clone https://github.com/mfortunat0/indoor-service && \
cd indoor-service && \ 
OLD_IP=192.168.100.134 && \
sed -i "s|$OLD|$LOCAL_IP|g" index.html && \
yarn && \
cd .. && \
git clone https://github.com/mfortunat0/indoor-client-web && \
cd indoor-client-web && \
yarn 

