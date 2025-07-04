### Next step
The next logical step after creating this Web App is to deploy it onto the ICP Blockchain. I don't know whether I'll do it,

but I'll make sure to document the steps needed in this file. In order to run the app, it needs computational power.

For that, we will need ICP Tokens, which are tradeable tokens, which can be obtained in various ways.

1. The most straightforward way is purchasing the tokens using another cryptocurrency in Coinbase
2. Network Nervous System(NNS) which runs the ICP has neurons where we can vote to get some tokens
3. Grants from the Internet Computer project Developer Grant Program upon request

These tokens can then be burnt to get computational **cycles** in our canister. Our code runs as long as we have these cycles.

Cycles are also called stored computational potential. We can also use the Cycles Faucet to get tokens via connecting with GitHub.

But creating canisters, and adding to the ICP is costly in ICP tokens, so we should be careful not to extinguish our supply.

(I'll just continue deploying on the local network, but keep this as knowledge)

#### How to get free tokens?
1. To utilize Cycles Faucet, we can go to faucet.dfinity.org/auth.
2. After authorizing with GitHub, it will ask for principal ID, for which we can go to terminal and use `dfx identity get-principal`

(Not sure if this still works. Can try [in this site where it gets redirected to](https://anv4y-qiaaa-aaaal-qaqxq-cai.ic0.app/))
3. In the final step we can create a new cycles wallet, and we get 15TerraCycles worth $20 in ICP tokens
4. We get a command which we can run to associate our identity with the wallet. We need to use it inside our project folder
5. To check balance we can go to `<principal_ID>.raw.ic0.app` and set up an Identity Anchor, which we need to save, along with recovery text
6. Then we can use the script given which we can paste to register our device

#### How to deploy our app to ICP?
1. In the project folder, ensure all node packages are installed using npm install
2. Use `dfx deploy --network ic` to create a new canister on the Internet Computer network
3. Use `dfx canister --network ic id dbank_assets` to get the canister ID
4. In the browser go to `https://<canister-id>.raw.ic0.app` where the app exists
5. It uses a lot of ICP Tokens to deploy the app, but less to update it, we can use same deploy command to update

#### How to replenish cycles?
We might run out of cycles but still need to host DApps, and there's a way we can get ICP for free.

1. Coinbase offers Learn & Earn options to earn value in cryptocurrency by completing these, which we can exchange for ICP.
2. We can go to the [Network Nervous System](nns.ic0.app) and select our wallet, then go to Coinbase and transfer the ICP there.
3. Finally to convert ICP to cycles, we need to go to Canisters section on NNS and exchange ICP for cycles using our wallet canister id

We can use `dfx identity --network ic get-wallet` to get the canister ID.

#### Deploy normal sites on ICP
Instead of creating these sites using dfx, we can also choose to deploy our own basic site on the ICP. We need to note the following:
- All the static files html, css etc should be put inside a folder, normally we call the folder "assets"
- Since the folder structure is flattened in deployment (i.e. all files are in the same level), we should make references that way
- Finally, we need a file called dfx.json in the root folder which looks like:
```json
{
    "canisters": {
        "<name_of_canister>": {
            "type": "assets",
            "source": ["assets"]
        }
    }
}
```
- Finally we can use `dfx deploy --network ic` to deploy, then use `dfx canister --network ic id <canister_name>` for the id

We can access the site the same way as above.