### Why Web3/Blockchain?

In 2022, it was the aspect of IT with the highest job growth, with promising salaries and high demand.

Currently it is a bit in a limbo but it was one of the most anticipated things to learn about in 2022.

#### What is Web3?

Web3 is the third stage of the world wide web. The first stage was read only static sites, basically an information place.

The second version of the internet included ability to read and write, forming social media where people could form the web.

Web3 is simply the next step, where AI and Blockchain make the content owned by people, and allow edge computing.

Since 2018, developers have been creating more and more Web3 services that could shape the future of the WWW.

Some examples are crypto funds and there is a lot of asset: [See Infographic](https://cryptofundresearch.com/cryptocurrency-funds-overview-infographic/)

The course was curated with support from [Dfinity](https://dfinity.org/)

### What is a Blockchain?

A blockchain is basically a ledger that contains information about something, most usually a monetary transaction (for crypto blockchains).

In order to keep a record of the transaction, we need to store it, but who stores it? We need consensus and trust in the ledger.

If one person modifies the ledger, it can disrupt the transactions. There are ways we can counter this.

#### Encryption

Encryption is the conversion of a plain text data into a cipher. A major property of encryption is that it is reversible.

As long as the key used to encrypt is known, it is possible to decrypt the message, and that compromises the ledger's state.

An example of an encryption method is [the Caesar Cipher](https://csis.gmu.edu/albanese/labs/caesar_cypher.php)

#### Hashing

In hashing, we instead use a mathematical hashing function which is one way, i.e. we can't retrieve the original data from hash.

The only way to find the original data is by bruteforcing (checking for all possible combinations), which is computationally almost impossible.

Read more in this [paper about bruteforcing a hash](https://eprint.iacr.org/2020/697.pdf)

An example is the [SHA256 Hashing Algorithm](https://www.movable-type.co.uk/scripts/sha256.html)

### How does a blockchain work?

A blockchain is what is says: a chain of blocks. Each block contains a message, and its hash. Each new block's hash is dependent on previous hash.

It is easy to detect when someone tries to change the data inside any one block, since it changes its hash,

as well as all hashes after it. This means that data in a blockchain is immutable and can not be changed once put.

#### Blockchain mining

Hash function generates a random string of alphanumeric characters, but in a blockchain, in order to ensure truth, we use a pattern.

Only when the pattern is satisfied (eg. having a certain number of zeroes at the start of the hash), can the block be added to the chain.

But the hash of a specific data can never be different. In order to cause variance, we use something called nonce along with the data.

So we use the data, nonce and the previous block's hash (a string of 0s for the first block) to mine a new block in the chain.

The mining process takes computational power. We can test out [the blockchain demo](https://guggero.github.io/blockchain-demo/#!/block)

#### Distributed Blockchain

Apart from being immutable, it is also distributed, meaning all people have an identical version of the ledger, and it holds all transactions.

If any transaction is changed in such a way that everything is still valid (challenging but not impossible), we can detect it by comparing with others.

This lets us create a trustless ledger, where trust is ensured by the blockchain system itself.

### Use of Blockchain

Apart from being used to store transactions, the introduction of Ethereum and smart contracts brought forth ways to store code into the blocks.

When the condition for the block's code is met, it is automatically executed, this ensures accountability in contracts and trust in the system.

### Distributed Apps (DApps)

A normal application would need to be built, then acquire Venture Capital Funding to get on its feet, then with enough luck, release an IPO.

But a decentralized app can be built, and then release tokens that people can own. The money from these tokens can be used for the company.

The tokens also signify ownership so people can make decisions for the company, which in the end benefits everyone because of their investment as incentive.

The biggest advantage of DApps is pseudonymity, which means you are known for what you do, not who you are. This means anyone can do it without bias.

In order to deploy our DApps, there are many platforms available like Ethereum, Solana, etc but they don't store anything on their server.

We need to instead rely on expensive servers from Amazon AWS or others that the platforms use. We can also use Dfinity's Internet Computer concept.

In it, the data is stored across the computers on the internet which ensures redundancy, and also a cheaper cost.

### The Internet Computer

The major blockchain and smart contract providers weren't meant to store the large amount of data inside their chain.

They store the blockchain in their servers, and the wallet and coins are stored in the browser extension, but the main app logic and such,

they are stored in the servers of tech giants like Microsoft and Amazon, so their blockchain is dependent on those servers.

They basically store data like [this transaction report](https://etherscan.io/tx/0x674779579a8e456fc1f6c8fdf41ef942eb93001d6b8f5ad6c6c59cbc76bef161)

But Internet Computer is a concept by Dfinity which uses concepts in [this paper](https://dfinity.org/presentations/podc-2022-cr.pdf) to create consensus.

They store all the information about the code and logic into something called canisters, and the code/logic inside the said canisters run forever.

This means any variables inside the canisters are permanent, and people can access the canisters using the web protocol (HTTPS).

The data is stored in independent data centers around the world, so there is no risk. Many apps are developed on the Internet Computer Network.

These apps can distribute the revenue to the contributors, making a revolution in Web3 technologies.

### Installing the Internet Computer Development Environment

The installation is fairly straightforward in Mac as it already has bash and uses the UNIX terminal, but in windows, we need WSL.

We can follow the instructions in [this link](https://docs.google.com/document/d/e/2PACX-1vTNicu-xuf4EiLAehHIqgfpjAnPjzqMGT-xpZVvYaAWNyvzYK_Ceve_me4PVRIxpzH7ea5PAX9NxGwY/pub), I will list them here as well:

1. Open Powershell as Admin and run `wsl --install` to install the Ubuntu subsystem, restart then set up the username/password
2. Confirm WSL installation using `wsl --list --verbose`
3. Download [VS Code](https://www.google.com/url?q=https://code.visualstudio.com/&sa=D&source=editors&ust=1751557485458582&usg=AOvVaw3_hIPpGE38Z2D7rL4COHu7),
   [Motoko Extension](https://www.google.com/url?q=https://marketplace.visualstudio.com/items?itemName%3Ddfinity-foundation.vscode-motoko&sa=D&source=editors&ust=1751557485459250&usg=AOvVaw2r7ldk-EYW0YASEtZifkFN) and
   [Remote WSL Extension](https://www.google.com/url?q=https://marketplace.visualstudio.com/items?itemName%3Dms-vscode-remote.remote-wsl&sa=D&source=editors&ust=1751557485459808&usg=AOvVaw0Gh7BLVhxiHBggauNPX5WN)
4. Open ubuntu and install homebrew using the command found on [official site](https://www.google.com/url?q=https://brew.sh/&sa=D&source=editors&ust=1751557485460929&usg=AOvVaw37JAGfLgBQgTHIQ5dSmbor), or use:

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

5. Add brew to path by following the instructions in the terminal then install dependencies with `sudo apt-get install build-essential`
6. Check working using `brew -version` then install node16 with `brew install node@16` and confirm with `node -version`
   (May need to link using `brew link node@16`)
7. Use `DFX_VERSION=0.9.3 sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"` to install DFX
8. Export the installed path using `export PATH=$PATH:<REPLACE WITH YOUR INSTALLATION PATH>` then check with `echo "${PATH//:/$'\n'}"`
9. Check version with `dfx --version`. Now create new folder and inside that folder run `dfx new hello` to create a new project
10. On VS Code, press the button on bottom left "Open a Remote Window" then open WSL Window. Activate the Motoko extension.
11. Start the server in the terminal using `dfx start` then in another terminal run `dfx deploy` then `npm start` and it should run [locally](http://localhost:8080)
