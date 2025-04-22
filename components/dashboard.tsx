"use client"

import { useState, useEffect } from "react"
import { CustomConnectButton } from "@/components/custom-connect-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProtocolList } from "@/components/protocol-list"
import { StakingForm } from "@/components/staking-form"
import { useCurrentAccount } from "@mysten/dapp-kit"
import type { Protocol } from "@/lib/types"
import { fetchProtocols } from "@/lib/data"

export function Dashboard() {
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null)
  const currentAccount = useCurrentAccount()

  // Load data only once on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const data = await fetchProtocols()
        setProtocols(data)

        // If no protocol is selected yet, don't auto-select one
        if (selectedProtocol) {
          // If we have a selected protocol, find its updated data without changing the reference
          const updated = data.find((p) => p.id === selectedProtocol.id)
          if (updated) {
            setSelectedProtocol(updated)
          }
        }
      } catch (error) {
        console.error("Failed to fetch protocols:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()

    // Refresh data every 5 minutes instead of 2 minutes to reduce state changes
    const intervalId = setInterval(loadData, 5 * 60 * 1000)
    return () => clearInterval(intervalId)
  }, []) // Remove selectedProtocol dependency to prevent re-fetching

  const handleProtocolSelect = (protocol: Protocol) => {
    setSelectedProtocol(protocol)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sui APR Aggregator</h1>
          <p className="text-muted-foreground mt-1">
            Compare APRs and stake directly on different protocols on the Sui blockchain
          </p>
        </div>
        <CustomConnectButton />
      </div>

      <div className="grid gap-6">
        {/* Protocol Comparison - Always visible */}
        <Card>
          <CardHeader>
            <CardTitle>Protocol Comparison</CardTitle>
            <CardDescription>View and compare APRs from different staking protocols</CardDescription>
          </CardHeader>
          <CardContent>
            <ProtocolList
              protocols={protocols}
              isLoading={isLoading}
              onSelectProtocol={handleProtocolSelect}
              selectedProtocolId={selectedProtocol?.id}
            />
          </CardContent>
        </Card>

        {/* Staking Section - Always visible if wallet is connected */}
        {currentAccount && (
          <Card>
            <CardHeader>
              <CardTitle>Stake Tokens</CardTitle>
              <CardDescription>Stake your tokens directly through our platform</CardDescription>
            </CardHeader>
            <CardContent>
              <StakingForm
                protocols={protocols}
                selectedProtocol={selectedProtocol}
                onSelectProtocol={handleProtocolSelect}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
