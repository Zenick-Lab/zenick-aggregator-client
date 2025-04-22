"use client"

import type { Protocol } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { TrendingUp, ArrowRight } from "lucide-react"
import React from "react"

interface ProtocolListProps {
  protocols: Protocol[]
  isLoading: boolean
  onSelectProtocol: (protocol: Protocol) => void
  selectedProtocolId?: string
}

export function ProtocolList({ protocols, isLoading, onSelectProtocol, selectedProtocolId }: ProtocolListProps) {
  // Use a memo to prevent unnecessary re-renders
  const renderedProtocols = React.useMemo(() => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="mt-4">
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )
    }

    // Find the protocol with the highest APR
    const highestAPR = Math.max(...protocols.map((p) => p.currentAPR))

    // Sort protocols by APR in descending order
    const sortedProtocols = [...protocols].sort((a, b) => b.currentAPR - a.currentAPR)

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedProtocols.map((protocol) => (
          <Card
            key={protocol.id}
            className={`overflow-hidden transition-all duration-200 ${
              protocol.currentAPR === highestAPR ? "border-2 border-primary" : ""
            } ${selectedProtocolId === protocol.id ? "ring-2 ring-primary ring-offset-2" : ""}`}
          >
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      {protocol.icon ? (
                        <img src={protocol.icon || "/placeholder.svg"} alt={protocol.name} className="w-6 h-6" />
                      ) : (
                        <TrendingUp className="w-4 h-4" />
                      )}
                    </div>
                    <h3 className="font-semibold">{protocol.name}</h3>
                  </div>
                  {protocol.currentAPR === highestAPR && (
                    <Badge className="bg-primary hover:bg-primary">Highest APR</Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current APR</span>
                    <span className="font-medium">{protocol.currentAPR.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">TVL</span>
                    <span className="font-medium">${protocol.tvl.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Min Stake</span>
                    <span className="font-medium">{protocol.minStake} SUI</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lock Period</span>
                    <span className="font-medium">{protocol.lockPeriod} days</span>
                  </div>
                </div>
                <Button
                  onClick={() => onSelectProtocol(protocol)}
                  className="mt-4 w-full"
                  variant={selectedProtocolId === protocol.id ? "default" : "outline"}
                >
                  {selectedProtocolId === protocol.id ? "Selected" : "Select for Staking"}
                  {selectedProtocolId !== protocol.id && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }, [protocols, isLoading, selectedProtocolId, onSelectProtocol])

  return renderedProtocols
}
