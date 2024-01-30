# app-mobile
 This example was modificated the tab Home, List (this tab use a API petition of fakestoreapi) and Name
 
## Backend
The backend was developed in Node.js and uses Express.

### Installation
```bash
cd backend
npm install
```

### Start API Service
```bash
tsc
node build/index.js
```
### Note!
For use the comand tsc is necesary install typescript
``` bash
npm install -g typescript
```

## Frontend
The front was developed in React Native and uses Expo.

### Important!
Before build the frontend is necesary change the IP (with port 3000) from API request in file "./app-example/src/screen/User.js"
This file contain the variable serverIP (use your IP address)
```javascript
// Here change server ip 
const serverIP = "255.255.255.255:3000";
```

### Installation
```bash
cd frontend/app-example
npm install
```

### Start API Service
```bash
npx expo start
```
