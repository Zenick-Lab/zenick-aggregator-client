'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import type { Protocol } from '@/lib/types';
import {
  useSignAndExecuteTransaction,
  useCurrentAccount,
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface StakingFormProps {
  protocols: Protocol[];
  selectedProtocol: Protocol | null;
  onSelectProtocol: (protocol: Protocol) => void;
}

// Add React.memo to prevent unnecessary re-renders
export const StakingForm = React.memo(function StakingForm({
  protocols,
  selectedProtocol,
  onSelectProtocol,
}: StakingFormProps) {
  const [amount, setAmount] = useState<string>('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [estimatedRewards, setEstimatedRewards] = useState<number>(0);

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const currentAccount = useCurrentAccount();

  // Reset form when selected protocol changes
  useEffect(() => {
    if (selectedProtocol) {
      setAmount('');
      setStatus('idle');
      setMessage('');
      setTxHash('');
      setEstimatedRewards(0);
    }
  }, [selectedProtocol]);

  // Calculate estimated rewards when amount or selected protocol changes
  useEffect(() => {
    if (selectedProtocol && amount && !isNaN(Number(amount))) {
      const principal = Number(amount);
      const apr = selectedProtocol.currentAPR / 100;
      // Simple calculation for annual rewards
      const annualRewards = principal * apr;
      setEstimatedRewards(annualRewards);
    } else {
      setEstimatedRewards(0);
    }
  }, [selectedProtocol ? selectedProtocol.id : null, amount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedProtocol ||
      !amount ||
      isNaN(Number(amount)) ||
      Number(amount) <= 0
    ) {
      setStatus('error');
      setMessage('Please enter a valid amount and select a protocol');
      return;
    }

    if (Number(amount) < selectedProtocol.minStake) {
      setStatus('error');
      setMessage(`Minimum stake amount is ${selectedProtocol.minStake} SUI`);
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      // Create a transaction for staking
      const tx = new Transaction();

      // Convert SUI amount to MIST (1 SUI = 10^9 MIST)
      const amountInMist = BigInt(Math.floor(Number(amount) * 1_000_000_000));

      // Add the staking operation based on the protocol's module and function
      tx.moveCall({
        target: `${selectedProtocol.packageId}::${selectedProtocol.moduleName}::${selectedProtocol.stakeFunctionName}`,
        arguments: [tx.pure.u64(amountInMist)], // Properly format as u64 BCS value
        typeArguments: [],
      });

      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            console.log('Transaction successful:', result);
            setStatus('success');
            setMessage(
              `Successfully staked ${amount} SUI on ${selectedProtocol.name}`
            );
            setTxHash(result.digest);
            setAmount('');
          },
          onError: (error) => {
            console.error('Transaction failed:', error);
            setStatus('error');
            setMessage(`Failed to stake: ${error.message}`);
          },
        }
      );
    } catch (error: any) {
      console.error('Error creating transaction:', error);
      setStatus('error');
      setMessage(`Error: ${error.message}`);
    }
  };

  if (!currentAccount) {
    return (
      <Alert>
        <AlertCircle className='h-4 w-4' />
        <AlertTitle>Wallet not connected</AlertTitle>
        <AlertDescription>
          Please connect your wallet to stake tokens.
        </AlertDescription>
      </Alert>
    );
  }

  if (protocols.length === 0) {
    return (
      <Alert>
        <AlertCircle className='h-4 w-4' />
        <AlertTitle>No protocols available</AlertTitle>
        <AlertDescription>
          No staking protocols available at the moment.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className='space-y-6'>
      {!selectedProtocol ? (
        <Alert>
          <AlertCircle className='h-4 w-4' />
          <AlertTitle>No protocol selected</AlertTitle>
          <AlertDescription>
            Please select a protocol from the list above to stake your tokens.
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid md:grid-cols-2 gap-6'>
            <div className='space-y-4'>
              <div>
                <label
                  htmlFor='protocol'
                  className='block text-sm font-medium mb-1'
                >
                  Selected Protocol
                </label>
                <Select
                  value={selectedProtocol.id}
                  onValueChange={(value) => {
                    const protocol = protocols.find((p) => p.id === value);
                    if (protocol) onSelectProtocol(protocol);
                  }}
                >
                  <SelectTrigger id='protocol'>
                    <SelectValue placeholder='Select a protocol' />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Sort protocols by APR in descending order in the dropdown too */}
                    {[...protocols]
                      .sort((a, b) => b.currentAPR - a.currentAPR)
                      .map((protocol) => (
                        <SelectItem key={protocol.id} value={protocol.id}>
                          {protocol.name} - {protocol.currentAPR.toFixed(2)}%
                          APR
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  htmlFor='amount'
                  className='block text-sm font-medium mb-1'
                >
                  Amount (SUI)
                </label>
                <div className='flex space-x-2'>
                  <Input
                    id='amount'
                    type='number'
                    placeholder='0.0'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min={selectedProtocol.minStake}
                    step='0.01'
                    className='flex-1'
                  />
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() =>
                      setAmount(selectedProtocol.minStake.toString())
                    }
                  >
                    Min
                  </Button>
                </div>
              </div>

              <div className='pt-2'>
                <label className='block text-sm font-medium mb-3'>
                  Adjust Amount
                </label>
                <Slider
                  value={[Number(amount) || 0]}
                  min={selectedProtocol.minStake}
                  max={100}
                  step={0.1}
                  onValueChange={(value) => setAmount(value[0].toString())}
                  disabled={!selectedProtocol}
                />
                <div className='flex justify-between text-xs text-muted-foreground mt-1'>
                  <span>Min: {selectedProtocol.minStake} SUI</span>
                  <span>Max: 100 SUI</span>
                </div>
              </div>

              {status === 'success' && (
                <Alert className='bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-900'>
                  <CheckCircle2 className='h-4 w-4 text-green-600 dark:text-green-400' />
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>
                    {message}
                    {txHash && (
                      <div className='mt-2'>
                        <a
                          href={`https://explorer.sui.io/txblock/${txHash}?network=mainnet`}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-primary underline underline-offset-2'
                        >
                          View transaction
                        </a>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {status === 'error' && (
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              <Button
                type='submit'
                className='w-full'
                disabled={
                  status === 'loading' ||
                  !selectedProtocol ||
                  !amount ||
                  isNaN(Number(amount)) ||
                  Number(amount) < selectedProtocol.minStake
                }
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Staking...
                  </>
                ) : (
                  `Stake ${amount || '0'} SUI`
                )}
              </Button>
            </div>

            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Staking Details</h3>
              <Card>
                <CardContent className='p-4 space-y-3'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Protocol</span>
                    <span className='font-medium'>{selectedProtocol.name}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Current APR</span>
                    <span className='font-medium text-primary'>
                      {selectedProtocol.currentAPR.toFixed(2)}%
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Lock Period</span>
                    <span className='font-medium'>
                      {selectedProtocol.lockPeriod} days
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Minimum Stake</span>
                    <span className='font-medium'>
                      {selectedProtocol.minStake} SUI
                    </span>
                  </div>
                  <div className='border-t pt-3 mt-3'>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>
                        Estimated Annual Rewards
                      </span>
                      <span className='font-medium text-green-600 dark:text-green-400'>
                        {estimatedRewards.toFixed(2)} SUI
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue='rewards'>
                <TabsList className='w-full'>
                  <TabsTrigger value='rewards' className='flex-1'>
                    Rewards
                  </TabsTrigger>
                  <TabsTrigger value='info' className='flex-1'>
                    Protocol Info
                  </TabsTrigger>
                </TabsList>
                <TabsContent value='rewards' className='space-y-4 pt-4'>
                  <div className='space-y-2'>
                    <h4 className='font-medium'>Estimated Rewards</h4>
                    <Card>
                      <CardContent className='p-4 space-y-3'>
                        <div className='flex justify-between'>
                          <span className='text-muted-foreground'>Daily</span>
                          <span className='font-medium'>
                            {(estimatedRewards / 365).toFixed(4)} SUI
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-muted-foreground'>Weekly</span>
                          <span className='font-medium'>
                            {(estimatedRewards / 52).toFixed(4)} SUI
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-muted-foreground'>Monthly</span>
                          <span className='font-medium'>
                            {(estimatedRewards / 12).toFixed(4)} SUI
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-muted-foreground'>Yearly</span>
                          <span className='font-medium text-green-600 dark:text-green-400'>
                            {estimatedRewards.toFixed(4)} SUI
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value='info' className='space-y-4 pt-4'>
                  <div className='space-y-2'>
                    <h4 className='font-medium'>
                      About {selectedProtocol.name}
                    </h4>
                    <p className='text-muted-foreground text-sm'>
                      {selectedProtocol.description}
                    </p>
                    <div className='pt-2'>
                      <h4 className='font-medium mb-2'>Features</h4>
                      <ul className='list-disc list-inside space-y-1 text-sm text-muted-foreground'>
                        {selectedProtocol.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </form>
      )}
    </div>
  );
});
