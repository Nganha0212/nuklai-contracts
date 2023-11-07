import { DatasetNFT } from '../typechain-types';
import { Addressable } from 'ethers';
import { WHITELISTED_MANAGER_ROLE } from '../utils/constants';
import { task } from 'hardhat/config';

interface TaskArgs {
  pk: string;
  contractAddress: Addressable;
  managerAddress: Addressable;
}

task('set-whitelist-manager', 'Adds a new whitelisted manager to a data set')
  .addParam('pk', 'Signer private key with ADMIN_ROLE')
  .addParam('contractAddress', 'Address of the DatasetNFT contract')
  .addParam('managerAddress', 'Address of the manager to whitelist')
  .setAction(async (taskArgs: TaskArgs) => {
    if (!taskArgs.contractAddress || !taskArgs.managerAddress)
      throw new Error('No address provided');

    const wallet = new ethers.Wallet(taskArgs.pk, ethers.provider);

    const dataset = (await ethers.getContractAt(
      'DatasetNFT',
      taskArgs.contractAddress,
      wallet
    )) as unknown as DatasetNFT;

    console.log('Whitelisting manager', taskArgs.managerAddress);
    await (await dataset.grantRole(WHITELISTED_MANAGER_ROLE, taskArgs.managerAddress)).wait();

    console.log('Manager', taskArgs.managerAddress, 'successfully whitelisted');
  });
