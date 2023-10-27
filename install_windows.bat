cd senior_project_dea-main
npm install
npm i mdb-react-ui-kit
cd server
npm install
npm install cors
touch .env
echo $'DB_URI=EDIT_ME\nDB_USERNAME=EDIT_ME\nDB_PASSWORD=EDIT_ME\nJWT_SECRET=EDIT_ME\nLPORT=5000' >.env
echo 'EDIT .env FILE"
cd ..
cd src
echo 'EDIT Config.js FILE'