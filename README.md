# PEAR: De-centralized scientific journal and peer review system

<img src="https://user-images.githubusercontent.com/2636451/31581210-7572a57c-b133-11e7-89a2-9a0dab1dee8e.png" height=200>

## Inspiration

It is extremely important for scientists to be able to communicate their findings as quickly as possible, while guaranteeing that the community accepts only publications that satisfy strict scientific and innovation standards. To solve this issue, the process of peer review via academic journals has become the most accepted method of proving that a work is of value to the community. The model currently has journals accepting researchers’ work and connecting it to other researchers it deems expert enough in the subject to evaluate work. Only articles that are recommended by reviewers and the editor are then published and distributed to the rest of the community. While this system is very widely used it does not come without its shortcomings: 1) High prestige journals often monopolize the market and charge researchers thousands of dollars just to publish their articles which they then charge people again per access. 2) The reviewing and editorial process is often biased by the identity of the author 3) reviewers have no incentive and see no reward outside of personal edification from spending time to review a peer’s work.  

It is here that we felt confident Ethereum could play a big role in improving the current model and providing a self regulating system where scientists could participate in without predatory journals and editorial bias.  Our idea is therefore to impartially and anonymously distribute research while implementing a reputation staking model that will reward reviewers for providing fair feedback and submitters for making valuable contributions to the community. The only form of value in our system would be Reputation which only speaks to the merit of the scientist’s contributions and cannot be exchanged for fiat.

## What it does 
            
Pear is an academic, peer-reviewed journal, that ensures anonymity between those submitting papers and those reviewing them. Pear forces both parties to stake their ‘Reputation’ (tokens) on their manuscript and reviews, respectively. It rewards those submitting for writing highly-reviewed papers and punishes them for writing poorly-reviewed papers in the form of Reputation by either giving the author more Reputation in the first case and taking some away in the latter. Similarly, Pear rewards reviewers with Reputation for giving a review consistent with the majority of the other reviewers and punishes them by destroying their staked Reputation for reviews not consistent with the average reviewer. These rewards and punishments are also related to the initial Reputational stake of each party.

Another feature of this system is that Reputation staked on a manuscript guarantees a certain stake from reviewers. Therefore, by staking more on a paper, academics ensure their work will be evaluated by reviewers with a higher degree of expertise. Additionally, the number of Reputation tokens one owns, is an objective measure of the level of expertise one has in his chosen field. This objective score can be used as proof for why grants or tenure is deserved. Thus, although the Reputation tokens possess no monetary value, they do have a value to professional researchers.




## How we built it

Pear is written in Solidity and JavaScript. It was developed on the TestRPC network using the MetaMask extension and Web3 to interface the webpage with the smart contract.

The smart contract allows users to register an account and tie their address to a set of values defining their reputation in different fields. In the future we will add a functionality to introduce new fields by simply specifying their code as a uint.

One can submit a paper to the blockchain by saving an address which references that paper on a external database (similar to arxiv.org) in conjunction with a public key generated at submission together and a private key to be kept secret by the author. After the review process, the secret key will allow the author to prove that they authored the paper by showing that the hash of their address and the private key gives the published public key.

The anonymity of the reviewer is handled in the same way. 

The step that we have yet to test is the allocation of Reputation based on the distribution of review scores. The contract currently has the function implemented but the API for handling Reputation balance updates remains to be built.  Once enough reviews are gathered for a paper, the contract would distribute reputation away from those who are significantly removed from the consensus score and rewards reviewers who, when a certain quorum is reached agreed on a decision for the paper.

At the moment we have implemented a very simple identification server and interface for the smart contract that manages submissions and reviews. Users are able to sign up, make a transaction to log their assigned key to the blockchain and submit a reference to an off-chain paper with stake. The contract can also accept reviews from any reviewer with sufficient reputation in the paper’s field and hold their reputation until the submission period closes. 


## What's next for Pear 

We believe we can achieve a truly bias-free, decentralized, and cheap peer-review process using Pear. The goal for the immediate future is to have a fully working application. To achieve this goal we will have to:
1. create a server that can store users information locally and properly interact with the blockchain
2. finalize the paper submission process by creating a submissions database interfaced with the blockchain
3. create a system and rules where Reputation is automatically distributed based on reviews of submitted papers and the stakes of the author and the reviewers


This platform can eventually be generalized to handle other mechanisms where an unbiased decision must be made by judges who should judge candidates based on merit alone. Examples include awarding funding through grants, granting acceptance into institutions such as Universities, hiring employees, judging sporting event, etc…   

