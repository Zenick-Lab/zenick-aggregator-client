"use client"

import {
  useCurrentAccount,
  useCurrentWallet,
  useDisconnectWallet,
  useConnectWallet,
  useWallets,
} from "@mysten/dapp-kit"
import { Button } from "@/components/ui/button"
import { Wallet, ChevronDown, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"

export function CustomConnectButton() {
  const currentAccount = useCurrentAccount()
  const { currentWallet } = useCurrentWallet()
  const { mutate: disconnect } = useDisconnectWallet()
  const { mutate: connect } = useConnectWallet()
  const wallets = useWallets()
  const [open, setOpen] = useState(false)

  if (!currentAccount) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect a wallet</DialogTitle>
            <DialogDescription>Select a wallet to connect to this app</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {wallets.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No wallets detected. Please install a Sui wallet extension.
              </div>
            ) : (
              wallets.map((wallet) => (
                <Button
                  key={wallet.name}
                  variant="outline"
                  className="flex justify-between items-center w-full"
                  onClick={() => {
                    connect(
                      { wallet },
                      {
                        onSuccess: () => setOpen(false),
                      },
                    )
                  }}
                >
                  <span>{wallet.name}</span>
                  {wallet.icon && (
                    <img
                      src={wallet.icon || "/placeholder.svg"}
                      alt={`${wallet.name} icon`}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  )}
                </Button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Wallet className="mr-2 h-4 w-4" />
          {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="px-2 py-1.5 text-sm font-medium">{currentWallet?.name || "Connected"}</div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive cursor-pointer"
          onClick={() => disconnect()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
