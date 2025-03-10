
import { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers"
import faucetContract from "./ethereum/faucet";


function App() {
  const [message, setMessage] = useState('');
  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState();
  const [fcContract, setFcContract] = useState();
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress]);

  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        //get provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        //get account
        const accounts = await provider.send("eth_requestAccounts", []);

        //get signer
        setSigner(provider.getSigner());

        //get contract instance
        setFcContract(faucetContract(provider));

        setWalletAddress(accounts[0]);
        console.log(accounts[0]);

      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        //get provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        //get account
        const accounts = await provider.send("eth_accounts", []);





        if (accounts.length > 0) {
          //get signer
          setSigner(provider.getSigner());

          //get contract instance
          setFcContract(faucetContract(provider));

          setWalletAddress(accounts[0]);
          console.log(accounts[0]);
        } else {
          console.log("Connect to MetaMask using the Connect button");
        }
      } catch (err) {
        console.error(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      });
    } else {
      /* MetaMask is not installed */
      setWalletAddress("");
      console.log("Please install MetaMask");
    }
  };

  const getSneTo = async () => {
    <p className="panel-heading"></p>
    setWithdrawError("");
    setWithdrawSuccess("");
    
    
    try {
      const fcContractWithSigner = fcContract.connect(signer);
      const response = await fcContractWithSigner.requestTokens(message);
      console.log(response);
      setTransactionHash(response.hash);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      },10000)
      setWithdrawSuccess("success");

    }
    catch (err) {
      console.log(err.message);
      setWithdrawError("This exceed the daily maximum limit");
    }
  };


  const handleChange = (event) => {
    // 👇 Get input value from "event"
    // console.log(event.target.value);
    setMessage(event.target.value);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <h1 className="navbar-item is-size-4">Sneto Faucet (SNT)</h1>
          </div>
          <div id="navbarMenu" className="navbar-menu">
            <div className="navbar-end is-align-items-center">
              <button
                className="button is-white connect-wallet"
                onClick={connectWallet}
              >
                <span className="is-link has-text-weight-bold">
                  {walletAddress && walletAddress.length > 0
                    ? `Connected: ${walletAddress.substring(
                      0,
                      6
                    )}...${walletAddress.substring(38)}`
                    : "Connect Wallet"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <section className="hero is-fullheight">
        <div className="faucet-hero-body">
          <div className="container has-text-centered main-content">
            <div className="mt-5">
              {withdrawError && (
                <div className="withdraw-error">{withdrawError}</div>
              )}
              
            </div>
            <div className="box address-box">
              <div className="columns">
                <div className="column is-four-fifths">
                  <input
                    className="input is-medium"
                    type="text"
                    placeholder="Enter your wallet address (0x...)"
                    defaultValue={walletAddress}
                  />
                </div>




              </div>
              <div className="columns">
                <div className="column is-four-fifths">
                  <input
                    className="input is-medium"
                    type="text"
                    placeholder="Amount"
                    onChange={handleChange}
                  />

                </div>

              </div>
              <div className="column">
                {isLoading ? "" :
                  <button className="button is-link is-medium" onClick={getSneTo}>
                    GET TOKENS
                  </button>
                }
                {isLoading ? <div><h4>Ongoing transaction..</h4>
                  <img style={{ width: "200px", height: "200px" }} src="img/loader.gif" /> </div>: <div>
                  {withdrawSuccess && (
                <div className="withdraw-success">{withdrawSuccess}</div>
              )}{" "}
            
                </div> 
                }
              {/* </div> */}

            </div>
            
            <article className="panel is-grey-darker">
            {transactionHash && (
                <div className="withdraw-success">{transactionHash}</div>
              )}{" "}

            </article>
          </div>
        </div>
    </div>
      </section >
    </div >
  );
}

export default App;
