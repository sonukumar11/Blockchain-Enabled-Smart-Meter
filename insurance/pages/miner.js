import Web3 from 'web3';
import React, { useState, useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from './utils/loadContract';
import 'bootstrap/dist/css/bootstrap.css'
const Miner = () => {
    const [account, setAccount] = useState("not yet");
    const [balance, setBalance] = useState(null);
    const [desc, setDesc] = useState("");
    const [checkBool, setCheckBool] = useState(false);
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

    const minerLastApprovalStatus = async () => {
        const { web3, contract } = web3Api;
        await contract.minerLastApprovalStatus({
            from: account,

        })

    }

    const minerCheckUserDetailForApproval = async () => {
        const { web3, contract } = web3Api;
        var s = await contract.minerLastApprovalStatus({
            from: account,

        });
        setDesc(s);
    }

    const minerAprroval = async () => {
        const { contract } = web3Api;
        var b = false;
        if (checkBool == 1)
            b = true;
        var s = await contract.minerLastApprovalStatus(b, {
            from: account,
        });

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
                    <button className='btn' onClick={minerLastApprovalStatus}>
                        LastApprovalStatus
                    </button>
                </div>
                <div className='form'>
                    <button className='btn' onClick={minerCheckUserDetailForApproval}>
                        CheckUserDetailForApproval
                    </button>
                </div>
                <div className='form'>
                    <button className='btn' onClick={minerAprroval}>
                        Approve
                    </button>
                </div>
            </div>
        </div>
    );
}
export default Miner;