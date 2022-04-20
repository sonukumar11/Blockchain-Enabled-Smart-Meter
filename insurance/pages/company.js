import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import 'animate.css';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from './utils/loadContract';
import 'bootstrap/dist/css/bootstrap.css'
const Company = () => {
   // const [company, setCompany] = useState(null);
    const[aminer,setAminer]=useState(0);
    const [account, setAccount] = useState("not yet");
    const [balance, setBalance] = useState(null);
    const [connect, setConnect] = useState("Not Connected Yet");
    const [cust, setCust] = useState(null);
    const [ownerbal, setOwnerbal] = useState(0);
    const [web3Api, setWeb3Api] = useState({
        provider: null,
        web3: null,
        contract: null
    });
    useEffect(() => {
        const loadProvider = async () => {
            const provider = await detectEthereumProvider();
            const contract = await loadContract("orderBook", provider)
            if (provider) {
                const chainId = await provider.request({
                    method: 'eth_requestAccounts'
                })
                setWeb3Api({
                    web3: new Web3(provider),
                    provider,
                    contract
                })
            }
            else {
                console.log('Please install MetaMask!')
            }
        }
        loadProvider()
    }, []);
    //getting account
    useEffect(() => {
        const getAccount = async () => {
            const account = await web3Api.web3.eth.getAccounts(); //get ethereum account
            setAccount(account[0]);
        }
        web3Api.web3 && getAccount(); //call when web3 api
    }, [web3Api.web3])

    useEffect(() => {
        const loadBalance = async () => {
            const { contract, web3 } = web3Api;
            const balance = await web3.eth.getBalance(contract.address);
            setBalance(web3.utils.fromWei(balance, "ether"));
        }
        web3Api.contract && loadBalance();
    }, [web3Api])
    
    const connectAccount = async () => {
        alert("connect wallet");
        try {
            if (typeof window != null && typeof window.ethereum) {
                window.ethereum.request({ method: "eth_requestAccounts" });
                setConnect(account)
                abc()
            }
            else {
                alert("sry");
            }
        }
        catch (err) {
            alert("not connected yet");
        }

    }
    const addMiner = async () => {
                console.log(account);
            const { web3, contract } = web3Api;
            await contract.addEnergy({
                from: account,
                //value: web3.utils.toWei(balance, 'ether'),
            }
            );
        

    }


    const buyEnergy = async () => {
        console.log("Triggering the buyEnergy function")
    const { web3, contract } = web3Api;
    console.log("10 units of enery has been deducted from the Owner's Stock.");
    // await contract.buy({
    //     from: account,
    //     //value: web3.utils.toWei(balance, 'ether'),
    // }
    // );
}

    const abc=async()=>{
        const { web3, contract } = web3Api;
       let v= await contract.energy({
            from: account,
            //value: web3.utils.toWei(balance, 'ether'),
        }
        );
        console.log(v);
        setOwnerbal(v.words[0])
        console.log(v.words[0]);
    }


    // const xyz=async()=>{
    //     const { web3, contract } = web3Api;
    //     console.log(account);
    //    let v = await contract.detail[account].eng({
    //         from: account,
    //         //value: web3.utils.toWei(balance, 'ether'),
    //     }
    //     );
    //     console.log(v);
    // }



    // 0x984dfeF16c155e334122C68a0B2C6C25ee0D57e2
    // 0x39cba872912Db7Fd09230494c6EfcfFf8D5F4755
    return (
        <div className='container'>
            <div className='conntainer-fluid' style={{marginTop:"7%" , textAlign:"center"}}>
                <div className='form'>
                    <h1 className="animate__animated animate__backInDown" style={{marginBottom:"2%"}}>Smart Meter Using Blockchain</h1>
                    <Button variant="contained" color="warning" onClick={connectAccount}>
                        Connect To MetaMask
                    </Button>
                    <p style={{color:"blue"}}>Owner Address: <span style={{color:"red"}}>{connect}</span></p>
                    {cust && <p style={{color:"red"}}>Customer Address: {connect}</p>}
                    <Button variant="contained" color="success" onClick={abc}>
                        Owners Information
                    </Button>
                    <h6 style={{color:"blue"}}>Owner's Energy Balance:- <span style={{color:"red"}}>{ownerbal}</span></h6>
                </div>
                <div className='form'>
                    {/* <input type="number" require="true" value={aminer} onChange={e => setAminer(e.target.value)} /> */}
                    <Button variant="outlined" color="success" onClick={addMiner} style={{margin:"1em"}}>
                        Add Fuel
                    </Button>
                    <Button variant="outlined" color="warning" onClick={buyEnergy} style={{margin:"1em"}}>
                        Buy Energy
                    </Button>
                    <Button variant="outlined" color="warning" disabled style={{margin:"1em"}}>
                        Customer Info
                    </Button>
                </div>
            
            
            </div>
        </div>
    );
}
export default Company;