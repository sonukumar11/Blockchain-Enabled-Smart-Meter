import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from './utils/loadContract';
import 'bootstrap/dist/css/bootstrap.css'
const User = () => {
    const [money, setMoney] = useState(0);
    const [account, setAccount] = useState("Not Set Yet");
    const [balance, setBalance] = useState(0);
    const [desc, setDesc] = useState("");
    const [due, setDue] = useState(0);
    // const ether=require("ether");

    const [web3Api, setWeb3Api] = useState({
        provider: null,
        web3: null,
        contract: null
    });

    useEffect(() => {
        const loadProvider = async () => {
            const provider = await detectEthereumProvider();
            const contract = await loadContract("Insurance", provider);
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

    useEffect(() => {
        const getAccount = async () => {
            const account = await web3Api.web3.eth.getAccounts(); //get ethereum account
            setAccount(account[0]);
        }
        web3Api.web3 && getAccount(); //call when web3 api
    }, [web3Api.web3])

    const connectAccount = async () => {
        alert("connect wallet");
        try {
            if (typeof window != null && typeof window.ethereum) {
                window.ethereum.request({ method: "eth_requestAccounts" });
            }
            else {
                alert("sry");
            }
        }
        catch (err) {
            alert("not connected yet");
        }

    }

    const addUser = async () => {
        const { web3, contract } = web3Api;

        await contract.addUser({
            from: account,
            value: web3.utils.toWei(money, 'ether'),
        }
        );
    }

    const subsequentPayment = async () => {
        const { web3, contract } = web3Api;
        await contract.subsequentPayment({
            from: account,
            value: web3.utils.toWei(balance, 'ether'),
        })
    }

    const dueAmountUser = async () => {
        const { contract } = web3Api;
        let v = await contract.dueAmountUser({
            from: account,
        });
        setDue(v.words[0]);
    }

    const insuranceClaim = async () => {
        const { contract } = web3Api;
        await contract.insuranceClaim(desc, {
            from: account,
        })

    }



    return (
        <div className='container'>
            <div className='conntainer-fluid'>
                <div className='form'>
                    <button className='btn' onClick={connectAccount}>
                        connectAccount
                    </button>
                </div>
                <div className='form'>
                    <input type="number" require="true" value={money} onChange={e => setMoney(e.target.value)} />
                    <button className='btn' onClick={addUser}>
                        addUser
                    </button>
                </div>
                <div className='form'>
                    <input type="number" require="true" value={balance} onChange={e => setBalance(e.target.value)} />
                    <button className='btn' onClick={subsequentPayment}>
                        subsequentPayment
                    </button>
                </div>
                <div className='form'>
                    <button className='btn' onClick={dueAmountUser}>
                        dueAmountUser
                    </button>
                    <p>{due > 0 ? due : "0"}</p>
                </div>
                <div className='form'>
                    <input type="text" require="true" value={desc} onChange={e => setDesc(e.target.value)} />
                    <button className='btn' onClick={insuranceClaim}>
                        insuranceClaim
                    </button>
                </div>
            </div>
        </div>
    );
}
export default User;