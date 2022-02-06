# Ronia Index Server
Index server of Ronia market place.

## Installation
1. Clone the project using ```git clone https://gitlab.com/1gnftm/nft-market-server.git ``` command (or via SSH).

2. Go to the project root directory and run ```npm i``` command.

3. Create a file named ```config/env/development.env``` and add the following properties:

```RONIA_NFT=``` and  ```RONIA_MARKET=```

4. Clone the Ronia Core project and run a local node using ```npx hardhat node```.

5. compile the contracts in Ronia Core project using ```npx hardhat compile```.

6. Copy and paste generated abi jsons from Ronia Core ```artifacts``` directory to Ronia Server ```src/contracts/<contract-name>.json```.

7. Depoly contracts from Core to local node using: ``` npx hardhat run --network localhost scripts/0-deploy.ts ```

8. Copy and Paste contract addresses to ```.env``` in Ronia Core and ```config/env/development.env``` in Ronia Server.

9. Install MongoDB server on your machine. It depends on your environment (Windows or Linux). MongoDB Default address has been added to ```src/app.module.ts```.

10. In case you need to run the Ronia Server Project, run ``` npm run start:dev ``` otherwise, you can just start Listening to contract events using ``` pm2 start listener.sh --watch ```.

Download and install ``` pm2``` with ``` npm install pm2 -g ```.
