import { 
  TransactionEvent, 
  Finding, 
  HandleTransaction, 
  FindingSeverity, 
  FindingType,
  createTransactionEvent,
  getJsonRpcUrl

} from 'forta-agent'
import Web3 from 'web3';
import {
  PANCAKESWAP_FACTORY_ABI,
  PANCAKESWAP_FACTORY_ADDRESS

} from "./consts"
import iTxInput from './iTXInput';

const abiDecoder = require('abi-decoder');
abiDecoder.addABI(PANCAKESWAP_FACTORY_ABI)
const web3 = new Web3(getJsonRpcUrl())
const handleTransaction: HandleTransaction = async (txEvent: TransactionEvent) => {
  const findings: Finding[] = [];
  if (txEvent.transaction.to === PANCAKESWAP_FACTORY_ADDRESS){
    const decodedSig:iTxInput = abiDecoder.decodeMethod(txEvent.transaction.data);
    if (decodedSig.name ==="createPair"){
      findings.push(
        Finding.fromObject({
          name: "PancakeSwap pool created",
          description: `Created pull ${decodedSig.params[0].value}/${decodedSig.params[1].value}`,
          alertId: "FORTA-102",
          severity: FindingSeverity.Info,
          type: FindingType.Info,
  
        })
       )

    }
  }    
    

  return findings;
}

export default {
  handleTransaction
}